import PropTypes from "prop-types";

const TransactionTable = ({ transactions }) => {
	return (
		<table className="border-collapse border border-slate-500">
			<thead>
				<tr>
					<th className="border border-slate-600 p-1">Date</th>
					<th className="border border-slate-600 p-1">Merchant</th>
					<th className="border border-slate-600 p-1">Amount</th>
				</tr>
			</thead>
			<tbody>
				{transactions.map((transaction) => (
					<tr key={transaction.id}>
						<td className="border border-slate-600 p-1">{transaction.date}</td>
						<td className="border border-slate-600 p-1">{transaction.merchant}</td>
						<td className="border border-slate-600 p-1">{transaction.amount}</td>
					</tr>
				))}
			</tbody>
		</table>
	);
};

TransactionTable.propTypes = {
	transactions: PropTypes.arrayOf(
		PropTypes.shape({
			id: PropTypes.number.isRequired,
			date: PropTypes.string.isRequired,
			merchant: PropTypes.string.isRequired,
			amount: PropTypes.number.isRequired,
		})
	).isRequired,
};

export default TransactionTable;
