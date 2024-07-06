import PropTypes from "prop-types";

const NavItem = ({ text, onClick, active, activeIconSrc, inactiveIconSrc }) => {
	return (
		<button
			className={`${
				active ? "bg-cGreen-lightTrans" : "bg-white"
			} w-full flex items-center gap-3.5 py-3 px-4 rounded-lg`}
			onClick={onClick}
		>
			<img src={active ? activeIconSrc : inactiveIconSrc} className="w-7" />
			<label className={`${active ? "text-cGreen-dark font-semibold" : "text-slate-500"} text-sm`}>{text}</label>
		</button>
	);
};

NavItem.propTypes = {
	active: PropTypes.bool,
	text: PropTypes.string,
	onClick: PropTypes.func,
	activeIconSrc: PropTypes.string,
	inactiveIconSrc: PropTypes.string,
};

export default NavItem;
