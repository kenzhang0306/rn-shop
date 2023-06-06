import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";

const authenticateUser = createAsyncThunk(
  "auth/authenticateUser",
  async ({ token, userId, expiryTime }, { dispatch }) => {
    dispatch(setLogoutTimer(expiryTime));
    return { token, userId };
  }
);

const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { dispatch }) => {
    clearLogoutTimer();
    await AsyncStorage.removeItem("userData");
    dispatch(logout());
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: { token: null, userId: null, loading: false, error: null },
  reducers: {
    authenticate: (state, action) => {
      state.token = action.payload.token;
      state.userId = action.payload.userId;
    },
    logout: (state) => {
      state.token = null;
      state.userId = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(authenticateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(authenticateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.userId = action.payload.userId;
      })
      .addCase(authenticateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.token = null;
        state.userId = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { authenticate, logout } = authSlice.actions;

export const signup = (email, password) => {
  console.log(email, password);
  return async (dispatch) => {
    const response = await fetch(
      "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCPc2HMVEKsDes-jQBkoSQX8D94jnqpERg",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
          returnSecureToken: true,
        }),
      }
    );

    if (!response.ok) {
      const errorResData = await response.json();
      console.log("error: " + JSON.stringify(errorResData));
      const errorId = errorResData.error.message;
      let message = "Something went wrong with logging in!";
      if (errorId === "EMAIL_EXISTS") {
        message = "This email already exists!";
      }
      throw new Error(message);
    }

    const resData = await response.json(); // transforms the data from json to javascript object
    dispatch(
      authenticate(
        resData.idToken,
        resData.localId,
        parseInt(resData.expiresIn) * 1000
      )
    );
    // The first new Date converts the second's huge number of miliseconds in a concrete date.
    const expirationDate = new Date(
      new Date().getTime() + parseInt(resData.expiresIn) * 1000
    );
    saveDataToStorage(resData.idToken, resData.localId, expirationDate);
  };
};

export const login = (email, password) => {
  return async (dispatch) => {
    try {
      const response = await fetch(
        "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCPc2HMVEKsDes-jQBkoSQX8D94jnqpERg",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            password: password,
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
      }
      const resData = await response.json(); // transforms the data from json to javascript object
      console.log("resData.expiresIn", resData.expiresIn);

      dispatch(
        authenticate(
          resData.idToken,
          resData.localId,
          parseInt(resData.expiresIn) * 1000
        )
      );
      // The first new Date converts the second's huge number of miliseconds in a concrete date.
      const expirationDate = new Date(
        new Date().getTime() + parseInt(resData.expiresIn) * 1000
      );
      saveDataToStorage(resData.idToken, resData.localId, expirationDate);
    } catch (error) {
      throw error;
    }
  };
};

export const authenticateAsync = (token, userId, expiryTime) => {
  return (dispatch) => {
    dispatch(authenticateUser({ token, userId, expiryTime }));
  };
};

export const logoutAsync = () => {
  return (dispatch) => {
    dispatch(logoutUser());
  };
};

let timer;

const clearLogoutTimer = () => {
  if (timer) {
    clearTimeout(timer);
  }
};

const setLogoutTimer = (expirationTime) => (dispatch) => {
  timer = setTimeout(() => {
    dispatch(logoutUser());
  }, expirationTime);
};

const saveDataToStorage = (token, userId, expirationDate) => {
  // data must be in string format!
  AsyncStorage.setItem(
    "userData",
    JSON.stringify({
      token: token,
      userId: userId,
      expiryDate: expirationDate.toISOString(), // convert it to a string in a standardize format
    })
  );
};

export default authSlice.reducer;
