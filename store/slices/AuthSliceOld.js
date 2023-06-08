// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// export const authenticateUser = createAsyncThunk(
//   "auth/authenticateUser",
//   async ({ token, userId, expiryTime }, { dispatch }) => {
//     console.log("authuser params: " + token, userId, expiryTime);
//     dispatch(setLogoutTimer(expiryTime));
//     return { token, userId };
//   }
// );

// export const logoutUser = createAsyncThunk(
//   "auth/logoutUser",
//   async (_, { dispatch }) => {
//     clearLogoutTimer();
//     await AsyncStorage.removeItem("userData");
//     dispatch(logout());
//   }
// );

// const authSlice = createSlice({
//   name: "auth",
//   initialState: { token: null, userId: null, loading: false, error: null },
//   reducers: {
//     authenticate: (state, action) => {
//       // console.log("my token: " + action.payload.token);
//       // console.log("my userId: " + action.payload.userId);
//       state.token = action.payload.token;
//       state.userId = action.payload.userId;
//     },
//     logout: (state) => {
//       state.token = null;
//       state.userId = null;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(authenticateUser.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(authenticateUser.fulfilled, (state, action) => {
//         console.log("extraReducers auth: " + JSON.stringify(action.payload));
//         state.loading = false;
//         state.token = action.payload.token;
//         state.userId = action.payload.userId;
//       })
//       .addCase(authenticateUser.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.error.message;
//       })
//       .addCase(logoutUser.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(logoutUser.fulfilled, (state) => {
//         state.loading = false;
//         state.token = null;
//         state.userId = null;
//         console.log("user logged out");
//       })
//       .addCase(logoutUser.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.error.message;
//       });
//   },
// });

// export const { authenticate, logout } = authSlice.actions;

// export const signup = (email, password) => {
//   return async (dispatch) => {
//     const response = await fetch(
//       "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCPc2HMVEKsDes-jQBkoSQX8D94jnqpERg",
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           email: email,
//           password: password,
//           returnSecureToken: true,
//         }),
//       }
//     );

//     if (!response.ok) {
//       const errorResData = await response.json();
//       console.log("error: " + JSON.stringify(errorResData));
//       const errorId = errorResData.error.message;
//       let message = "Something went wrong with logging in!";
//       if (errorId === "EMAIL_EXISTS") {
//         message = "This email already exists!";
//       }
//       throw new Error(message);
//     }

//     const resData = await response.json(); // transforms the data from json to javascript object
//     dispatch(
//       authenticate(
//         resData.idToken,
//         resData.localId,
//         parseInt(resData.expiresIn) * 1000
//       )
//     );
//     // The first new Date converts the second's huge number of miliseconds in a concrete date.
//     const expirationDate = new Date(
//       new Date().getTime() + parseInt(resData.expiresIn) * 1000
//     );
//     saveDataToStorage(resData.idToken, resData.localId, expirationDate);
//   };
// };

// export const login = (email, password) => {
//   return async (dispatch) => {
//     try {
//       const response = await fetch(
//         "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCPc2HMVEKsDes-jQBkoSQX8D94jnqpERg",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             email: email,
//             password: password,
//             returnSecureToken: true,
//           }),
//         }
//       );

//       if (!response.ok) {
//         const errorResData = await response.json();
//         const errorId = errorResData.error.message;
//         let message = "Something went wrong with logging in!";
//         if (errorId === "EMAIL_NOT_FOUND") {
//           message = "This email could not be found!";
//         } else if (errorId === "INVALID_PASSWORD") {
//           message = "This password is not valid!";
//         }
//         throw new Error(message);
//       }
//       const resData = await response.json(); // transforms the data from json to javascript object
//       console.log("resData.expiresIn", resData.expiresIn);

//       dispatch(
//         authenticateUser(
//           resData.idToken,
//           resData.localId,
//           parseInt(resData.expiresIn) * 1000
//         )
//       );

//       dispatch(
//         authenticate({
//           token: resData.idToken,
//           userId: resData.localId,
//         })
//       );
//       // The first new Date converts the second's huge number of miliseconds in a concrete date.
//       const expirationDate = new Date(
//         new Date().getTime() + parseInt(resData.expiresIn) * 1000
//       );
//       saveDataToStorage(resData.idToken, resData.localId, expirationDate);
//     } catch (error) {
//       throw error;
//     }
//   };
// };

// export const authenticateAsync = (token, userId, expiryTime) => {
//   return (dispatch) => {
//     dispatch(authenticateUser({ token, userId, expiryTime }));
//   };
// };

// export const logoutAsync = () => {
//   return (dispatch) => {
//     dispatch(logoutUser());
//   };
// };

// let timer;

// const clearLogoutTimer = () => {
//   if (timer) {
//     clearTimeout(timer);
//   }
// };

// const setLogoutTimer = (expirationTime) => (dispatch) => {
//   timer = setTimeout(() => {
//     dispatch(logoutUser());
//   }, expirationTime);
// };

// const saveDataToStorage = (token, userId, expirationDate) => {
//   // data must be in string format!
//   AsyncStorage.setItem(
//     "userData",
//     JSON.stringify({
//       token: token,
//       userId: userId,
//       expiryDate: expirationDate.toISOString(), // convert it to a string in a standardize format
//     })
//   );
// };

// export default authSlice.reducer;

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

// export const signup = (email, password) => async (dispatch) => {
//   try {
//     const response = await fetch(
//       "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCPc2HMVEKsDes-jQBkoSQX8D94jnqpERg",
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           email: email,
//           password: password,
//           returnSecureToken: true,
//         }),
//       }
//     );

//     if (!response.ok) {
//       const errorResData = await response.json();
//       const errorId = errorResData.error.message;
//       let message = "Something went wrong with logging in!";
//       if (errorId === "EMAIL_EXISTS") {
//         message = "This email already exists!";
//       }
//       throw new Error(message);
//     }

//     const resData = await response.json();
//     dispatch(
//       authenticate({
//         token: resData.idToken,
//         userId: resData.localId,
//         expiryDate: new Date(
//           new Date().getTime() + parseInt(resData.expiresIn) * 1000
//         ).toISOString(),
//       })
//     );
//     saveDataToStorage(
//       resData.idToken,
//       resData.localId,
//       new Date(new Date().getTime() + parseInt(resData.expiresIn) * 1000)
//     );
//   } catch (error) {
//     throw error;
//   }
// };

// export const login = (email, password) => async (dispatch) => {
//   try {
//     console.log("login start");
//     const response = await fetch(
//       "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCPc2HMVEKsDes-jQBkoSQX8D94jnqpERg",
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           email: email,
//           password: password,
//           returnSecureToken: true,
//         }),
//       }
//     );

//     if (!response.ok) {
//       const errorResData = await response.json();
//       const errorId = errorResData.error.message;
//       let message = "Something went wrong with logging in!";
//       if (errorId === "EMAIL_NOT_FOUND") {
//         message = "This email could not be found!";
//       } else if (errorId === "INVALID_PASSWORD") {
//         message = "This password is not valid!";
//       }
//       throw new Error(message);
//     }

//     const resData = await response.json();
//     dispatch(
//       authenticate({
//         token: resData.idToken,
//         userId: resData.localId,
//         expiryDate: new Date(
//           new Date().getTime() + parseInt(resData.expiresIn) * 1000
//         ).toISOString(),
//       })
//     );
//     saveDataToStorage(
//       resData.idToken,
//       resData.localId,
//       new Date(new Date().getTime() + parseInt(resData.expiresIn) * 1000)
//     );
//   } catch (error) {
//     throw error;
//   }
// };

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
  async (credentials, thunkAPI) => {
    try {
      const response = await fetch(
        "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCPc2HMVEKsDes-jQBkoSQX8D94jnqpERg",
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
        let message = "Something went wrong with logging in!";
        if (errorId === "EMAIL_NOT_FOUND") {
          message = "This email could not be found!";
        } else if (errorId === "INVALID_PASSWORD") {
          message = "This password is not valid!";
        }
        throw new Error(message);
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
