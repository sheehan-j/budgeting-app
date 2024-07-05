import PropTypes from "prop-types";

const CSVSymbolOption = ({ symbolMeaning, firstQuestion, firstOnChange, secondQuestion, secondOnChange }) => {
	return (
		<div>
			<div>
				<label>{firstQuestion}</label>
				<input type="checkbox" checked={symbolMeaning !== null} onChange={firstOnChange} />
			</div>
			{symbolMeaning && (
				<div>
					<label>{secondQuestion}</label>
					<select value={symbolMeaning} onChange={secondOnChange}>
						<option value="charge">Charge</option>
						<option value="credit">Credit</option>
					</select>
				</div>
			)}
		</div>
	);
};

CSVSymbolOption.propTypes = {
	symbolMeaning: PropTypes.string,
	firstQuestion: PropTypes.string,
	firstOnChange: PropTypes.func,
	secondQuestion: PropTypes.string,
	secondOnChange: PropTypes.func,
};

export default CSVSymbolOption;
