import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Platform,
  Image,
  StatusBar
} from "react-native";
import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import { createBottomTabNavigator } from "react-navigation-tabs";
import { Provider } from "react-redux";

import store from "./store";

import WelcomeScreen from "./components/WelcomeScreen.js";
import HomeScreen from "./components/HomeScreen.js";
import DetailScreen from "./components/DetailScreen";
import AddScreen from "./components/AddScreen";
import ProfileScreen from "./components/ProfileScreen";
import Setting1Screen from "./components/Setting1Screen";
import Setting2Screen from "./components/Setting2Screen";

export default class App extends React.Component {
  render() {
    const headerNavigationOptions = {
      headerStyle: {
        backgroundColor: "deepskyblue",
        marginTop: Platform.OS === "android" ? 24 : 0
      },
      headerTitleStyle: { color: "white" },
      headerTintColor: "white"
    };

    const HomeStack = createStackNavigator({
      home: {
        screen: HomeScreen,
        navigationOptions: {
          // ここから`headerNavigationOprions`の中身の展開開始〜
          headerStyle: {
            backgroundColor: "deepskyblue",
            marginTop: Platform.OS === "android" ? 24 : 0
          },
          headerTitleStyle: { color: "white" },
          headerTintColor: "white",
          // 〜ここまで`headerNavigationOprions`の中身の展開終了

          headerTitle: "Treco",
          headerBackTitle: "Home"
        }
      },
      detail: {
        screen: DetailScreen,
        navigationOptions: {
          ...headerNavigationOptions,
          headerTitle: "Detail"
        }
      }
    });
    // 1階層目以外はタブを隠す
    HomeStack.navigationOptions = ({ navigation }) => {
      return {
        tabBarVisible: navigation.state.index === 0
      };
    };

    const AddStack = createStackNavigator({
      add: {
        screen: AddScreen,
        navigationOptions: {
          header: null
        }
      }
    });
    // 0階層目以外(つまり全階層)はタブを隠す
    AddStack.navigationOptions = ({ navigation }) => {
      return {
        tabBarVisible: navigation.state.index === -1 // ←0じゃなくて-1
      };
    };

    const ProfileStack = createStackNavigator({
      profile: {
        screen: ProfileScreen,
        navigationOptions: {
          ...headerNavigationOptions,
          headerTitle: "Treco",
          headerBackTitle: "Profile"
        }
      },
      setting1: {
        screen: Setting1Screen,
        navigationOptions: {
          ...headerNavigationOptions,
          headerTitle: "Setting 1"
          // headerBackTitle: 'Setting 1' は要らない。
        }
      },
      setting2: {
        screen: Setting2Screen,
        navigationOptions: {
          ...headerNavigationOptions,
          headerTitle: "Setting 2"
        }
      }
    });
    // 1階層目以外はタブを隠す
    ProfileStack.navigationOptions = ({ navigation }) => {
      return {
        tabBarVisible: navigation.state.index === 0
      };
    };

    const MainTab = createBottomTabNavigator(
      {
        homeStack: {
          screen: HomeStack,
          navigationOptions: {
            tabBarIcon: ({ tintColor: tintColor }) => (
              <Image
                style={{ height: 25, width: 25, tintColor: tintColor }}
                source={require("./assets/home.png")}
              />
            ),
            title: "Home"
          }
        },
        addStack: {
          screen: AddStack,
          navigationOptions: {
            tabBarIcon: () => (
              <Image
                style={{ height: 60, width: 60, tintColor: "deepskyblue" }}
                source={require("./assets/add.png")}
              />
            ),
            title: ""
          }
        },
        profileStack: {
          screen: ProfileStack,
          navigationOptions: {
            tabBarIcon: ({ tintColor }) => (
              <Image
                style={{ height: 25, width: 25, tintColor: tintColor }}
                source={require("./assets/profile.png")}
              />
            ),
            title: "Profile"
          }
        }
      },
      {
        swipeEnabled: false // Android用
      }
    );

    const NavigatorTab = createAppContainer(
      createSwitchNavigator({
        welcome: { screen: WelcomeScreen },
        main: { screen: MainTab }
      })
    );

    return (
      <Provider store={store}>
        <View style={styles.container}>
          <StatusBar barStyle="light-content" />
          <NavigatorTab />
        </View>
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    //alignItems: "center",
    justifyContent: "center"
  }
});
