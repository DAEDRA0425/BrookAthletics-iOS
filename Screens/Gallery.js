import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  Pressable,
  Alert,
  RefreshControl,
} from "react-native";
import React, { useState, useEffect } from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { AntDesign } from "@expo/vector-icons";
import { EvilIcons, Ionicons, MaterialIcons } from "@expo/vector-icons";
import {
  query,
  orderBy,
  doc,
  startAt,
  collection,
  updateDoc,
  arrayRemove,
  arrayUnion,
  getDocs,
  increment,
  addDoc,
  where,
  deleteDoc,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "../firebase";

export function Gallery() {
  const [posts, setPosts] = useState([]);
  const [id, setId] = useState();
  const [email, setEmail] = useState("");
  const [update, setUpdate] = useState(false);

  const [refreshing, setRefreshing] = React.useState(false);

  const getUserId = async function uploadBeforePromise() {
    const auth = getAuth();
    return new Promise(function (resolve, reject) {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          resolve(user.uid);
          setId(user.uid);
          setEmail(user.email);
        } else {
        }
      });
    });
  };
  async function getPosts() {
    setRefreshing(true);
    const blockedQuery = query(
      collection(db, "Block"),
      where("requestedBy", "==", email)
    );
    const blockedSnapshot = await getDocs(blockedQuery);
    var blockedUser = [];
    blockedSnapshot.forEach((doc) => {
      var data = doc.data();
      console.log("HEY", data);
      blockedUser.push(data["ownerEmail"]);
    });

    const flagQuery = query(
      collection(db, "Flags"),
      where("requestedBy", "==", email)
    );
    const flagSnapshot = await getDocs(flagQuery);
    var flaggedPosts = [];
    flagSnapshot.forEach((doc) => {
      var data = doc.data();
      flaggedPosts.push(data["postId"]);
    });

    const q = query(collection(db, "Gallery"), orderBy("timestamp", "desc"));
    // console.log("Posts: ", q);
    const querySnapshot = await getDocs(q);

    let tempPosts = [];
    querySnapshot.forEach((doc) => {
      // console.log(doc.id, " => ", doc.data());
      var data = doc.data();
      print("DATA: ", data);
      if (
        !blockedUser.includes(data["email"]) &&
        !flaggedPosts.includes(doc.id)
      ) {
        tempPosts.push({ ...doc.data(), docId: doc.id });
      }
    });
    console.log("Posts: ", tempPosts);
    setPosts(tempPosts);
    setRefreshing(false);
  }

  async function likePost(docId) {
    console.log("user", id, "is liking the post...");

    let newPost = [...posts];
    let postToUpdate = newPost.find((post) => post.docId === docId);
    if (postToUpdate) {
      postToUpdate.likes = postToUpdate.likes + 1;
      postToUpdate.likedUsers = [...postToUpdate.likedUsers, id];
    }
    console.log("New post", newPost);
    setPosts(newPost);

    const docRef = doc(db, "Gallery", docId);
    await updateDoc(docRef, postToUpdate);
  }

  async function removeLike(docId) {
    let newPost = [...posts];
    let postToUpdate = newPost.find((post) => post.docId === docId);
    if (postToUpdate) {
      postToUpdate.likes = postToUpdate.likes - 1;
      postToUpdate.likedUsers = postToUpdate.likedUsers.filter(
        (liked) => liked != id
      );
    }
    console.log("New post", newPost);
    setPosts(newPost);
    const docRef = doc(db, "Gallery", docId);

    await updateDoc(docRef, {
      likedUsers: arrayRemove(id),
      likes: increment(-1),
    });
  }

  const onRefresh = React.useCallback(() => {
    getPosts();
  }, []);

  useEffect(() => {
    const init = async () => {
      getUserId();
      if (email) {
        getPosts();
      }
    };
    init();
  }, [email, update]);
  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {posts.map((post, i) => (
        <View key={i}>
          <Post
            key={post.docId}
            userName={post.userName}
            likes={post.likes}
            description={post.caption}
            isLiked={post.likedUsers.includes(id)}
            likePost={likePost}
            removeLike={removeLike}
            docId={post.docId}
            uri={post.uri}
            date={post.date}
            email={post.email}
            ownerEmail={email}
            update={update}
            setUpdate={setUpdate}
          ></Post>
        </View>
      ))}
      {/* <Post likes={30} isLiked={true}></Post>
      <Post likes={30} isLiked={false}></Post> */}
    </ScrollView>
  );
}

function Header({
  src,
  userName,
  date,
  email,
  postId,
  ownerEmail,
  update,
  setUpdate,
}) {
  const block = async (blockUser) => {
    const docRef = await addDoc(collection(db, "Block"), {
      requestedBy: ownerEmail,
      ownerEmail: blockUser,
    });
    setUpdate(!update);
    alert(blockUser + " has been blocked!");
  };

  const flag = async (flagUser, flagId) => {
    const docRef = await addDoc(collection(db, "Flags"), {
      postId: flagId,
      requestedBy: ownerEmail,
      ownerEmail: flagUser,
    });
    setUpdate(!update);
    alert("Flagged!");
  };

  const deletePost = async (postId) => {
    await deleteDoc(doc(db, "Gallery", postId));
    setUpdate(!update);
  };

  const report = async (reportUser, reportId) => {
    const docRef = await addDoc(collection(db, "Reports"), {
      postId: reportId,
      requestedBy: ownerEmail,
      ownerEmail: reportUser,
    });
    setUpdate(!update);
    alert("Reported!");
  };
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        padding: hp(1),
        justifyContent: "space-between",
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Ionicons
          name="person-circle-outline"
          size={hp(4)}
          color="black"
          style={{}}
        />
        <View style={{ display: "flex", marginLeft: wp("1.5%") }}>
          <Text style={{ fontWeight: "500" }}>{userName}</Text>
          <Text
            style={{
              marginLeft: wp("0.2%"),
              color: "#505050",
            }}
          >
            {date}
          </Text>
        </View>
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
        }}
      >
        <MaterialIcons
          name="block"
          color="black"
          size={hp(3)}
          onPress={() => {
            Alert.alert("Block User", "Would you like to block this user?", [
              {
                text: "Cancel",
                onPress: () => console.log("Cancel Pressed"),
                style: "cancel",
              },
              {
                text: "Yes",
                onPress: () => {
                  block(email);
                },
              },
            ]);
          }}
        />
        <Ionicons
          name="flag"
          color="black"
          size={hp(3)}
          onPress={() => {
            Alert.alert(
              "Hide Inappropriate Posts",
              "Would you like to flag this post and hide it?",
              [
                {
                  text: "Cancel",
                  onPress: () => console.log("Cancel Pressed"),
                  style: "cancel",
                },
                {
                  text: "Yes",
                  onPress: () => {
                    flag(email, postId);
                  },
                },
              ]
            );
          }}
        />
        <MaterialIcons
          name="campaign"
          color="black"
          size={hp(4)}
          onPress={() => {
            Alert.alert(
              "Report",
              "Would you like to report this content as inappropriate?",
              [
                {
                  text: "Cancel",
                  onPress: () => console.log("Cancel Pressed"),
                  style: "cancel",
                },
                {
                  text: "Yes",
                  onPress: () => {
                    report(email, postId);
                  },
                },
              ]
            );
          }}
        />
        {ownerEmail == "admin@admin.com" && (
          <Ionicons
            name="close-circle-outline"
            color="red"
            size={hp(3)}
            onPress={() => {
              Alert.alert(
                "Delete Post",
                "Are you sure you would like to delete this post?",
                [
                  {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel",
                  },
                  {
                    text: "Yes",
                    onPress: () => {
                      deletePost(postId);
                    },
                  },
                ]
              );
            }}
          />
        )}
      </View>
    </View>
  );
}

function Post({
  likes,
  description,
  isLiked,
  uri,
  userName,
  date,
  docId,
  likePost,
  removeLike,
  email,
  ownerEmail,
  update,
  setUpdate,
}) {
  return (
    <View style={{ marginBottom: 15 }}>
      <Header
        userName={userName}
        date={date}
        email={email}
        postId={docId}
        ownerEmail={ownerEmail}
        update={update}
        setUpdate={setUpdate}
      ></Header>
      <View>
        <Image
          style={{ width: "100%", height: hp("40%") }}
          source={{
            uri: uri,
            // uri: "https://www.hillsidebeefnwa.com/images/default.jpg",
          }}
        ></Image>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            margin: 15,
            marginBottom: 5,
            alignItems: "center",
          }}
        >
          <Text style={{ fontWeight: "600", flex: 1, fontSize: 16 }}>
            {likes} likes
          </Text>
          <Pressable
            onPress={() => (isLiked ? removeLike(docId) : likePost(docId))}
          >
            <AntDesign
              style={{ marginRight: wp("1%") }}
              name={isLiked ? "heart" : "hearto"}
              size={24}
              color={isLiked && "red"}
            />
          </Pressable>
        </View>
        <Text style={{ marginLeft: 15 }}>{description}</Text>
      </View>
    </View>
  );
}
