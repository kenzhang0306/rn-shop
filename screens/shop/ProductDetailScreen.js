import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Button,
} from "react-native";
import React, { useLayoutEffect } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { getAvailableProducts } from "../../store/slices/ProductsSlice";
import { useDispatch, useSelector } from "react-redux";
import ThemeColors from "../../constants/ThemeColors";
import { addToCart } from "../../store/slices/CartSlice";

export default function ProductDetailScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { productId } = route.params;

  const availableProducts = useSelector(getAvailableProducts);

  const selectedProduct = availableProducts.find(
    (prod) => prod.id === productId
  );

  const dispatch = useDispatch();

  const { productTitle } = route.params;

  useLayoutEffect(() => {
    navigation.setOptions({ title: productTitle });
  }, [navigation, productTitle]);

  return (
    <ScrollView>
      <Image style={styles.image} source={{ uri: selectedProduct.imageUrl }} />
      <View style={styles.actions}>
        <Button
          color={ThemeColors.maroon}
          title="Add to Cart"
          onPress={() => dispatch(addToCart(selectedProduct))}
        />
      </View>
      <Text style={styles.price}>${selectedProduct.price}</Text>
      <Text style={styles.desc}>{selectedProduct.description}</Text>
    </ScrollView>
  );
}

// ProductDetailScreen.options = ({ route }) => ({
//   title: route.params.productTitle,
// });

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: 300,
  },
  actions: {
    marginVertical: 10,
    alignItems: "center", // So the button does not stretch in android.
    // width: '40%'
  },
  price: {
    fontFamily: "open-sans-bold",
    fontSize: 20,
    color: "#888",
    textAlign: "center",
    marginVertical: 20,
  },
  desc: {
    fontFamily: "open-sans",
    fontSize: 14,
    textAlign: "center",
    marginHorizontal: 20,
  },
});
