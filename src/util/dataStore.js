import { create } from "zustand";
import { getTransactions, getConfigurations, getCategories, getBudgets, getTransactionCount } from "./supabaseQueries";
import { getDashboardStats } from "./statsUtil";
import { defaultFilter } from "../constants/Filters";
import { getMerchantSettings } from "./supabaseQueries";

const today = new Date();

const store = (set, get) => ({
	totalTransactionCount: -1,
	setTotalTransactionCount: (totalTransactionCount) => set(() => ({ totalTransactionCount })),
	fetchTotalTransactionCount: async () => {
		const count = await getTransactionCount();
		set({ totalTransactionCount: count });
	},

	transactions: null,
	setTransactions: (transactions) => set(() => ({ transactions })),
	transactionsLoading: false,
	fetchTransactions: async () => {
		const { dashboardStats, fetchDashboardStats } = get();
		set({ transactionsLoading: true });
		const data = await getTransactions();
		set({ transactions: data, transactionsLoading: false });
		if (dashboardStats === null) fetchDashboardStats();
	},

	filters: [{ ...defaultFilter }],
	setFilters: (filters) => {
		set(() => ({ filters }));
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
		const { transactions, filters } = get();
		if (transactions === null || filters === null) return;
		set({ dashboardStatsLoading: true });
		const data = await getDashboardStats(transactions, filters);
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

	activeSetting: null,
	setActiveSetting: (setting) => set(() => ({ activeSetting: setting })),

	merchantSettings: null,
	setMerchantSettings: (merchantSettings) => set(() => ({ merchantSettings })),
	merchantSettingsLoading: true,
	editingMerchantSetting: null,
	setEditingMerchantSetting: (merchantSetting) => set(() => ({ editingMerchantSetting: merchantSetting })),
	fetchMerchantSettings: async () => {
		set({ merchantSettingsLoading: true });
		const data = await getMerchantSettings();
		set({ merchantSettings: data, merchantSettingsLoading: false });
	},
});

export const useDataStore = create(store);
