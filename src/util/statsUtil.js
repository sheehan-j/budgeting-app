import { getCategories } from "./supabaseQueries";
import { filterTransactions } from "./filterUtil";

const specialCaseCategories = ["Income", "Credits/Payments"];

export const getDashboardStats = async (transactions, filters) => {
	const today = new Date();
	transactions = filterTransactions(transactions, filters);
	const categories = await getCategories();

	const specialCase = handleSpecialCaseCategoryFilter(transactions, filters);
	if (specialCase) return specialCase;

	const ignoredCategories = ["Income", "Credits/Payments"];

	const spendingAmount = transactions.reduce((acc, transaction) => {
		if (!ignoredCategories.includes(transaction.categoryName) && !transaction.ignored) acc += transaction.amount;
		return acc;
	}, 0);

	const categoricalSpending = getCategoricalSpending(transactions);
	ignoredCategories.forEach((category) => {
		delete categoricalSpending[category];
	});

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
		specialCaseCategory: false,
		filters: filters,
	};
};

export const handleSpecialCaseCategoryFilter = (transactions, filters) => {
	const categoryFilters = filters.filter((filter) => filter.type === "Category");
	if (categoryFilters.length === 1 && specialCaseCategories.includes(categoryFilters[0].category.name)) {
		const categoricalSpending = getCategoricalSpending(transactions);
		const categoryName = categoryFilters[0].category.name;

		const amount =
			categoryName === "Income" ? categoricalSpending["Income"] * -1 : categoricalSpending["Credits/Payments"];

		return {
			spending: {
				amount: amount,
			},
			topCategories: [
				{
					...categoryFilters[0].category,
					amount: amount,
					percentage: 100,
				},
			],
			specialCaseCategory: true,
			category: categoryFilters[0].category,
			filters: filters,
		};
	}

	return null;
};

export const getCategoricalSpending = (transactions) => {
	const categoricalSpending = {};
	transactions.forEach((transaction) => {
		if (transaction.ignored) return;

		if (categoricalSpending[transaction.categoryName]) {
			categoricalSpending[transaction.categoryName] += transaction.amount;
		} else {
			categoricalSpending[transaction.categoryName] = transaction.amount;
		}
	});
	return categoricalSpending;
};
