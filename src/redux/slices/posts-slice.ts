import { createSlice } from "@reduxjs/toolkit";

interface InitialState {
  pageNumber: number;
  dynamicPageNumber: number;
  editingPost: string | null;
}

const initialState : InitialState = {
  pageNumber: 1,
  dynamicPageNumber: 1,
  editingPost: null,
};

export const postSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    setPageNumber: (state, action) => {
      state.pageNumber = action.payload;
    },
    setDynamicPageNumber: (state, action) => {
      state.dynamicPageNumber = action.payload;
    },
    setEditingPost: (state, action) => {
      state.editingPost = action.payload;
    },
  },
});

export const { setPageNumber, setDynamicPageNumber, setEditingPost } = postSlice.actions;

export default postSlice.reducer;
