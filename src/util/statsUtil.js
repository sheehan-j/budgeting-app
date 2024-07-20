import { getCategories, getTransactionsByMonth } from "./supabaseQueries";

export const getDashboardStats = async () => {
	const today = new Date();
	const transactions = await getTransactionsByMonth(today);
	const categories = await getCategories();

	// TODO: Add a check here to not add ignored transactions to the total

	const spendingAmount = transactions.reduce((acc, transaction) => {
		if (transaction.amount > 0) acc += transaction.amount;
		return acc;
	}, 0);

	const categoricalSpending = getCategoricalSpending(transactions);

	// Sort and pull the top three categories
	const sortedCategories = Object.entries(categoricalSpending).sort((a, b) => b[1] - a[1]);
	let topCategories = sortedCategories.slice(0, 3).map(([categoryName, amount]) => {
		const categoryData = categories.find((category) => category.name === categoryName);
		return {
			name: categoryName,
			amount,
			color: categoryData.color,
			colorDark: categoryData.colorDark,
			colorLight: categoryData.colorLight,
			percentage: (amount / spendingAmount) * 100,
		};
	});

	return {
		spending: {
			amount: spendingAmount.toFixed(2),
			title: `${today.toLocaleString("default", { month: "long" })} Spending`,
		},
		topCategories,
	};
};

export const getCategoricalSpending = (transactions) => {
	const categoricalSpending = {};
	transactions.forEach((transaction) => {
		if (transaction.amount < 0) return;

		if (categoricalSpending[transaction.categoryName]) {
			categoricalSpending[transaction.categoryName] += transaction.amount;
		} else {
			categoricalSpending[transaction.categoryName] = transaction.amount;
		}
	});
	return categoricalSpending;
};
