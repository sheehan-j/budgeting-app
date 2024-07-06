import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./screens/Home";

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/*" element={<Home />} />
				{/* <Route path="/settings" element={<Settings />} />
				<Route path="/transactions" element={<Transactions />} /> */}
			</Routes>
		</BrowserRouter>
	);
}

export default App;
