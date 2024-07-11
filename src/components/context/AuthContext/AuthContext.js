import React, {
  useEffect,
  createContext,
  useContext,
  useState,
  useCallback,
} from "react";
import { auth, firestore } from "../../../Firebase/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

// Create our context with the imported createContext from React
const AuthContext = createContext();

// Create a provider for our context
export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loader, setLoader] = useState(false);
  const [authenticatedUser, setAuthenticatedUser] = useState();
  const nav = useNavigate();

  useEffect(() => {
    // Subscribe to authentication state changes
    const unsubscribe = auth.onAuthStateChanged(async (authUser) => {
      // Fix the path to 'auth'
      if (authUser) {
        // User is signed in
        console.log("Authenticated user:", authUser);
        setAuthenticatedUser(authUser);
      } else {
        // No user is signed in
        console.log("No user signed in.");
        nav("/signup");
        setUser(null);
      }
    });

    // Cleanup the subscription when the component renders
    return () => unsubscribe();
  }, []);

  const getCurrentUserFromFirestore = useCallback(async () => {
    // setLoader(true);
    console.log("getCurrentUserFromfirestore function")
    try {
      // Get the current user's UID
      const uid = auth.currentUser.uid;

      // Reference to the user document in Firestore
      const userDocRef = doc(firestore, "users", uid);

      // Get the user document from Firestore
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        return userData;
      } else {
        console.log("User document does not exist in Firestore.");
        return null;
      }
    } catch (error) {
      console.error("Error getting user data from Firestore:", error);
      throw error;
    }
  }, []);


  const fetchData = useCallback(async () => {
    try {
      const userData = await getCurrentUserFromFirestore();
      setUser(userData);
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
    }
    setLoader(false);
  }, [getCurrentUserFromFirestore, setUser]);
  
  useEffect(() => {
    setLoader(true);
    console.log("useEffect ran")
    if (authenticatedUser) {
      fetchData();
      setLoader(false);
    }
    // setLoader(false);
  }, [authenticatedUser, fetchData]);
  

  const payload = {
    user,
    setUser,
    fetchData,
    loader,
    setLoader,
  };

  return (
    <AuthContext.Provider value={payload}>{children}</AuthContext.Provider>
  );
};

// Creating a custom hook for the context
export const useAuthContext = () => {
  return useContext(AuthContext);
};
