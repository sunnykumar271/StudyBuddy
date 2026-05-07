import { createSlice } from '@reduxjs/toolkit';

const groupSlice = createSlice({
  name: 'group',
  initialState: {
    groups: [],
    myGroups: [],
    currentGroup: null,
    messages: [],
    loading: false,
    error: null,
  },
  reducers: {
    setGroups: (state, action) => {
      state.groups = action.payload;
    },
    setMyGroups: (state, action) => {
      state.myGroups = action.payload;
    },
    setCurrentGroup: (state, action) => {
      state.currentGroup = action.payload.group;
      state.messages = action.payload.messages || [];
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    setGroupLoading: (state, action) => {
      state.loading = action.payload;
    },
    setGroupError: (state, action) => {
      state.error = action.payload;
    },
    clearCurrentGroup: (state) => {
      state.currentGroup = null;
      state.messages = [];
    },
  },
});

export const {
  setGroups,
  setMyGroups,
  setCurrentGroup,
  addMessage,
  setGroupLoading,
  setGroupError,
  clearCurrentGroup,
} = groupSlice.actions;

export const selectGroups = (state) => state.group.groups;
export const selectMyGroups = (state) => state.group.myGroups;
export const selectCurrentGroup = (state) => state.group.currentGroup;
export const selectMessages = (state) => state.group.messages;
export const selectGroupLoading = (state) => state.group.loading;

export default groupSlice.reducer;
