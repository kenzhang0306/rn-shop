import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: null,
    userId: null,
    expiryDate: null,
    isLoading: false,
    error: null,
  },
  reducers: {
    authenticate: (state, action) => {
      state.token = action.payload.token;
      state.userId = action.payload.userId;
      state.expiryDate = action.payload.expiryDate;
      state.isLoading = false;
      state.error = null;
    },
    logout: (state) => {
      state.token = null;
      state.userId = null;
      state.expiryDate = null;
      state.isLoading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.userId = action.payload.userId;
        state.expiryDate = action.payload.expiryDate;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(signup.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.userId = action.payload.userId;
        state.expiryDate = action.payload.expiryDate;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(signup.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  },
});

const clearLogoutTimer = () => {
  if (timer) {
    clearTimeout(timer);
  }
};

const setLogoutTimer = (expirationTime) => (dispatch) => {
  timer = setTimeout(() => {
    dispatch(logout());
  }, expirationTime);
};

const saveDataToStorage = (token, userId, expirationDate) => {
  AsyncStorage.setItem(
    "userData",
    JSON.stringify({
      token: token,
      userId: userId,
      expiryDate: expirationDate.toISOString(),
    })
  );
};

export const test = () => {
  console.log("test test test");
};

export const signup = createAsyncThunk(
  "auth/signup",
  async (credentials, { dispatch }) => {
    try {
      const response = await fetch(
        "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCPc2HMVEKsDes-jQBkoSQX8D94jnqpERg",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: credentials.email,
            password: credentials.password,
            returnSecureToken: true,
          }),
        }
      );

      if (!response.ok) {
        const errorResData = await response.json();
        const errorId = errorResData.error.message;
        let message = "Something went wrong with signing up!";
        if (errorId === "EMAIL_EXISTS") {
          message = "This email already exists!";
        }
        throw new Error(message);
      }

      const resData = await response.json();
      const expiryDate = new Date(
        new Date().getTime() + parseInt(resData.expiresIn) * 1000
      ).toISOString();

      // Dispatch the authenticate action using `thunkAPI.dispatch`
      dispatch(
        authenticate({
          token: resData.idToken,
          userId: resData.localId,
          expiryDate: expiryDate,
        })
      );

      // Save data to storage
      saveDataToStorage(
        resData.idToken,
        resData.localId,
        new Date(new Date().getTime() + parseInt(resData.expiresIn) * 1000)
      );

      // Return the result data
      return {
        token: resData.idToken,
        userId: resData.localId,
        expiryDate: expiryDate,
      };
    } catch (error) {
      // Throw the error to be handled by the rejected action
      throw error;
    }
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async (payload, thunkAPI) => {
    try {
      const response = await fetch(
        "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCPc2HMVEKsDes-jQBkoSQX8D94jnqpERg",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: payload.email,
            password: payload.password,
            returnSecureToken: true,
          }),
        }
      );

      if (!response.ok) {
        const errorResData = await response.json();
        const errorId = errorResData.error.message;
        let message = "Something went wrong with logging in!";
        if (errorId === "EMAIL_NOT_FOUND") {
          message = "This email could not be found!";
        } else if (errorId === "INVALID_PASSWORD") {
          message = "This password is not valid!";
        }
        throw new Error(message);
      } else {
        payload.navigation.navigate("Shop");
      }

      const resData = await response.json();
      const expiryDate = new Date(
        new Date().getTime() + parseInt(resData.expiresIn) * 1000
      ).toISOString();

      // Dispatch the authenticate action using `thunkAPI.dispatch`
      thunkAPI.dispatch(
        authenticate({
          token: resData.idToken,
          userId: resData.localId,
          expiryDate: expiryDate,
        })
      );

      // Save data to storage
      saveDataToStorage(
        resData.idToken,
        resData.localId,
        new Date(new Date().getTime() + parseInt(resData.expiresIn) * 1000)
      );

      // Return the result data
      return {
        token: resData.idToken,
        userId: resData.localId,
        expiryDate: expiryDate,
      };
    } catch (error) {
      // Throw the error to be handled by the rejected action
      throw error;
    }
  }
);

export const { authenticate, logout } = authSlice.actions;

export default authSlice.reducer;
