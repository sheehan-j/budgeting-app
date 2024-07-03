const columns = [
	{
		index: 1,
		dataType: "date",
	},
	{
		index: 2,
		dataType: "amount",
	},
	{
		index: 3,
		dataType: "merchant",
	},
];

export const parseCSV = (event) => {
	const fileContent = event.target.result;
	const transactions = [];

	const rows = fileContent.split("\n");
	rows.forEach((row) => {
		row = row.replace(", ", ",");
		const cells = row.split(",");

		const newTransaction = {};
		cells.forEach((cell, index) => {
			const column = columns.find((column) => column.index === index + 1) || null;
			if (column) {
				if (column.dataType === "amount") {
					newTransaction.amount = parseFloat(cell);
				} else if (column.dataType === "date") {
					newTransaction.date = new Date(cell);
				} else if (column.dataType === "merchant") {
					newTransaction.merchant = cell;
				}
			}
		});
		transactions.push(newTransaction);
	});
};
