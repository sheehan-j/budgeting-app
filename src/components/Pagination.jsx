import PropTypes from "prop-types";

const Pagination = ({ page, setPage, pageLimit }) => {
	const decrementPage = () => {
		if (page > 0) {
			setPage(page - 1);
		}
	};

	const incrementPage = () => {
		if (page < pageLimit) {
			setPage(page + 1);
		}
	};

	return (
		<div className="border-t border-slate-200 px-5 py-2 flex justify-end items-center gap-3">
			<button
				onClick={decrementPage}
				className={`${page === 0 ? "opacity-50 cursor-default" : "hover:bg-gray-100"} rounded w-5 p-1`}
			>
				<img className="w-full" src="/back.svg" />
			</button>
			<div className="text-base py-0.5 px-1.5 border border-slate-200 rounded">{page + 1}</div>
			<button
				onClick={incrementPage}
				className={`${page === pageLimit ? "opacity-50 cursor-default" : "hover:bg-gray-100"} rounded w-5 p-1`}
			>
				<img className="w-full" src="/forward.svg" />
			</button>
		</div>
	);
};

Pagination.propTypes = {
	page: PropTypes.number,
	setPage: PropTypes.func,
	pageLimit: PropTypes.number,
};

export default Pagination;
