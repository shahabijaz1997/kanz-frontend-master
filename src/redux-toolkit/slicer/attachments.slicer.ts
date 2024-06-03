import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

const initialStateAttachments: any = {
    value: []
}
const initialStateLogo: any = {
    value: {}
}

export const PhilosophySlice = createSlice({
    name: 'attachments',
    initialState: {
        attachments: initialStateAttachments,
        logo: initialStateLogo
    },
    reducers: {
        saveAttachments: (state, action: PayloadAction<String>) => {
            state.attachments.value = action.payload;
        },
        saveLogo: (state, action: PayloadAction<String>) => {
            state.logo.value = action.payload;
        }
    }
});

export const { saveAttachments, saveLogo } = PhilosophySlice.actions;
export default PhilosophySlice.reducer;