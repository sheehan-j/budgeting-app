import { useState, useEffect } from "react";
import TransactionTable from "../components/TransactionTable";
import { getTransactions } from "../util/transactionQueries";

const Home = () => {
	const [transactions, setTransactions] = useState([]);

	useEffect(() => {
		const fetchTransactions = async () => {
			const data = await getTransactions();
			setTransactions(data);
		};

		fetchTransactions();
	}, []);

	return (
		<div className="w-screen min-h-screen p-3 flex justify-center items-center">
			<TransactionTable transactions={transactions} />
		</div>
	);
};

export default Home;
