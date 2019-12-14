import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Picker,
  DatePickerIOS,
  Dimensions,
  LayoutAnimation,
  UIManager,
  Platform
} from "react-native";
import { Header, ListItem, Icon } from "react-native-elements";
import DatePicker from "react-native-datepicker";

// 評価ランクに関する定数
const GREAT = "sentiment-very-satisfied";
const GREAT_COLOR = "red";
const GOOD = "sentiment-satisfied";
const GOOD_COLOR = "orange";
const POOR = "sentiment-dissatisfied";
const POOR_COLOR = "blue";

// スマホ画面の横幅の定数
const SCREEN_WIDTH = Dimensions.get("window").width;

// 地図のズームサイズ
const MAP_ZOOM_RATE = 15.0; // ←追記部分

const INITIAL_STATE = {
  // ←追記部分
  // プルダウンメニューが開いてるか閉じてるか
  countryPickerVisible: false,
  dateFromPickerVisible: false,
  dateToPickerVisible: false,

  // プルダウンメニューで選択された日付データを保存
  chosenDateFrom: new Date().toLocaleString("ja"),
  chosenDateTo: new Date().toLocaleString("ja"),

  // 旅行の評価データ用
  tripDetail: {
    country: "Select Counrty",
    dateFrom: "From",
    dateTo: "To",
    imageURIs: [
      require("../assets/add_image_placeholder.png"),
      require("../assets/add_image_placeholder.png"),
      require("../assets/add_image_placeholder.png")
    ],
    rank: ""
  },

  // 地図描画用
  initialRegion: {
    latitude: 35.658581, // 東京タワー
    longitude: 139.745433, // 東京タワー
    latitudeDelta: MAP_ZOOM_RATE,
    longitudeDelta: MAP_ZOOM_RATE * 2.25
  }
};

class AddScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = INITIAL_STATE;
  }

  // 画面上で何か再描画される度に滑らかなアニメーションを適用する
  componentDidUpdate() {
    UIManager.setLayoutAnimationEnabledExperimental &&
      UIManager.setLayoutAnimationEnabledExperimental(true);
    LayoutAnimation.easeInEaseOut();
  }

  // 国選択のプルダウンメニューを描画
  renderCountryPicker() {
    // 国選択のプルダウンメニューが開いていたら
    if (this.state.countryPickerVisible === true) {
      // プルダウンメニューを描画
      return (
        <Picker
          // 現在の値がPicker内で最初から選択されてるようにする
          selectedValue={this.state.tripDetail.country}
          // Picker内で選択されてる値が変わったら、
          onValueChange={itemValue => {
            // `this.state.tripDetail.country`に引数の`itemValue`をセットする
            this.setState({
              ...this.state, // `this.state`の中身をここに展開
              tripDetail: {
                ...this.state.tripDetail, // `this.state.tripDetail`の中身をここに展開
                country: itemValue
              }
            });
          }}
        >
          <Picker.Item
            label={INITIAL_STATE.tripDetail.country}
            value={INITIAL_STATE.tripDetail.country}
          />
          <Picker.Item label="China" value="China" />
          <Picker.Item label="UK" value="UK" />
          <Picker.Item label="USA" value="USA" />
        </Picker>
      );
    }
  }

  // 出国日のプルダウンメニューを描画
  renderDateFromPicker() {
    if (this.state.dateFromPickerVisible) {
      switch (Platform.OS) {
        // iOSだったら、
        case "ios":
          return (
            <DatePickerIOS
              mode="date"
              date={new Date(this.state.chosenDateFrom)}
              onDateChange={date => {
                // `date` = "Thu Oct 04 2018 17:00:00 GMT+0900 (JST)"

                // "Thu Oct 04 2018 17:00:00 GMT+0900 (JST)" ---> "2018/10/04 17:00:00"
                const dateString = date.toLocaleString("ja");

                this.setState({
                  tripDetail: {
                    ...this.state.tripDetail,
                    dateFrom: dateString.split(" ")[0] // "2018/10/04 17:00:00" ---> "2018/10/04"
                  },
                  chosenDateFrom: dateString,
                  chosenDateTo: dateString // 帰国日の初期選択日付を出国日にセットする
                });
              }}
            />
          );
        // Androidだったら、
        case "android":
          return (
            <DatePicker
              mode="date"
              date={new Date(this.state.chosenDateFrom)}
              format="YYYY-MM-DD"
              confirmBtnText="OK"
              cancelBtnText="キャンセル"
              onDateChange={date => {
                // `date` = "2018-10-04 17:00"

                // "2018-10-04 17:00" ---> "2018-10-04 17:00:00"
                let dateString = `${date}:00`;

                // "2018-10-04 17:00:00" ---> "2018/10/04 17:00:00"
                dateString = dateString.replace(/-/g, "/");

                this.setState({
                  tripDetail: {
                    ...this.state.tripDetail,
                    dateFrom: dateString.split(" ")[0] // "2018/10/04 17:00:00" ---> "2018/10/04"
                  },
                  chosenDateFrom: dateString,
                  chosenDateTo: dateString // 帰国日の初期選択日付を出国日にセットする
                });
              }}
            />
          );
        // iOSでもAndroidでもなかったら、
        default:
          // 何も描画しない
          return <View />;
      }
    }
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <Header
          statusBarProps={{ barStyle: "light-content" }} // ステータスバーの色
          backgroundColor="deepskyblue" // ヘッダーの色
          leftComponent={{
            // 左上のアイコン
            icon: "close",
            color: "white",
            onPress: () => {
              // `this.state`を`INITIAL_STATE`にリセット
              this.setState({
                ...INITIAL_STATE, // `INITIAL_STATE`の中身をここに展開
                tripDetail: {
                  ...INITIAL_STATE.tripDetail, // `INITIAL_STATE.tripDetail`の中身をここに展開
                  imageURIs: [
                    require("../assets/add_image_placeholder.png"),
                    require("../assets/add_image_placeholder.png"),
                    require("../assets/add_image_placeholder.png")
                  ]
                }
              });

              // HomeScreenに戻る
              this.props.navigation.navigate("home");
            }
          }}
          centerComponent={{ text: "Add", style: styles.headerStyle }} // ヘッダータイトル
        />

        <ScrollView style={{ flex: 1 }}>
          <ListItem
            title="Country: "
            subtitle={
              <View style={styles.listItemStyle}>
                <Text
                  style={{
                    fontSize: 18,
                    // 現在の選択肢`this.state`が`INITIAL_STATE`のままなら灰色、それ以外の選択肢なら黒色
                    color:
                      this.state.tripDetail.country ===
                      INITIAL_STATE.tripDetail.country
                        ? "gray"
                        : "black"
                  }}
                >
                  {this.state.tripDetail.country}
                </Text>
              </View>
            }
            // プルダウンメニューが開いてれば上矢印、閉じてれば下矢印
            rightIcon={{
              name:
                this.state.countryPickerVisible === true
                  ? "keyboard-arrow-up"
                  : "keyboard-arrow-down"
            }}
            // 項目欄ListItemを押されたら、
            onPress={() =>
              this.setState({
                countryPickerVisible: !this.state.countryPickerVisible, // 国選択のプルダウンメニューの開閉を切り替え
                dateFromPickerVisible: false, // 出国日選択のプルダウンメニューは閉じる
                dateToPickerVisible: false // 帰国日選択のプルダウンメニューは閉じる
              })
            }
          />

          {this.renderCountryPicker()}

          <ListItem
            title="Date: "
            subtitle={
              <View style={styles.listItemStyle}>
                <Text
                  style={{
                    fontSize: 18,
                    // 現在の選択肢`this.state`が`INITIAL_STATE`のままなら灰色、それ以外の選択肢なら黒色
                    color:
                      this.state.tripDetail.dateFrom ===
                      INITIAL_STATE.tripDetail.dateFrom
                        ? "gray"
                        : "black"
                  }}
                >
                  {this.state.tripDetail.dateFrom}
                </Text>
              </View>
            }
            // プルダウンメニューが開いてれば上矢印、閉じてれば下矢印
            rightIcon={{
              name: this.state.dateFromPickerVisible
                ? "keyboard-arrow-up"
                : "keyboard-arrow-down"
            }}
            // 項目欄ListItemを押されたら、
            onPress={() =>
              this.setState({
                countryPickerVisible: false, // 国選択のプルダウンメニューは閉じる
                dateFromPickerVisible: !this.state.dateFromPickerVisible, // 出国日選択のプルダウンメニューの開閉を切り替え
                dateToPickerVisible: false // 帰国日選択のプルダウンメニューは閉じる
              })
            }
          />

          {this.renderDateFromPicker()}
        </ScrollView>
      </View>
    );
  }
}

export default AddScreen;

const styles = StyleSheet.create({
  // ←追記部分
  headerStyle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold"
  }
});
