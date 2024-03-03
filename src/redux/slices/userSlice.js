import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  id: '',
  fullname: '',
  phone: '',
  email: '',
  gender: '', 
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateUser: (state, action) => {
      const { 
        id = '',
        fullname = '',
        phone = '',
        email = '',
        gender = '', 
      } = action.payload;

      state.id = id;
      state.fullname = fullname;
      state.phone = phone;
      state.email = email;
      state.gender = gender;
    },
    resetUser: (state) => {
      state.id = '';
      state.fullname = '';
      state.phone = '';
      state.email = '';
      state.gender = '';
    },
  },
});

// Action creators are generated for each case reducer function
export const { updateUser, resetUser } = userSlice.actions;

export default userSlice.reducer;