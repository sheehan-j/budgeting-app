export const daysTo30 = Array.from({ length: 30 }, (_, index) => index + 1);
export const daysTo31 = Array.from({ length: 31 }, (_, index) => index + 1);
export const daysTo28 = Array.from({ length: 28 }, (_, index) => index + 1);
export const daysByMonth = {
	1: daysTo31,
	2: daysTo28,
	3: daysTo31,
	4: daysTo30,
	5: daysTo31,
	6: daysTo30,
	7: daysTo31,
	8: daysTo31,
	9: daysTo30,
	10: daysTo31,
	11: daysTo30,
	12: daysTo31,
};
