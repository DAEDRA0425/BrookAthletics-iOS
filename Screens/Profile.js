import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  Alert,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import {
  getAuth,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  currentUser,
  deleteUser,
} from "firebase/auth";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { MaterialIcons } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { addDoc, setDoc, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export function Profile({ navigation }) {
  const [favorites, setFavorites] = React.useState({});
  const [userInfo, setUserInfo] = useState({});
  const [email, setEmail] = useState("");
  const iconSize = 30;
  const appGrey = "#545454";

  const getUserId = async function uploadBeforePromise() {
    const auth = getAuth();
    return new Promise(function (resolve, reject) {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          resolve(user.uid);
        } else {
        }
      });
    });
  };

  async function getFavorites(email) {
    const ids = await getUserId();
    // console.log("ID: ", id);
    // alert("ID: ", id);
    // const docRef = doc(db, "Favorites", ids);
    const docRef = doc(db, "Favorites", email);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setFavorites(docSnap.data());
      console.log("Favorites: ", docSnap.data());
    } else {
      console.log("No favorites document!");
    }
  }

  const deleteUserAccount = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
    console.log("User info: ", user);
    Alert.alert(
      "Delete Account",
      "Hold on!, Are you sure you want to delete your account?",
      [
        {
          text: "Cancel",
          onPress: () => null,
          style: "cancel",
        },
        {
          text: "YES",
          onPress: () =>
            deleteUser(user)
              .then(() => {
                navigation.reset({
                  index: 0,
                  routes: [{ name: "Login" }],
                });
                console.log("Successfully deleted user");
              })
              .catch((error) => {
                console.log("Error deleting user:", error);
              }),
        },
      ]
    );
  };

  useEffect(() => {
    const init = async () => {
      const auth = getAuth();
      setEmail(auth.currentUser.email);
      await getUserInfo(auth.currentUser.email);
      await getFavorites(auth.currentUser.email);
      console.log("Email: ", auth.currentUser.email);
    };
    init();
  }, []);

  // adds header
  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <View style={{ marginLeft: wp("5%") }}>
          <Text style={{ fontWeight: 700, fontSize: 24 }}>Profile</Text>
        </View>
      ),
      headerRight: () => (
        <View style={{ marginRight: wp("5%") }}>
          <Pressable onPress={async() => {
            await AsyncStorage.removeItem('email');
            await AsyncStorage.removeItem('password');
              navigation.navigate("Login")
          }}>
            <Text style={{ color: "green", fontSize: 16 }}>SIGNOUT</Text>
          </Pressable>
        </View>
      ),
    });
  }, [navigation]);

  async function getUserInfo(email) {
    // const docRef = doc(db, "Users", id);
    console.log("email from get users: ", email);
    const docRef = doc(db, "Users", email);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
      setUserInfo(docSnap.data());
    } else {
      console.log("No user info document!");
    }
  }
  return (
    <>
      <View style={{ margin: 20 }}>
        <Text
          style={{
            fontWeight: "400",
            marginBottom: 15,
            fontSize: 16,
          }}
        >
          USER INFO
        </Text>
        <View
          style={{
            backgroundColor: "white",
            marginBottom: hp("4%"),
            borderRadius: 10,
            padding: wp("5%"),
          }}
        >
          <View>
            <View
              style={[
                styles.flex,
                {
                  justifyContent: "center",
                  gap: wp("2%"),
                  marginBottom: hp("3%"),
                },
              ]}
            >
              <Text
                style={{ textAlign: "center", fontSize: 40, fontWeight: 600 }}
              >
                {userInfo.points}
              </Text>
              <Text style={{ fontSize: 18, fontWeight: 500, color: appGrey }}>
                points
              </Text>
            </View>

            <View style={[styles.flex, { marginBottom: hp("0.5%") }]}>
              <Text style={{ fontSize: 17 }}>Email: </Text>
              <Text style={{ color: appGrey, fontSize: 15 }}>
                {userInfo.email}
              </Text>
            </View>
            <View style={[styles.flex, { marginBottom: hp("0.5%") }]}>
              <Text style={{ fontSize: 17 }}>Name: </Text>
              <Text style={{ color: appGrey, fontSize: 15 }}>
                {userInfo.name}
              </Text>
            </View>
            <View style={[styles.flex, { marginBottom: hp("0.5%") }]}>
              <Text style={{ fontSize: 17 }}>Grade: </Text>
              <Text style={{ color: appGrey, fontSize: 15 }}>
                {userInfo.grade}
              </Text>
            </View>
          </View>
        </View>
        <Text
          style={{
            fontWeight: "400",
            marginBottom: 15,
            fontSize: 16,
          }}
        >
          MY FAVORITE SPORTS
        </Text>
        <ScrollView
          style={{
            backgroundColor: "white",
            height: hp("30%"),
            marginBottom: hp("4%"),
            borderRadius: 10,
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              borderRadius: 10,
              padding: wp("3%"),
            }}
          >
            <View style={styles.sports}>
              <MaterialIcons
                name="sports-hockey"
                size={iconSize}
                color="black"
              />
              <Text style={styles.sporTitle}>Ice hockey</Text>
              <View style={{ flex: 1 }}></View>
              {favorites.iceHockey ? (
                <AntDesign name="star" size={30} color="#F7E226" />
              ) : (
                <AntDesign name="staro" size={30} color="black" />
              )}
            </View>
            <View style={styles.sports}>
              <MaterialIcons
                name="sports-basketball"
                size={iconSize}
                color="black"
              />
              <Text style={styles.sporTitle}>Basketball</Text>
              <View style={{ flex: 1 }}></View>
              {favorites.basketball ? (
                <AntDesign name="star" size={30} color="#F7E226" />
              ) : (
                <AntDesign name="staro" size={30} color="black" />
              )}
            </View>
            <View style={styles.sports}>
              <MaterialIcons
                name="sports-baseball"
                size={iconSize}
                color="black"
              />
              <Text style={styles.sporTitle}>Baseball</Text>
              <View style={{ flex: 1 }}></View>
              {favorites.baseball ? (
                <AntDesign name="star" size={30} color="#F7E226" />
              ) : (
                <AntDesign name="staro" size={30} color="black" />
              )}
            </View>
            <View style={styles.sports}>
              <MaterialIcons
                name="sports-tennis"
                size={iconSize}
                color="black"
              />
              <Text style={styles.sporTitle}>Tennis</Text>
              <View style={{ flex: 1 }}></View>
              {favorites.tennis ? (
                <AntDesign name="star" size={30} color="#F7E226" />
              ) : (
                <AntDesign name="staro" size={30} color="black" />
              )}
            </View>
            <View style={styles.sports}>
              <MaterialIcons
                name="sports-volleyball"
                size={iconSize}
                color="black"
              />
              <Text style={styles.sporTitle}>Volleyball</Text>
              <View style={{ flex: 1 }}></View>
              {favorites.volleyball ? (
                <AntDesign name="star" size={30} color="#F7E226" />
              ) : (
                <AntDesign name="staro" size={30} color="black" />
              )}
            </View>
            <View style={styles.sports}>
              <MaterialIcons
                name="sports-football"
                size={iconSize}
                color="black"
              />
              <Text style={styles.sporTitle}>Football</Text>
              <View style={{ flex: 1 }}></View>
              {favorites.football ? (
                <AntDesign name="star" size={30} color="#F7E226" />
              ) : (
                <AntDesign name="staro" size={30} color="black" />
              )}
            </View>
            <View style={styles.sports}>
              <MaterialIcons
                name="sports-soccer"
                size={iconSize}
                color="black"
              />
              <Text style={styles.sporTitle}>Soccer</Text>
              <View style={{ flex: 1 }}></View>
              {favorites.soccer ? (
                <AntDesign name="star" size={30} color="#F7E226" />
              ) : (
                <AntDesign name="staro" size={30} color="black" />
              )}
            </View>
            <View style={styles.sports}>
              <MaterialIcons
                name="sports-cricket"
                size={iconSize}
                color="black"
              />
              <Text style={styles.sporTitle}>Cricket</Text>
              <View style={{ flex: 1 }}></View>
              {favorites.cricket ? (
                <AntDesign name="star" size={30} color="#F7E226" />
              ) : (
                <AntDesign name="staro" size={30} color="black" />
              )}
            </View>
          </View>
        </ScrollView>
        <View>
          <Pressable
            onPress={() => deleteUserAccount()}
            style={{
              backgroundColor: "red",
              padding: wp("2%"),
              paddingLeft: wp("4%"),
              paddingRight: wp("4%"),
              borderRadius: 20,
              alignSelf: "center",
            }}
          >
            <Text style={{ color: "white", fontWeight: 600, fontSize: 18 }}>
              Delete Account
            </Text>
          </Pressable>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  flex: { display: "flex", flexDirection: "row", alignItems: "center" },
  sports: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: hp("2%"),
    marginBottom: hp("1%"),
    margin: wp("2%"),
  },
  sporTitle: {
    fontSize: 20,
    fontWeight: "600",
  },
});
