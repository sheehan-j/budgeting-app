import { useEffect, useState } from "react";
import supabase from "../config/supabaseClient";
import CSVRowNumOption from "./CSVRowNumOption";
import CSVSymbolOption from "./CSVSymbolOption";

const ConfigurationCreator = () => {
	const [configurations, setConfigurations] = useState([]);
	const [activeConfiguration, setActiveConfiguration] = useState(null);
	const [newConfigurationName, setNewConfigurationName] = useState("");

	const loadData = async () => {
		let { data, error } = await supabase.from("configurations").select("*");
		if (error) {
			alert("Could not fetch configurations");
			return;
		}
		data.sort((a, b) => a.name.localeCompare(b.name));
		setConfigurations(data);
	};

	useEffect(() => {
		loadData();
	}, []);

	const handleClickConfiguration = (configurationName) => {
		setActiveConfiguration(configurations.find((configuration) => configuration.name === configurationName));
		setNewConfigurationName("");
	};

	const handleCreateConfiguration = async () => {
		if (configurations.some((configuration) => configuration.name === newConfigurationName)) {
			alert("Configuration name already exists.");
			return;
		}

		const newConfiguration = {
			name: newConfigurationName,
			minusSymbolMeaning: null,
			plusSymbolMeaning: null,
			noSymbolMeaning: null,
			dateRowNum: null,
			amountRowNum: null,
			merchantRowNum: null,
		};

		setNewConfigurationName("");
		setActiveConfiguration(newConfiguration);
	};

	const handleDeleteConfiguration = async (configurationName) => {
		const { error } = await supabase.from("configurations").delete().eq("name", configurationName);
		if (error) {
			alert("Could not delete configuration.");
			return;
		}

		await loadData();

		if (activeConfiguration.name === configurationName) setActiveConfiguration({});
	};

	const handleSaveConfiguration = async () => {
		// TODO: Add error handling here to check that a minimum of two checkboxes are selected/there aren't two selections for charge or credit
		const { error } = await supabase.from("configurations").upsert(activeConfiguration);
		if (error) {
			alert("Could not save configuration.");
			return;
		}

		setNewConfigurationName("");
		await loadData();
	};

	return (
		<section className="flex gap-2">
			<section className="flex flex-col gap-2">
				{configurations?.map((configuration) => (
					<div className="flex" key={configuration.name}>
						<button
							className="border grow p-1"
							onClick={() => {
								handleClickConfiguration(configuration.name);
							}}
						>
							{configuration.name}
						</button>
						<button className="bg-red-100" onClick={() => handleDeleteConfiguration(configuration.name)}>
							X
						</button>
					</div>
				))}
				<div className="border p-2 flex flex-col">
					<input
						className="border p-1 text-sm"
						type="text"
						placeholder="Configuration Name"
						value={newConfigurationName}
						onChange={(e) => setNewConfigurationName(e.target.value)}
					/>
					<button className="bg-green-100" onClick={handleCreateConfiguration}>
						Create
					</button>
				</div>
			</section>
			<section className="border p-2">
				{activeConfiguration && (
					<>
						<input
							className="border p-1 text-sm"
							type="text"
							value={activeConfiguration?.name || ""}
							onChange={(e) => setActiveConfiguration({ ...activeConfiguration, name: e.target.value })}
						/>
						<div id="configOptionsContainer" className="flex flex-col gap-3">
							<CSVRowNumOption
								name={"Date"}
								value={activeConfiguration?.dateRowNum?.toString() || ""}
								onChange={(e) => {
									setActiveConfiguration({
										...activeConfiguration,
										dateRowNum: e.target.value !== "" ? e.target.value : null,
									});
								}}
							/>

							<CSVRowNumOption
								name={"Amount"}
								value={activeConfiguration?.amountRowNum?.toString() || ""}
								onChange={(e) => {
									setActiveConfiguration({
										...activeConfiguration,
										amountRowNum: e.target.value !== "" ? e.target.value : null,
									});
								}}
							/>

							<CSVRowNumOption
								name={"Merchant"}
								value={activeConfiguration?.merchantRowNum?.toString() || ""}
								onChange={(e) => {
									setActiveConfiguration({
										...activeConfiguration,
										merchantRowNum: e.target.value !== "" ? e.target.value : null,
									});
								}}
							/>

							<CSVSymbolOption
								symbolMeaning={activeConfiguration?.minusSymbolMeaning}
								firstQuestion={"Does your CSV have minus (-) symbols?"}
								firstOnChange={(e) => {
									setActiveConfiguration({
										...activeConfiguration,
										minusSymbolMeaning: e.target.checked ? "charge" : null,
									});
								}}
								secondQuestion={"What does the minus symbol signify?"}
								secondOnChange={(e) =>
									setActiveConfiguration({
										...activeConfiguration,
										minusSymbolMeaning: e.target.value,
									})
								}
							/>

							<CSVSymbolOption
								symbolMeaning={activeConfiguration?.plusSymbolMeaning}
								firstQuestion={"Does your CSV have plus (+) symbols?"}
								firstOnChange={(e) => {
									setActiveConfiguration({
										...activeConfiguration,
										plusSymbolMeaning: e.target.checked ? "credit" : null,
									});
								}}
								secondQuestion={"What does the plus symbol signify?"}
								secondOnChange={(e) =>
									setActiveConfiguration({
										...activeConfiguration,
										plusSymbolMeaning: e.target.value,
									})
								}
							/>

							<CSVSymbolOption
								symbolMeaning={activeConfiguration?.noSymbolMeaning}
								firstQuestion={"Does your CSV have transactions without symbols?"}
								firstOnChange={(e) => {
									setActiveConfiguration({
										...activeConfiguration,
										noSymbolMeaning: e.target.checked ? "credit" : null,
									});
								}}
								secondQuestion={"What does these transactions signify?"}
								secondOnChange={(e) =>
									setActiveConfiguration({
										...activeConfiguration,
										noSymbolMeaning: e.target.value,
									})
								}
							/>
						</div>

						<div>
							<button className="bg-blue-100" onClick={handleSaveConfiguration}>
								Save
							</button>
						</div>
					</>
				)}
			</section>
		</section>
	);
};

export default ConfigurationCreator;
