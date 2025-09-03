import React, { useEffect, useState } from "react";
import DashboardNav from "../components/DashboardNav";
import Table from "../components/Table";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "../constant/Firebase";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { toast } from "react-toastify";
import { authProvider } from "../context/MyProvider";
import PermissionChecker from "../components/PermissionChecker";
import ActionButton from "../components/ActionButton";
import { CircularProgress } from "@mui/material";
import IconButton from "@mui/joy/IconButton";
import Menu from "@mui/joy/Menu";
import ListDivider from "@mui/joy/ListDivider";
import MoreVert from "@mui/icons-material/MoreVert";
import MenuButton from "@mui/joy/MenuButton";
import Dropdown from "@mui/joy/Dropdown";

const UserList = () => {
  const { rolesList, allPermission } = authProvider();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [role, setRole] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const [extraPermission, setExtraPermission] = useState([]);

  const handleValue = (e) => {
    const { value } = e.target;
    setExtraPermission((prev) => {
      if (prev.includes(value)) {
        return prev.filter((item) => item !== value);
      } else {
        return [...prev, value];
      }
    });
  };
  const openDialog = (data) => {
    setSelectedUser(data);
    setRole(data.role_id);
    setExtraPermission(data.customePermission || []);
    setOpen(true);
  };
  const closeDialog = () => {
    setOpen(false);
  };

  const userFetch = async () => {
    setLoading(true);
    try {
      const query = await getDocs(collection(db, "users"));
      const user = query.docs.map((doc) => {
        const userData = doc.data();
        const rolename =
          rolesList.find((item) => item.id === userData.role)?.role ||
          "Unknow Role";
        return {
          id: doc.id,
          ...userData,
          role_id: userData.role,
          role: rolename,
        };
      });

      setData(user);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    userFetch();
  }, []);

  const changeRole = async () => {
    // if (role === selectedUser.role_id) {
    //   toast.warning("You already have this role");
    //   return;
    // }
    setLoading(true);
    try {
      const docRef = doc(db, "users", selectedUser.id);
      await updateDoc(docRef, {
        role: role,
        customePermission: extraPermission,
      });
      toast.success("Role updated");

      await userFetch();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
      setOpen(false);
      setRole("");
      setExtraPermission([]);
    }
  };

  const columns = [
    {
      header: "User Name",
      render: (dataRow) => (
        <div className="flex items-center gap-1">
          {/* <input type="checkbox" className="mt-1" /> */}
          <span className="">{dataRow.username}</span>
        </div>
      ),
    },

    {
      header: "Email",
      accessor: "email",
    },
    {
      header: "Role",
      accessor: "role",
      render: (dataRow) => (
        <div className="flex items-center gap-2  ">
          <span className="truncate w-full">{dataRow.role}</span>
        </div>
      ),
    },
    {
      header: "Action",
      render: (dataRow) => (
        <Dropdown>
          <MenuButton slots={{ root: IconButton }}>
            <MoreVert />
          </MenuButton>

          <Menu
            placement="left-start"
            sx={{
              minWidth: 100,
              "&:hover": {
                backgroundColor: "#f0f0f0",
              },
            }}
          >
            <MenuItem onClick={() => openDialog(dataRow)}>Edit</MenuItem>
            <MenuItem sx={{ color: "error.main" }}>Delete</MenuItem>
          </Menu>
        </Dropdown>

        // <span className="flex gap-2">
        //   <ActionButton
        //     permission="edit-user-role"
        //     defaultStyle="px-3 py-1 rounded "
        //     disabledColor="bg-gray-400 text-gray-500 cursor-not-allowed"
        //     normalColor="bg-blue-400 hover:bg-blue-600 hover:text-white cursor-pointer"
        //     onClick={() => openDialog(dataRow)}
        //   >
        //     <span className="flex items-center gap-1">
        //       <PencilSquareIcon className="w-5 h-5 text-white " />
        //       <span className="text-gray-100">Edit</span>
        //     </span>
        //   </ActionButton>

        //   <ActionButton
        //     permission={"delete-user"}
        //     onClick={() => alert(`${dataRow.role}`)}
        //     defaultStyle="px-3 py-1 rounded"
        //     disabledColor="bg-gray-400 text-gray-500 cursor-not-allowed"
        //     normalColor="bg-red-400 hover:bg-red-600 hover:text-white cursor-pointer"
        //   >
        //     <span className="flex items-center gap-1">
        //       <TrashIcon className="text-white w-5  h-5" />
        //       <span className="text-gray-100">Delete</span>
        //     </span>
        //   </ActionButton>
        // </span>
      ),
    },
  ];
  return (
    <>
      <div className="w-full pt-5">
        <span className="font-bold text-3xl">User List</span>
        <div className="m-auto mt-5 ">
          <Table
            columns={columns}
            loading={loading}
            data={data}
            sortColumn={sortColumn}
            setSortColumn={setSortColumn}
            setSortDirection={setSortDirection}
            sortDirection={sortDirection}
          />
        </div>
      </div>

      <Dialog open={open} onClose={closeDialog} fullWidth maxWidth="sm">
        <DialogTitle className="font-semibold">Change User Role</DialogTitle>
        <DialogContent>
          <div className="flex items-center justify-between">
            <div>
              <span className="font-semibold whitespace-nowrap">
                Current Role:
                <span className="font-normal text-gray-600 ml-1">
                  {selectedUser?.role}
                </span>
              </span>
            </div>
            <div>
              <FormControl fullWidth sx={{ m: 1, minWidth: 120 }}>
                <InputLabel>Role</InputLabel>
                <Select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  label="Role"
                >
                  {rolesList?.map((rol) => (
                    <MenuItem key={rol.id} value={rol.id}>
                      {rol.role}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
          </div>
          <div>
            <p className="font-semibold mb-3">Assign Extra Permission</p>
            <div className="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-2">
              {allPermission?.map((perm) => (
                <div key={perm.id} className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    value={perm.perValue}
                    onChange={handleValue}
                    checked={extraPermission.includes(perm.perValue)}
                    className="min-w-5 h-3.5 mt-1"
                  />
                  <span>{perm.perValue}</span>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog} color="white">
            Cancel
          </Button>
          <Button
            disabled={loading}
            onClick={() => changeRole()}
            color="primary"
          >
            {loading && <CircularProgress size={14} className="mr-2" />}
            {loading ? "Saving..." : "Change Role"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UserList;
