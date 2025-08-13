import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { createContext, use, useContext, useEffect, useState } from "react";
import { auth } from "../constant/Firebase";
import { useNavigate } from "react-router-dom";
import { collection, doc, getDoc, onSnapshot } from "firebase/firestore";
import { db } from "../constant/Firebase";

const Usercontext = createContext();

export const UserProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [userPermission, setUserPermission] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rolesList, setRolesList] = useState(null);
  const [allPermission, setAllPermission] = useState([]);
  const [customePermission, setCustomePermission] = useState([]);
  const [combine, setCombine] = useState([]);
  const [roleName, setRoleName] = useState("");
  // console.log(rolesList);
  // console.log(user);
  // console.log(userInfo);
  // console.log(customePermission);
  // console.log(combine);
  console.log(roleName);

  const categoriesData = [
    { id: 1, name: "Tech" },
    { id: 2, name: "Web" },
    { id: 3, name: "Mobile" },
  ];

  useEffect(() => {
    const roleGetting = onSnapshot(
      collection(db, "roles"),
      (snapshot) => {
        const rolesResult = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setRolesList(rolesResult);
      },
      (error) => {
        console.log(error);
      }
    );
    return () => roleGetting();
  }, []);

  useEffect(() => {
    const permissionGetting = onSnapshot(
      collection(db, "permissions"),
      (snapshot) => {
        const permissionResult = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAllPermission(permissionResult);
      },
      (error) => {
        console.log(error);
      }
    );
    return () => permissionGetting();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const loggedInUser = userCredential?.user;
      localStorage.setItem("uid", loggedInUser.uid);
      await fetchUserDetail(loggedInUser.uid);
      setUser(loggedInUser);
      return loggedInUser;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const fetchUserDetail = async (uid) => {
    setLoading(true);
    try {
      const dbUser = await getDoc(doc(db, "users", uid));
      if (!dbUser.exists()) return;
      const userData = dbUser.data();
      setCustomePermission(userData?.customePermission);
      const dbRoles = await getDoc(doc(db, "roles", userData.role));
      if (dbRoles.exists()) {
        const roleData = dbRoles.data();
        setRoleName(roleData?.role || "");
        setUserPermission(roleData.Permission || []);
      }
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const custom = Array.isArray(customePermission) ? customePermission : [];
    const userPerm = Array.isArray(userPermission) ? userPermission : [];

    const combined =
      custom.length > 0 ? [...new Set([...userPerm, ...custom])] : userPerm;
    setCombine(combined);
  }, [userPermission, customePermission]);

  useEffect(() => {
    const logoutState = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await fetchUserDetail(currentUser.uid);
      }
      setLoading(false);
    });
    return logoutState;
  }, []);

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setUserInfo(null);
    localStorage.removeItem("uid");
  };

  const hasPermission = (permName) => combine.includes(permName);

  return (
    <Usercontext.Provider
      value={{
        login,
        logout,
        user,
        loading,
        fetchUserDetail,
        userInfo,
        userPermission,
        hasPermission,
        categoriesData,
        rolesList,
        allPermission,
        roleName,
      }}
    >
      {children}
    </Usercontext.Provider>
  );
};
export const authProvider = () => useContext(Usercontext);
