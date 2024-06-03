import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { Data } from "../../interfaces/redux/redux.interface";

const initialState: Data = {
    value: {}
}

export const PhilosophySlice = createSlice({
    name: 'philosophyData',
    initialState,
    reducers: {
        savePhilisophyData: (state, action: PayloadAction<String>) => {
            state.value = action.payload;
        }
    }
});

export const { savePhilisophyData } = PhilosophySlice.actions;
export default PhilosophySlice.reducer;