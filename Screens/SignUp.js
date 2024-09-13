import React, { useState, useEffect, useContext, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  BackHandler,
  Alert,
} from "react-native";
// import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {
  getAuth,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  currentUser,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  addDoc,
  setDoc,
  doc,
} from "firebase/firestore";
import { db } from "../firebase";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { MaterialIcons } from "@expo/vector-icons";
import Checkbox from 'expo-checkbox';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import EULA from "../components/EULA";
const auth = getAuth();

export default function SignUp(props) {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [grade, setGrade] = useState("");
  const [signupError, setSignupError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isNext, setIsNext] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [isChecked, setChecked] = useState(false);
  const bottomSheetRef = useRef(null);

  // if user presses the back button, asks for exit
  useEffect(() => {
    const backAction = () => {
      {
        Alert.alert("Hold on!", "Are you sure you want to leave?", [
          {
            text: "Cancel",
            onPress: () => null,
            style: "cancel",
          },
          { text: "YES", onPress: () => BackHandler.exitApp() },
        ]);
      }
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);

  const getUserId = async function uploadBeforePromise() {
    return new Promise(function (resolve, reject) {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          resolve(user.uid);
        } else {
        }
      });
    });
  };

  const register = () => {
    if (email == "") {
      {
        alert("Please enter an email.");
        setSignupError(true);
        return;
      }
    } else if (name == "") {
      alert("Please enter your name.");
      setSignupError(true);
      return;
    } else if (password == "") {
      alert("Please enter your password.");
      setSignupError(true);
      return;
    } else if (confirmPassword == "") {
      alert("Please enter your password twice.");
      setConfirmPasswordError("Please confirm your password.");
      setSignupError(true);
      return;
    } else if (password != confirmPassword) {
      alert("Passwords does not match.");
      setConfirmPasswordError("Passwords does not match.");
      setSignupError(true);
      return;
    } else if (grade == "" || !Number.isInteger(Number(grade))) {
      alert("Please enter grade properly.");
      setConfirmPasswordError("Passwords does not match.");
      setSignupError(true);
      return;
    }
    else if (isChecked == false) {
      alert("Please agree to EULA agreement.");
      setSignupError(true);
      return;
    }

    setLoading(true);
    createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        console.log("The user account is created.");
        // console.log(auth.currentUser.email);
        // const email = auth.currentUser.email
        // const id = await getUserId();

        // Add a new document with a generated id.
        const userInfo = {
          // email works as an id
          email: email,
          name: name,
          grade: grade,
          points: 0,
        };
        await setDoc(doc(db, "Users", email), userInfo);
        // console.log("Document written with ID: ", docRef.id);

        setLoading(false);
        setIsNext(true);
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
        } else {
          // setErrorMessage(errorCode)
          alert(errorCode);
        }
        setLoading(false);
      });
  };
  const iconSize = 30;
  async function uploadFavorites() {
    console.log("Favorites: ", favorites);
    // const id = await getUserId();
    await setDoc(doc(db, "Favorites", email), favorites);
  }

  return !isNext ? (
    <View style={styles.container}>
      {/* <KeyboardAwareScrollView> */}
      <Text
        style={{
          fontSize: 40,
          fontWeight: "bold",
          marginLeft: 20,
          marginBottom: "5%",
          marginTop: "20%",
        }}
      >
        {"Sign Up"}
      </Text>
      <TextInput
        style={{
          backgroundColor: "#EEEEEE",
          padding: 15,
          fontSize: 15,
          // marginTop: 50,
          borderRadius: 15,
          marginHorizontal: 20,
        }}
        autoCapitalize={"none"}
        placeholder={"Email"}
        onChangeText={setEmail}
        onChange={() => {
          setEmailError("");
        }}
      ></TextInput>
      <TextInput
        style={{
          backgroundColor: "#EEEEEE",
          padding: 15,
          fontSize: 15,
          borderRadius: 15,
          marginTop: 20,
          marginHorizontal: 20,
        }}
        autoCapitalize={"none"}
        placeholder={"Name"}
        onChangeText={setName}
        onChange={() => {
          setNameError("");
        }}
      ></TextInput>
      <TextInput
        style={{
          backgroundColor: "#EEEEEE",
          padding: 15,
          fontSize: 15,
          borderRadius: 15,
          marginTop: 20,
          marginHorizontal: 20,
        }}
        autoCapitalize={"none"}
        placeholder={"Grade"}
        onChangeText={setGrade}
        onChange={() => { }}
      ></TextInput>
      <TextInput
        style={{
          backgroundColor: "#EEEEEE",
          padding: 15,
          fontSize: 15,
          marginTop: 20,
          borderRadius: 15,
          marginHorizontal: 20,
        }}
        autoCapitalize={"none"}
        onChange={() => {
          setPasswordError("");
        }}
        secureTextEntry={true}
        placeholder={"Password"}
        onChangeText={setPassword}
      ></TextInput>
      <TextInput
        style={{
          backgroundColor: "#EEEEEE",
          padding: 15,
          fontSize: 15,
          marginTop: 20,
          borderRadius: 15,
          marginHorizontal: 20,
        }}
        autoCapitalize={"none"}
        onChange={() => {
          setConfirmPasswordError("");
        }}
        secureTextEntry={true}
        placeholder={"Confirm Password"}
        onChangeText={setConfirmPassword}
      ></TextInput>

      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 'auto',
        marginRight: 'auto'
      }}>
        <Checkbox
          style={{
            margin: 8
          }}
          value={isChecked}
          onValueChange={setChecked}
          color={isChecked ? '#4630EB' : undefined}
        />
        <Text style={{ fontSize: hp(1.5) }}>Accept <Text style={{ textDecorationLine: 'underline' }} onPress={() => { bottomSheetRef.current.snapToIndex(2) }}>EULA</Text> Agreement (required)</Text>
      </View>
      <TouchableOpacity
        style={{
          backgroundColor: "green",
          //   backgroundColor: "#537FE7",
          marginLeft: 20,
          marginRight: 20,
          marginTop: 20,
          padding: 15,
          borderRadius: 15,
        }}
        onPress={() => {
          register();
        }}
      // onPress={() => {
      //   //   props.navigation.navigate("Favorites");
      //   setIsNext(!isNext);
      // }}
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
            Next
          </Text>
        )}
      </TouchableOpacity>
      <Text
        style={{
          textAlign: "center",
          marginTop: "3%",
        }}
      >
        {"Already have an account?"}

        <Text
          style={{ fontWeight: "bold" }}
          onPress={() => {
            props.navigation.navigate("Login");
          }}
        >
          {" "}
          {"Login"}
        </Text>
      </Text>
      {/* </KeyboardAwareScrollView> */}
      <BottomSheet
          ref={bottomSheetRef}
          snapPoints={[1, 300, hp(65)]}
          index={0}
      >
          <EULA />   
      </BottomSheet>
    </View>
  ) : (
    <SafeAreaView>
      <View style={{ margin: wp("10%") }}>
        <Text style={{ marginBottom: hp("2%"), fontSize: 20 }}>
          Choose your favorite sports
        </Text>
        <View
          style={{
            backgroundColor: "white",
            borderRadius: 10,
            padding: wp("2%"),
          }}
        >
          <View style={styles.sports}>
            <MaterialIcons name="sports-hockey" size={iconSize} color="black" />
            <Text style={styles.sporTitle}>Ice hockey</Text>
            <View style={{ flex: 1 }}></View>
            <BouncyCheckbox
              onPress={(isChecked) => {
                setFavorites({ ...favorites, iceHockey: isChecked });
              }}
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
              onPress={(isChecked) => {
                setFavorites({ ...favorites, basketball: isChecked });
              }}
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
              onPress={(isChecked) => {
                setFavorites({ ...favorites, baseball: isChecked });
              }}
              fillColor="green"
              unfillColor="#FFFFFF"
            />
          </View>
          <View style={styles.sports}>
            <MaterialIcons name="sports-tennis" size={iconSize} color="black" />
            <Text style={styles.sporTitle}>Tennis</Text>
            <View style={{ flex: 1 }}></View>
            <BouncyCheckbox
              onPress={(isChecked) => {
                setFavorites({ ...favorites, tennis: isChecked });
              }}
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
              onPress={(isChecked) => {
                setFavorites({ ...favorites, volleyball: isChecked });
              }}
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
              onPress={(isChecked) => {
                setFavorites({ ...favorites, football: isChecked });
              }}
              fillColor="green"
              unfillColor="#FFFFFF"
            />
          </View>
          <View style={styles.sports}>
            <MaterialIcons name="sports-soccer" size={iconSize} color="black" />
            <Text style={styles.sporTitle}>Soccer</Text>
            <View style={{ flex: 1 }}></View>
            <BouncyCheckbox
              onPress={(isChecked) => {
                setFavorites({ ...favorites, soccer: isChecked });
              }}
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
              onPress={(isChecked) => {
                setFavorites({ ...favorites, cricket: isChecked });
              }}
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
            // upload favorites here
            uploadFavorites();
            props.navigation.navigate("Login");
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
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "white",
  },
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
