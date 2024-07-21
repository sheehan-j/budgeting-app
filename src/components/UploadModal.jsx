import { useState, useEffect } from "react";
import { insertTransactions } from "../util/supabaseQueries";
import { parseCSV } from "../util/csvUtil";
import { useDataStore } from "../util/dataStore";
import { useAnimationStore } from "../util/animationStore";
import NotificationBanner from "../components/NotificationBanner";
import ButtonSpinner from "../components/ButtonSpinner";

const UploadModal = () => {
	const [selectedConfigurationName, setselectedConfigurationName] = useState("");
	const [selectedFile, setSelectedFile] = useState(null);
	const { configurations, fetchConfigurations, setNotification, fetchTransactions, fetchDashboardStats, session } =
		useDataStore((state) => ({
			configurations: state.configurations,
			fetchConfigurations: state.fetchConfigurations,
			setNotification: state.setNotification,
			fetchTransactions: state.fetchTransactions,
			fetchDashboardStats: state.fetchDashboardStats,
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
				transactions = parseCSV(
					event,
					configurations?.find((configuration) => configuration.name === selectedConfigurationName),
					session.user.id
				);
				await insertTransactions(transactions);
				await fetchTransactions();
				await fetchDashboardStats();
			} catch (error) {
				setNotification({ message: error.message, type: "error" });
				setLoading(false);
				return;
			}

			setSelectedFile(null);
			document.querySelector("#fileInput").value = "";
			setNotification({ message: "Transactions uploaded successfully!", type: "success" });
			setLoading(false);
		};
		reader.readAsText(selectedFile);
	};

	return (
		<>
			{uploadModalVisible || uploadModalAnimating ? (
				<div
					onClick={closeUploadModal}
					className={`${uploadModalAnimating ? (uploadModalVisible ? "enter" : "exit") : ""}
			z-[99] overflow-hidden upload-modal top-0 left-0 absolute w-full h-full flex items-center justify-center bg-[rgba(0,0,0,0.25)]`}
				>
					<div
						onClick={(e) => {
							e.stopPropagation();
						}}
						className="w-1/3 flex flex-col gap-2 bg-white rounded-xl border border-slate-200 p-3"
					>
						<div className="flex bg-slate-50 w-full justify-between items-center px-3 py-2.5 rounded-lg border border-slate-200">
							<div className="text-base text-slate-600 font-semibold">Upload Transactions</div>
							<button onClick={closeUploadModal}>
								<img src="./close.svg" alt="close" className="w-3" onClick={closeUploadModal} />
							</button>
						</div>
						<div className="flex flex-col gap-3 bg-white w-full justify-between items-center rounded-lg p-3">
							<div className="flex justify-between items-center w-full">
								<span className="text-slate-600 align-bottom">Select an upload configuration: </span>
								<select
									className="w-40 p-0.5 rounded border border-slate-300"
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
					<NotificationBanner />
				</div>
			) : (
				""
			)}
		</>
	);
};

export default UploadModal;
