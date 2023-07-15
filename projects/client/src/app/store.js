import { configureStore } from "@reduxjs/toolkit";
import attendanceClockReducer from "../global/Attendace";

export default configureStore({
  reducer: {
    attendance: attendanceClockReducer,
  },
});
