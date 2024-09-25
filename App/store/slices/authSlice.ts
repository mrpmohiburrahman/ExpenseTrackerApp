// redux/slices/authSlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import auth from '@react-native-firebase/auth'; // Ensure Firebase is configured
import { RootState } from '../store';

// Define the User type based on your Firebase user structure
interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  // Add other user properties as needed
}

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  // Uncomment if you choose to track authentication status explicitly
  // isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
  // isAuthenticated: false,
};

// Async thunk for user registration
export const registerUser = createAsyncThunk<
  User, // Return type on success
  { email: string; password: string; displayName: string }, // Argument type
  { rejectValue: string } // Type for rejected value
>('auth/register', async (userData, thunkAPI) => {
  try {
    const { email, password, displayName } = userData;
    const userCredential = await auth().createUserWithEmailAndPassword(email, password);
    await userCredential.user.updateProfile({ displayName });
    const user: User = {
      uid: userCredential.user.uid,
      email: userCredential.user.email,
      displayName: userCredential.user.displayName,
    };
    return user;
  } catch (error: any) {
    // Return a custom error message for the rejected action
    return thunkAPI.rejectWithValue(error.message);
  }
});

// Async thunk for user login
export const loginUser = createAsyncThunk<
  User, // Return type on success
  { email: string; password: string }, // Argument type
  { rejectValue: string } // Type for rejected value
>('auth/login', async (credentials, thunkAPI) => {
  try {
    const { email, password } = credentials;
    const userCredential = await auth().signInWithEmailAndPassword(email, password);
    const user: User = {
      uid: userCredential.user.uid,
      email: userCredential.user.email,
      displayName: userCredential.user.displayName,
    };
    return user;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

// Async thunk for logging out
export const logoutUser = createAsyncThunk<
  void, // No return value on success
  void, // No argument
  { rejectValue: string } // Type for rejected value
>('auth/logout', async (_, thunkAPI) => {
  try {
    await auth().signOut();
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Optional: Set user directly (useful for persisting auth state)
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      // Uncomment if using isAuthenticated
      // state.isAuthenticated = true;
    },
  },
  extraReducers: builder => {
    // Handle Register
    builder
      .addCase(registerUser.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.user = action.payload;
        // Uncomment if using isAuthenticated
        // state.isAuthenticated = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Registration failed';
      });

    // Handle Login
    builder
      .addCase(loginUser.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.user = action.payload;
        // Uncomment if using isAuthenticated
        // state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Login failed';
      });

    // Handle Logout
    builder
      .addCase(logoutUser.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, state => {
        state.loading = false;
        state.user = null;
        // Uncomment if using isAuthenticated
        // state.isAuthenticated = false;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Logout failed';
      });
  },
});

// Export the setUser action
export const { setUser } = authSlice.actions;

// Selector to access the auth state
export const selectAuthState = (state: RootState) => state.auth;

// Export the reducer to be included in the store
export default authSlice.reducer;
