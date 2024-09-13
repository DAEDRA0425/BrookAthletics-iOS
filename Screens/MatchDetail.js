import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Button,
  Pressable,
  SafeAreaView,
  TextInput,
} from "react-native";
import React, { useEffect, useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { SimpleLineIcons } from "@expo/vector-icons";
import { EvilIcons } from "@expo/vector-icons";
import {
  doc,
  getDoc,
  getDocs,
  updateDoc,
  setDoc,
  addDoc,
  collection,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import { getAuth } from "firebase/auth";
import { AutoFocus } from "expo-camera";
export function MatchDetail({
  navigation,
  route,
  title,
  team1,
  team2,
  date,
  location,
}) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLive, setisLive] = useState();
  const [liveState, setLiveState] = React.useState(
    calculateLiveState(route.params.date, route.params.hour)
  );
  const [matches, setMatches] = React.useState();
  const [uesrName, setUesrName] = React.useState();
  const [comment, setComment] = React.useState("");
  const [comments, setComments] = React.useState({});
  // const [score1, setScore1] = useState(route.params.score1);
  const [score1, setScore1] = useState(route.params.score1);
  const [score2, setScore2] = useState(route.params.score2);

  async function getMatches() {
    const docRef = doc(db, "Matches", "2024-01-11");
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
      setMatches(docSnap.data());
    } else {
      // docSnap.data() will be undefined in this case
      console.log("No such document!");
    }
  }

  async function getUsername() {
    const auth = getAuth();
    const docRef = doc(db, "Users", auth.currentUser.email);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
      setUesrName(docSnap.data().name);
    } else {
      console.log("No username document!");
    }
  }

  useEffect(() => {
    const init = async () => {
      const auth = getAuth();
      const email = auth.currentUser.email;
      const docRef = doc(db, "Users", email);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        console.log("Document data:", docSnap.data());
        if (docSnap.data().isAdmin) {
          setIsAdmin(true);
        }
      }
    };
    init();
  }, []);

  useEffect(() => {
    const init = async () => {
      await getUsername();
      console.log("Params: ", route.params);
    };
    init();
  }, []);

  async function getComments() {
    let id = route.params.id;
    // get all docs in comment and filter them by the id
    const q = query(collection(db, "Comments"), where("id", "==", id));

    const querySnapshot = await getDocs(q);
    let comments = {};
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      // console.log(doc.id, " => ", doc.data());
      comments[doc.id] = doc.data();
    });
    console.log("Comments: ", comments);
    setComments(comments);
  }
  async function addComment() {
    let id = route.params.id;
    console.log("adding comment!");
    // const docRef = await addDoc(collection(db, "Matches"), data);
    let data = {
      comment: comment,
      userId: uesrName,
      id: id,
    };
    const docRef = await addDoc(collection(db, "Comments"), data);
    // adds comment locally
    setComments({ ...comments, [docRef.id]: data });
    // resets the comment field
    setComment("");
  }
  async function updateScores() {
    console.log("ID: ", route.params.id);
    const docRef = doc(db, "Matches", route.params.id);

    await updateDoc(docRef, {
      score1: Number(score1),
      score2: Number(score2),
    });
    alert("Score updated!");
  }
  function calculateLiveState(dateString, givenHour) {
    let date = new Date();
    currentDate = date.toISOString().split("T")[0];
    matchDate = new Date(dateString).setHours(givenHour);

    // Check if the dates are the same
    const isSameDate = dateString == currentDate;
    const isHourWithinLimit = new Date().getHours() == givenHour;

    let today = new Date();
    if (isSameDate && isHourWithinLimit) {
      return "Live";
    } else if (today > matchDate) {
      return "FINISHED";
    } else if (today < matchDate) return "NOT STARTED";
  }
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          {liveState == "Live" ? (
            <MaterialIcons
              style={{ marginRight: wp("5%") }}
              name="campaign"
              size={34}
              color="red"
            />
          ) : (
            <View
              style={{
                backgroundColor: "grey",
                borderRadius: 10,
                padding: 5,
                paddingLeft: 10,
                paddingRight: 10,
                marginRight: wp("2%"),
              }}
            >
              <Text style={{ color: "white", fontWeight: "700" }}>
                {liveState}
              </Text>
            </View>
          )}
          {isAdmin && (
            <Pressable>
              <Button onPress={updateScores} title="Save" color="green" />
            </Pressable>
          )}
        </View>
      ),
    });
  }, [navigation, score1, score2, isAdmin]);

  useEffect(() => {
    const init = async () => {
      // await getMatches();
      console.log("Params: ", route.params);
      await getComments();
    };
    init();
  }, []);
  return (
    <SafeAreaView>
      <View style={{ backgroundColor: "white" }}>
        <View style={{ marginTop: hp("5%"), marginBottom: hp("2%") }}>
          <Text
            style={{ textAlign: "center", fontSize: 26, fontWeight: "700" }}
          >
            {route.params.title}
          </Text>
        </View>

        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            margin: wp("3%"),
            marginBottom: hp("0%"),
            alignItems: "center",
          }}
        >
          <View
            style={{
              backgroundColor: "green",
              padding: wp("2%"),
              paddingLeft: wp("2%"),
              paddingRight: wp("2%"),
              borderRadius: 10,
              flex: 0.45,
            }}
          >
            <Text
              style={{
                color: "white",
                textAlign: "center",
                fontSize: liveState == "Live" ? 16 : 20,
                fontWeight: "400",
              }}
            >
              {route.params.team1}
            </Text>
            {/* show this for isAdmin */}
            <View>
              {isAdmin ? (
                <TextInput
                  style={styles.scoreInput}
                  // onChangeText={setScore1}
                  onChangeText={(newValue) => {
                    setScore1(newValue);
                  }}
                  value={score1}
                  placeholder={route.params.score1.toString()}
                  // placeholder="Type score1"
                />
              ) : (
                <Text
                  style={{
                    marginTop: hp("1%"),
                    color: "white",
                    textAlign: "center",
                    fontSize: 36,
                    fontWeight: "600",
                  }}
                >
                  {route.params.score1}
                  {/* {score1} */}
                </Text>
              )}
            </View>
          </View>

          <Text
            style={{
              fontSize: 20,
              marginLeft: wp("4%"),
              marginRight: wp("4%"),
              color: "#505050",
            }}
          >
            {" "}
            vs{" "}
          </Text>

          <View
            style={{
              backgroundColor: "green",
              padding: wp("2%"),
              borderRadius: 10,
              flex: 0.45,
            }}
          >
            <Text
              style={{
                color: "white",
                textAlign: "center",
                fontSize: liveState == "Live" ? 16 : 20,
                fontWeight: "400",
              }}
            >
              {route.params.team2}
            </Text>
            <View>
              {isAdmin ? (
                <TextInput
                  style={styles.scoreInput}
                  onChangeText={setScore2}
                  value={score2}
                  placeholder={route.params.score2.toString()}
                  // placeholderTextColor={"ivory"}
                />
              ) : (
                score2 && (
                  <Text
                    style={{
                      marginTop: hp("1%"),
                      color: "white",
                      textAlign: "center",
                      fontSize: 36,
                      fontWeight: "600",
                    }}
                  >
                    {route.params.score2}
                  </Text>
                )
              )}
            </View>
          </View>
        </View>

        <View
          style={{
            display: "flex",
            flexDirection: "row",

            // margin: wp("10%"),
            margin: wp("8%"),
            alignItems: "center",
          }}
        >
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              flex: 0.5,
              alignItems: "center",
            }}
          >
            <MaterialCommunityIcons
              name="calendar-clock"
              size={30}
              color="grey"
            />
            <Text
              style={{ marginLeft: wp("2%"), color: "#505050", fontSize: 14 }}
            >
              {/* Nov 22 2023, 15:00 */}
              {route.params.date + ", " + route.params.hour + ":00"}
            </Text>
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              flex: 0.5,
              alignItems: "center",
            }}
          >
            <SimpleLineIcons name="location-pin" size={27} color="grey" />
            <Text
              style={{ marginLeft: wp("2%"), color: "#505050", fontSize: 14 }}
            >
              {route.params.location}
            </Text>
          </View>
        </View>
      </View>
      <ScrollView>
        {/* Comments */}

        <View style={{ margin: wp("10%") }}>
          {Object.values(comments).map((comment, i) => (
            <>
              <View
                key={comment.id}
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: wp("1%"),
                  marginBottom: hp("1%"),
                }}
              >
                <EvilIcons name="user" size={45} color="green" />
                <Text style={{ color: "#505050", marginRight: wp("1%") }}>
                  {/* {comments["16:00"].ids[0]} */}
                  {comment.userId}
                </Text>
                <Text style={{ fontSize: 16 }}>
                  {/* {comments["16:00"].comments[1]} */}
                  {comment.comment}
                </Text>
              </View>
            </>
          ))}
        </View>

        <View
          style={{
            backgroundColor: "white",
            margin: wp("10%"),
            marginTop: hp("0%"),
            marginBottom: hp("30%"),
            height: hp("5%"),
            borderRadius: 5,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <TextInput
            style={styles.input}
            onChangeText={setComment}
            value={comment}
            placeholder="Post a message..."
          />
          <Pressable onPress={() => addComment()}>
            <MaterialCommunityIcons
              style={{ marginRight: wp("2%") }}
              name="send"
              size={28}
              color="green"
            />
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scoreInput: {
    // border: None,
    // height: 40,
    // margin: 12,
    // marginLeft: wp("10%"),
    marginTop: hp("1%"),
    color: "white",
    fontWeight: "600",
    fontSize: 18,
    padding: wp("2%"),

    textAlign: "center",
  },
  input: {
    height: 40,
    margin: 12,
    width: wp("60%"),
    padding: wp("2%"),
  },
});
