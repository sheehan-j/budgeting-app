import { useDataStore } from "../util/dataStore";

const DashboardStats = () => {
	const { dashboardStats, dashboardStatsLoading } = useDataStore((state) => ({
		dashboardStats: state.dashboardStats,
		dashboardStatsLoading: state.dashboardStatsLoading,
	}));

	return (
		<div className="w-full flex gap-3">
			<div className="py-6 pl-6 pr-12 flex flex-col justify-end bg-white border border-slate-300 rounded-2xl">
				{!dashboardStatsLoading && dashboardStats && (
					<>
						<div className="text-sm text-slate-700 font-semibold">{dashboardStats?.spending?.title}</div>
						<div className="text-4xl font-bold text-cGreen-dark">{dashboardStats?.spending?.amount}</div>
					</>
				)}
				{dashboardStatsLoading && (
					<>
						<div className="w-24 bg-slate-200 animate-pulse rounded h-4 mb-2"></div>
						<div className="w-32 bg-cGreen-light animate-pulse rounded h-8"></div>
					</>
				)}
			</div>
			<div className="px-6 pb-6 pt-5 flex flex-col grow text-slate-700 justify-center bg-white border border-slate-300 rounded-2xl">
				{/* <div className="text-sm text-slate-700 font-medium">{dashboardStats?.spending?.title}</div>
				<div>
					<div className="bg-cGreen-lightTrans inline-block border border-cGreen p-1 text-4xl font-bold text-cGreen-dark">
						{dashboardStats?.spending?.amount}
					</div>
				</div> */}
				{dashboardStatsLoading && (
					<>
						<div className="bg-slate-200 animate-pulse w-32 rounded h-4 mb-2"></div>
						<div className="flex flex-col gap-2">
							<div className="flex flex-col gap-1">
								<div className="w-full flex justify-between items-center mb-1">
									<div className="bg-slate-200 animate-pulse w-28 rounded h-3"></div>
									<div className="bg-slate-200 animate-pulse w-12 rounded h-3"></div>
								</div>
								<div className="h-2 w-full bg-slate-200 animate-pulse rounded-3xl overflow-hidden">
									<div className="h-full"></div>
								</div>
							</div>
						</div>
					</>
				)}
				{!dashboardStatsLoading && (
					<>
						<div className="text-lg font-semibold mb-1">Top Categories</div>
						<div className="flex flex-col gap-2">
							{dashboardStats?.topCategories?.map((category) => (
								<div key={category.name} className="flex flex-col gap-1">
									<div className="w-full flex justify-between items-center">
										<div>
											{category.name} {`(${category.percentage.toFixed()}%)`}
										</div>
										<div className="font-semibold">{category.amount.toFixed(2)}</div>
									</div>
									<div
										className="h-2 w-full rounded-3xl overflow-hidden"
										style={{
											backgroundColor: category.color,
											borderWidth: "1px",
											borderColor: category.colorDark,
										}}
									>
										<div
											className="h-full"
											style={{
												backgroundColor: category.colorDark,
												width: `${category.percentage}%`,
											}}
										></div>
									</div>
								</div>
							))}
						</div>
					</>
				)}
			</div>
		</div>
	);
};

export default DashboardStats;
