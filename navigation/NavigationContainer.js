// import React, { useEffect, useRef } from "react";
// import { useSelector } from "react-redux";
// import { CommonActions, useNavigation } from "@react-navigation/native";

// import MainNavigator from "./MainNavigator";

// const NavigationContainerComponent = () => {
//   const isAuth = useSelector((state) => !!state.auth.token);
//   const navigationRef = useRef();

//   useEffect(() => {
//     if (!isAuth) {
//       CommonActions.navigate("Auth");
//     }
//   }, [isAuth]);

//   return <MainNavigator />;
// };

// export default NavigationContainerComponent;

import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { NavigationContainerRef } from "@react-navigation/native";
import { CommonActions } from "@react-navigation/native";

import MainNavigator from "./MainNavigator";

const NavigationContainer = () => {
  const isAuth = useSelector((state) => !!state.auth.token);
  const navRef = useRef < NavigationContainerRef > null;

  useEffect(() => {
    if (!isAuth) {
      navRef.current?.dispatch(CommonActions.navigate("Auth"));
    }
  }, [isAuth]);

  return <MainNavigator />;
};

export default NavigationContainer;
