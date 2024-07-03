import supabase from "../config/supabaseClient";

export const getTransactions = async () => {
	try {
		const { data, error } = await supabase.from("transactions").select("*");
		if (error) throw error;
		return data;
	} catch (error) {
		alert("Error retrieving transactions:", error);
	}
};

export const insertTransactions = async (transactions) => {
	try {
		const { data, error } = await supabase.from("transactions").insert(transactions);
		if (error) throw error;
		console.log("Transaction inserted successfully:", data);
	} catch (error) {
		alert("Error inserting transaction:", error);
	}
};
