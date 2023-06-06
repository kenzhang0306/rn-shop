import React, { useState, useEffect, useLayoutEffect } from "react";
import {
  FlatList,
  View,
  Text,
  Platform,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { useNavigation } from "@react-navigation/native";

import CustomHeaderButton from "../../components/UI/CustomHeaderButton";
import OrderItem from "../../components/shop/OrderItem";
import ThemeColors from "../../constants/ThemeColors";
import { fetchOrders, getOrders } from "../../store/slices/OrderSlice";

export default function OrdersScreen(props) {
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const orders = useSelector(getOrders);

  // useEffect(() => {
  //   setIsLoading(true);
  //   dispatch(fetchOrders()).then(() => {
  //     setIsLoading(false);
  //   });
  // }, [dispatch]);

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={ThemeColors.chocolate} />
      </View>
    );
  }

  if (!isLoading && orders.length === 0) {
    return (
      <View style={styles.centered}>
        <Text>No orders found!</Text>
      </View>
    );
  }

  // useLayoutEffect(() => {
  //   navigation.setOptions({
  //     headerTitle: "Your Orders",
  //     headerLeft: () => (
  //       <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
  //         <Item
  //           title="card"
  //           iconName={Platform.OS === "android" ? "md-menu" : "ios-menu"}
  //           onPress={() => navigation.toggleDrawer()}
  //         />
  //       </HeaderButtons>
  //     ),
  //   });
  // }, [navigation]);

  return (
    <FlatList
      data={orders}
      keyExtractor={(item) => item.id}
      renderItem={(itemData) => {
        return (
          <OrderItem
            amount={itemData.item.totalAmount}
            date={itemData.item.readableDate}
            items={itemData.item.items} // for the OrderItem
          />
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
