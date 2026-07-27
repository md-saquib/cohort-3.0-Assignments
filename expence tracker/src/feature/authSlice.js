import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import storageService from '../services/storageService';

export const registerUser = createAsyncThunk(
  'auth/register',
  async ({ name, email, password }, { rejectWithValue }) => {
    try {
      const users = await storageService.getUsersList();
      const emailExists = users.some((u) => u.email.toLowerCase() === email.toLowerCase());
      if (emailExists) {
        return rejectWithValue('An account with this email already exists');
      }

      const newUser = {
        id: `user_${Date.now()}`,
        name,
        email: email.toLowerCase(),
        password,
        settings: {
          currency: 'USD',
          theme: 'light',
          avatar: '0', // Default index
        },
      };

      await storageService.saveUser(newUser);

      const session = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        settings: newUser.settings
      };
      await storageService.saveSession(session);

      return session;
    } catch (e) {
      console.error('Registration failed error:', e);
      return rejectWithValue(e.message || 'Registration failed');
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const users = await storageService.getUsersList();
      const user = users.find(
        (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );

      if (!user) {
        return rejectWithValue('Invalid email or password');
      }

      // Upgrade legacy user profiles without avatar settings
      if (!user.settings) {
        user.settings = { currency: 'USD', theme: 'light', avatar: '0' };
      } else if (user.settings.avatar === undefined) {
        user.settings.avatar = '0';
      }

      const session = {
        id: user.id,
        name: user.name,
        email: user.email,
        settings: user.settings
      };
      await storageService.saveSession(session);
      return session;
    } catch (e) {
      console.error('Login failed error:', e);
      return rejectWithValue(e.message || 'Login failed');
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await storageService.clearSession();
      return null;
    } catch (e) {
      return rejectWithValue('Logout failed');
    }
  }
);

export const checkSession = createAsyncThunk(
  'auth/checkSession',
  async (_, { rejectWithValue }) => {
    try {
      const session = await storageService.getSession();
      if (!session) return rejectWithValue(null);
      return session;
    } catch (e) {
      return rejectWithValue(null);
    }
  }
);


const initialState = {
  user: null,
  status: 'idle',
  error: null,
  isInitialized: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.status = 'idle';
      })

      .addCase(checkSession.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(checkSession.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
        state.isInitialized = true;
      })
      .addCase(checkSession.rejected, (state) => {
        state.status = 'failed';
        state.user = null;
        state.isInitialized = true;
      });
  },
});

export const { clearAuthError } = authSlice.actions; 
export default authSlice.reducer; 
export const selectCurrentUser = (state) => state.auth.user;
export const selectIsAuthInitialized = (state) => state.auth.isInitialized;
export const selectAuthStatus = (state) => state.auth.status;
export const selectAuthError = (state) => state.auth.error;
export const selectUserAvatar = (state) => state.auth.user?.settings?.avatar || '0';
export const selectUserCurrency = (state) => state.auth.user?.settings?.currency || 'USD';
export const selectUserTheme = (state) => state.auth.user?.settings?.theme || 'light';
