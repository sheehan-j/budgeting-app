import supabase from "../config/supabaseClient";

export const getTransactions = async () => {
	let { data, error } = await supabase.from("transactions").select("*");
	if (error) {
		alert("Error retrieving transactions:" + error.message);
		return [];
	}

	data = data.map((transaction) => {
		transaction.date = new Date(transaction.date).toLocaleDateString("en-US");
		transaction.amount = transaction.amount.toFixed(2);
		return transaction;
	});
	return data;
};

export const insertTransactions = async (transactions) => {
	console.log(transactions);
	const { error } = await supabase.from("transactions").insert(transactions);
	if (error) {
		alert(JSON.stringify(error));
	}
};
