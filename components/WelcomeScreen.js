import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Dimensions,
  AsyncStorage,
  ActivityIndicator
} from "react-native";
import { Button } from "react-native-elements";

const SCREEN_WIDTH = Dimensions.get("window").width;
const SLIDE_DATA = [
  { title: "Step: 1", text: "aaa" },
  { title: "Step: 2", text: "bbb" },
  { title: "Step: 3", text: "ccc" }
];

export default class WelcomeScreen extends Component {
  constructor(props) {
    super(props);
    // `state`の`isInitialized`を`null`に初期化
    // `AsyncStorage`の'isInitialized'とはまた別物
    this.state = {
      isInitialized: null
    };
  }

  async componentDidMount() {
    let isInitializedString = await AsyncStorage.getItem("isInitialized");

    if (isInitializedString === "true") {
      this.setState({ isInitialized: true });
      this.props.navigation.navigate("main");
    } else {
      this.setState({ isInitialized: false });
    }
  }

  onStartButtonPress = async () => {
    // `AsyncStorage`に『ウェルカム画面表示済み』という情報を保存する
    await AsyncStorage.setItem("isInitialized", "true");
    this.props.navigation.navigate("main");
  };

  renderLastButton(index) {
    if (index === SLIDE_DATA.length - 1) {
      return (
        <Button
          style={{ padding: 10 }}
          buttonStyle={{ backgroundColor: "deepskyblue" }}
          title="Let's get it started!"
          onPress={this.onStartButtonPress}
        />
      );
    }
  }
  renderSlides() {
    return SLIDE_DATA.map((slide, index) => {
      return (
        <View
          key={index}
          style={{
            flex: 1,
            backgroundColor: "skyblue",
            width: SCREEN_WIDTH
          }}
        >
          <View style={styles.containerStyle}>
            <Text style={styles.textStyle}>{slide.title}</Text>
            <Text style={styles.textStyle}>{slide.text}</Text>
          </View>
          <View style={styles.containerStyle}>
            {this.renderLastButton(index)}
            <Text>{index + 1} / 3</Text>
          </View>
        </View>
      );
    });
  }
  render() {
    if (this.state.isInitialized === null) {
      return <ActivityIndicator size="large" />;
    }
    return (
      <ScrollView horizontal pagingEnabled style={{ flex: 1 }}>
        {this.renderSlides()}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  slideStyle: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "skyblue",
    width: SCREEN_WIDTH
  },
  containerStyle: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  textStyle: {
    color: "white",
    fontSize: 20,
    padding: 5
  }
});
