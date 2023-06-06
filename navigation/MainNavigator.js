import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from "@react-navigation/drawer";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ProductsOverviewScreen from "../screens/shop/ProductsOverviewScreen";
import ProductDetailScreen from "../screens/shop/ProductDetailScreen";
import CartScreen from "../screens/shop/CartScreen";
import { Ionicons } from "@expo/vector-icons";
import { Platform, SafeAreaView, View, Button } from "react-native";
import ThemeColors from "../constants/ThemeColors";
import { useDispatch } from "react-redux";
import OrdersScreen from "../screens/shop/OrdersScreen";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import CustomHeaderButton from "../components/UI/CustomHeaderButton";
import AuthScreen from "../screens/user/AuthScreen";

export default function MainNavigator() {
  const Stack = createNativeStackNavigator();
  const Drawer = createDrawerNavigator();

  const defaultNavOptions = {
    headerStyle: {
      backgroundColor: Platform.OS === "android" ? ThemeColors.maroon : "",
    },
    headerTitleStyle: {
      fontFamily: "open-sans-bold",
    },
    headerBackTitleStyle: {
      fontFamily: "open-sans",
    },
    headerTintColor: Platform.OS === "android" ? "white" : ThemeColors.maroon,
  };

  const ProductsNavigator = () => {
    return (
      <Stack.Navigator screenOptions={defaultNavOptions}>
        <Stack.Screen
          name="Products Overview"
          component={ProductsOverviewScreen}
        />
        <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
        <Stack.Screen name="Cart" component={CartScreen} />
      </Stack.Navigator>
    );
  };

  const OrdersNavigator = ({ navigation }) => {
    return (
      <Stack.Navigator screenOptions={defaultNavOptions}>
        <Stack.Screen
          name="Orders Screen"
          component={OrdersScreen}
          options={{
            title: "My Orders",
            headerLeft: () => (
              <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
                <Item
                  title="card"
                  iconName={Platform.OS === "android" ? "md-menu" : "ios-menu"}
                  onPress={() => navigation.toggleDrawer()}
                />
              </HeaderButtons>
            ),
          }}
        />
      </Stack.Navigator>
    );
  };

  const CustomDrawerContent = (props) => {
    const dispatch = useDispatch();

    const handleLogout = () => {
      //dispatch(authActions.logout());
    };

    return (
      <View style={{ flex: 1, paddingTop: 20 }}>
        <DrawerContentScrollView {...props}>
          <DrawerItemList {...props} />
        </DrawerContentScrollView>
        <Button
          title="Logout"
          color={ThemeColors.chocolate}
          onPress={handleLogout}
        />
      </View>
    );
  };

  const ShopNavigator = () => {
    return (
      <Drawer.Navigator
        screenOptions={({ route }) => ({
          drawerIcon: ({ color }) => {
            let iconName;
            if (route.name === "Products") {
              iconName = Platform.OS === "android" ? "md-cart" : "ios-cart";
            } else if (route.name === "Orders") {
              iconName = Platform.OS === "android" ? "md-list" : "ios-list";
            } else if (route.name === "Admin") {
              iconName = Platform.OS === "android" ? "md-create" : "ios-create";
            }
            return <Ionicons name={iconName} size={23} color={color} />;
          },
          headerShown: false,
          activeTintColor: ThemeColors.chocolate,
        })}
        drawerContent={(props) => <CustomDrawerContent {...props} />}
      >
        <Drawer.Screen name="Products" component={ProductsNavigator} />
        <Drawer.Screen name="Orders" component={OrdersNavigator} />
        {/* <Drawer.Screen name="Admin" component={AdminNavigator} /> */}
      </Drawer.Navigator>
    );
  };

  const AuthNavigator = () => {
    return (
      <Stack.Navigator screenOptions={defaultNavOptions}>
        <Stack.Screen name="AuthScreen" component={AuthScreen} />
      </Stack.Navigator>
    );
  };

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* <Stack.Screen name="StartUp" component={StartUpScreen} /> */}
        <Stack.Screen name="Auth" component={AuthNavigator} />
        <Stack.Screen name="Shop" component={ShopNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
