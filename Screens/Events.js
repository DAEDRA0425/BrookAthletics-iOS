import { StyleSheet, Text, View, Pressable, ScrollView } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import React, {useCallback, useEffect, useState} from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { UserList } from "./UserList";
import {
  collection,
  getDocs,
  query,
  orderBy,
  getDoc,
  doc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../firebase";
import {useFocusEffect} from "@react-navigation/native";

export function Events({ navigation }) {
  const [events, setEvents] = useState();
  const [isAdmin, setIsAdmin] = useState(false);
  const [prevEvents, setPrevEvents] = useState([{}]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);

  function stringToTimestamp(dateString) {
    const [year, month, day] = dateString.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    return date.getTime();
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

  async function getEvents() {
    const q = query(collection(db, "Events"), orderBy("date", "desc"));
    const querySnapshot = await getDocs(q);
    let tempEvents = [];
    let tempPrev = [];
    let tempUpcoming = [];
    const now = new Date().getTime()
    querySnapshot.forEach((doc) => {
      // if a given event's timestamp is larger than current
      if (stringToTimestamp(doc.data().date) > now) {
        tempUpcoming.push(doc.data());
      } else {
        tempPrev.push(doc.data());
      }
      //tempEvents.push(doc.data());
    });
    setPrevEvents(tempPrev);
    tempUpcoming.sort((a, b) => {
      return new Date(a.date) - new Date(b.date)
    })
    setUpcomingEvents(tempUpcoming.slice(0, 3));
    setEvents(tempEvents);
    console.log("upcoming: ", tempUpcoming);
    console.log("prev: ", tempPrev);
    // console.log("events: ", tempEvents);
  }

  useFocusEffect(
      useCallback(() => {
        getEvents();
      }, [])
  );

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <View style={{ marginLeft: wp("5%") }}>
          <Text style={{ fontWeight: 700, fontSize: 24 }}>Events</Text>
        </View>
      ),
      headerRight: () =>
        isAdmin && (
          <View style={{ marginRight: wp("5%") }}>
            <Pressable onPress={() => navigation.navigate("UserList")}>
              <Text style={{ color: "green", fontSize: 16 }}>Give Points</Text>
            </Pressable>
          </View>
        ),
    });
  }, [navigation, isAdmin]);

  return (
    <>
      <ScrollView>
        {/* <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}> */}
        <View style={{ margin: 20 }}>
          <Text
            style={{
              fontWeight: "400",
              marginBottom: 15,
            }}
          >
            UPCOMING EVENTS
          </Text>
          {
            upcomingEvents.length !== 0 ? upcomingEvents.map((it) =>
              (<View
                  id={`${it.date}-${it.description}`}
                  style={{
                    backgroundColor: "white",
                    // height: hp("20%"),
                    marginBottom: hp("2%"),
                    borderRadius: 10,
                    padding: wp("3%"),
                  }}
              >
                <Text
                    style={{
                      textAlign: "center",
                      fontWeight: "600",
                      fontSize: 18,
                      marginTop: 15,
                    }}
                >
                  {it.description}
                </Text>
                <View style={[styles.flex, {marginTop: hp(2)}]}>
                  <Text style={{fontSize: 17}}>Sports: </Text>
                  <Text style={{color: appGrey, fontSize: 15}}>
                    {it.sports}
                  </Text>
                </View>
                <View style={[styles.flex, {marginTop: hp(1)}]}>
                  <Text style={{fontSize: 17}}>Points: </Text>
                  <Text style={{color: appGrey, fontSize: 15}}>
                    {it.points}
                  </Text>
                </View>
                <View style={[styles.flex, {marginTop: hp(1)}]}>
                  <Text style={{fontSize: 17}}>Date: </Text>
                  <Text style={{color: appGrey, fontSize: 15}}>
                    {it.date}
                  </Text>
                </View>
              </View>)
            ) : (
                <View
                    style={{
                      backgroundColor: "white",
                      // height: hp("20%"),
                      marginBottom: hp("2%"),
                      borderRadius: 10,
                      padding: wp("3%"),
                    }}
                >
                  <Text>
                    No Upcoming Events
                  </Text>
                </View>
            )
          }
          <Text
            style={{
              fontWeight: "400",
              marginBottom: 15,
            }}
          >
            PREVIOUS EVENTS
          </Text>
          {/* <ScrollView> */}
          <View
            style={{
              backgroundColor: "white",
              minHeight: hp("50%"),
              marginBottom: hp("2%"),
              borderRadius: 10,
            }}
          >
            {prevEvents &&
              prevEvents.map((e, i) => (
                <View key={i} style={{ margin: wp("3%") }}>
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 15,
                        color: appGrey,
                        marginRight: wp("2%"),
                        minWidth: wp("20%"),
                      }}
                    >
                      {e.date}
                    </Text>
                    <Text style={{ fontSize: 18, fontWeight: "500" }}>
                      {e.sports}
                    </Text>
                    <View style={{ flex: 1 }}></View>
                    <Text style={{ fontSize: 17 }}>{e.points} points</Text>
                  </View>
                </View>
              ))}
          </View>
          {/* </ScrollView> */}
        </View>
      </ScrollView>
    </>
  );
}

const Stack = createStackNavigator();
export default function EventTab() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Events"
        component={Events}
        options={{ headerTitleAlign: "center", title: "" }}
      />
      <Stack.Screen
        name="UserList"
        component={UserList}
        options={{
          title: " ",
          headerTitleAlign: "center",
          headerBackTitleVisible: false,
        }}
      />
    </Stack.Navigator>
  );
}
const appGrey = "#545454";
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
