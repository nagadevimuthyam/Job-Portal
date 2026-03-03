import { createSlice } from "@reduxjs/toolkit";
import { emptyFilters } from "../../modules/employer/pages/search/utils/searchPayload";

const initialState = {
  draftFilters: emptyFilters,
  selectedSkills: [],
  appliedFilters: null,
};

const searchSlice = createSlice({
  name: "employerSearch",
  initialState,
  reducers: {
    setDraftFilters(state, action) {
      state.draftFilters = action.payload;
    },
    setSelectedSkills(state, action) {
      state.selectedSkills = action.payload;
    },
    setAppliedFilters(state, action) {
      state.appliedFilters = action.payload;
    },
    resetSearchState(state) {
      state.draftFilters = emptyFilters;
      state.selectedSkills = [];
      state.appliedFilters = null;
    },
  },
});

export const {
  setDraftFilters,
  setSelectedSkills,
  setAppliedFilters,
  resetSearchState,
} = searchSlice.actions;

export default searchSlice.reducer;
