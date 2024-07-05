import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./screens/Home";
import Settings from "./screens/Settings";
import FileUpload from "./screens/FileUpload";

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/*" element={<Home />} />
				<Route path="/settings" element={<Settings />} />
				<Route path="/file-upload" element={<FileUpload />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;
