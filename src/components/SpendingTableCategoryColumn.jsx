import { ignoredCategories } from "../constants/Categories";
import PropTypes from "prop-types";

const SpendingTableCategoryColumn = ({ categories, isFirstColumn }) => {
	return (
		<div className="min-w-56 h-full flex flex-col justify-between">
			<div
				className="flex justify-start items-center grow px-2 min-h-11 bg-gray-50 dark:bg-neutral-500"
				style={{
					borderTopLeftRadius: isFirstColumn ? "0.5rem" : "",
					borderTopRightRadius: !isFirstColumn ? "0.5rem" : "",
				}}
			>
				<div className="inline-block py-1 px-2 rounded-md font-semibold dark:text-white">Category</div>
			</div>
			{categories
				.filter((category) => !ignoredCategories.includes(category.name))
				.map((category) => (
					<>
						<div className="h-[1px] bg-slate-300 dark:bg-neutral-500"></div>
						<div className={`flex justify-start items-center grow px-2 min-h-11 py-1`} key={category.name}>
							<div
								className="inline-block py-1 px-2 rounded-md font-normal"
								style={{
									backgroundColor: category.color,
									outline: `1px solid ${category.colorDark}`,
								}}
							>
								{category.name}
							</div>
						</div>
					</>
				))}
			<div
				className="flex justify-start items-center grow px-2 py-1 mb-5 min-h-11 bg-gray-50 dark:bg-neutral-500"
				style={{
					borderBottomLeftRadius: isFirstColumn ? "0.5rem" : "",
					borderBottomRightRadius: !isFirstColumn ? "0.5rem" : "",
				}}
			>
				<div className="inline-block py-1 px-2 rounded-md font-bold dark:text-white">Total</div>
			</div>

			{categories
				.filter((category) => ignoredCategories.includes(category.name))
				.map((category, index) => (
					<>
						{index !== 0 && <div className="h-[1px] bg-slate-300 dark:bg-neutral-500"></div>}
						<div className="flex justify-start items-center grow px-2 py-0.5 min-h-11" key={category.name}>
							<div
								className="inline-block py-0.5 px-2 rounded-md font-normal"
								style={{
									backgroundColor: category.color,
									outline: `1px solid ${category.colorDark}`,
								}}
							>
								{category.name}
							</div>
						</div>
					</>
				))}
		</div>
	);
};

SpendingTableCategoryColumn.propTypes = {
	categories: PropTypes.array,
	isFirstColumn: PropTypes.bool,
};

export default SpendingTableCategoryColumn;
