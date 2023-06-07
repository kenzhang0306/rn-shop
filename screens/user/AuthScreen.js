import React, {
  useReducer,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import {
  View,
  KeyboardAvoidingView,
  ScrollView,
  Text,
  ActivityIndicator,
  Image,
  Button,
  StyleSheet,
  Alert,
  Keyboard,
} from "react-native";
import { useDispatch } from "react-redux";
import { LinearGradient } from "expo-linear-gradient";

import Card from "../../components/UI/Card";
import Input from "../../components/UI/Input";
import ThemeColors from "../../constants/ThemeColors";
import { login, signup } from "../../store/slices/AuthSlice";

const FORM_INPUT_UPDATE = "FORM_INPUT_UPDATE";

const formReducer = (state, action) => {
  //console.log("state, action", state, action);
  switch (action.type) {
    case FORM_INPUT_UPDATE:
      const updatedValues = {
        ...state.inputValues,
        [action.input]: action.value,
      };
      const updatedValidities = {
        ...state.inputValidities,
        [action.input]: action.isValid,
      };
      let updatedFormIsValid = true;
      for (const key in updatedValidities) {
        updatedFormIsValid = updatedFormIsValid && updatedValidities[key];
      }
      return {
        formIsValid: updatedFormIsValid,
        inputValidities: updatedValidities,
        inputValues: updatedValues,
      };
    default:
      return state;
  }
};

const AuthScreen = (props) => {
  const [error, setError] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const dispatch = useDispatch();

  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      email: "",
      password: "",
    },
    inputValidities: {
      email: false,
      password: false,
    },
    formIsValid: false,
  });

  console.log("after updated: " + JSON.stringify(formState));

  useEffect(() => {
    if (error) {
      Alert.alert("An Error Occurred!", error, [{ text: "Okay" }]);
    }
  }, [error]);

  const keyboardDidHideListener = Keyboard.addListener(
    "keyboardDidHide",
    () => {
      console.log("Keyboard is closed: " + JSON.stringify(formState));
      // 其他逻辑...
      if (formState.formIsValid) {
        let action;
        if (isSignUp) {
          //console.log("signup: " + formState.inputValues);
          action = signup(
            formState.inputValues.email,
            formState.inputValues.password
          );
        } else {
          action = login(
            formState.inputValues.email,
            formState.inputValues.password
          );
        }
        setError(null);
        setIsLoading(true);
        try {
          dispatch(action);
          props.navigation.navigate("Shop");
        } catch (err) {
          setError(err.message);
          setIsLoading(false);
        }
      }
    }
  );

  //   const authHandler = useCallback(() => {
  //     Keyboard.dismiss();

  //     setTimeout(() => {
  //       console.log(
  //         "after sign up pressed " + JSON.stringify(formState.inputValues)
  //       );
  //       let action;
  //       if (isSignUp) {
  //         //console.log("signup: " + formState.inputValues);
  //         action = signup(
  //           formState.inputValues.email,
  //           formState.inputValues.password
  //         );
  //       } else {
  //         action = login(
  //           formState.inputValues.email,
  //           formState.inputValues.password
  //         );
  //       }
  //       setError(null);
  //       setIsLoading(true);
  //       try {
  //         dispatch(action);
  //         props.navigation.navigate("Shop");
  //       } catch (err) {
  //         setError(err.message);
  //         setIsLoading(false);
  //       }
  //     }, 5000);
  //   }, [dispatch, formState, dispatchFormState]);

  const authHandler = useCallback(() => {
    Keyboard.dismiss();

    keyboardDidHideListener;
    console.log("after sign up pressed: " + JSON.stringify(formState));
    if (formState.formIsValid) {
      console.log("sign up");
    } else {
      console.log("can not sin up");
    }

    // if (formState.formIsValid) {
    //   let action;
    //   if (isSignUp) {
    //     //console.log("signup: " + formState.inputValues);
    //     action = signup(
    //       formState.inputValues.email,
    //       formState.inputValues.password
    //     );
    //   } else {
    //     action = login(
    //       formState.inputValues.email,
    //       formState.inputValues.password
    //     );
    //   }
    //   setError(null);
    //   setIsLoading(true);
    //   try {
    //     dispatch(action);
    //     props.navigation.navigate("Shop");
    //   } catch (err) {
    //     setError(err.message);
    //     setIsLoading(false);
    //   }
    // }
  }, [formState, dispatch, dispatchFormState]);

  const inputChangeHandler = useCallback(
    (inputIdentifier, inputValue, inputValidity) => {
      console.log(inputIdentifier, inputValue);
      dispatchFormState({
        type: FORM_INPUT_UPDATE,
        value: inputValue,
        isValid: inputValidity,
        input: inputIdentifier,
      });
    },
    [dispatchFormState]
  );

  return (
    <KeyboardAvoidingView
      behavior="height"
      keyboardVerticalOffset={50}
      style={styles.screen}
    >
      <LinearGradient
        colors={["white", ThemeColors.chocolate, ThemeColors.maroon]}
        // start={{ x: 0, y: 1 }}
        // end={{ x: 0, y: 0 }}
        style={styles.gradient}
      >
        <Card style={styles.authContainer}>
          <ScrollView>
            <Input
              id="email"
              label="E-Mail"
              keyboardType="email-address"
              required
              email
              autoCapitalize="none"
              errorText="Please enter a valid email address."
              onInputChange={inputChangeHandler}
              initialValue=""
            />
            <Input
              id="password"
              label="Password"
              keyboardType="default"
              secureTextEntry
              required
              minLength={3}
              autoCapitalize="none"
              errorText="Please enter a valid password."
              onInputChange={inputChangeHandler}
              initialValue=""
            />
          </ScrollView>
          <View style={styles.buttonContainer}>
            {isLoading ? (
              <ActivityIndicator size="large" color={ThemeColors.chocolate} />
            ) : (
              <Button
                title={isSignUp ? "Sign Up" : "Login"}
                color={ThemeColors.chocolate}
                onPress={() => {
                  // Keyboard.dismiss();
                  authHandler();
                }}
              />
            )}
          </View>
          <View style={styles.buttonContainer}>
            <Button
              title={`Switch to ${isSignUp ? "Log in" : "Sign Up"}`}
              color={ThemeColors.maroon}
              onPress={() => setIsSignUp(!isSignUp)}
            />
          </View>
        </Card>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

// AuthScreen.navigationOptions = {
//   headerTitle: "Authentication",
// };

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center'
  },
  gradient: {
    // width: '100%',
    // height: '100%',
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  authContainer: {
    width: "80%",
    maxWidth: 400,
    maxHeight: 400,
    padding: 20,
  },
  buttonContainer: {
    marginTop: 10,
  },
});

export default AuthScreen;
