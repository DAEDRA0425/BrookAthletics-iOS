import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  Button,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { MaterialIcons } from "@expo/vector-icons";
import {
  ExpandableCalendar,
  AgendaList,
  CalendarProvider,
  WeekCalendar,
} from "react-native-calendars";
import React, { useEffect, useState } from "react";
import {
  query,
  getDocs,
  collection,
  setDoc,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { MatchDetail } from "./MatchDetail";
import { Add } from "./Add";
import { createStackNavigator } from "@react-navigation/stack";
import { dateFormatter } from "../Utils/date";
import { getEvents } from "../Utils/firebase";
import { getAuth } from "firebase/auth";

function Schedule({ navigation }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [matchCount, setMatchCount] = useState();
  // change this to today
  const [selectedDate, setSelectedDate] = React.useState(
    dateFormatter(new Date())
  );
  const [isLoading, setIsloading] = React.useState(true);
  const [email, setEmail] = React.useState(true);
  const [matches, setMatches] = React.useState([{}]);
  const [filteredMatches, setFilteredMatches] = React.useState([{}]);
  const [filteredMatchesId, setFilteredMatchesId] = React.useState([{}]);
  const [markedDates, setMarkedDates] = React.useState({});

  // gets all matches
  async function getMatches(tempMarkedDates) {
    const q = query(collection(db, "Matches"));
    const querySnapshot = await getDocs(q);
    tempMatches = {};
    querySnapshot.forEach((doc) => {
      // updates all the matches
      let data = doc.data();
      tempMatches[doc.id] = data;
      if (tempMarkedDates[data.date]) {
        tempMarkedDates[data.date].selected = true;
        tempMarkedDates[data.date].selectedColor = "green";
      } else {
        tempMarkedDates[data.date] = { selected: true, selectedColor: "green" };
      }
    });
    // console.log("Matches: ", tempMatches);
    setMatches(tempMatches);
    // console.log("Marked Dates: ", tempMarkedDates);
  }

  async function getEvents(tempMarkedDates) {
    const q = query(collection(db, "Events"));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      // adds a dot color of red
      // tempMarkedDates[doc.id] = {
      //   marked: true,
      //   dotColor: "red",
      // };
      let data = doc.data();
      tempMarkedDates[data.date] = {
        marked: true,
        dotColor: "red",
      };
    });
    // console.log("Event Dates: ", tempMarkedDates);
  }

  async function setEventsAndMatches() {
    // Red marks are events and green marks are matches.
    let tempMarkedDates = {};
    await getEvents(tempMarkedDates);
    await getMatches(tempMarkedDates);
    setMarkedDates(tempMarkedDates);
  }

  function filterMatches() {
    // if (matches)
    // console.log("matches: ", matches);
    let filtered = {};
    for (const id in matches) {
      if (matches[id].date == selectedDate) {
        filtered[id] = matches[id];
      }
    }
    // console.log("Filtered: ", filtered);
    setFilteredMatches(filtered);
  }

  useEffect(() => {
    const init = async () => {
      const auth = getAuth();
      const email = auth.currentUser.email;
      const docRef = doc(db, "Users", email);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        // console.log("Document data:", docSnap.data());
        if (docSnap.data().isAdmin) {
          setIsAdmin(true);
        }
      }
    };
    init();
  }, []);

  useEffect(() => {
    const init = async () => {
      const auth = getAuth();
      setEmail(auth.currentUser.email);
      // console.log("Email: ", auth.currentUser.email);
    };
    init();
  }, []);

  useEffect(() => {
    const init = async () => {
      // await uploadMatch({
      //   date: "2024-03-02",
      //   hour: 12,
      //   score1: 3,
      //   title: "ice hockey",
      //   team1: "Cushing",
      //   team2: "team2",
      //   location: "Cushings",
      // });
      setEventsAndMatches();
    };
    init();
  }, []);
  useEffect(() => {
    const init = async () => {
      filterMatches();
    };
    init();
  }, [selectedDate]);

  React.useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <>
          {/* email === admin@admin.com */}
          {isAdmin && (
            <Button
              onPress={() => navigation.navigate("Add")}
              title="Add"
              color="green"
            ></Button>
          )}
        </>
      ),
    });
  }, [navigation, isAdmin]);

  return (
    <ScrollView>
      <View>
        <View style={{ marginBottom: isExpanded ? hp("4%") : hp("2%") }}>
          <Calendar
            navigation={navigation}
            isExpanded={isExpanded}
            setIsExpanded={setIsExpanded}
            markedDates={markedDates}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
          ></Calendar>
        </View>

        <View style={{ margin: 15 }}>
          <View style={{}}>
            {
              <Text
                style={{
                  marginBottom: hp("1%"),
                  fontSize: 16,
                  fontWeight: "600",
                }}
              >
                {Object.keys(filteredMatches).length} MATCH(ES)
              </Text>
            }
          </View>
          <View style={{ marginTop: hp("2%") }}>
            {/* map function goes here. */}
            {/* should filter dates here */}
            {Object.values(filteredMatches).map((match, index) => (
              <Pressable
                onPress={
                  () =>
                    navigation.navigate("MatchDetail", {
                      ...match,
                      // id
                      id: Object.keys(filteredMatches)[index],
                    })
                  // navigate('MatchDetail', match)
                }
                key={Object.keys(filteredMatches)[index]}
              >
                <Match
                  isHome={true}
                  // isLive={true}
                  date={match.date}
                  time={match.hour}
                  team1={match.team1}
                  team2={match.team2}
                  title={match.title}
                ></Match>
              </Pressable>
            ))}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

function Match({ isHome, time, team1, team2, title, date }) {
  function setIsLive(dateString, givenHour) {
    let date = new Date();
    currentDate = date.toISOString().split("T")[0];

    // Check if the dates are the same

    const isSameDate = dateString == currentDate;
    const isHourWithinLimit = new Date().getHours() == givenHour;
    return isSameDate && isHourWithinLimit;
  }
  let isLive = setIsLive(date, time);
  // console.log("isLive: ", isLive);
  return (
    <View
      style={{
        backgroundColor: "white",
        marginBottom: hp("3%"),
        borderRadius: 10,
      }}
    >
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          margin: 15,
          marginLeft: 15,
          alignItems: "center",
        }}
      >
        <View
          style={{
            backgroundColor: "grey",
            borderRadius: 10,
            padding: 5,
            paddingLeft: 10,
            paddingRight: 10,
          }}
        >
          <Text style={{ color: "white", fontWeight: "700" }}>
            {time + ":00"}
          </Text>
        </View>
        <Text
          style={{
            fontWeight: "600",
            marginLeft: wp("2%"),
            fontSize: 18,
            flex: 1,
          }}
        >
          {isHome ? "HOME" : "AWAY"}
        </Text>
        {isLive && (
          <MaterialIcons
            style={{ marginRight: 5 }}
            name="campaign"
            size={34}
            color="red"
          />
        )}
      </View>
      <Text
        style={{
          textAlign: "center",
          fontWeight: "700",
          fontSize: 25,
          marginTop: 15,
          marginBottom: hp("2%"),
        }}
      >
        {title}
      </Text>
      <Text
        style={{
          textAlign: "center",
          fontSize: 18,
          color: "#505050",
        }}
      >
        {team1}
      </Text>
      <Text
        style={{
          textAlign: "center",
          fontSize: 18,
          color: "#505050",
          marginBottom: hp("0.25%"),
          marginTop: hp("0.25%"),
        }}
      >
        {" "}
        vs
      </Text>
      <Text
        style={{
          textAlign: "center",
          fontSize: 18,
          color: "#505050",
          marginBottom: hp("5%"),
        }}
      >
        {team2}
      </Text>
    </View>
  );
}

function Calendar({
  navigation,
  setIsExpanded,
  isExpanded,
  markedDates,
  setSelectedDate,
  selectedDate,
}) {
  return (
    <CalendarProvider date={selectedDate}>
      {/* <WeekCalendar firstDay={1} /> */}
      <ExpandableCalendar
        firstDay={1}
        onDayPress={(date) => {
          setSelectedDate(date.dateString);
          // if there is an event today
          if (
            markedDates[date.dateString] &&
            markedDates[date.dateString].dotColor &&
            !markedDates[date.dateString].selected
          ) {
            navigation.navigate("EventTab");
          }
        }}
        closeOnDayPress={false}
        initialPosition="open"
        markedDates={
          markedDates
        }
        onCalendarToggled={() => {
          setIsExpanded(!isExpanded);
        }}
      ></ExpandableCalendar>
    </CalendarProvider>
  );
}

const Stack = createStackNavigator();
export default function ScheduleTab() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Schedule"
        component={Schedule}
        options={{ headerTitleAlign: "center" }}
      />
      <Stack.Screen
        name="MatchDetail"
        component={MatchDetail}
        options={{
          title: " ",
          headerTitleAlign: "center",
          headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen
        name="Add"
        component={Add}
        options={{
          title: "Add",
          headerTitleAlign: "center",
          headerBackTitleVisible: false,
        }}
      />
    </Stack.Navigator>
  );
}
