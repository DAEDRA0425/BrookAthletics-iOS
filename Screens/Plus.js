import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  StatusBar,
  Pressable,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Button as RNButton,
} from "react-native";
import {
  FontAwesome,
  MaterialCommunityIcons,
  AntDesign,
} from "@expo/vector-icons";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { CameraView, useCameraPermissions } from "expo-camera";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
  addDoc,
  setDoc,
  doc,
  getDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";
import {
  Container,
  RecordButton,
  Header,
  Row,
  Description,
  Button,
} from "./styles";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "../firebase";
import * as Crypto from 'expo-crypto';

import { dateFormatter } from "../Utils/date";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCC9JJvwyN5qpUtHCtIgUgOBGoaGRmSTzg",
  authDomain: "sports-f17a6.firebaseapp.com",
  projectId: "sports-f17a6",
  storageBucket: "sports-f17a6.appspot.com",
  messagingSenderId: "596605125231",
  appId: "1:596605125231:web:fe8470bd50fcaa7927439a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export function Plus() {
  // const [hasPermission, setHasPermission] = React.useState();
  // (useState < boolean) | (null > null);
  // const [type, setType] = React.useState();
  // useState(Camera.Constants.Type.back);
  const [type, setType] = useState("back");
  const [photoReady, setPhotoReady] = useState(true);
  const [uploadReady, setUploadReady] = useState(false);
  const [photo, setPhoto] = useState();
  const [caption, setCaption] = useState("");
  const [id, setId] = useState("");
  const [permission, requestPermission] = useCameraPermissions();

  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const auth = getAuth();

  useEffect(() => {
    // async function permission() {
    //   const { status } = await Camera.requestPermissionsAsync();
    //   setHasPermission(status === "granted");
    //   StatusBar.setHidden(true);
    // }
    // permission();
    requestPermission();
  }, []);

  if (!permission) {
    // Camera permissions are still loading
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center" }}>
          We need your permission to shoçw the camera
        </Text>
        {/* <Button onPress={requestPermission}>
          <Text style={{ textAlign: "center" }}>Grant Permission</Text>
        </Button> */}
        <RNButton
          title="Grant Permission"
          onPress={requestPermission}
        ></RNButton>
      </View>
    );
  }
  function toggleCameraType() {
    setType((current) =>
      current === 'back' ? 'front' : 'back'
    );
  }

  function takePicture() {
    if (this.camera) {
      this.camera.takePictureAsync({ onPictureSaved: this.onPictureSaved, quality: 0.1 });
    }
  }
  onPictureSaved = (photo) => {
    console.log(photo);
    setPhoto(photo.uri);
    setPhotoReady(!photoReady);
  };
  const getUserId = async function uploadBeforePromise() {
    return new Promise(function (resolve, reject) {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          resolve(user.uid);
          setId(user.uid);
        } else {
        }
      });
    });
  };

  const uploadImageAsync = async() => {
  
    const UUID = Crypto.randomUUID();
    const fileRef = ref(getStorage(), UUID);
    const img = await fetch(photo);
    const bytes = await img.blob();
    const result = await uploadBytes(fileRef, bytes);
    var downloadUrl = await getDownloadURL(fileRef); 
    let email = auth.currentUser.email;

    let name;
    const docRef = doc(db, "Users", email);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      // console.log("Document data:", docSnap.data());
      name = docSnap.data().name;
    } else {
      console.log("No such document!");
    }
    console.log("getting id");
    const id = await getUserId();
    console.log("ID: ", id);
    const docRef2 = addDoc(collection(db, "Gallery"), {
      caption: caption,
      likedUsers: [],
      likes: 0,
      uri: downloadUrl,
      userId: id,
      userName: name,
      date: dateFormatter(new Date()),
      timestamp: new Date(),
      email: email
    });
    

    navigation.navigate("Gallery");
  }

  //   async function uploadPhoto() {
  //     // firebase functions for upload
  //     // Create a root reference
  //     const storage = getStorage();

  //     // Create a reference to 'mountains.jpg'
  //     const mountainsRef = ref(storage, photo);

  //     // Create a reference to 'images/mountains.jpg'
  //     const imageRef = ref(storage, "images/" + photo);

  //     // While the file names are the same, the references point to different files
  //     // mountainsRef.name === mountainImagesRef.name; // true
  //     // mountainsRef.fullPath === mountainImagesRef.fullPath; // false
  //     // navigation.navigate("Gallery");

  // // 'file' comes from the Blob or File API
  // uploadBytes(imageRef, file).then((snapshot) => {
  //   console.log('Uploaded a blob or file!');
  // });
  //   }

  return photoReady ? (
    <>
      {isFocused && (
        <CameraView
          style={{ flex: 1 }}
          facing={type}
          ref={(ref) => {
            this.camera = ref;
          }}
        >
          <Container>
            <Header>
              <Button
                onPress={() => {
                  StatusBar.setHidden(false);
                  navigation.goBack();
                }}
              >
                <AntDesign name="close" size={28} color="#fff" />
              </Button>
              {/* flips camera */}
              <Button onPress={toggleCameraType}>
                <MaterialCommunityIcons
                  name="rotate-right"
                  size={28}
                  color="#fff"
                />
              </Button>
            </Header>
            {/* <TouchableOpacity
            onPress={() => {
              takePicture();
            }}
          >
            <RecordButton />
          </TouchableOpacity> */}
            <RecordButton
              onPress={() => {
                takePicture();
              }}
            ></RecordButton>
          </Container>
        </CameraView>
      )}
      {/* <Text>Write a caption</Text> */}
    </>
  ) : (
    <ScrollView>
      <Image
        style={{
          width: wp("100%"),
          height: uploadReady ? hp("40%") : hp("80%"),
        }}
        source={{ uri: photo }}
      ></Image>
      {!uploadReady && (
        <View
          style={[
            styles.flex,
            {
              marginTop: hp("3%"),
              justifyContent: "space-around",
              marginBottom: hp("3%"),
            },
          ]}
        >
          <Pressable
            style={styles.bottomButtons}
            onPress={() => {
              setPhotoReady(!photoReady);
            }}
          >
            <Text style={{ color: "white", fontWeight: 500 }}>Take again</Text>
          </Pressable>
          <Pressable
            style={styles.bottomButtons}
            onPress={() => {
              setUploadReady(!uploadReady);
            }}
          >
            <Text style={{ color: "white", fontWeight: 500 }}>
              Use this picture
            </Text>
          </Pressable>
        </View>
      )}
      {uploadReady && (
        <>
          <View style={{ margin: wp("10%") }}>
            <Text
              style={{ fontSize: 16, fontWeight: 500, marginBottom: hp("1%") }}
            >
              Write a comment
            </Text>
            <View style={{ backgroundColor: "white", borderRadius: 10 }}>
              <TextInput
                multiline={true}
                style={styles.input}
                onChangeText={setCaption}
                value={caption}
              />
            </View>
          </View>
          <View
            style={[
              styles.flex,
              {
                marginTop: hp("3%"),
                justifyContent: "space-around",
                marginBottom: hp("3%"),
              },
            ]}
          >
            <Pressable
              style={[
                styles.bottomButtons,
                {
                  backgroundColor: "white",
                  borderColor: "#92D72D",
                  borderStyle: "solid",
                  borderWidth: 1,
                },
              ]}
              onPress={() => {
                setPhotoReady(!photoReady);
                setUploadReady(!uploadReady);
              }}
            >
              <Text
                style={{
                  color: "#92D72D",
                  fontWeight: 500,
                  paddingLeft: wp("6%"),
                  paddingRight: wp("6%"),
                }}
              >
                Back
              </Text>
            </Pressable>
            <Pressable
              style={styles.bottomButtons}
              onPress={() => {
                uploadImageAsync();
                // uploadPhoto();
              }}
            >
              <Text
                style={{
                  color: "white",
                  fontWeight: 500,
                  paddingLeft: wp("6%"),
                  paddingRight: wp("6%"),
                }}
              >
                Upload
              </Text>
            </Pressable>
          </View>
        </>
      )}
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  bottomButtons: {
    padding: wp("4%"),
    paddingLeft: wp("5%"),
    paddingRight: wp("5%"),
    backgroundColor: "#92D72D",
    borderRadius: 25,
  },
  flex: {
    display: "flex",
    flexDirection: "row",
  },
  container: {
    flex: 1,
    justifyContent: "center",
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  input: {
    // height: hp("20%"),
    margin: 12,
    padding: 10,
  },
});
