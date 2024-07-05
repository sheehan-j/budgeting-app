import { useEffect, useState } from "react";
import { insertTransactions } from "../util/transactionQueries";
import { parseCSV } from "../util/csvUtil";
import supabase from "../config/supabaseClient";

const FileUpload = () => {
	const [selectedConfigurationName, setselectedConfigurationName] = useState("");
	const [configurations, setConfigurations] = useState([]);
	const [selectedFile, setSelectedFile] = useState(null);

	const loadData = async () => {
		let { data, error } = await supabase.from("configurations").select("*");
		if (error) {
			alert("Could not fetch configurations");
			return;
		}
		data.sort((a, b) => a.name.localeCompare(b.name));
		setConfigurations(data);
	};

	useEffect(() => {
		loadData();
	}, []);

	const onFileChange = (event) => {
		setSelectedFile(event.target.files[0]);
	};

	const onFileUpload = () => {
		if (selectedFile) {
			const reader = new FileReader();

			reader.onload = async (event) => {
				const transactions = parseCSV(
					event,
					configurations.find((configuration) => configuration.name === selectedConfigurationName)
				);
				await insertTransactions(transactions);
			};

			reader.readAsText(selectedFile);
		}
	};

	return (
		<div className="w-screen h-screen flex flex-col justify-center items-center">
			<select value={selectedConfigurationName} onChange={(e) => setselectedConfigurationName(e.target.value)}>
				<option value="" disabled></option>
				{configurations.map((configuration) => (
					<option key={configuration.name} value={configuration.name}>
						{configuration.name}
					</option>
				))}
			</select>
			<div>
				<input type="file" accept=".csv" onChange={onFileChange} />
				<button onClick={onFileUpload}>Upload</button>
			</div>
		</div>
	);
};

export default FileUpload;
