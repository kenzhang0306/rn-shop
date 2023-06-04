import { View, Button, FlatList, StyleSheet } from "react-native";
import React from "react";
import { useSelector } from "react-redux";
import { getAvailableProducts } from "../../store/slices/ProductsSlice";
import ProductItem from "../../components/shop/ProductItem";
import ThemeColors from "../../constants/ThemeColors";

export default function ProductsOverviewScreen(props) {
  const availableProducts = useSelector(getAvailableProducts);

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
        onSelect={() => selectItemHandler(item.id, item.title)}
      >
        <Button
          color={ThemeColors.maroon}
          title="View Details"
          onPress={() => selectItemHandler(item.id, item.title)}
        />
        <Button
          color={ThemeColors.maroon}
          title="To Cart"
          onPress={() => dispatch(cartActions.addToCard(item))}
        />
      </ProductItem>
    );
  };
  return (
    <FlatList
      data={availableProducts}
      renderItem={renderAvailableProducts}
      keyExtractor={(item) => item.id}
    />
  );
}

const styles = StyleSheet.create({});
