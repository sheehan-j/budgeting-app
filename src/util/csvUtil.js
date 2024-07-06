export const parseCSV = (event, configuration) => {
	const fileContent = event.target.result;
	const transactions = [];

	const rows = fileContent.split("\n");
	if (rows[rows.length - 1] === "") rows.pop();
	rows.forEach((row) => {
		row = row.replace(", ", ",");
		const cells = row.split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/);

		const newTransaction = {};
		cells.forEach((cell, index) => {
			if (cell[0] == '"' && cell[cell.length - 1] == '"') {
				if (cell.includes("ITEM")) console.log(cell);
				cell = cell.substring(1, cell.length - 1);
			}
			cell = cell.trim();

			if (index + 1 === configuration.amountRowNum) {
				try {
					if (cell.includes("$")) cell = cell.replace("$", "");

					let coefficient;
					if (cell.includes("-")) {
						if (configuration.minusSymbolMeaning) {
							cell = cell.replace("-", "");
							if (configuration.minusSymbolMeaning === "charge") coefficient = 1.0;
							else if (configuration.minusSymbolMeaning === "credit") coefficient = -1.0;
							else throw Error("Internal error: minusSymbolMeaning is not valid.");
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
							else throw Error("Internal error: plusSymbolMeaning is not valid.");
						} else {
							throw Error(
								"Encountered unexpected plus symbol in amount column. Please check your configuration."
							);
						}
					} else {
						if (configuration.noSymbolMeaning) {
							if (configuration.noSymbolMeaning === "charge") coefficient = 1.0;
							else if (configuration.noSymbolMeaning === "credit") coefficient = -1.0;
							else throw Error("Internal error: noSymbolMeaning is not valid.");
						}
					}

					newTransaction.amount = parseFloat(parseFloat(cell) * coefficient);
				} catch (error) {
					alert(error.message);
					return [];
				}
			} else if (index + 1 === configuration.dateRowNum) {
				newTransaction.date = new Date(cell);
			} else if (index + 1 === configuration.merchantRowNum) {
				newTransaction.merchant = cell;
			}
		});
		transactions.push(newTransaction);
	});

	return transactions;
};
