import { useState, useEffect } from "react";
import { insertTransactions } from "../util/supabaseQueries";
import {
	parseTransactionsFromCSV,
	checkForDuplicateTransactions,
	checkForSavedMerchants,
} from "../util/transactionUtil";
import { useDataStore } from "../util/dataStore";
import { useAnimationStore } from "../util/animationStore";
import ButtonSpinner from "../components/ButtonSpinner";

const UploadModal = () => {
	const [selectedConfigurationName, setselectedConfigurationName] = useState("");
	const [selectedFile, setSelectedFile] = useState(null);
	const [pendingTransactions, setPendingTransactions] = useState([]);
	const [duplicateTransactions, setDuplicateTransactions] = useState([]);
	const {
		configurations,
		fetchConfigurations,
		setNotification,
		fetchTransactions,
		fetchDashboardStats,
		merchantSettings,
		session,
	} = useDataStore((state) => ({
		configurations: state.configurations,
		fetchConfigurations: state.fetchConfigurations,
		setNotification: state.setNotification,
		fetchTransactions: state.fetchTransactions,
		fetchDashboardStats: state.fetchDashboardStats,
		merchantSettings: state.merchantSettings,
		session: state.session,
	}));
	const { uploadModalVisible, uploadModalAnimating, closeUploadModal } = useAnimationStore((state) => ({
		uploadModalVisible: state.uploadModalVisible,
		uploadModalAnimating: state.uploadModalAnimating,
		closeUploadModal: state.closeUploadModal,
	}));

	const [loading, setLoading] = useState(false);
	useEffect(() => {
		if (configurations === null) fetchConfigurations();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const onFileChange = (event) => {
		setSelectedFile(event.target.files[0]);
	};

	const onFileUpload = () => {
		if (loading) return;
		setLoading(true);

		if (selectedConfigurationName === "") {
			setNotification({ message: "Please select a configuration.", type: "error" });
			setLoading(false);
			return;
		}

		if (!selectedFile) {
			setNotification({ message: "Please select a file to upload.", type: "error" });
			setLoading(false);
			return;
		}

		const reader = new FileReader();
		reader.onload = async (event) => {
			let transactions;
			try {
				transactions = parseTransactionsFromCSV(
					event,
					configurations?.find((configuration) => configuration.name === selectedConfigurationName),
					session.user.id
				);

				const duplicateResults = await checkForDuplicateTransactions(transactions, selectedConfigurationName);
				if (duplicateResults.length > 0) {
					setPendingTransactions(
						transactions.filter((t) => !duplicateResults.some((d) => d.tempInsertId === t.tempInsertId))
					);
					setDuplicateTransactions(duplicateResults);
					setLoading(false);
					return;
				}

				transactions = transactions.map((transaction) => {
					delete transaction.tempInsertId;
					return transaction;
				});

				transactions = checkForSavedMerchants(transactions, merchantSettings);

				await insertTransactions(transactions);
				await fetchTransactions();
				await fetchDashboardStats();
			} catch (error) {
				setNotification({ message: error.message, type: "error" });
				setLoading(false);
				return;
			}

			onClose();
			setNotification({ message: "Transactions uploaded successfully!", type: "success" });
			setLoading(false);
		};
		reader.readAsText(selectedFile);
	};

	const onDuplicateUpload = async () => {
		setLoading(true);
		let transactions = [...pendingTransactions];

		duplicateTransactions.forEach((duplicate) => {
			if (duplicate.include) {
				transactions.push(duplicate);
			}
		});

		transactions = transactions.map((transaction) => {
			delete transaction.tempInsertId;
			delete transaction.include;
			return transaction;
		});

		transactions = checkForSavedMerchants(transactions, merchantSettings);

		await insertTransactions(transactions);
		await fetchTransactions();
		await fetchDashboardStats();

		onClose();
		setNotification({ message: "Transactions uploaded successfully!", type: "success" });
		setLoading(false);
	};

	const onClose = () => {
		closeUploadModal();
		setDuplicateTransactions([]);
		setPendingTransactions([]);
		setselectedConfigurationName("");
		setSelectedFile(null);
		document.querySelector("#fileInput").value = "";
		// setLoading(false);
	};

	const onCancelDuplicateUpload = () => {
		setPendingTransactions([]);
		setDuplicateTransactions([]);
	};

	return (
		<>
			{uploadModalVisible || uploadModalAnimating ? (
				<div
					onClick={onClose}
					className={`${uploadModalAnimating ? (uploadModalVisible ? "enter" : "exit") : ""}
			z-[99] overflow-hidden upload-modal top-0 left-0 absolute w-full h-full flex items-center justify-center bg-[rgba(0,0,0,0.25)]`}
				>
					<div
						onClick={(e) => {
							e.stopPropagation();
						}}
						className="w-5/12 overflow-hidden flex flex-col gap-2 bg-white rounded-xl border border-slate-200"
					>
						<div
							className="w-[200%] flex items-center transition-[all] duration-300"
							style={{ transform: duplicateTransactions.length > 0 ? "translateX(-50%)" : "" }}
						>
							{/* First Section (Contains the Upload Transactions form) */}
							<div className="w-1/2 p-3 flex flex-col gap-3">
								<div className="flex bg-slate-50 w-full justify-between items-center px-3 py-2.5 rounded-lg border border-slate-200">
									<div className="text-base text-slate-600 font-semibold">Upload Transactions</div>
									<button onClick={onClose}>
										<img src="./close.svg" alt="close" className="w-3" />
									</button>
								</div>
								<div className="flex flex-col gap-4 bg-white w-full justify-between items-center rounded-lg px-3">
									<div className="flex justify-between items-center w-full">
										<span className="text-slate-600 align-bottom">
											Select an upload configuration:{" "}
										</span>
										<select
											className="w-40 p-1 bg-white rounded border border-slate-300"
											value={selectedConfigurationName}
											onChange={(e) => setselectedConfigurationName(e.target.value)}
										>
											<option value="" disabled>
												---
											</option>
											{configurations?.map((configuration) => (
												<option key={configuration.name} value={configuration.name}>
													{configuration.name}
												</option>
											))}
										</select>
									</div>
									<div className="flex justify-between w-full gap-5">
										<input
											id="fileInput"
											className="grow rounded"
											type="file"
											accept=".csv"
											onChange={onFileChange}
										/>
										<button
											className="relative bg-cGreen-light hover:bg-cGreen-lightHover border border-slate-300 rounded text-sm text-slate-700 py-1 px-3"
											onClick={onFileUpload}
										>
											<span className={`${loading ? "opacity-0" : ""}`}>Upload</span>
											{loading && <ButtonSpinner />}
										</button>
									</div>
								</div>
							</div>

							{/* Second Section (Contains the Duplicate Transactions form) */}
							<div
								className={`${
									duplicateTransactions.length > 0 ? "h-[40vh]" : "h-0"
								} transition-[all] duration-300 w-1/2 p-4 flex flex-col gap-3`}
							>
								<div>
									<div className="text-base text-slate-600 font-semibold">
										Duplicate Transactions Detected
									</div>
									<div className="text-xs text-slate-500 italic">
										The following transactions share an identical date, merchant, amount, and
										configuration with an existing transaction and will automatically be ignored.
										Check any transactions that you would like to include.
									</div>
								</div>
								<div className="grow border border-slate-200 rounded-lg overflow-auto">
									{duplicateTransactions.map((transaction, index) => (
										<div
											key={index}
											className={`${
												index < duplicateTransactions.length - 1 ? "border-b" : ""
											} border-slate-200 w-full py-1.5 text-sm flex items-center px-2`}
										>
											<div className="w-[15%] pr-2">{transaction.date}</div>
											<div className="w-[60%] pr-3">{transaction.merchant}</div>
											<div
												className={`${
													transaction.amount.toString().includes("-")
														? "text-cGreen-dark"
														: ""
												} w-[20%] pr-2`}
											>
												{transaction.amount.toFixed(2)}
											</div>
											<div className="w-[5%] flex justify-center items-center">
												<input
													className="w-full"
													type="checkbox"
													checked={transaction?.include || false}
													onChange={(e) => {
														setDuplicateTransactions(
															duplicateTransactions.map((duplicate) => {
																if (
																	duplicate.tempInsertId === transaction.tempInsertId
																) {
																	duplicate.include = e.target.checked;
																}
																return duplicate;
															})
														);
													}}
												/>
											</div>
										</div>
									))}
								</div>
								{pendingTransactions.length == 0 && (
									<div className="text-xs text-slate-500 italic">
										<span className="font-bold">NOTE: </span>All transactions were detected as
										duplicates. Either select at least one transaction to be included or cancel the
										upload.
									</div>
								)}
								<div className="flex justify-between items-center">
									<button
										onClick={onCancelDuplicateUpload}
										className="border-slate-200 text-slate-500 hover:bg-slate-50 text-sm font-normal px-2 py-1 border-slate-300 border rounded"
									>
										Cancel
									</button>
									<button
										onClick={
											pendingTransactions.length === 0 &&
											duplicateTransactions.filter((d) => d.include).length === 0
												? () => {}
												: onDuplicateUpload
										}
										className={`${
											pendingTransactions.length === 0 &&
											duplicateTransactions.filter((d) => d.include).length === 0
												? "opacity-40 hover:cursor-default"
												: ""
										} relative font-normal text-slate-600 bg-cGreen-light hover:bg-cGreen-lightHover border border-slate-300 rounded text-sm py-1 px-3`}
									>
										<span className={`${loading ? "opacity-0" : ""}`}>Upload</span>
										{loading && <ButtonSpinner />}
									</button>
								</div>
								{/* <div className="flex bg-slate-50 w-full justify-between items-center px-3 py-2.5 rounded-lg border border-slate-200">
									<div className="text-base text-slate-600 font-semibold">
										Duplicate Transactions Detected
									</div>
								</div> */}
							</div>
						</div>
					</div>
				</div>
			) : (
				""
			)}
		</>
	);
};

export default UploadModal;
