import { create } from "zustand";
import { openMenu, closeMenu, openCategoryMenu, closeCategoryMenu } from "./animationUtil";

const store = (set, get) => ({
	filterMenuVisible: false,
	filterMenuAnimating: false,
	setFilterMenuVisible: (value) => set({ filterMenuVisible: value }),
	setFilterMenuAnimating: (value) => set({ filterMenuAnimating: value }),
	openFilterMenu: () => {
		const { setFilterMenuVisible, setFilterMenuAnimating } = get();
		openMenu(setFilterMenuVisible, setFilterMenuAnimating);
	},
	closeFilterMenu: () => {
		const { setFilterMenuVisible, setFilterMenuAnimating } = get();
		closeMenu(setFilterMenuVisible, setFilterMenuAnimating);
	},

	uploadModalVisible: false,
	uploadModalAnimating: false,
	setUploadModalVisible: (value) => set({ uploadModalVisible: value }),
	setUploadModalAnimating: (value) => set({ uploadModalAnimating: value }),
	openUploadModal: () => {
		const { setUploadModalVisible, setUploadModalAnimating } = get();
		openMenu(setUploadModalVisible, setUploadModalAnimating);
	},
	closeUploadModal: () => {
		const { setUploadModalVisible, setUploadModalAnimating } = get();
		closeMenu(setUploadModalVisible, setUploadModalAnimating);
	},

	visibleCategoryMenu: null,
	animatingCategoryMenu: null,
	categoryMenuDirectionDown: true,
	setVisibleCategoryMenu: (value) => set({ visibleCategoryMenu: value }),
	setAnimatingCategoryMenu: (value) => set({ animatingCategoryMenu: value }),
	setCategoryMenuDirectionDown: (value) => set({ categoryMenuDirectionDown: value }),
	openCategoryMenu: (transactionId, buttonRef, tableRef) => {
		const { visibleCategoryMenu, setCategoryMenuDirectionDown, setAnimatingCategoryMenu, setVisibleCategoryMenu } =
			get();
		openCategoryMenu(
			transactionId,
			buttonRef,
			tableRef,
			visibleCategoryMenu,
			setCategoryMenuDirectionDown,
			setAnimatingCategoryMenu,
			setVisibleCategoryMenu
		);
	},
	closeCategoryMenu: () => {
		const { visibleCategoryMenu, setAnimatingCategoryMenu, setVisibleCategoryMenu } = get();
		closeCategoryMenu(visibleCategoryMenu, setAnimatingCategoryMenu, setVisibleCategoryMenu);
	},
});

export const useAnimationStore = create(store);
