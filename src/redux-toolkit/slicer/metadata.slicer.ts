import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { Data } from "../../interfaces/redux/redux.interface";

const initialState: Data = {
    value: {}
}

export const UserSlice = createSlice({
    name: 'userData',
    initialState,
    reducers: {
        saveUserMetaData: (state, action: PayloadAction<String>) => {
            state.value = action.payload;
        }
    }
});

export const { saveUserMetaData } = UserSlice.actions;
export default UserSlice.reducer;