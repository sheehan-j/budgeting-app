import PropTypes from "prop-types";
import { daysByMonth } from "../../constants/Dates";
import { useDataStore } from "../../util/dataStore";

const DateFilterMenu = ({ selectedFilterOptions, setSelectedFilterOptions }) => {
	const { filters, setFilters } = useDataStore((state) => ({ filters: state.filters, setFilters: state.setFilters }));

	return (
		<div className="add-filter-option flex flex-col justify-between grow px-2.5 pb-2">
			<div className="add-filter-option">
				<div className="add-filter-option text-xs font-medium">Start</div>
				<div className="flex gap-1">
					<select
						value={selectedFilterOptions.start.month}
						onChange={(e) =>
							setSelectedFilterOptions({
								...selectedFilterOptions,
								start: { ...selectedFilterOptions.start, month: e.target.value },
							})
						}
						className="add-filter-option flex-[1_0_0] w-full text-xs border border-slate-200 rounded p-0.5 outline-none"
					>
						{Array.from({ length: 12 }, (_, index) => (
							<option key={index + 1} value={index + 1}>
								{index + 1}
							</option>
						))}
					</select>
					<select
						value={selectedFilterOptions.start.day}
						onChange={(e) =>
							setSelectedFilterOptions({
								...selectedFilterOptions,
								start: { ...selectedFilterOptions.start, day: e.target.value },
							})
						}
						className="add-filter-option flex-[1_0_0] w-full text-xs border border-slate-200 rounded p-0.5 outline-none"
					>
						{daysByMonth[selectedFilterOptions.start.month].map((day) => (
							<option key={day} value={day}>
								{day}
							</option>
						))}
					</select>
					<select
						value={selectedFilterOptions.start.year}
						onChange={(e) =>
							setSelectedFilterOptions({
								...selectedFilterOptions,
								start: { ...selectedFilterOptions.start, year: e.target.value },
							})
						}
						className="add-filter-option flex-[2_0_0] w-full text-xs border border-slate-200 rounded p-0.5 outline-none"
					>
						{Array.from({ length: new Date().getFullYear() - 2010 + 1 }, (_, index) => (
							<option key={new Date().getFullYear() - index} value={new Date().getFullYear() - index}>
								{new Date().getFullYear() - index}
							</option>
						))}
					</select>
				</div>
			</div>
			<div className="add-filter-option">
				<div className="add-filter-option text-xs font-medium">End</div>
				<div className="flex gap-1">
					<select
						value={selectedFilterOptions.end.month}
						onChange={(e) =>
							setSelectedFilterOptions({
								...selectedFilterOptions,
								end: { ...selectedFilterOptions.end, month: e.target.value },
							})
						}
						className="add-filter-option flex-[1_0_0] w-full text-xs border border-slate-200 rounded p-0.5 outline-none"
					>
						{Array.from({ length: 12 }, (_, index) => (
							<option key={index + 1} value={index + 1}>
								{index + 1}
							</option>
						))}
					</select>
					<select
						value={selectedFilterOptions.end.day}
						onChange={(e) =>
							setSelectedFilterOptions({
								...selectedFilterOptions,
								end: { ...selectedFilterOptions.end, day: e.target.value },
							})
						}
						className="add-filter-option flex-[1_0_0] w-full text-xs border border-slate-200 rounded p-0.5 outline-none"
					>
						{daysByMonth[selectedFilterOptions.end.month].map((day) => (
							<option key={day} value={day}>
								{day}
							</option>
						))}
					</select>
					<select
						value={selectedFilterOptions.end.year}
						onChange={(e) =>
							setSelectedFilterOptions({
								...selectedFilterOptions,
								end: { ...selectedFilterOptions.end, year: e.target.value },
							})
						}
						className="add-filter-option flex-[2_0_0] w-full text-xs border border-slate-200 rounded p-0.5 outline-none"
					>
						{Array.from({ length: new Date().getFullYear() - 2010 + 1 }, (_, index) => (
							<option key={new Date().getFullYear() - index} value={new Date().getFullYear() - index}>
								{new Date().getFullYear() - index}
							</option>
						))}
					</select>
				</div>
			</div>
			<button
				onClick={() => {
					const tempSelectedFilterOptions = { ...selectedFilterOptions };
					setSelectedFilterOptions(null);

					if (
						filters.some(
							(filter) =>
								filter?.type === "Date" &&
								filter?.start?.month === tempSelectedFilterOptions.start.month &&
								filter?.start?.day === tempSelectedFilterOptions.start.day &&
								filter?.start?.year === tempSelectedFilterOptions.start.year &&
								filter?.end?.month === tempSelectedFilterOptions.end.month &&
								filter?.end?.day === tempSelectedFilterOptions.end.day &&
								filter?.end?.year === tempSelectedFilterOptions.end.year
						)
					) {
						return;
					}
					setFilters([...filters, tempSelectedFilterOptions]);
				}}
				className="add-filter-option text-xs hover:bg-slate-50 border border-slate-200 rounded w-full py-0.5"
			>
				Add
			</button>
		</div>
	);
};

DateFilterMenu.propTypes = {
	selectedFilterOptions: PropTypes.object,
	setSelectedFilterOptions: PropTypes.func,
};

export default DateFilterMenu;