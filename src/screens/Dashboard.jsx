import { useState, useEffect } from "react";
import TransactionTable from "../components/TransactionTable";
import { getTransactions } from "../util/transactionQueries";

const Dashboard = () => {
	const [transactions, setTransactions] = useState([]);
	useEffect(() => {
		const fetchTransactions = async () => {
			const data = await getTransactions();
			setTransactions(data);
		};

		fetchTransactions();
	}, []);
	return (
		<div className="grow h-full overflow-y-scroll bg-slate-100">
			<TransactionTable transactions={transactions} />
		</div>
	);
};

export default Dashboard;
