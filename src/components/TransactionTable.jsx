import { useState, useRef, useEffect, useLayoutEffect } from "react";
import { useDataStore } from "../util/dataStore";
import { useAnimationStore } from "../util/animationStore";
import { filterTransactions } from "../util/filterUtil";
import { sortTransactions } from "../util/sortUtil";
import TransactionMenu from "./TransactionMenu";
import PropTypes from "prop-types";
import ButtonSpinner from "./ButtonSpinner";
import supabase from "../config/supabaseClient";
import TransactionTableCategoryButton from "./TransactionTableCategoryButton";
import TableSorter from "./TableSorter";
import FilterButtons from "./FilterButtons";
import Pagination from "./Pagination";
import { getDashboardStats } from "../util/statsUtil";

const TransactionTable = ({ transactions, setTransactions, transactionsLoading }) => {
	const {
		categories,
		categoriesLoading,
		setNotification,
		setDashboardStats,
		dashboardSortState,
		setDashboardSortState,
		filters,
		setFilters,
		fetchBudgets,
	} = useDataStore((state) => ({
		categories: state.categories,
		categoriesLoading: state.categoriesLoading,
		setNotification: state.setNotification,
		setDashboardStats: state.setDashboardStats,
		fetchDashboardStats: state.fetchDashboardStats,
		dashboardSortState: state.dashboardSortState,
		setDashboardSortState: state.setDashboardSortState,
		totalTransactionCount: state.totalTransactionCount,
		filters: state.filters,
		setFilters: state.setFilters,
		fetchBudgets: state.fetchBudgets,
	}));
	const { openUploadModal, closeCategoryMenu } = useAnimationStore((state) => ({
		openUploadModal: state.openUploadModal,
		closeCategoryMenu: state.closeCategoryMenu,
	}));
	const [categoryUpdateLoading, setCategoryUpdateLoading] = useState(false);
	const [showFilters, setShowFilters] = useState(false);
	const [localTransactions, setLocalTransactions] = useState(transactions);
	const tableRef = useRef(null);
	const filtersRef = useRef(null);

	const [page, setPage] = useState(0);
	const pageSize = 20;

	// Reapply filters and sorting to local transactions whenver transactions from the store change
	useEffect(() => {
		if (transactions) {
			let newTransactions = [...transactions];
			newTransactions = filterTransactions(transactions, filters);
			newTransactions = sortTransactions(newTransactions, dashboardSortState);
			setLocalTransactions(newTransactions);
		}
	}, [filters, dashboardSortState, transactions, setDashboardStats]);

	// Whenever a filter is applied, reset to the first page
	useEffect(() => {
		setPage(0);
	}, [filters]);

	// Resize the height of the filter menu on window resize
	useLayoutEffect(() => {
		if (showFilters) {
			filtersRef.current.style.maxHeight = `${filtersRef.current.scrollHeight}px`;
		} else {
			filtersRef.current.style.maxHeight = "0";
		}
	}, [showFilters, filters]);

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

		// Instead of calling fetchTransactions, which causes loading animations, update the data in place on success
		const updatedTransactions = transactions.map((transaction) => {
			if (transaction.id === updatedTransaction.id) {
				return updatedTransaction;
			}
			return transaction;
		});

		setTransactions(updatedTransactions);
		closeCategoryMenu();
		setDashboardStats(await getDashboardStats(updatedTransactions, filters));
		fetchBudgets();
		setTimeout(() => {
			setCategoryUpdateLoading(false);
		}, 100);
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
	};

	return (
		<div ref={tableRef} className="w-full grow flex flex-col bg-white border border-slate-300 rounded-2xl">
			<div className="flex items-center justify-between text-lg text-slate-600 font-semibold px-5 py-3">
				<span>Transactions</span>
				<div className="flex gap-2">
					<button
						onClick={() => {
							setShowFilters(!showFilters);
						}}
						className="border-slate-200 text-slate-500 hover:bg-slate-50 text-sm font-normal px-2 py-1 border-slate-300 border rounded"
					>
						{showFilters ? "Hide Filters" : "Show Filters"}
					</button>
					<button
						onClick={openUploadModal}
						className="relative font-normal text-slate-600 bg-cGreen-light hover:bg-cGreen-lightHover border border-slate-300 rounded text-sm py-1 px-3"
					>
						Upload
					</button>
				</div>
			</div>
			<div
				ref={filtersRef}
				className={`${showFilters ? "mb-3" : "overflow-hidden"} relative transition-[max-height] duration-200`}
			>
				<div className="w-full px-5">
					<div className="border border-slate-300 rounded-lg p-2 flex justify-between items-center">
						<div className="flex flex-wrap gap-2">
							{filters.map((filter, index) => (
								<div
									key={index}
									className="border border-slate-200 py-1.5 px-2 rounded flex items-center gap-1 shrink-0"
								>
									<span className="text-slate-600 font-semibold">{filter.type}: </span>
									{filter.type === "Date" && (
										<span>{`${filter.start.month}/${filter.start.day}/${filter.start.year} to ${filter.end.month}/${filter.end.day}/${filter.end.year}`}</span>
									)}
									{filter.type === "Merchant" && <span>{filter.merchant}</span>}
									{filter.type === "Category" && (
										<span
											className="text-slate-600 px-1.5 rounded"
											style={{ backgroundColor: filter.category.color }}
										>
											{filter.category.name}
										</span>
									)}
									{filter.type === "Configuration" && <span>{filter.configuration}</span>}
									{filter.type === "Amount" && (
										<span>
											{filter.condition === "lessThan" && "Less Than"}
											{filter.condition === "equals" && "Equals"}
											{filter.condition === "greaterThan" && "Greater Than"} {filter.amount}
										</span>
									)}
									<button
										onClick={async () => {
											const newFilters = [...filters];
											newFilters.splice(index, 1);
											setFilters(newFilters);
											setDashboardStats(await getDashboardStats(transactions, newFilters));
										}}
										className="hover:bg-slate-100 h-full"
									>
										<img className="w-3" src="./close.svg" />
									</button>
								</div>
							))}
						</div>
						<div className="shrink-0">
							<FilterButtons />
						</div>
					</div>
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
				<div className="font-semibold w-[18%] pr-4 flex justify-between items-center">
					<span>Configuration</span>
					<TableSorter
						column={"configurationName"}
						sortState={dashboardSortState}
						onSorterClick={onSorterClick}
					/>
				</div>
				<div className="font-semibold w-[12%] pr-4 flex justify-between items-center">
					<span>Amount</span>
					<TableSorter column={"amount"} sortState={dashboardSortState} onSorterClick={onSorterClick} />
				</div>
				<div className="font-semibold w-[4%] flex justify-between items-center"></div>
			</div>
			<div className="flex flex-col grow">
				<div className="grow">
					{!transactionsLoading &&
						localTransactions
							?.slice(page * pageSize, page * pageSize + pageSize)
							?.map((transaction, index) => (
								<div
									key={transaction.id}
									className={`${
										index <
										(pageSize - 1 < localTransactions.length - 1
											? pageSize - 1
											: localTransactions.length - 1)
											? "border-b"
											: ""
									} border-slate-200 flex items-center py-3 px-5 flex`}
								>
									<div className={`${transaction.ignored ? "opacity-30" : ""} w-[11%] pr-4`}>
										{transaction.date}
									</div>
									<div className={`${transaction.ignored ? "opacity-30" : ""} w-[37%] pr-4`}>
										{transaction.merchant}
									</div>
									<div className={`${transaction.ignored ? "opacity-30" : ""} w-[20%] pr-4 relative`}>
										<TransactionTableCategoryButton
											transaction={transaction}
											tableRef={tableRef}
											categories={categories}
											categoriesLoading={categoriesLoading}
											editTransactionCategory={editTransactionCategory}
											categoryUpdateLoading={categoryUpdateLoading}
										/>
									</div>
									<div className={`${transaction.ignored ? "opacity-30" : ""} w-[18%] pr-4`}>
										{transaction.configurationName}
									</div>
									<div
										className={`${
											transaction.amount.toFixed(2).includes("-") ? "text-cGreen-dark" : ""
										} ${transaction.ignored ? "opacity-30" : ""} w-[12%]`}
									>
										{transaction.amount.toFixed(2)}
									</div>
									<div className="w-[4%] flex justify-center">
										<TransactionMenu transactionId={transaction.id} ignored={transaction.ignored} />
									</div>
								</div>
							))}

					{transactionsLoading && (
						<div className="flex relative justify-center text-sm text-slate-300 items-center p-5 opacity-80">
							<ButtonSpinner />
						</div>
					)}
				</div>
				<Pagination
					page={page}
					setPage={setPage}
					pageLimit={Math.ceil(localTransactions?.length / pageSize) - 1}
				/>
			</div>
		</div>
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
	),
	setTransactions: PropTypes.func,
	transactionsLoading: PropTypes.bool,
	linkToTransactionsPage: PropTypes.bool,
};

export default TransactionTable;
