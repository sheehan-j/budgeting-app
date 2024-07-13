import ButtonSpinner from "./ButtonSpinner";
import PropTypes from "prop-types";

const TransactionTableCategoryButton = ({
	transaction,
	visibleCategoryMenu,
	animatingCategoryMenu,
	categories,
	categoriesLoading,
	menuDirectionDown,
	openCategoryMenu,
	editTransactionCategory,
	categoryUpdateLoading,
}) => {
	return (
		<>
			<button
				ref={(ref) => {
					transaction.buttonRef = ref;
				}}
				onClick={() => {
					openCategoryMenu(transaction.id, transaction.buttonRef);
				}}
				className="category-button inline-block bg-red-100 px-1.5 py-0.5 border border-red-200 rounded"
				// Apply color styles set inside the DB
				style={{
					backgroundColor: categories?.find((category) => category.name === transaction.categoryName).color,
					borderWidth: "1px",
					borderColor: categories?.find((category) => category.name === transaction.categoryName).colorDark,
				}}
			>
				{transaction.categoryName}
			</button>
			{/** Checks if this menu is either currently visible or being animated to be visible/invisible */}
			{(visibleCategoryMenu === transaction.id || animatingCategoryMenu === transaction.id) && (
				<div
					className={`${
						animatingCategoryMenu === transaction.id // First checks if this menu is being animated
							? visibleCategoryMenu === transaction.id // If it is, then check if it should become visible or invisible
								? "enter"
								: "exit"
							: ""
					} ${
						// Check if the menu should be below or above the button, based on available space
						menuDirectionDown ? "category-menu-down top-[130%]" : "category-menu-up bottom-[130%]"
					} absolute bg-white border border-slate-300 rounded-lg z-10 px-2 py-1.5`}
				>
					<div className="font-semibold text-slate-600 mb-1">Edit Category</div>
					{/** Map each category to be displayed in the dropdown menu */}
					<div className={`${categoryUpdateLoading ? "opacity-0" : ""} flex flex-col gap-1 relative`}>
						{!categoriesLoading &&
							categories.map((category) => (
								<button
									key={category.name}
									className="category-button text-sm text-slate-600 px-3 py-0.5 rounded"
									style={{
										backgroundColor: category.color,
										borderWidth: "1px",
										borderColor: category.colorDark,
									}}
									onClick={
										!categoryUpdateLoading
											? () => editTransactionCategory(transaction, category.name)
											: () => {}
									}
								>
									{category.name}
								</button>
							))}
					</div>
					{categoryUpdateLoading && <ButtonSpinner />}
				</div>
			)}
		</>
	);
};

TransactionTableCategoryButton.propTypes = {
	transaction: PropTypes.object,
	visibleCategoryMenu: PropTypes.number,
	animatingCategoryMenu: PropTypes.number,
	categories: PropTypes.array,
	categoriesLoading: PropTypes.bool,
	menuDirectionDown: PropTypes.bool,
	openCategoryMenu: PropTypes.func,
	editTransactionCategory: PropTypes.func,
	categoryUpdateLoading: PropTypes.bool,
};

export default TransactionTableCategoryButton;
