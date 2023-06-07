// import React, { useEffect, useRef } from "react";
// import { useSelector } from "react-redux";
// import { CommonActions, useNavigation } from "@react-navigation/native";

// import MainNavigator from "./MainNavigator";

// const NavigationContainer = () => {
//   const isAuth = useSelector((state) => !!state.auth.token);
//   const navigationRef = useRef();

//   useEffect(() => {
//     console.log("Auth:" + isAuth);
//     if (!isAuth) {
//       CommonActions.navigate("Auth");
//     }
//   }, [isAuth]);

//   return <MainNavigator />;
// };

// export default NavigationContainer;

import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { NavigationContainerRef } from "@react-navigation/native";
import { CommonActions } from "@react-navigation/native";

import MainNavigator from "./MainNavigator";

const NavigationContainer = () => {
  const isAuth = useSelector((state) => !!state.auth.token);
  const navRef = useRef < NavigationContainerRef > null;
  useEffect(() => {
    console.log("Auth:" + isAuth);
    if (!isAuth) {
      navRef.current?.dispatch(CommonActions.navigate("Auth"));
    }
  }, [isAuth]);

  return <MainNavigator />;
};

export default NavigationContainer;
