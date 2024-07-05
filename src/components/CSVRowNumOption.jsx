import PropTypes from "prop-types";

const CSVRowNumOption = ({ name, value, onChange }) => {
	return (
		<div className="flex justify-between w-full">
			<p>{name}</p>
			<input type="text" className="border text-end px-1 py-0.5" value={value} onChange={onChange} />
		</div>
	);
};

CSVRowNumOption.propTypes = {
	name: PropTypes.string,
	value: PropTypes.string,
	onChange: PropTypes.func,
};

export default CSVRowNumOption;
