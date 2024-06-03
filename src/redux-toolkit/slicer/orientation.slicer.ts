import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { Data } from "../../interfaces/redux/redux.interface";

const initialState: Data = {
    value: "ltr"
}

export const OrientaionSlice = createSlice({
    name: 'orientation',
    initialState,
    reducers: {
        saveOrientation: (state, action: PayloadAction<String>) => {
            state.value = action.payload;
        }
    }
});

export const { saveOrientation } = OrientaionSlice.actions;
export default OrientaionSlice.reducer;