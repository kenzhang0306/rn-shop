import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const fetchOrders = createAsyncThunk(
  "order/fetchOrders",
  async (_, { getState, rejectWithValue }) => {
    const userId = getState().auth.userId;
    console.log("userId", userId);

    try {
      const response = await fetch(
        `https://shop-app-bf402.firebaseio.com/orders/${userId}.json`
      );

      if (!response.ok) {
        throw new Error(
          "Something went wrong with fetching the data from the server!"
        );
      }

      const resData = await response.json();
      const loadedOrders = [];

      for (const key in resData) {
        loadedOrders.push({
          id: key,
          items: resData[key].cartItems,
          amount: resData[key].totalAmount,
          date: new Date(resData[key].date),
        });
      }

      return loadedOrders;
    } catch (err) {
      // sent error to custom analytics server
      return rejectWithValue(err.message);
    }
  }
);

export const addOrder = createAsyncThunk(
  "order/addOrder",
  async ({ cartItems, totalAmount }, { getState, rejectWithValue }) => {
    const token = getState().auth.token;
    const userId = getState().auth.userId;
    const date = new Date();

    const response = await fetch(
      `https://shop-app-bf402.firebaseio.com/orders/${userId}.json?auth=${token}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cartItems,
          totalAmount,
          date: date.toISOString(),
        }),
      }
    );

    if (!response.ok) {
      throw new Error(
        "Something went wrong with adding the order on the server!"
      );
    }

    const resData = await response.json();

    return {
      id: resData.name,
      items: cartItems,
      amount: totalAmount,
      date,
    };
  }
);

const initialState = {
  orders: [],
  loading: false,
  error: null,
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    // setOrders(state, action) {
    //   state.orders = action.payload;
    // },
    // addOrder(state, action) {
    //   const newOrder = {
    //     id: action.payload.id,
    //     items: action.payload.items,
    //     amount: action.payload.amount,
    //     date: action.payload.date,
    //   };
    //   state.orders.push(newOrder);
    // },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orders.push(action.payload);
      })
      .addCase(addOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const getOrders = (state) => state.order.orders;
//export const { setOrders, addOrder } = orderSlice.actions;

export default orderSlice.reducer;
