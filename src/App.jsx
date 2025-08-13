import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Login from "./Auth/Login";
import ProtectedLayout from "./pages/ProtectedLayout";
import { UserProvider } from "./context/MyProvider";
import { ToastContainer } from "react-toastify";
import Post from "./pages/Post";
import Register from "./Auth/Register";
import UserList from "./pages/UserList";
import Role from "./pages/Role";
import Permission from "./pages/Permission";
import AddRole from "./components/AddRole";

const App = () => {
  return (
    <BrowserRouter>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover={false}
        rtl={false}
      />
      <UserProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<ProtectedLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/post/:id?" element={<Post />} />
            <Route path="/user" element={<UserList />} />
            <Route path="/role" element={<Role />} />
            <Route path="/role/add/:id?" element={<AddRole />} />
            <Route path="/permission" element={<Permission />} />
          </Route>
        </Routes>
      </UserProvider>
    </BrowserRouter>
  );
};

export default App;
