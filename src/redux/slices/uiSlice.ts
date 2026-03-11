import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UIState {
  isMobileMenuOpen: boolean;
  activeNavLink: string;
  isScrolled: boolean;
}

const initialState: UIState = {
  isMobileMenuOpen: false,
  activeNavLink: "",
  isScrolled: false,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleMobileMenu(state) {
      state.isMobileMenuOpen = !state.isMobileMenuOpen;
    },
    closeMobileMenu(state) {
      state.isMobileMenuOpen = false;
    },
    setActiveNavLink(state, action: PayloadAction<string>) {
      state.activeNavLink = action.payload;
    },
    setIsScrolled(state, action: PayloadAction<boolean>) {
      state.isScrolled = action.payload;
    },
  },
});

export const { toggleMobileMenu, closeMobileMenu, setActiveNavLink, setIsScrolled } =
  uiSlice.actions;

export default uiSlice.reducer;
