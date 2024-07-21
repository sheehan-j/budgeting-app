import PropTypes from "prop-types";
import { useAnimationStore } from "../util/animationStore";
import { useDataStore } from "../util/dataStore";
import { setTransactionIgnored, deleteTransaction } from "../util/supabaseQueries";
import { getDashboardStats } from "../util/statsUtil";

const TransactionMenu = ({ transactionId, ignored }) => {
	const { visibleTransactionMenu, animatingTransactionMenu, openTransactionMenu, closeTransactionMenu } =
		useAnimationStore((state) => ({
			visibleTransactionMenu: state.visibleTransactionMenu,
			animatingTransactionMenu: state.animatingTransactionMenu,
			openTransactionMenu: state.openTransactionMenu,
			closeTransactionMenu: state.closeTransactionMenu,
		}));
	const { transactions, setTransactions, filters, setDashboardStats } = useDataStore((state) => ({
		transactions: state.transactions,
		setTransactions: state.setTransactions,
		filters: state.filters,
		setDashboardStats: state.setDashboardStats,
	}));

	const toggleTransactionMenu = () => {
		if (visibleTransactionMenu === transactionId) {
			closeTransactionMenu();
		} else {
			openTransactionMenu(transactionId);
		}
	};

	const updateTransactionIgnored = async (ignore) => {
		toggleTransactionMenu();
		const success = await setTransactionIgnored(transactionId, ignore);

		// Instead of calling fetchTransactions, which causes loading animations, just update the data in place on success
		if (success) {
			const newTransactions = transactions.map((transaction) => {
				if (transaction.id === transactionId) {
					return { ...transaction, ignored: ignore };
				}
				return transaction;
			});
			setTransactions(newTransactions);
			setDashboardStats(await getDashboardStats(newTransactions, filters));
		}
	};

	const onClickDelete = async () => {
		toggleTransactionMenu();
		const success = await deleteTransaction(transactionId);

		if (success) {
			const newTransactions = transactions.filter((transaction) => transaction.id !== transactionId);
			setTransactions(newTransactions);
			setDashboardStats(await getDashboardStats(newTransactions, filters));
		}
	};

	return (
		<div className="transaction-menu-item w-full relative flex items-center justify-start">
			<div className="w-full max-w-4">
				<button onClick={toggleTransactionMenu} className="transaction-menu-item relative">
					<img className="transaction-menu-item" src="./dots.svg" />
				</button>
			</div>
			{(visibleTransactionMenu === transactionId || animatingTransactionMenu === transactionId) && (
				<div
					className={`${
						animatingTransactionMenu === transactionId
							? visibleTransactionMenu === transactionId
								? "enter"
								: "exit"
							: ""
					} transaction-menu-item dropdown-down flex flex-col p-1 overflow-hidden w-[10rem] drop-shadow-sm absolute z-[99] right-0 top-[120%] bg-white border border-slate-200 rounded-lg`}
				>
					{ignored ? (
						<button
							onClick={() => {
								updateTransactionIgnored(false);
							}}
							className="transaction-menu-item text-start font-regular text-xs hover:bg-slate-50 px-2 py-1 rounded flex items-center gap-1.5"
						>
							<img src="./unignore.svg" className="transaction-menu-item w-5" />
							Un-ignore
						</button>
					) : (
						<button
							onClick={() => {
								updateTransactionIgnored(true);
							}}
							className="transaction-menu-item text-start font-regular text-xs hover:bg-slate-50 px-2 py-1 rounded flex items-center gap-1.5"
						>
							<img src="./ignore.svg" className="transaction-menu-item w-5" />
							Ignore
						</button>
					)}
					<button
						onClick={onClickDelete}
						className="transaction-menu-item text-start font-regular text-xs text-red-400 hover:bg-slate-50 px-2 py-1 rounded flex items-center gap-1.5"
					>
						<img src="./trash.svg" className="transaction-menu-item w-5" />
						Delete
					</button>
				</div>
			)}
		</div>
	);
};

TransactionMenu.propTypes = {
	transactionId: PropTypes.number,
	ignored: PropTypes.bool,
};

export default TransactionMenu;
