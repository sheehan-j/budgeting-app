import { useState, useRef } from "react";
import { useDataStore } from "../util/dataStore";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import ButtonSpinner from "./ButtonSpinner";
import supabase from "../config/supabaseClient";
import TransactionTableCategoryButton from "./TransactionTableCategoryButton";
import TableSorter from "./TableSorter";

const TransactionTable = ({ transactions, setTransactions, transactionsLoading, linkToTransactionsPage }) => {
	const {
		categories,
		categoriesLoading,
		setNotification,
		fetchDashboardStats,
		dashboardSortState,
		setDashboardSortState,
		totalTransactionCount,
	} = useDataStore((state) => ({
		categories: state.categories,
		categoriesLoading: state.categoriesLoading,
		setNotification: state.setNotification,
		fetchDashboardStats: state.fetchDashboardStats,
		dashboardSortState: state.dashboardSortState,
		setDashboardSortState: state.setDashboardSortState,
		totalTransactionCount: state.totalTransactionCount,
	}));
	const [visibleCategoryMenu, setVisibleCategoryMenu] = useState(null);
	const [animatingCategoryMenu, setAnimatingCategoryMenu] = useState(null);
	const [menuDirectionDown, setMenuDirectionDown] = useState(true);
	const [categoryUpdateLoading, setCategoryUpdateLoading] = useState(false);
	const tableRef = useRef(null);

	const openCategoryMenu = (transactionId, buttonRef) => {
		if (visibleCategoryMenu === transactionId) return;

		const buttonRect = buttonRef.getBoundingClientRect();
		const tableRect = tableRef.current.getBoundingClientRect();
		const spaceBelow = tableRect.bottom - buttonRect.bottom;
		const spaceAbove = buttonRect.top - tableRect.top;

		if (spaceBelow < 300 && spaceAbove > spaceBelow) {
			setMenuDirectionDown(false);
		} else {
			setMenuDirectionDown(true);
		}

		setAnimatingCategoryMenu(transactionId);
		setVisibleCategoryMenu(transactionId);
		setTimeout(() => {
			setAnimatingCategoryMenu(null);
		}, 200);
	};

	const closeCategoryMenu = () => {
		if (!visibleCategoryMenu) return;
		setAnimatingCategoryMenu(visibleCategoryMenu);
		setVisibleCategoryMenu(null);
		setTimeout(() => {
			// setVisibleCategoryMenu(null);
			setAnimatingCategoryMenu(null);
		}, 200);
	};

	const editTransactionCategory = async (transaction, categoryName) => {
		if (categoryUpdateLoading) return;

		setCategoryUpdateLoading(true);
		const updatedTransaction = { ...transaction, categoryName };
		delete updatedTransaction.buttonRef;

		const { error } = await supabase.from("transactions").upsert(updatedTransaction);
		if (error) {
			setNotification({ message: error.message, type: "error" });
			setCategoryUpdateLoading(false);
			return;
		}

		const updatedTransactions = transactions.map((transaction) => {
			if (transaction.id === updatedTransaction.id) {
				return updatedTransaction;
			}
			return transaction;
		});

		setTransactions(updatedTransactions);
		closeCategoryMenu();
		setCategoryUpdateLoading(false);
		fetchDashboardStats();
	};

	window.onclick = (event) => {
		if (!event.target.matches(".category-button") && !event.target.matches(".category-menu")) {
			closeCategoryMenu();
		}
	};

	const onSorterClick = (column) => {
		let newDashboardSortState = {};
		if (dashboardSortState?.column === column) {
			if (dashboardSortState?.direction === "asc") newDashboardSortState = null;
			else newDashboardSortState = { column, direction: "asc" };
		} else {
			newDashboardSortState = { column, direction: "desc" };
		}

		setDashboardSortState(newDashboardSortState);
		let sortedTransactions = [...transactions];
		sortedTransactions.sort((a, b) => {
			// Set sort column and direction, default to desc date
			const sortColumn = newDashboardSortState?.column || "date";
			const sortDirection = newDashboardSortState?.direction || "desc";

			let aVal, bVal;
			if (sortColumn === "date") {
				aVal = new Date(a[sortColumn]);
				bVal = new Date(b[sortColumn]);
			} else if (sortColumn == "amount") {
				aVal = parseFloat(a[sortColumn]);
				bVal = parseFloat(b[sortColumn]);
			} else {
				aVal = a[sortColumn];
				bVal = b[sortColumn];
			}

			if (aVal < bVal) {
				return sortDirection === "asc" ? -1 : 1;
			}
			if (aVal > bVal) {
				return sortDirection === "asc" ? 1 : -1;
			}
			return 0;
		});
		setTransactions(sortedTransactions);
	};

	return (
		<div ref={tableRef} className="w-full grow flex flex-col bg-white border border-slate-300 rounded-2xl">
			<div className="flex items-center justify-between text-lg text-slate-600 font-semibold px-5 py-3">
				<span>Transactions</span>
				<div className="flex gap-2">
					<Link to="/transactions">
						<button className="border-slate-200 text-slate-500 hover:bg-slate-50 text-sm font-normal px-2 py-1 border-slate-300 border rounded">
							View Full Table
						</button>
					</Link>
					<button className="relative font-normal text-slate-600 bg-cGreen-light hover:bg-cGreen-lightHover border border-slate-300 rounded text-sm py-1 px-3">
						Upload
					</button>
				</div>
			</div>
			<div className="bg-slate-100 py-3 px-5 w-full flex box-border">
				<div className="font-semibold w-[11%] pr-4 flex justify-between items-center">
					<span>Date</span>
					<TableSorter column={"date"} sortState={dashboardSortState} onSorterClick={onSorterClick} />
				</div>
				<div className="font-semibold w-[37%] pr-4 flex justify-between items-center">
					<span>Merchant</span>
					<TableSorter column={"merchant"} sortState={dashboardSortState} onSorterClick={onSorterClick} />
				</div>
				<div className="font-semibold w-[20%] pr-4 flex justify-between items-center">
					<span>Category</span>
					<TableSorter column={"categoryName"} sortState={dashboardSortState} onSorterClick={onSorterClick} />
				</div>
				<div className="font-semibold w-[20%] pr-4 flex justify-between items-center">
					<span>Configuration</span>
					<TableSorter
						column={"configurationName"}
						sortState={dashboardSortState}
						onSorterClick={onSorterClick}
					/>
				</div>
				<div className="font-semibold w-[12%] flex justify-between items-center">
					<span>Amount</span>
					<TableSorter column={"amount"} sortState={dashboardSortState} onSorterClick={onSorterClick} />
				</div>
			</div>
			{!transactionsLoading &&
				transactions?.map((transaction, index) => (
					<div
						key={transaction.id}
						className={`border-t ${
							index < transaction.length - 1 && totalTransactionCount <= 30 ? "border-b" : ""
						} border-slate-200 flex items-center py-3 px-5 flex`}
					>
						<div className="w-[11%] pr-4">{transaction.date}</div>
						<div className="w-[37%] pr-4">{transaction.merchant}</div>
						<div className="w-[20%] pr-4 relative">
							<TransactionTableCategoryButton
								transaction={transaction}
								visibleCategoryMenu={visibleCategoryMenu}
								animatingCategoryMenu={animatingCategoryMenu}
								categories={categories}
								categoriesLoading={categoriesLoading}
								menuDirectionDown={menuDirectionDown}
								openCategoryMenu={openCategoryMenu}
								editTransactionCategory={editTransactionCategory}
								categoryUpdateLoading={categoryUpdateLoading}
							/>
						</div>
						<div className="w-[20%] pr-4">{transaction.configurationName}</div>
						<div className={`${transaction.amount.includes("-") ? "text-cGreen-dark" : ""} w-[12%]`}>
							{transaction.amount}
						</div>
					</div>
				))}
			{!transactionsLoading && totalTransactionCount > 30 && (
				<div className="border-slate-200 border-t flex items-center justify-center py-3 px-5 ">
					<Link to="/transactions">
						<button className="border-slate-200 hover:bg-slate-50 font-medium px-2 py-1 border-slate-300 border rounded">
							View Full Table
						</button>
					</Link>
				</div>
			)}

			{transactionsLoading && (
				<div className="flex relative justify-center text-sm text-slate-300 items-center p-5 opacity-80">
					<ButtonSpinner />
				</div>
			)}
		</div>
	);
};

TransactionTable.propTypes = {
	transactions: PropTypes.arrayOf(
		PropTypes.shape({
			id: PropTypes.number.isRequired,
			date: PropTypes.string.isRequired,
			merchant: PropTypes.string.isRequired,
			amount: PropTypes.string.isRequired,
		})
	),
	setTransactions: PropTypes.func,
	transactionsLoading: PropTypes.bool,
	linkToTransactionsPage: PropTypes.bool,
};

export default TransactionTable;
