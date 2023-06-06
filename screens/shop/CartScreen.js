import React, { useState, useLayoutEffect } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { FlatList } from "react-native-gesture-handler";

import CartItem from "../../components/shop/CartItem";
import Card from "../../components/UI/Card";
import ThemeColors from "../../constants/ThemeColors";

import { useNavigation } from "@react-navigation/native";
import { getItems, getTotalAmount } from "../../store/slices/CartSlice";
import { addOrder } from "../../store/slices/OrderSlice";

export default function CartScreen(props) {
  const [isLoading, setIsLoading] = useState(false);
  // const [ error, setError ] = useState(false);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const cartTotalAmount = useSelector(getTotalAmount);
  const cartItems = useSelector((state) => {
    // TRANSFORM AN OBJECT INTO AN ARRAY
    const transformedCartItems = [];
    for (const key in state.cart.items) {
      // A cart-item with an additional productId prop.
      transformedCartItems.push({
        productId: key,
        productTitle: state.cart.items[key].productTitle,
        productPrice: state.cart.items[key].productPrice,
        quantity: state.cart.items[key].quantity,
        sum: state.cart.items[key].sum,
      });
    }
    return transformedCartItems.sort((a, b) =>
      a.productId > b.productId ? 1 : -1
    );
  });

  const sendOrderHandler = async () => {
    setIsLoading(true);
    dispatch(addOrder({ cartItems, cartTotalAmount }));
    setIsLoading(false);
  };

  if (isLoading) {
    return <View style={styles.centered} />;
  }

  useLayoutEffect(() => {
    navigation.setOptions({ title: "My Cart" });
  }, [navigation]);

  return (
    <View style={styles.screen}>
      <Card style={styles.summary}>
        <Text style={styles.summaryText}>
          {/* Use Math.round etc to remove the -0... */}
          Total:{" "}
          <Text style={styles.amount}>
            ${Math.round(cartTotalAmount.toFixed(2) * 100) / 100}
          </Text>
        </Text>
        {/* NOTE: cartItems is an array!!! */}
        {isLoading ? (
          <ActivityIndicator size="large" color={ThemeColors.chocolate} />
        ) : (
          <Button
            color={ThemeColors.chocolate}
            title="Order Now"
            disabled={cartItems.length === 0}
            onPress={sendOrderHandler}
          />
        )}
      </Card>
      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.productId}
        renderItem={(itemData) => (
          <CartItem
            quantity={itemData.item.quantity}
            title={itemData.item.productTitle}
            amount={itemData.item.sum}
            deletable // Needed to show the delete button.
            onRemove={() =>
              dispatch(cartActions.removeFromCart(itemData.item.productId))
            }
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    margin: 20,
  },
  summary: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
    padding: 10,
  },
  summaryText: {
    fontFamily: "open-sans-bold",
    fontSize: 18,
    color: ThemeColors.chocolate,
  },
  amount: {
    color: ThemeColors.chocolate,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
