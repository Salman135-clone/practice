import React, { useEffect, useState } from "react";
import Modal from "@mui/material/Modal";
import { Box, CircularProgress } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { toast } from "react-toastify";
import { addDoc, collection, getDocs, onSnapshot } from "firebase/firestore";
import { db } from "../constant/Firebase";
import Table from "../components/Table";
import MoreVert from "@mui/icons-material/MoreVert";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { authProvider } from "../context/MyProvider";

const Borrower = () => {
  const { allBorrowerList, loading } = authProvider();
  const [open, setOpen] = useState(false);
  const [tabValue, setTabValue] = useState("basic");
  const [data, setData] = useState([]);
  const [loadingTable, setLoadingTable] = useState(true);
  const [dob, setDOB] = useState(null);
  const [loadingForAdd, setLoadingForAdd] = useState(false);
  console.log(data);

  const [basicInfo, setBasicInfo] = useState({
    name: "",
    email: "",
    gender: "",
  });
  const [addressInfo, setAddressInfo] = useState({
    address: "",
    cnic: "",
    employ: "",
  });

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBasicInfo((prev) => ({ ...prev, [name]: value }));
  };

  const addressInputChange = (e) => {
    const { name, value } = e.target;
    setAddressInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const addDetail = async () => {
    const { name, email, gender } = basicInfo;
    const { address, employ, cnic } = addressInfo;
    try {
      setLoadingForAdd(true);
      const date = dob?.toDate();
      await addDoc(collection(db, "borrower"), {
        name,
        email,
        gender,
        date,
        address,
        cnic,
        employ,
      });
      toast.success("Successfully added");
    } catch (err) {
      toast.error(err);
    } finally {
      setLoadingForAdd(false);
    }
  };

  const columns = [
    {
      header: "Name",
      accessor: "name",
    },
    { header: "Email", accessor: "email" },
    { header: "CNIC", accessor: "cnic" },
    { header: "Employment", accessor: "employ" },
    { header: "Gender", accessor: "gender" },
    {
      header: "Date",
      accessor: "date",
      render: (row) => <div>{row.date?.toDate().toLocaleDateString()}</div>,
    },
    { header: "Address", accessor: "address" },
    {
      header: "Action",
      disableSort: true,
      render: (row) => (
        <>
          <Menu>
            <MenuButton className="focus:outline-none">
              <MoreVert className="cursor-pointer " />
            </MenuButton>
            <MenuItems
              anchor="left-start"
              className="bg-gray-200 w-45 rounded-md py-2 space-y-1 focus:outline-none"
            >
              <MenuItem>
                <a className="block data-focus:bg-gray-400 px-2 py-1" href="">
                  View
                </a>
              </MenuItem>
              <MenuItem>
                <a className="block data-focus:bg-gray-400 px-2 py-1 " href="">
                  View Transaction
                </a>
              </MenuItem>
              <MenuItem>
                <a
                  className="block data-focus:bg-red-500 data-focus:text-white px-2 py-1 text-red-600"
                  href=""
                >
                  Delete
                </a>
              </MenuItem>
            </MenuItems>
          </Menu>
        </>
      ),
    },
  ];

  return (
    <>
      <div className="pt-8">
        <span className="font-bold text-3xl">Borrower</span>
        <div className=" mt-3">
          <div className="add-borrower flex justify-end">
            <button
              onClick={handleOpen}
              className="bg-gray-800 text-white py-3 px-4 rounded-sm cursor-pointer"
            >
              Add Borrower
            </button>
          </div>

          <div className="mt-5">
            <Table columns={columns} data={allBorrowerList} loading={loading} />
          </div>
          <p>Perosn list show here</p>
          <Modal
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
            open={open}
            onClose={handleClose}
          >
            <Box
              sx={{
                bgcolor: "background.paper",
                padding: 2,
                maxWidth: "70%",
                width: "100%",
                borderRadius: "8px",
              }}
            >
              <TabContext value={tabValue}>
                <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                  <TabList onChange={handleChange}>
                    <Tab label="Basic Info" value="basic" />
                    <Tab label="Address" value="address" />
                  </TabList>
                </Box>
                <TabPanel value="basic">
                  <div>
                    <span className="font-semibold text-2xl ">
                      Basic Information
                    </span>
                    <div className="mt-4 max-h-[80vh] overflow-y-auto ">
                      <form>
                        <div>
                          <label className="block text-sm text-gray-700 font-medium">
                            Full Name
                          </label>
                          <input
                            type="text"
                            className=" mt-1 block w-full border rounded-sm border-gray-300 p-2"
                            name="name"
                            id="name"
                            required
                            placeholder="Enter Full Name"
                            value={basicInfo.name}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div>
                          <label className="mt-1 block text-sm text-gray-700 font-medium">
                            Email Address
                          </label>
                          <input
                            type="email"
                            className=" mt-1 block w-full border rounded-sm border-gray-300 p-2"
                            name="email"
                            id="email"
                            placeholder="Enter Your Email"
                            onChange={handleInputChange}
                            value={basicInfo.email}
                            required
                          />
                        </div>
                        <div>
                          <label className=" mt-1 block text-sm text-gray-700 font-medium">
                            Gender
                          </label>
                          <input
                            type="gender"
                            className=" mt-1 block w-full border rounded-sm border-gray-300 p-2"
                            name="gender"
                            id="gender"
                            placeholder="Your Gender"
                            value={basicInfo.gender}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div>
                          <label className="mt-1 mb-1 block text-sm text-gray-700 font-medium">
                            Date of Birth
                          </label>
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                              sx={{ width: "100%" }}
                              value={dob}
                              onChange={(newValue) => setDOB(newValue)}
                              required
                            />
                          </LocalizationProvider>
                        </div>
                      </form>
                      <div>
                        <button
                          onClick={() => setTabValue("address")}
                          className="cursor-pointer w-full bg-gray-800 text-white rounded-sm mt-3 py-3 px-4 text-xl"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  </div>
                </TabPanel>
                <TabPanel value={"address"}>
                  <div>
                    <span className="font-semibold text-2xl ">
                      Address & Identity
                    </span>
                    <div className="mt-4 max-h-[80vh] overflow-y-auto ">
                      <form>
                        <div>
                          <label className="block text-sm text-gray-700 font-medium">
                            Current Address
                          </label>
                          <input
                            type="text"
                            className=" mt-1 block w-full border rounded-sm border-gray-300 p-2"
                            name="address"
                            id="address"
                            required
                            value={addressInfo.address}
                            onChange={addressInputChange}
                            placeholder="Enter Your Current Address"
                          />
                        </div>
                        <div>
                          <label className="mt-1 block text-sm text-gray-700 font-medium">
                            National ID / CNIC Number
                          </label>
                          <input
                            type="cnic"
                            className=" mt-1 block w-full border rounded-sm border-gray-300 p-2"
                            name="cnic"
                            id="cnic"
                            required
                            value={addressInfo.cnic}
                            onChange={addressInputChange}
                            placeholder="Enter Your CNIC Number"
                          />
                        </div>
                        <div>
                          <label className="mt-1 block text-sm text-gray-700 font-medium">
                            Employment Status
                          </label>
                          <input
                            type="employ"
                            className=" mt-1 block w-full border rounded-sm border-gray-300 p-2"
                            name="employ"
                            id="employ"
                            value={addressInfo.employ}
                            onChange={addressInputChange}
                            placeholder="Employment Status (employed, self-employed, unemployed)"
                          />
                        </div>
                      </form>
                      <div>
                        <button
                          disabled={loadingForAdd}
                          onClick={addDetail}
                          className={` w-full text-white rounded-sm mt-3 py-3 px-4 text-xl ${
                            loadingForAdd
                              ? "bg-gray-600 cursor-not-allowed"
                              : " bg-gray-800 cursor-pointer"
                          }`}
                        >
                          <span className="flex items-center gap-2 justify-center">
                            {loadingForAdd && (
                              <CircularProgress size={20} color="inherit" />
                            )}
                            {loadingForAdd ? "Saving" : " Add"}
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                </TabPanel>
              </TabContext>
            </Box>
          </Modal>
        </div>
      </div>
    </>
  );
};

export default Borrower;
