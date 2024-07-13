export const parseCSV = (event, configuration, userId) => {
	const fileContent = event.target.result;
	const transactions = [];

	const rows = fileContent.split("\n");
	if (rows[rows.length - 1] === "") rows.pop();
	rows.forEach((row) => {
		row = row.replace(", ", ",");
		const cells = row.split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/);

		const newTransaction = { userId, configurationName: configuration.name, categoryName: "Uncategorized" };
		cells.forEach((cell, index) => {
			if (cell[0] == '"' && cell[cell.length - 1] == '"') cell = cell.substring(1, cell.length - 1);
			cell = cell.trim();

			if (index + 1 === configuration.amountColNum) {
				if (cell.includes("$")) cell = cell.replace("$", "");

				let coefficient;
				if (cell.includes("-")) {
					if (configuration.minusSymbolMeaning) {
						cell = cell.replace("-", "");
						if (configuration.minusSymbolMeaning === "charge") coefficient = 1.0;
						else if (configuration.minusSymbolMeaning === "credit") coefficient = -1.0;
						else throw Error("Internal error - minusSymbolMeaning is not valid. Please report this.");
					} else {
						throw Error(
							"Encountered unexpected minus symbol in amount column. Please check your configuration."
						);
					}
				} else if (cell.includes("+")) {
					if (configuration.plusSymbolMeaning) {
						cell = cell.replace("-", "");
						if (configuration.plusSymbolMeaning === "charge") coefficient = 1.0;
						else if (configuration.plusSymbolMeaning === "credit") coefficient = -1.0;
						else throw Error("Internal error - plusSymbolMeaning is not valid. Please report this.");
					} else {
						throw Error(
							"Encountered unexpected plus symbol in amount column. Please check your configuration."
						);
					}
				} else {
					if (configuration.noSymbolMeaning) {
						if (configuration.noSymbolMeaning === "charge") coefficient = 1.0;
						else if (configuration.noSymbolMeaning === "credit") coefficient = -1.0;
						else throw Error("Internal error - noSymbolMeaning is not valid. Please report this.");
					}
				}

				if (coefficient < 0) newTransaction.categoryName = "Credit/Income";
				newTransaction.amount = parseFloat(parseFloat(cell) * coefficient);
			} else if (index + 1 === configuration.dateColNum) {
				const date = new Date(cell);
				newTransaction.date = date.toLocaleDateString("en-US");
				newTransaction.month = date.getMonth() + 1;
				newTransaction.year = date.getFullYear();
				newTransaction.day = date.getDate();
			} else if (index + 1 === configuration.merchantColNum) {
				newTransaction.merchant = cell;
			}
		});
		transactions.push(newTransaction);
	});
	return transactions;
};
