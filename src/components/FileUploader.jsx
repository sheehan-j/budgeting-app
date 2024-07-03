import { useState } from "react";
import { parseCSV } from "../util/csvUtil";

const FileUploader = () => {
	const [selectedFile, setSelectedFile] = useState(null);

	const onFileChange = (event) => {
		setSelectedFile(event.target.files[0]);
	};

	const onFileUpload = () => {
		if (selectedFile) {
			const reader = new FileReader();

			reader.onload = (event) => {
				parseCSV(event);
			};

			reader.readAsText(selectedFile);
		}
	};

	return (
		<div>
			<input type="file" accept=".csv" onChange={onFileChange} />
			<button onClick={onFileUpload}>Upload</button>
		</div>
	);
};

export default FileUploader;
