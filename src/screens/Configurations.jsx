import ConfigurationCreator from "../components/ConfigurationCreator";
import Navbar from "../components/Navbar";
import NotificationBanner from "../components/NotificationBanner";

const Configurations = () => {
	return (
		<div className="w-screen h-screen flex relative">
			<Navbar activePage={"Configurations"} />
			<div className="grow h-full overflow-y-scroll bg-slate-100 p-16 lg:p-28">
				<ConfigurationCreator />
			</div>
			<NotificationBanner />
		</div>
	);
};

export default Configurations;
