/* eslint-disable react-hooks/exhaustive-deps */
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDataStore } from "./util/dataStore";
import { useAnimationStore } from "./util/animationStore";
import Dashboard from "./screens/Dashboard";
import Budgets from "./screens/Budgets";
import Settings from "./screens/Settings";
import LoginWithSignupDisabled from "./screens/LoginWithSignupDisabled";
import supabase from "./config/supabaseClient";

const App = () => {
	const { session, setSession, totalTransactionCount, fetchTotalTransactionCount } = useDataStore((state) => ({
		session: state.session,
		setSession: state.setSession,
		totalTransactionCount: state.totalTransactionCount,
		fetchTotalTransactionCount: state.fetchTotalTransactionCount,
	}));
	const {
		filterMenuVisible,
		closeFilterMenu,
		visibleCategoryMenu,
		closeCategoryMenu,
		visibleTransactionMenu,
		closeTransactionMenu,
		bulkActionsMenuVisible,
		closeBulkActionsMenu,
	} = useAnimationStore((state) => ({
		filterMenuVisible: state.filterMenuVisible,
		closeFilterMenu: state.closeFilterMenu,
		visibleCategoryMenu: state.visibleCategoryMenu,
		closeCategoryMenu: state.closeCategoryMenu,
		visibleTransactionMenu: state.visibleTransactionMenu,
		closeTransactionMenu: state.closeTransactionMenu,
		bulkActionsMenuVisible: state.bulkActionsMenuVisible,
		closeBulkActionsMenu: state.closeBulkActionsMenu,
	}));
	const {
		transactions,
		fetchTransactions,
		categories,
		fetchCategories,
		dashboardStats,
		fetchDashboardStats,
		filters,
		merchantSettings,
		fetchMerchantSettings,
	} = useDataStore((state) => ({
		transactions: state.transactions,
		fetchTransactions: state.fetchTransactions,
		categories: state.categories,
		fetchCategories: state.fetchCategories,
		dashboardStats: state.dashboardStats,
		fetchDashboardStats: state.fetchDashboardStats,
		filters: state.filters,
		merchantSettings: state.merchantSettings,
		fetchMerchantSettings: state.fetchMerchantSettings,
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

		const { data, error } = await supabase.auth.getSession();
		if (!error) setSession(data.session);

		setLoading(false);

		if (totalTransactionCount == -1) await fetchTotalTransactionCount();
	};

	useEffect(() => {
		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((_event, session) => {
			setSession(session);
		});

		return () => subscription.unsubscribe();
	}, []);

	useEffect(() => {
		loadData();
	}, []);

	window.onclick = (event) => {
		const categoryMenuClassNames = [".category-button", ".category-menu"];
		if (
			!categoryMenuClassNames.some((className) => event.target.closest(className)) &&
			visibleCategoryMenu !== null
		) {
			closeCategoryMenu();
		}

		const addFilterMenuClassNames = [
			".add-filter-button",
			".add-filter-menu",
			".add-filter-option",
			".add-filter-header",
		];
		if (!addFilterMenuClassNames.some((className) => event.target.closest(className)) && filterMenuVisible) {
			closeFilterMenu();
		}

		const transactionMenuClassNames = [".transaction-menu-button", ".transaction-menu"];
		if (
			!transactionMenuClassNames.some((className) => event.target.closest(className)) &&
			visibleTransactionMenu !== null
		) {
			closeTransactionMenu();
		}

		const bulkActionsMenuClassNames = [".bulk-actions-menu", ".bulk-actions-button"];
		if (!bulkActionsMenuClassNames.some((className) => event.target.closest(className)) && bulkActionsMenuVisible) {
			closeBulkActionsMenu();
		}
	};

	const updateDataStore = () => {
		if (transactions === null) fetchTransactions();
		if (categories === null) fetchCategories();
		if (dashboardStats === null) fetchDashboardStats();
		if (merchantSettings === null) fetchMerchantSettings();
	};

	useEffect(() => {
		updateDataStore();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [transactions, filters, dashboardStats, merchantSettings]);

	if (loading) return null;

	return (
		<BrowserRouter>
			<Routes>
				{session ? (
					<>
						<Route path="/*" element={<Dashboard />} />
						<Route path="/settings" element={<Settings />} />
						<Route path="/budgets" element={<Budgets />} />
					</>
				) : (
					<>
						<Route path="/*" element={<LoginWithSignupDisabled />} />
					</>
				)}
			</Routes>
		</BrowserRouter>
	);
};

export default App;
