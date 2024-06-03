import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { Data } from "../../interfaces/redux/redux.interface";

const initialState: Data = {
    value: {}
}

export const LanguageSlice = createSlice({
    name: 'language',
    initialState,
    reducers: {
        saveLanguage: (state, action: PayloadAction<String>) => {
            state.value = action.payload;
        }
    }
});

export const { saveLanguage } = LanguageSlice.actions;
export default LanguageSlice.reducer;