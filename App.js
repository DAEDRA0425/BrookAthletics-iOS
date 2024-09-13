import "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, SafeAreaView, ScrollView } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Schedule } from "./Screens/Schedule";
import { Events } from "./Screens/Events";
import { Gallery } from "./Screens/Gallery";
import { Profile } from "./Screens/Profile";
import { Plus } from "./Screens/Plus";
import { Feather } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import ScheduleTab from "./Screens/Schedule";
import EventTab from "./Screens/Events";
import { Colors } from "react-native/Libraries/NewAppScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SignUp from "./Screens/SignUp";
import SignIn from "./Screens/SignIn";
import { Favorites } from "./Screens/Favorites";
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
function MyTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: "green",
      }}
    >
      <Tab.Screen
        name="ScheduleTab"
        component={ScheduleTab}
        options={{
          headerTitleAlign: "center",
          headerShown: false,
          tabBarShowLabel: false,
          tabBarIcon: ({ color, size }) => (
            <Feather name="calendar" size={28} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="EventTab"
        component={EventTab}
        options={{
          headerTitleAlign: "center",
          tabBarShowLabel: false,
          headerShown: false,
          headerTitle: "",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="alarm-on" size={32} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Plus"
        component={Plus}
        options={{
          title: "Upload",
          headerTitleAlign: "center",
          tabBarShowLabel: false,
          tabBarIcon: ({ color, size }) => (
            <Feather name="plus-circle" size={36} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Gallery"
        component={Gallery}
        options={{
          headerTitleAlign: "center",
          tabBarShowLabel: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="image-outline" size={30} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          title: " ",
          tabBarShowLabel: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-circle-outline" size={30} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView>
    <NavigationContainer>
      {/* <Stack.Navigator initialRouteName="MyTabs"> */}
      <Stack.Navigator initialRouteName="Login">
        {/* <MyTabs /> */}
        <Stack.Screen
          name="MyTabs"
          component={MyTabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Login"
          component={SignIn}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SignUp"
          component={SignUp}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Favorites"
          component={Favorites}
          options={{ title: " ", headerShown: true }}
          // options={{

          //   headerTitleAlign: "center",
          //   headerBackTitleVisible: false,
          // }}
        />
      </Stack.Navigator>
    </NavigationContainer>
    </GestureHandlerRootView>
  );
}
