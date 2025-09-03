import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  CircularProgress,
  Avatar,
  Paper,
  Typography,
  Tabs,
  Tab,
} from "@mui/material";
import { authProvider } from "@/context/MyProvider";
import {
  getAuth,
  updateEmail,
  sendEmailVerification,
  verifyBeforeUpdateEmail,
} from "firebase/auth";
import { db } from "@/constant/Firebase";
import { updateDoc, doc } from "firebase/firestore";
import { toast } from "react-toastify";

const Profile = () => {
  const { userInfo, user } = authProvider();
  const [tab, setTab] = useState(0);
  const auth = getAuth();
  const userAuth = auth.currentUser;

  console.log(userAuth);
  console.log(user);
  console.log(userInfo?.id);

  const [profileData, setProfileData] = useState({
    username: userInfo?.username || "",
    email: userInfo?.email || "",
  });
  const [passwordData, setPasswordData] = useState({
    current: "",
    newPass: "",
  });
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const profileUpdateUserDb = async () => {
    try {
      await updateDoc(doc(db, "users", userInfo?.id), {
        email: profileData.email,
        username: profileData.username,
      });
    } catch (err) {
      throw err;
    }
  };

  const handleProfileUpdate = async () => {
    setLoadingProfile(true);
    try {
      if (userAuth) {
        await verifyBeforeUpdateEmail(userAuth, profileData.email);
        toast.info(
          "A verification email has been sent to your new email. Please confirm to complete the update."
        );
        await updateEmail(userAuth, profileData.email);
      }
      //   await profileUpdateUserDb();
      //   toast.success("Profile updated!");
    } catch (error) {
      throw error;
    } finally {
      setLoadingProfile(false);
    }
  };

  const handlePasswordUpdate = async () => {
    if (passwordData.newPass !== passwordData.confirmPass) {
      alert("New password and confirmation do not match.");
      return;
    }
    setLoadingPassword(true);
    try {
      await new Promise((res) => setTimeout(res, 1200));
      alert("Password updated!");
    } finally {
      setLoadingPassword(false);
    }
  };

  return (
    <Box className="flex bg-gray-100 justify-center py-10">
      <Paper
        elevation={4}
        className="p-8 w-full max-w-lg rounded-2xl shadow-lg"
      >
        <Box textAlign="center" mb={3}>
          <Avatar
            sx={{ width: 80, height: 80, bgcolor: "#67C090", margin: "0 auto" }}
          >
            {profileData.username[0]?.toUpperCase()}
          </Avatar>
          <Typography variant="h6" className="mt-4 font-bold">
            Account Settings
          </Typography>
        </Box>

        <Tabs
          value={tab}
          onChange={handleTabChange}
          centered
          textColor="primary"
          indicatorColor="primary"
        >
          <Tab label="Profile Info" />
          <Tab label="Change Password" />
        </Tabs>

        {tab === 0 && (
          <Box mt={3}>
            <TextField
              fullWidth
              label="Username"
              name="username"
              value={profileData.username}
              onChange={handleProfileChange}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Email"
              type="email"
              name="email"
              value={profileData.email}
              onChange={handleProfileChange}
              margin="normal"
            />

            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={handleProfileUpdate}
              disabled={loadingProfile}
              sx={{ paddingY: 1.5, borderRadius: 2, mt: 2 }}
            >
              {loadingProfile ? (
                <>
                  <CircularProgress
                    size={18}
                    color="inherit"
                    className="mr-2"
                  />
                  Updating...
                </>
              ) : (
                "Update Profile"
              )}
            </Button>
          </Box>
        )}

        {tab === 1 && (
          <Box mt={3}>
            <TextField
              fullWidth
              label="Current Password"
              type="password"
              name="current"
              value={passwordData.current}
              onChange={handlePasswordChange}
              margin="normal"
            />
            <TextField
              fullWidth
              label="New Password"
              type="password"
              name="newPass"
              value={passwordData.newPass}
              onChange={handlePasswordChange}
              margin="normal"
            />

            <Button
              fullWidth
              variant="outlined"
              color="secondary"
              onClick={handlePasswordUpdate}
              disabled={loadingPassword}
              sx={{ paddingY: 1.5, borderRadius: 2, mt: 2 }}
            >
              {loadingPassword ? (
                <>
                  <CircularProgress
                    size={18}
                    color="inherit"
                    className="mr-2"
                  />
                  Updating...
                </>
              ) : (
                "Change Password"
              )}
            </Button>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default Profile;
