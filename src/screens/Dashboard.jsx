import TransactionTable from "../components/TransactionTable";
import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import { useDataStore } from "../util/dataStore";
import NotificationBanner from "../components/NotificationBanner";
import DashboardStats from "../components/DashboardStats";
import UploadModal from "../components/UploadModal";

const Dashboard = () => {
	const {
		transactions,
		setTransactions,
		fetchTransactions,
		transactionsLoading,
		categories,
		fetchCategories,
		dashboardStats,
		fetchDashboardStats,
		filters,
	} = useDataStore((state) => ({
		transactions: state.transactions,
		setTransactions: state.setTransactions,
		fetchTransactions: state.fetchTransactions,
		transactionsLoading: state.transactionsLoading,
		categories: state.categories,
		fetchCategories: state.fetchCategories,
		dashboardStats: state.dashboardStats,
		fetchDashboardStats: state.fetchDashboardStats,
		filters: state.filters,
	}));
	const [uploadModalVisible, setUploadModalVisible] = useState(false);
	const [uploadModalAnimating, setUploadModalAnimating] = useState(false);

	const openUploadModal = () => {
		setUploadModalAnimating(true);
		setUploadModalVisible(true);
		setTimeout(() => {
			setUploadModalAnimating(false);
		}, 100);
	};

	const closeUploadModal = () => {
		setUploadModalAnimating(true);
		setUploadModalVisible(false);
		setTimeout(() => {
			setUploadModalAnimating(false);
		}, 100);
	};

	useEffect(() => {
		if (transactions === null) fetchTransactions();
		if (categories === null) fetchCategories();
		if (dashboardStats === null) fetchDashboardStats();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [transactions, filters]);

	return (
		<div className="w-screen h-screen flex overflow-hidden relative">
			<Navbar activePage={"Dashboard"} />
			<div className="grow flex flex-col gap-3 h-full overflow-y-auto no-scrollbar bg-slate-100 p-4 md:p-12 lg:p-32">
				<DashboardStats />
				<TransactionTable
					transactions={transactions}
					setTransactions={setTransactions}
					transactionsLoading={transactionsLoading}
					linkToTransactionsPage={true}
					openUploadModal={openUploadModal}
				/>
			</div>
			<NotificationBanner />
			<UploadModal
				modalVisible={uploadModalVisible}
				setModalVisible={setUploadModalVisible}
				modalAnimating={uploadModalAnimating}
				setModalAnimating={setUploadModalAnimating}
				openUploadModal={openUploadModal}
				closeUploadModal={closeUploadModal}
			/>
		</div>
	);
};

export default Dashboard;
