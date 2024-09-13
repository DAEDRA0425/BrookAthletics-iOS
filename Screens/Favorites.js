import { StyleSheet, Text, View, SafeAreaView } from "react-native";
import React, { useState, useEffect, useContext } from "react";
import { TouchableOpacity, ActivityIndicator } from "react-native";
import {
  getAuth,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  currentUser,
} from "firebase/auth";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { MaterialIcons } from "@expo/vector-icons";
export function Favorites() {
  const [loading, setLoading] = useState(false);
  const register = () => {
    if (email == "") {
      {
        alert("Please enter an email.");
        return;
      }
    } else if (name == "") {
      alert("Please enter your name.");
      return;
    } else if (password == "") {
      alert("Please enter your password.");
      return;
    } else if (confirmPassword == "") {
      setConfirmPasswordError("Please confirm your password.");
      return;
    } else if (password != confirmPassword) {
      setConfirmPasswordError("Passwords does not match.");
      return;
    }

    setLoading(true);
    createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        console.log("The user account is created.");
        alert("The user account is created.");
        const id = await getUserId();
        props.navigation.navigate("Login");
        setLoading(false);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        if (errorCode == "auth/email-already-in-use") {
          {
            alert("Email is already being used.");
          }
        } else if (errorCode == "auth/invalid-email") {
          alert("Email format is not correct.");
        } else if (errorCode == "auth/weak-password") {
          alert("Password is too weak.");
        }
        setLoading(false);
      });
  };
  const iconSize = 30;
  return (
    <SafeAreaView>
      <View style={{ margin: wp("10%") }}>
        <Text style={{ marginBottom: hp("2%"), fontSize: 20 }}>
          Choose your favorite sports
        </Text>
        <View
          style={{
            backgroundColor: "white",
            borderRadius: "10px",
            padding: wp("2%"),
          }}
        >
          <View style={styles.sports}>
            <MaterialIcons name="sports-hockey" size={iconSize} color="black" />
            <Text style={styles.sporTitle}>Ice hockey</Text>
            <View style={{ flex: 1 }}></View>
            <BouncyCheckbox
              onPress={(isChecked) => {}}
              fillColor="green"
              unfillColor="#FFFFFF"
            />
          </View>
          <View style={styles.sports}>
            <MaterialIcons
              name="sports-basketball"
              size={iconSize}
              color="black"
            />
            <Text style={styles.sporTitle}>Basketball</Text>
            <View style={{ flex: 1 }}></View>
            <BouncyCheckbox
              onPress={(isChecked) => {}}
              fillColor="green"
              unfillColor="#FFFFFF"
            />
          </View>
          <View style={styles.sports}>
            <MaterialIcons
              name="sports-baseball"
              size={iconSize}
              color="black"
            />
            <Text style={styles.sporTitle}>Baseball</Text>
            <View style={{ flex: 1 }}></View>
            <BouncyCheckbox
              onPress={(isChecked) => {}}
              fillColor="green"
              unfillColor="#FFFFFF"
            />
          </View>
          <View style={styles.sports}>
            <MaterialIcons name="sports-tennis" size={iconSize} color="black" />
            <Text style={styles.sporTitle}>Tennis</Text>
            <View style={{ flex: 1 }}></View>
            <BouncyCheckbox
              onPress={(isChecked) => {}}
              fillColor="green"
              unfillColor="#FFFFFF"
            />
          </View>
          <View style={styles.sports}>
            <MaterialIcons
              name="sports-volleyball"
              size={iconSize}
              color="black"
            />
            <Text style={styles.sporTitle}>Volleyball</Text>
            <View style={{ flex: 1 }}></View>
            <BouncyCheckbox
              onPress={(isChecked) => {}}
              fillColor="green"
              unfillColor="#FFFFFF"
            />
          </View>
          <View style={styles.sports}>
            <MaterialIcons
              name="sports-football"
              size={iconSize}
              color="black"
            />
            <Text style={styles.sporTitle}>Football</Text>
            <View style={{ flex: 1 }}></View>
            <BouncyCheckbox
              onPress={(isChecked) => {}}
              fillColor="green"
              unfillColor="#FFFFFF"
            />
          </View>
          <View style={styles.sports}>
            <MaterialIcons name="sports-soccer" size={iconSize} color="black" />
            <Text style={styles.sporTitle}>Soccer</Text>
            <View style={{ flex: 1 }}></View>
            <BouncyCheckbox
              onPress={(isChecked) => {}}
              fillColor="green"
              unfillColor="#FFFFFF"
            />
          </View>
          <View style={styles.sports}>
            <MaterialIcons
              name="sports-cricket"
              size={iconSize}
              color="black"
            />
            <Text style={styles.sporTitle}>Cricket</Text>
            <View style={{ flex: 1 }}></View>
            <BouncyCheckbox
              onPress={(isChecked) => {}}
              fillColor="green"
              unfillColor="#FFFFFF"
            />
          </View>
        </View>
        <TouchableOpacity
          style={{
            backgroundColor: "green",
            //   backgroundColor: "#537FE7",

            marginTop: hp("3%"),
            padding: 15,
            borderRadius: 30,
          }}
          onPress={() => {
            register();
          }}
        >
          {loading ? (
            <ActivityIndicator color={"white"} />
          ) : (
            <Text
              style={{
                fontSize: 15,
                textAlign: "center",
                fontWeight: "bold",
                color: "white",
              }}
            >
              Done
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sports: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: hp("2%"),
    marginBottom: hp("3%"),
    margin: wp("2%"),
  },
  sporTitle: {
    fontSize: 20,
    fontWeight: "600",
  },
});
