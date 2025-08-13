import React, { useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Button, CircularProgress } from "@mui/material";
import { toast } from "react-toastify";
import {
  addDoc,
  collection,
  getDocs,
  onSnapshot,
  query,
} from "firebase/firestore";
import { db } from "../constant/Firebase";
import PermissionChecker from "../components/PermissionChecker";
import { authProvider } from "../context/MyProvider";

const Permission = () => {
  const { allPermission } = authProvider();
  const [open, setOpen] = useState(false);
  const [loading, setloading] = useState(false);
  const [permissionList, setPermissionList] = useState(null);
  const [perField, setPerField] = useState("");

  console.log(permissionList);
  const handleBox = () => setOpen(!open);
  const exists = allPermission.some((value) => value.perValue === perField);

  const clearField = () => setPerField("");

  const addPermissionBTN = async () => {
    if (!perField) {
      toast.error("Field Require");
      return;
    }

    if (exists) {
      toast.error(`${perField} Already Exist.`);
      return;
    }
    setloading(true);
    try {
      const lowercase = perField.split(" ").join("-").trim().toLowerCase();

      await addDoc(collection(db, "permissions"), {
        perValue: lowercase,
      });
      toast.success(`${perField} Permission Added.`);
      clearField();
      handleBox();
    } catch (error) {
      toast.error(error);
    } finally {
      setloading(false);
    }
  };

  useEffect(() => {
    const dbRef = onSnapshot(
      collection(db, "permissions"),
      (snapshot) => {
        const result = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPermissionList(result);
      },
      (error) => {
        toast.error(error);
      }
    );
    return () => dbRef();
  }, []);

  return (
    <>
      <div className="main-container h-full pt-8 ">
        <span className="font-bold text-3xl">List of Permissions</span>
        <div className="flex flex-col w-full gap-5 mt-5">
          <div className="flex justify-end ">
            <PermissionChecker name="add-new-permission">
              <button
                onClick={handleBox}
                className="bg-gray-800 text-white px-4 py-3 cursor-pointer rounded-sm"
              >
                Add New Permission
              </button>
            </PermissionChecker>
          </div>
          <div className="grid lg:grid-cols-7 md:grid-cols-4 sm:grid-cols-2 gap-4">
            {permissionList ? (
              permissionList.map((perm) => (
                <div
                  key={perm.id}
                  className="rounded-xl px-4 py-3 shadow-sm bg-white hover:shadow-md cursor-pointer"
                >
                  <span onClick={() => alert(`${perm.id}`)}>
                    {perm.perValue}
                  </span>
                </div>
              ))
            ) : (
              <CircularProgress />
            )}
          </div>
        </div>
        <Dialog open={open} onClose={handleBox} fullWidth maxWidth="xs">
          <DialogTitle>Add New Permission</DialogTitle>
          <DialogContent dividers>
            <div>
              <label htmlFor="pname">Name of Permission:</label>
              <input
                type="text"
                name="perField"
                value={perField}
                onChange={(e) => setPerField(e.target.value)}
                placeholder="Type Here .... "
                className="border border-gray-300 rounded-sm px-3 py-2 lg:ml-3 md:ml-3 "
              />
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleBox} color="error">
              Close
            </Button>

            <Button disabled={loading} onClick={addPermissionBTN}>
              {loading ? (
                <>
                  <CircularProgress
                    size={14}
                    color="success"
                    className="mr-2"
                  />
                  Saving...
                </>
              ) : (
                "Add"
              )}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
};

export default Permission;
