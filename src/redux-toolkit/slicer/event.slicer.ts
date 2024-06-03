import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

const initialState: any = {
    value: "en"
}

export const PhilosophySlice = createSlice({
    name: 'event',
    initialState,
    reducers: {
        saveEvent: (state, action: PayloadAction<String>) => {
            state.value = action.payload;
        }
    }
});

export const { saveEvent } = PhilosophySlice.actions;
export default PhilosophySlice.reducer;