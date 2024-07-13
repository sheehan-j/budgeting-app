import TransactionTable from "../components/TransactionTable";
import Navbar from "../components/Navbar";
import { useEffect } from "react";
import { useDataStore } from "../util/dataStore";
import NotificationBanner from "../components/NotificationBanner";
import DashboardStats from "../components/DashboardStats";

const Dashboard = () => {
	const {
		dashboardTransactions,
		setDashboardTransactions,
		fetchDashboardTransactions,
		dashboardTransactionsLoading,
		categories,
		fetchCategories,
		dashboardStats,
		fetchDashboardStats,
	} = useDataStore((state) => ({
		dashboardTransactions: state.dashboardTransactions,
		setDashboardTransactions: state.setDashboardTransactions,
		fetchDashboardTransactions: state.fetchDashboardTransactions,
		dashboardTransactionsLoading: state.dashboardTransactionsLoading,
		categories: state.categories,
		fetchCategories: state.fetchCategories,
		dashboardStats: state.dashboardStats,
		fetchDashboardStats: state.fetchDashboardStats,
	}));

	useEffect(() => {
		if (dashboardTransactions === null) fetchDashboardTransactions();
		if (categories === null) fetchCategories();
		if (dashboardStats === null) fetchDashboardStats();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div className="w-screen h-screen flex relative">
			<Navbar activePage={"Dashboard"} />
			<div className="grow flex flex-col gap-3 h-full overflow-y-auto no-scrollbar bg-slate-100 p-4 md:p-12 lg:p-28">
				<DashboardStats />
				<TransactionTable
					transactions={dashboardTransactions}
					setTransactions={setDashboardTransactions}
					transactionsLoading={dashboardTransactionsLoading}
					linkToTransactionsPage={true}
				/>
			</div>
			<NotificationBanner />
		</div>
	);
};

export default Dashboard;
