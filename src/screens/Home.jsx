import { useState } from "react";
import Navbar from "../components/Navbar";
import Dashboard from "./Dashboard";
import Transactions from "./Transactions";
import Settings from "./Settings";

const Home = () => {
	const [activePage, setActivePage] = useState("Dashboard");

	return (
		<div className="w-screen h-screen flex overflow-hidden relative">
			<Navbar activePage={activePage} setActivePage={setActivePage} />
			{activePage === "Dashboard" && <Dashboard />}
			{activePage === "Transactions" && <Transactions />}
			{activePage === "Settings" && <Settings />}
		</div>
	);
};

export default Home;
