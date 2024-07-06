import PropTypes from "prop-types";
import NavItem from "./NavItem";

const Navbar = ({ activePage, setActivePage }) => {
	return (
		<nav className="h-full px-6 py-10 w-3/12 lg:w-2/12 bg-white flex flex-col gap-5">
			<div className="font-extrabold text-cGreen-dark text-4xl px-3">LOGO</div>
			<NavItem
				text={"Dashboard"}
				onClick={() => setActivePage("Dashboard")}
				active={activePage === "Dashboard"}
				activeIconSrc={"./dashboard_green.svg"}
				inactiveIconSrc={"./dashboard_slate.svg"}
			/>
			<NavItem
				text={"Transactions"}
				onClick={() => setActivePage("Transactions")}
				active={activePage === "Transactions"}
				activeIconSrc={"./transactions_green.svg"}
				inactiveIconSrc={"./transactions_slate.svg"}
			/>
			<NavItem
				text={"Settings"}
				onClick={() => setActivePage("Settings")}
				active={activePage === "Settings"}
				activeIconSrc={"./settings_green.svg"}
				inactiveIconSrc={"./settings_slate.svg"}
			/>
		</nav>
	);
};

Navbar.propTypes = {
	activePage: PropTypes.string,
	setActivePage: PropTypes.func,
};

export default Navbar;
