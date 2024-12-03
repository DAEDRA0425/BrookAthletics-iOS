import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  TextInput,
  Button, Switch,
} from "react-native";
import React, { useEffect, useState } from "react";
import {
  query,
  getDocs,
  collection,
  setDoc,
  doc,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import {uploadMatch, uploadEvent, removeMatch, removeMatchFor} from "../Utils/firebase";
import {CommonActions} from "@react-navigation/native";

export function Add({route, navigation}) {
  const { params = {} } = route
  const { editType = null, editItem = null } = params

  const [matchInfo, setMatchInfo] = useState(editType === 'match' ? editItem : {});
  const [eventInfo, setEventInfo] = useState(editType === 'event' ? editItem : {});
  const [isHome, setHome] = useState(true)


  async function addMatch() {
    console.log("matchInfo: ", matchInfo);
    matchInfo.hour = Number(matchInfo.hour);
    matchInfo.minutes = Number(matchInfo.minutes)
    await uploadMatch(matchInfo);
    setMatchInfo({});
    alert("Match added!");
  }

  async function removeMatch() {
    await removeMatchFor(matchInfo.id)
    alert("Match removed!");
    navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: "Schedule"}]
        })
    )
  }

  async function addEvent() {
    console.log("EventInfo: ", eventInfo);
    eventInfo.points = Number(eventInfo.points);
    eventInfo.timestamp = serverTimestamp();
    await uploadEvent(eventInfo);
    setEventInfo({});
    alert("Event added!");
  }

  async function removeEvent() {
    await removeMatchFor(eventInfo.id)
    alert("Event removed!");
    navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: "Schedule"}]
        })
    )
  }

  return (
    <ScrollView style={{ padding: wp("3%") }}>
      { editType == null || editType === 'match' ?
        <View
          style={{
            backgroundColor: "white",
            padding: wp("3%"),
            marginBottom: hp("3%"),
          }}
        >
          <Text style={{ fontSize: 20, marginBottom: hp("2%"), fontWeight: 600 }}>
            Add Match
          </Text>
          <Text style={{ fontSize: 18, marginBottom: hp("1%") }}>Title</Text>
          <TextInput
            style={styles.input}
            placeholder="Type title"
            onChangeText={(title) => setMatchInfo({ ...matchInfo, title: title })}
            value={matchInfo.title}
          />
          <Text style={{ fontSize: 18, marginBottom: hp("1%") }}>Date</Text>
          <TextInput
            style={styles.input}
            placeholder="2024-03-10"
            onChangeText={(date) => setMatchInfo({ ...matchInfo, date: date })}
            value={matchInfo.date}
          />
          <Text style={{ fontSize: 18, marginBottom: hp("1%") }}>Time</Text>
          <TextInput
            style={styles.input}
            placeholder="Hours (12)"
            onChangeText={(time) => setMatchInfo({ ...matchInfo, hour: time })}
            value={matchInfo.hour}
          />
          <TextInput
              style={styles.input}
              placeholder="Minutes (30)"
              onChangeText={(time) => setMatchInfo({ ...matchInfo, minutes: time })}
              value={matchInfo.minutes}
          />
          <Text style={{ fontSize: 18, marginBottom: hp("1%") }}>Location</Text>
          <TextInput
            style={styles.input}
            placeholder="Type location"
            onChangeText={(location) =>
              setMatchInfo({ ...matchInfo, location: location })
            }
            value={matchInfo.location}
          />
          <Text style={{ fontSize: 18, marginBottom: hp("1%") }}>Team1</Text>
          <TextInput
            style={styles.input}
            placeholder="Type team1"
            onChangeText={(team1) => setMatchInfo({ ...matchInfo, team1: team1 })}
            value={matchInfo.team1}
          />
          <Text style={{ fontSize: 18, marginBottom: hp("1%") }}>Team2</Text>
          <TextInput
            style={styles.input}
            placeholder="Type team2"
            onChangeText={(team2) => setMatchInfo({ ...matchInfo, team2: team2 })}
            value={matchInfo.team2}
          />
          <Text>{isHome ? "HOME" : "AWAY"}</Text>
          <Switch
              style={{}}
              trackColor={{false: '#767577', true: '#81b0ff'}}
              thumbColor={isHome ? '#f5dd4b' : '#f4f3f4'}
              ios_backgroundColor="#3e3e3e"
              onValueChange={() => {
                setMatchInfo({...matchInfo, isHome: !isHome})
                setHome(!isHome)
              }}
              value={isHome}
          />

          <Pressable
            style={{
              backgroundColor: "green",
              marginTop: hp("1%"),
              marginBottom: hp("3%"),
            }}
          >
            <Button
              onPress={() => addMatch()}
              title={editType == null ? "Add match" : "Edit match"}
              color={"white"}
            ></Button>
          </Pressable>
          { editType != null &&
            <Pressable
                style={{
                  backgroundColor: "red",
                  marginTop: hp("1%"),
                  marginBottom: hp("3%"),
                }}
            >
              <Button
                  onPress={() => removeMatch()}
                  title={"Delete"}
                  color={"white"}
              ></Button>
            </Pressable>
          }
        </View> : <View/>
      }
      {
        editType == null || editType === 'event' ?
        <View style={{ backgroundColor: "white", padding: wp("3%") }}>
          <Text style={{ fontSize: 20, marginBottom: hp("2%"), fontWeight: 600 }}>
            Add Event
          </Text>

          <Text style={{ fontSize: 18, marginBottom: hp("1%") }}>
            Event description
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Type event description"
            onChangeText={(d) => setEventInfo({ ...eventInfo, description: d })}
            value={eventInfo.description}
          />
          <Text style={{ fontSize: 18, marginBottom: hp("1%") }}>Date</Text>
          <TextInput
            style={styles.input}
            placeholder="2024-03-10"
            onChangeText={(date) => setEventInfo({ ...eventInfo, date: date })}
            value={eventInfo.date}
          />
          <Text style={{ fontSize: 18, marginBottom: hp("1%") }}>
            Related Sports
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Related Sports"
            onChangeText={(sports) =>
              setEventInfo({ ...eventInfo, sports: sports })
            }
            value={eventInfo.sports}
          />
          <Text style={{ fontSize: 18, marginBottom: hp("1%") }}> Points</Text>
          <TextInput
            style={styles.input}
            placeholder="Number of points"
            onChangeText={(points) =>
              setEventInfo({ ...eventInfo, points: points })
            }
            value={eventInfo.points}
          />
          <Pressable
            style={{
              backgroundColor: "green",
              marginTop: hp("1%"),
              marginBottom: hp("3%"),
            }}
          >
            <Button
              onPress={() => addEvent()}
              title="Add event"
              color={"white"}
            ></Button>
          </Pressable>
          {
            editType != null &&
              <Pressable
                  style={{
                    backgroundColor: "red",
                    marginTop: hp("1%"),
                    marginBottom: hp("3%"),
                  }}
              >
                <Button
                    onPress={() => removeEvent()}
                    title={"Delete"}
                    color={"white"}
                ></Button>
              </Pressable>
          }
        </View>
            : <View/>
      }
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  input: {
    // height: 40,
    marginBottom: hp("1%"),
    borderWidth: 1,
    padding: 6,
  },
});
