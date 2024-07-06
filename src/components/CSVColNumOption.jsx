import PropTypes from "prop-types";

const CSVColNumOption = ({ name, value, onChange }) => {
	return (
		<div className="flex flex-col">
			<div className="text-slate-500 mb-1">{name}</div>
			<input type="text" className="w-1/3" value={value} onChange={onChange} />
		</div>
	);
};

CSVColNumOption.propTypes = {
	name: PropTypes.string,
	value: PropTypes.string,
	onChange: PropTypes.func,
};

export default CSVColNumOption;
