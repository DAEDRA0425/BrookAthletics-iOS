import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  increment,
  arrayUnion,
  deleteField,
  addDoc,
  RefreshControl,
  serverTimestamp,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import {
  getAuth,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  currentUser,
} from "firebase/auth";
import { db } from "../firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";
// used for upload and updates
export async function uploadMatch(data) {
  const docRef = await addDoc(collection(db, "Matches"), data);
}

export async function uploadEvent(data) {
  const docRef = await addDoc(collection(db, "Events"), data);
}

// export const getUserId = async function uploadBeforePromise() {
//   const auth = getAuth();
//   return new Promise(function (resolve, reject) {
//     onAuthStateChanged(auth, (user) => {
//       if (user) {
//         resolve(user.uid);
//       } else {
//       }
//     });
//   });
// };

// await uploadEvent("2024-01-10", {
//   "16:00":
//   {
//   hour: 16,
//   title: "ice hockey",
//   team1: "Cushing",
//   team2: "team2",
//   location: "Cushings",
// }
// });
