import { View, Button, FlatList, StyleSheet } from "react-native";
import React, { useEffect, useLayoutEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAvailableProducts } from "../../store/slices/ProductsSlice";
import ProductItem from "../../components/shop/ProductItem";
import ThemeColors from "../../constants/ThemeColors";
import { addToCart } from "../../store/slices/CartSlice";
import { useNavigation } from "@react-navigation/native";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import CustomHeaderButton from "../../components/UI/CustomHeaderButton";

export default function ProductsOverviewScreen(props) {
  const availableProducts = useSelector(getAvailableProducts);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const selectItemHandler = (id, title) => {
    props.navigation.navigate("ProductDetail", {
      productId: id,
      productTitle: title,
    });
  };

  const renderAvailableProducts = ({ item }) => {
    return (
      <ProductItem
        image={item.imageUrl}
        title={item.title}
        price={item.price}
        onSelectCallback={() => selectItemHandler(item.id, item.title)}
      >
        <Button
          color={ThemeColors.maroon}
          title="View Details"
          onPress={() => selectItemHandler(item.id, item.title)}
        />
        <Button
          color={ThemeColors.maroon}
          title="To Cart"
          onPress={() => dispatch(addToCart(item))}
        />
      </ProductItem>
    );
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "All Products",
      headerLeft: () => (
        <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
          <Item
            title="card"
            iconName={Platform.OS === "android" ? "md-menu" : "ios-menu"}
            onPress={() => navigation.toggleDrawer()}
          />
        </HeaderButtons>
      ),
      headerRight: () => (
        <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
          <Item
            title="card"
            iconName={Platform.OS === "android" ? "md-cart" : "ios-cart"}
            onPress={() => navigation.navigate("Cart")}
          />
        </HeaderButtons>
      ),
    });
  }, [navigation]);

  return (
    <FlatList
      data={availableProducts}
      renderItem={renderAvailableProducts}
      keyExtractor={(item) => item.id}
    />
  );
}

const styles = StyleSheet.create({});
