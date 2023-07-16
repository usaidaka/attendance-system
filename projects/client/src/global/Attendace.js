import { createSlice } from "@reduxjs/toolkit";

export const attendanceClockSlice = createSlice({
  name: "counter",
  initialState: {
    value: "",
  },
  reducers: {
    attendanceClock: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { attendanceClock } = attendanceClockSlice.actions;

export default attendanceClockSlice.reducer;
