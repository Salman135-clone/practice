import { CircularProgress } from "@mui/material";
import {
  getDocs,
  collection,
  addDoc,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import React, { useState, useEffect } from "react";
import { db } from "../constant/Firebase";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { authProvider } from "../context/MyProvider";

const AddRole = () => {
  const { allPermission } = authProvider();
  const [fetchingLoading, setFetchingLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [roleName, setRoleName] = useState("");
  const [selectedPermission, setSelectedPermission] = useState([]);
  const navigate = useNavigate();
  const { id } = useParams();

  const selectValue = (e) => {
    const { value } = e.target;
    setSelectedPermission((prev) => {
      if (prev.includes(value)) {
        return prev.filter((name) => name !== value);
      } else {
        return [...prev, value];
      }
    });
  };

  const clearField = () => {
    setRoleName("");
    setSelectedPermission([]);
  };

  const submitRole = async () => {
    if (!roleName) {
      return toast.error("Please enter a role name.");
    }
    if (selectedPermission.length === 0) {
      return toast.error("Please select at least one permission.");
    }
    try {
      setSubmitLoading(true);
      if (id) {
        await updateDoc(doc(db, "roles", id), {
          role: roleName,
          Permission: selectedPermission,
        });
        toast.success("Role Updated Successfully");
        navigate("/role");
      } else {
        await addDoc(collection(db, "roles"), {
          role: roleName,
          Permission: selectedPermission,
        });
        toast.success("Role Created Successfully");
        navigate("/role");
      }
    } catch (err) {
      toast.error(err);
    } finally {
      setSubmitLoading(false);
      clearField();
    }
  };

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        if (!id) return;
        const dbRef = await getDoc(doc(db, "roles", id));
        if (dbRef.exists()) {
          const roleResult = dbRef.data();
          setRoleName(roleResult?.role || "");
          setSelectedPermission(roleResult?.Permission || []);
        }
      } catch (error) {
        console.error("Error fetching role:", error);
      }
    };
    fetchDetail();
  }, [id]);

  return (
    <>
      <div className="p-6 w-full">
        <span className="font-bold text-2xl ">Create a New Role</span>
        <div className="flex flex-col mt-6 ">
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">
              Role Name
            </label>
            <input
              className="border border-gray-300 px-4 py-2 w-full rounded-md focus:outline-none"
              type="text"
              required
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
              placeholder="Enter the role name (e.g., Admin, Editor)"
            />
          </div>
          <div>
            <p className="text-gray-700 font-medium mb-2 ">Permission</p>
            <div className="grid lg:grid-cols-5 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4 w-full">
              {fetchingLoading ? (
                <span>
                  <CircularProgress />
                </span>
              ) : (
                allPermission?.map((perm) => (
                  <div
                    key={perm.id}
                    className="flex items-center gap-3 shadow-sm px-4 py-3  rounded-sm  hover:shadow-md cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      value={perm.perValue}
                      checked={selectedPermission.includes(perm.perValue)}
                      onChange={selectValue}
                      className="min-w-5"
                    />
                    <span className="text-md text-gray-800 ">
                      {perm.perValue}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
        <div className="button w-full flex justify-end mt-4">
          <button
            onClick={submitRole}
            disabled={submitLoading}
            className={`flex items-center gap-2  justify-center px-3 py-3 lg:max-w-40 md:max-w-40 w-full text-white rounded-sm ${
              submitLoading
                ? "bg-gray-500 cursor-not-allowed leading-none"
                : " bg-gray-800 cursor-pointer"
            }`}
          >
            {submitLoading && <CircularProgress size={20} color="inherit" />}
            {submitLoading ? "Saving..." : id ? "Update" : "Add Role"}
          </button>
        </div>
      </div>
    </>
  );
};

export default AddRole;
