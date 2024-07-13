import supabase from "../config/supabaseClient";

export const getDashboardTransactions = async () => {
	const today = new Date();
	let { data, error } = await supabase
		.from("transactions")
		.select("*")
		.eq("month", today.getMonth() + 1);
	if (error) {
		alert("Error retrieving transactions:" + error.message);
		return [];
	}

	data = data.map((transaction) => {
		transaction.date = new Date(transaction.date).toLocaleDateString("en-US");
		transaction.amount = transaction.amount.toFixed(2);
		return transaction;
	});

	data.sort((a, b) => {
		const dateA = new Date(a.date);
		const dateB = new Date(b.date);

		if (dateA > dateB) return -1;
		else if (dateA < dateB) return 1;
		return a.merchant.localeCompare(b.merchant);
	});

	return data.slice(0, 30);
};

export const insertTransactions = async (transactions) => {
	const { error } = await supabase.from("transactions").insert(transactions);
	if (error) throw error;
};

export const getConfigurations = async () => {
	let { data, error } = await supabase.from("configurations").select("*");
	if (error) {
		alert("Could not fetch configurations");
		return;
	}

	data.sort((a, b) => a.name.localeCompare(b.name));
	return data;
};

export const getCategories = async () => {
	let { data, error } = await supabase.from("categories").select("*");
	if (error) {
		alert("Could not fetch categories");
		return;
	}

	data.sort((a, b) => a.orderIndex - b.orderIndex);
	return data;
};

export const getDashboardStats = async () => {
	const today = new Date();
	let { data, error } = await supabase
		.from("transactions")
		.select("*")
		.eq("month", today.getMonth() + 1);
	if (error) {
		alert("Could not fetch dashboard statistics");
		return;
	}

	const categories = await getCategories();

	// TODO: Add a check here to not add ignored transactions to the total

	const spendingAmount = data.reduce((acc, transaction) => {
		if (transaction.amount > 0) acc += transaction.amount;
		return acc;
	}, 0);

	const categoricalSpending = {};
	data.forEach((transaction) => {
		if (transaction.amount < 0) return;

		if (categoricalSpending[transaction.categoryName]) {
			categoricalSpending[transaction.categoryName] += transaction.amount;
		} else {
			categoricalSpending[transaction.categoryName] = transaction.amount;
		}
	});

	const sortedCategories = Object.entries(categoricalSpending).sort((a, b) => b[1] - a[1]);
	let topCategories = sortedCategories.slice(0, 3).map(([categoryName, amount]) => {
		const categoryData = categories.find((category) => category.name === categoryName);
		return {
			name: categoryName,
			amount,
			color: categoryData.color,
			colorDark: categoryData.colorDark,
			percentage: (amount / spendingAmount) * 100,
		};
	});

	if (topCategories.length === 0) {
		const uncategorizedCategory = categories.find((category) => category.name === "Uncategorized");
		topCategories = [
			{
				name: "None",
				amount: 0,
				color: uncategorizedCategory.color,
				colorDark: uncategorizedCategory.colorDark,
				percentage: 0,
			},
		];
	}

	return {
		spending: {
			amount: spendingAmount.toFixed(2),
			title: `${today.toLocaleString("default", { month: "long" })} Spending`,
		},
		topCategories,
	};
};
