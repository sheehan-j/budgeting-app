/* eslint-disable react-hooks/exhaustive-deps */
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDataStore } from "./util/dataStore";
import Dashboard from "./screens/Dashboard";
import Transactions from "./screens/Transactions";
import Configurations from "./screens/Configurations";
import Login from "./screens/Login";
import supabase from "./config/supabaseClient";

const App = () => {
	const { session, setSession, totalTransactionCount, fetchTotalTransactionCount } = useDataStore((state) => ({
		session: state.session,
		setSession: state.setSession,
		totalTransactionCount: state.totalTransactionCount,
		fetchTotalTransactionCount: state.fetchTotalTransactionCount,
	}));
	const [loading, setLoading] = useState(true);

	const loadData = async () => {
		const images = {
			dashboardGreen: "./dashboard_green.svg",
			dashboardSlate: "./dashboard_slate.svg",
			transactionsGreen: "./transactions_green.svg",
			transactionsSlate: "./transactions_slate.svg",
			settingsGreen: "./settings_green.svg",
			settingsSlate: "./settings_slate.svg",
		};

		// eslint-disable-next-line no-unused-vars
		Object.entries(images).map(async ([key, value]) => {
			const img = new Image();
			img.src = value;
		});

		setLoading(false);

		if (totalTransactionCount == -1) await fetchTotalTransactionCount();
	};

	useEffect(() => {
		loadData();
	}, []);

	useEffect(() => {
		supabase.auth.getSession().then(({ data: { session } }) => {
			setSession(session);
		});

		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((_event, session) => {
			setSession(session);
		});

		return () => subscription.unsubscribe();
	}, []);

	if (loading) return null;

	return (
		<BrowserRouter>
			<Routes>
				{session ? (
					<>
						<Route path="/*" element={<Dashboard />} />
						<Route path="/configurations" element={<Configurations />} />
						<Route path="/transactions" element={<Transactions />} />
					</>
				) : (
					<>
						<Route path="/*" element={<Login />} />
					</>
				)}
			</Routes>
		</BrowserRouter>
	);
};

export default App;
