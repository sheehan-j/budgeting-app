import supabase from "../config/supabaseClient";
import { getCategoricalSpending } from "./statsUtil";

export const getTransactions = async () => {
	let { data, error } = await supabase.from("transactions").select("*");
	if (error) {
		alert("Error retrieving transactions:" + error.message);
		return [];
	}

	return formatTransactions(data);
};

export const getTransactionsByMonth = async (dateObj) => {
	let { data, error } = await supabase
		.from("transactions")
		.select("*")
		.eq("month", dateObj.getMonth() + 1)
		.eq("year", dateObj.getFullYear());
	if (error) {
		alert("Could not fetch dashboard statistics");
		return [];
	}

	return formatTransactions(data);
};

const formatTransactions = (transactions) => {
	transactions = transactions.map((transaction) => {
		transaction.date = new Date(transaction.date).toLocaleDateString("en-US");
		// transaction.amount = transaction.amount.toFixed(2);
		return transaction;
	});

	transactions.sort((a, b) => {
		const dateA = new Date(a.date);
		const dateB = new Date(b.date);

		if (dateA > dateB) return -1;
		else if (dateA < dateB) return 1;
		return a.merchant.localeCompare(b.merchant);
	});

	return transactions;
};

export const insertTransactions = async (transactions) => {
	const { error } = await supabase.from("transactions").insert(transactions);
	if (error) throw error;
};

export const setTransactionIgnored = async (transactionId, ignored) => {
	const { error } = await supabase.from("transactions").update({ ignored }).eq("id", transactionId);
	if (error) {
		alert("Could not update transaction.");
		return false;
	}
	return true;
};

export const deleteTransaction = async (transactionId) => {
	const { error } = await supabase.from("transactions").delete().eq("id", transactionId);
	if (error) {
		alert("Could not delete transaction.");
		return false;
	}
	return true;
};

export const getConfigurations = async () => {
	let { data, error } = await supabase.from("configurations").select("*");
	if (error) {
		alert("Could not fetch configurations");
		return [];
	}

	data.sort((a, b) => a.name.localeCompare(b.name));
	return data;
};

export const getCategories = async () => {
	let { data, error } = await supabase.from("categories").select("*");
	if (error) {
		alert("Could not fetch categories");
		return [];
	}

	data.sort((a, b) => a.orderIndex - b.orderIndex);
	return data;
};

export const getBudgets = async (date) => {
	let { data, error } = await supabase.from("categories").select("*, budgets(*)");
	if (error) {
		alert("Could not fetch budgets");
		return [];
	}
	const transactions = await getTransactionsByMonth(date);
	const categoricalSpending = getCategoricalSpending(transactions);

	let totalLimit = 0;
	let totalSpending = 0;
	let budgets = data.map((budget) => {
		const newBudget = { ...budget };
		// Deconstruct the budget fields if one is returned
		newBudget.limit = newBudget.budgets.length > 0 ? newBudget.budgets[0].limit : null;
		newBudget.spending = categoricalSpending[newBudget.name] || 0;
		newBudget.percentage = newBudget.limit ? (newBudget.spending / newBudget.limit) * 100 : null;

		// Calculate the total limit and spending
		if (newBudget.limit) totalLimit += newBudget.limit;
		totalSpending += newBudget.spending;

		// Remove the budgets fields after deconstructing
		delete newBudget.budgets;
		return newBudget;
	});

	// Sort the budgets by the orderIndex that is returned as part of the category table
	budgets.sort((a, b) => a.orderIndex - b.orderIndex);

	// Add the "total" to the list
	const totalBudget = {
		name: "Total",
		limit: totalLimit > 0 ? totalLimit : null,
		spending: totalSpending,
		percentage: totalLimit > 0 ? (totalSpending / totalLimit) * 100 : null,
		// color: "rgb(241 245 249)",
		color: "white",
		colorDark: "rgb(226 232 240)",
		colorLight: "rgb(248 250 252)",
	};
	budgets = [totalBudget, ...budgets];

	return budgets;
};

export const updateBudget = async (newBudgets, userId) => {
	const updates = [];
	const deletes = [];

	newBudgets.forEach((budget) => {
		if (budget.name === "Total") return;

		if (budget.limit) {
			updates.push({ categoryName: budget.name, limit: budget.limit, userId });
		} else {
			deletes.push(budget.name);
		}
	});

	if (updates.length > 0) {
		const { error } = await supabase.from("budgets").upsert(updates);
		if (error) {
			alert("Could not update budgets");
			return;
		}
	}

	if (deletes.length > 0) {
		const { error } = await supabase.from("budgets").delete().in("categoryName", deletes).eq("userId", userId);
		if (error) {
			alert("Could not update budgets");
			return;
		}
	}
};
