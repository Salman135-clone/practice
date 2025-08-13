import * as React from "react";
import { EllipsisVerticalIcon } from "@heroicons/react/20/solid"; // or lucide-react, etc.

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { useState, useEffect } from "react";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { useNavigate, useParams } from "react-router-dom";
import { Modal, ModalBody, ModalHeader } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import {
  collection,
  deleteDoc,
  getDocs,
  onSnapshot,
  doc,
} from "firebase/firestore";
import { db } from "../constant/Firebase";
import PermissionChecker from "../components/PermissionChecker";
import { toast } from "react-toastify";
import { Circle } from "@chakra-ui/react";
import { CircularProgress } from "@mui/material";

const Role = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [role, setRole] = useState([]);
  const [deleteRole, setDeleteRole] = useState("");
  const [selectRolePermission, setSelectRolePermission] = useState(null);
  console.log(selectRolePermission);
  console.log(role);
  console.log(deleteRole);

  const handleOpenModal = (rol) => {
    setOpenModal(true);
    setSelectRolePermission(rol);
  };
  const handleCloseModal = (rol) => {
    setOpenModal(false);
    setSelectRolePermission(null);
  };

  const handleDeleteBox = (rol) => {
    setOpen(true);
    setDeleteRole(rol?.id);
  };
  const deleteBTN = async (deleteRole) => {
    setDeleteLoading(true);
    try {
      await deleteDoc(doc(db, "roles", deleteRole));
      toast.success("Delete Sucessfully");
    } catch (err) {
      toast.error(err);
    } finally {
      setDeleteLoading(false);
      setDeleteRole("");
      setOpen(false);
    }
  };

  useEffect(() => {
    setLoading(true);

    const q = onSnapshot(
      collection(db, "roles"),
      (snapshot) => {
        const rolesData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setRole(rolesData);
      },
      (error) => {
        toast.error(error);
        setLoading(false);
      }
    );
    return () => q();
  }, []);

  return (
    <>
      <div>
        <span className="text-2xl font-semibold ">Role Management Panel</span>
        <div className="submain w-full flex flex-col">
          <div className="addBtn flex justify-end">
            <PermissionChecker name="add-role">
              <button
                onClick={() => navigate("/role/add")}
                className=" bg-gray-800 text-white px-2.5 py-2 rounded-sm cursor-pointer"
              >
                Make a New Role
              </button>
            </PermissionChecker>
          </div>
          <div className="listRole w-full mt-5">
            <span className="font-semibold text-lg text-gray-500">
              Role List
            </span>
            <Box
              sx={{
                width: "100%",
                maxWidth: "100%",
                cursor: "pointer",
                // background: "red",
              }}
            >
              <nav className="main-list">
                {role.map((rol) => (
                  <ListItem
                    key={rol.id}
                    className="border mb-3 border-gray-300 hover:border-gray-800"
                  >
                    <ListItemText>{rol.role}</ListItemText>
                    <span className="flex gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-6 text-gray-400 hover:text-gray-800"
                        onClick={() => navigate(`/role/add/${rol.id}`)}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                        />
                      </svg>

                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-6 text-gray-400 hover:text-gray-800"
                        onClick={() => handleOpenModal(rol)}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                        />
                      </svg>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-6 text-gray-400 hover:text-gray-800"
                        onClick={() => handleDeleteBox(rol)}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5m6 4.125 2.25 2.25m0 0 2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z"
                        />
                      </svg>
                    </span>
                  </ListItem>
                ))}
              </nav>
            </Box>
          </div>
        </div>
        <Dialog open={openModal} onClose={handleCloseModal}>
          <DialogTitle>Check Role & Permission Assign</DialogTitle>
          <DialogContent>
            <div>
              <div className="flex gap-1 mb-2">
                <p className="font-medium tracking-wide">Role:</p>
                <span className="text-gray-500">
                  {selectRolePermission?.role}
                </span>
              </div>
              <div>
                <p className="font-medium tracking-wide mb-1">Permission:</p>
                <ul className=" list-decimal list-inside">
                  {selectRolePermission?.Permission?.map((per) => (
                    <li key={per} className="mb-1">
                      {per}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseModal}>Close</Button>
          </DialogActions>
        </Dialog>

        <Dialog open={open} onClose={() => setOpen(false)}>
          <DialogTitle>
            <div></div>
          </DialogTitle>
          <DialogContent>
            <div>
              <div>
                <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
                <p className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                  Are you sure you want to delete this product?
                </p>
              </div>
            </div>
            <DialogActions>
              <button
                onClick={() => setOpen(false)}
                className="hover:bg-gray-200 py-1 px-2 rounded-sm cursor-pointer"
              >
                Cancel
              </button>
              <button
                disabled={deleteLoading}
                onClick={() => deleteBTN(deleteRole)}
                className="bg-red-600 text-white px-3 py-1 rounded-sm hover:bg-red-700 cursor-pointer"
              >
                {deleteLoading ? (
                  <span className="flex items-center gap-2">
                    <CircularProgress size={17} color="inherit" />
                    <p>Deleting...</p>
                  </span>
                ) : (
                  "Start Delete"
                )}
              </button>
            </DialogActions>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default Role;
