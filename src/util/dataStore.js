import { create } from "zustand";
import { getTransactions, getConfigurations, getCategories, getBudgets } from "./supabaseQueries";
import { getDashboardStats } from "./statsUtil";
import { daysByMonth } from "../constants/Dates";
import supabase from "../config/supabaseClient";

const today = new Date();
const currentMonthDays = daysByMonth[today.getMonth() + 1];

const store = (set, get) => ({
	totalTransactionCount: -1,
	setTotalTransactionCount: (totalTransactionCount) => set(() => ({ totalTransactionCount })),
	fetchTotalTransactionCount: async () => {
		const { count } = await supabase.from("transactions").select("*", { count: "exact", head: true });
		set({ totalTransactionCount: count });
	},

	transactions: null,
	setTransactions: (transactions) => set(() => ({ transactions })),
	transactionsLoading: true,
	fetchTransactions: async () => {
		set({ transactionsLoading: true });
		const data = await getTransactions();
		set({ transactions: data, transactionsLoading: false });
	},

	filters: [
		{
			type: "Date",
			start: {
				month: today.getMonth() + 1,
				day: 1,
				year: today.getFullYear(),
			},
			end: {
				month: today.getMonth() + 1,
				day: currentMonthDays[currentMonthDays.length - 1],
				year: today.getFullYear(),
			},
		},
	],
	setFilters: (filters) => set(() => ({ filters })),

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

	budgets: null,
	setBudgets: (budgets) => set(() => ({ budgets })),
	budgetsMonth: today.getMonth() + 1,
	setBudgetsMonth: (month) => set(() => ({ budgetsMonth: month })),
	budgetsYear: today.getFullYear(),
	setBudgetsYear: (year) => set(() => ({ budgetsYear: year })),
	budgetsLoading: true,
	fetchBudgets: async () => {
		const { budgets, budgetsMonth, budgetsYear } = get();
		if (budgets === null) set({ budgetsLoading: true });
		const data = await getBudgets(new Date(`${budgetsYear}-${budgetsMonth}-01`));
		set({ budgets: data, budgetsLoading: false });
	},
});

export const useDataStore = create(store);
