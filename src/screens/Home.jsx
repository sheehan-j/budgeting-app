import { useState, useEffect } from "react";
import FileUploader from "../components/FileUploader";
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
		<div>
			<TransactionTable transactions={transactions} />
			<FileUploader />
		</div>
	);
};

export default Home;
