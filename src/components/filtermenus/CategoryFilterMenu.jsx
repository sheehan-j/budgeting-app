import PropTypes from "prop-types";
import { useDataStore } from "../../util/dataStore";

const CategoryFilterMenu = ({ setSelectedFilterOptions }) => {
	const { filters, setFilters, categories } = useDataStore((state) => ({
		filters: state.filters,
		setFilters: state.setFilters,
		categories: state.categories,
	}));

	return (
		<div className="flex flex-col gap-1 px-2 pb-1.5">
			{categories.map((category) => (
				<button
					key={category.name}
					className="add-filter-option w-full text-xs text-slate-600 px-1 py-0.5 rounded"
					style={{
						backgroundColor: category.color,
						borderWidth: "1px",
						borderColor: category.colorDark,
					}}
					onClick={() => {
						setSelectedFilterOptions(null);
						if (
							filters.some(
								(filter) => filter?.type === "Category" && filter?.category.name === category.name
							)
						) {
							return;
						}
						setFilters([...filters, { type: "Category", category: category }]);
					}}
				>
					{category.name}
				</button>
			))}
		</div>
	);
};

CategoryFilterMenu.propTypes = {
	selectedFilterOptions: PropTypes.object,
	setSelectedFilterOptions: PropTypes.func,
};

export default CategoryFilterMenu;