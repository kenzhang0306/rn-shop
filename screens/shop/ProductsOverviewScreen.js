import { View, Text, FlatList, StyleSheet } from "react-native";
import React from "react";
import { useSelector } from "react-redux";
import { getAvailableProducts } from "../../store/slices/ProductsSlice";

export default function ProductsOverviewScreen() {
  const availableProducts = useSelector(getAvailableProducts);
  const renderAvailableProducts = ({ item }) => {
    return <Text>{item.title}</Text>;
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
