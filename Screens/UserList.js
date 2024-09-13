import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { doc, updateDoc } from "firebase/firestore";

export function UserList() {
  const [point, setPoint] = useState(0);
  const [users, setUsers] = useState([]);
  const [email, setEmail] = useState("");
  const [points, setPoints] = useState("");

  async function getUsers() {
    const querySnapshot = await getDocs(collection(db, "Users"));
    let tempuser = [];
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      // console.log(doc.id, " => ", doc.data());
      tempuser.push(doc.data());
    });
    setUsers(tempuser);
    console.log("users: ", tempuser);
  }
  async function givePoints() {
    // use emails
    const docRef = doc(db, "Users", email);

    // update firebase db
    await updateDoc(docRef, {
      points: points,
    });

    // const myNextList = [...myList];
    // const artwork = myNextList.find(
    //   a => a.id === artworkId
    // );
    // artwork.seen = nextSeen;
    // setMyList(myNextList);

    const myUsers = [...users];
    const user = users.find((e) => e.email == email);
    user.points = points;
    setUsers(myUsers);
  }

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <ScrollView style={{ padding: wp("3%") }}>
      <View
        style={{
          backgroundColor: "white",
          padding: wp("3%"),
          marginBottom: hp("3%"),
        }}
      >
        <Text style={{ fontSize: 20, marginBottom: hp("2%"), fontWeight: 600 }}>
          Users
        </Text>
        <View style={{ display: "flex", flexDirection: "row" }}>
          <Text style={{ fontSize: 18, marginBottom: hp("1%") }}> Email: </Text>
          <Text style={{ fontSize: 18, marginBottom: hp("1%") }}>
            {" "}
            {email}{" "}
          </Text>
        </View>
        <View style={{ display: "flex", flexDirection: "row" }}>
          <Text style={{ fontSize: 18, marginBottom: hp("1%") }}>
            {" "}
            Points:{" "}
          </Text>
          <Text style={{ fontSize: 18, marginBottom: hp("1%") }}>
            {" "}
            {points}{" "}
          </Text>
        </View>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            flexDirection: "row",
            display: "flex",
            alignItems: "center",
            marginTop: hp("2%"),
            gap: wp("4%"),
          }}
        >
          <Pressable
            onPress={() => setPoints(Number(points) - 3)}
            style={{
              backgroundColor: "green",
              padding: wp("3%"),
              borderRadius: 10,
            }}
          >
            <Text style={{ textAlign: "center", color: "white", fontSize: 20 }}>
              - 3
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setPoints(Number(points) - 1)}
            style={{
              backgroundColor: "green",
              padding: wp("3%"),
              borderRadius: 10,
            }}
          >
            <Text style={{ textAlign: "center", color: "white", fontSize: 20 }}>
              - 1
            </Text>
          </Pressable>
          <View>
            {/* <Text style={{ fontSize: 20 }}>{point}</Text> */}
            <TextInput
              style={styles.input}
              onChangeText={(e) => setPoints(Number(e))}
              value={points && points.toString()}
            />
          </View>
          <Pressable
            onPress={() => setPoints(Number(points) + 1)}
            style={{
              backgroundColor: "green",
              padding: wp("3%"),
              borderRadius: 10,
            }}
          >
            <Text style={{ textAlign: "center", color: "white", fontSize: 20 }}>
              + 1
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setPoints(Number(points) + 3)}
            style={{
              backgroundColor: "green",
              padding: wp("3%"),
              borderRadius: 10,
            }}
          >
            <Text style={{ textAlign: "center", color: "white", fontSize: 20 }}>
              + 3
            </Text>
          </Pressable>
        </View>
        <Pressable
          style={{
            backgroundColor: "green",
            padding: wp("3%"),
            borderRadius: 10,
            marginTop: hp("3%"),
            alignSelf: "center",
          }}
          onPress={() => givePoints()}
        >
          <Text style={{ color: "white", fontSize: 18 }}>Update</Text>
        </Pressable>
        {/* <Button title="+3"></Button> */}
      </View>
      <View>
        <View>
          {users &&
            users.map((e, i) => (
              <Pressable
                onPress={() => {
                  setPoints(e.points);
                  setEmail(e.email);
                }}
              >
                <View
                  style={{
                    backgroundColor: "white",
                    padding: wp("3%"),
                    marginBottom: hp("1%"),
                    display: "flex",
                    flexDirection: "column",
                  }}
                  key={i}
                  // style={{}}
                >
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      marginBottom: hp("1%"),
                      alignItems: "center",
                      gap: wp("1%"),
                    }}
                  >
                    <Text style={{ fontSize: 16 }}>Email:</Text>
                    <Text style={{ fontSize: 14 }}>{e.email}</Text>
                  </View>

                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      gap: wp("1%"),
                    }}
                  >
                    <Text style={{ fontSize: 16 }}>Points:</Text>
                    <Text style={{ fontSize: 14 }}>{e.points}</Text>
                  </View>
                </View>
              </Pressable>
            ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    // borderWidth: 1,
    padding: 10,
  },
});
