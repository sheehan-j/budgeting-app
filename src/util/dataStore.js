import { create } from "zustand";
import { getDashboardTransactions, getConfigurations, getCategories, getDashboardStats } from "./supabaseQueries";
import supabase from "../config/supabaseClient";

const store = (set, get) => ({
	totalTransactionCount: -1,
	setTotalTransactionCount: (totalTransactionCount) => set(() => ({ totalTransactionCount })),
	fetchTotalTransactionCount: async () => {
		const { count } = await supabase.from("transactions").select("*", { count: "exact", head: true });
		set({ totalTransactionCount: count });
	},

	dashboardTransactions: null,
	setDashboardTransactions: (dashboardTransactions) => set(() => ({ dashboardTransactions })),
	dashboardTransactionsLoading: true,
	fetchDashboardTransactions: async () => {
		set({ dashboardTransactionsLoading: true });
		const data = await getDashboardTransactions();
		set({ dashboardTransactions: data, dashboardTransactionsLoading: false });
	},

	configurations: null,
	setConfigurations: (configurations) => set(() => ({ configurations })),
	configurationsLoading: true,
	fetchConfigurations: async () => {
		set({ configurationsLoading: true });
		const data = await getConfigurations();
		set({ configurations: data, configurationsLoading: false });
	},

	categories: null,
	setCategories: (categories) => set(() => ({ categories })),
	categoriesLoading: true,
	fetchCategories: async () => {
		set({ categoriesLoading: true });
		const data = await getCategories();
		set({ categories: data, categoriesLoading: false });
	},

	notification: null,
	setNotification: (notification) => set(() => ({ notification })),

	session: null,
	setSession: (session) => set(() => ({ session })),

	dashboardStats: null,
	setDashboardStats: (dashboardStats) => set(() => ({ dashboardStats })),
	dashboardStatsLoading: true,
	fetchDashboardStats: async () => {
		const { dashboardStats } = get();
		if (dashboardStats === null) set({ dashboardStatsLoading: true });
		const data = await getDashboardStats();
		set({ dashboardStats: data, dashboardStatsLoading: false });
	},
	dashboardSortState: null,
	setDashboardSortState: (state) => set(() => ({ dashboardSortState: state })),
});

export const useDataStore = create(store);
