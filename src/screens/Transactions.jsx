import { useState, useEffect } from "react";
import { insertTransactions } from "../util/supabaseQueries";
import { parseCSV } from "../util/csvUtil";
import Navbar from "../components/Navbar";
import NotificationBanner from "../components/NotificationBanner";
import { useDataStore } from "../util/dataStore";
import ButtonSpinner from "../components/ButtonSpinner";

const Transactions = () => {
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
		<div className="w-screen h-screen flex overflow-hidden relative">
			<Navbar activePage={"Transactions"} />
			<div className="relative grow h-full flex flex-col gap-3 justify-center items-center bg-slate-100">
				<div className="flex bg-white w-5/12 justify-between items-center rounded-lg p-3">
					<div className="text-slate-600">Select an upload configuration: </div>
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
				<div className="flex gap-5 bg-white w-5/12 justify-between items-center rounded-lg p-3">
					<input id="fileInput" className="grow" type="file" accept=".csv" onChange={onFileChange} />
					<button
						className="relative bg-cGreen-light hover:bg-cGreen-lightHover border border-slate-300 rounded text-sm text-slate-700 py-1 px-3"
						onClick={onFileUpload}
					>
						<span className={`${loading ? "opacity-0" : ""}`}>Upload</span>
						{loading && <ButtonSpinner />}
					</button>
				</div>
				<NotificationBanner />
			</div>
		</div>
	);
};

export default Transactions;
