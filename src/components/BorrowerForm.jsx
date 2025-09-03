import React, { useEffect, useState } from "react";
import Modal from "@mui/material/Modal";
import MoreVert from "@mui/icons-material/MoreVert";
import {
  Box,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { toast } from "react-toastify";
import {
  addDoc,
  collection,
  getDocs,
  onSnapshot,
  updateDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../constant/Firebase";
import { authProvider } from "../context/MyProvider";
import Table from "../components/Table";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import dayjs from "dayjs";

const BorrowerForm = () => {
  const { allBorrowerList, user, roleName, loadingBorrower } = authProvider();
  const [open, setOpen] = useState(false);
  const [tabValue, setTabValue] = useState("basic");
  const [dob, setDOB] = useState(null);
  const [loadingForAdd, setLoadingForAdd] = useState(false);
  const [cellNumber, setCellNumber] = useState("");
  const [loanForm, setLoanForm] = useState(false);
  const [loadingForLoan, setLoadingForLoan] = useState(false);
  // const [tableLoading, setTableLoading] = useState(true);
  const [borrowerId, setBorrowerId] = useState(null);
  const [loanAmount, setLoanAmount] = useState(null);
  const [data, setData] = useState([]);
  const [checkingBorrowerAdd, setCheckingBorrowerAdd] = useState(null);
  // console.log(checkingBorrowerAdd);

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

  const showBorrowerBTN = allBorrowerList.find(
    (b) => b.createdBy === user?.uid
  );

  useEffect(() => {
    if (roleName === "Admin") {
      setData(allBorrowerList);
    } else {
      const onlyUserBorrowerShow = allBorrowerList.find(
        (item) => item.createdBy === user?.uid
      );
      setCheckingBorrowerAdd(onlyUserBorrowerShow || null);
      setData(onlyUserBorrowerShow ? [onlyUserBorrowerShow] : []);
    }
  }, [allBorrowerList, user?.uid, roleName]);

  const getBorrowerId = () => {
    setBorrowerId(checkingBorrowerAdd?.id);
  };

  const handleOpen = (data) => {
    setOpen(true);
    setBasicInfo({
      name: data.name || "",
      email: data.email || "",
      gender: data.gender || "",
    });
    setAddressInfo({
      address: data.address || "",
      cnic: data.cnic || "",
      employ: data.employ || "",
    });
    setCellNumber(data.cellNumber || "");
    setDOB(data.date ? dayjs(data.date.toDate()) : null);
    setBorrowerId(data?.id || null);
  };
  const handleClose = () => setOpen(false);
  const loanFormOpen = () => {
    setLoanForm(true);
    getBorrowerId();
  };
  const loanFormClose = () => {
    setLoanForm(false);
    setLoanAmount(null);
  };

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
  const clearState = () => {
    setCellNumber("");
    setDOB(null);
    setOpen(false);
    setAddressInfo({
      address: "",
      cnic: "",
      employ: "",
    });
    setBasicInfo({
      name: "",
      email: "",
      gender: "",
    });
  };

  const addDetail = async () => {
    const { name, email, gender } = basicInfo;
    const { address, employ, cnic } = addressInfo;
    try {
      setLoadingForAdd(true);
      const date = dob?.toDate();
      if (borrowerId) {
        await updateDoc(doc(db, "borrower", borrowerId), {
          name,
          email,
          gender,
          date,
          address,
          cnic,
          employ,
          cellNumber,
        });
        toast.success("Borrower Updated Successfully");
      } else {
        await addDoc(collection(db, "borrower"), {
          name,
          email,
          gender,
          date,
          address,
          cnic,
          employ,
          cellNumber,
          createdBy: user?.uid,
        });
        toast.success("Successfully added");
      }
    } catch (err) {
      toast.error(err);
    } finally {
      setLoadingForAdd(false);
      clearState();
      setOpen(false);
    }
  };

  const sendLoanReq = async () => {
    if (!loanAmount) {
      toast.warning("Please Enter the Amount");
      return;
    }
    setLoadingForLoan(true);
    try {
      await addDoc(collection(db, "transaction"), {
        Amount: loanAmount,
        borrowerID: borrowerId,
        loan: "Loan",
        status: "pending",
        uid: user?.uid,
        createdAt: serverTimestamp(),
      });
      toast.success("Loan Req Send Successfully.");
    } catch (err) {
      toast.error(err);
    } finally {
      setLoadingForLoan(false);
      setLoanAmount(null);
      loanFormClose();
    }
  };
  const columns = [
    {
      header: "Name",
      accessor: "name",
    },
    { header: "Email", accessor: "email" },
    { header: "CNIC", accessor: "cnic" },
    { header: "Account Number", accessor: "cellNumber" },
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
      render: (dataRow) => (
        <>
          <Menu>
            <MenuButton className="focus:outline-none">
              <MoreVert
                className="cursor-pointer "
                onClick={() => setBorrowerId(dataRow?.id)}
              />
            </MenuButton>
            <MenuItems
              anchor="left-start"
              className="bg-gray-800 w-45 rounded-md py-2 px-1 space-y-1 focus:outline-none"
            >
              <MenuItem>
                <a
                  className="block data-focus:bg-gray-400  text-white px-2 py-1 rounded-md cursor-pointer"
                  onClick={() => handleOpen(dataRow)}
                >
                  Edit
                </a>
              </MenuItem>

              <MenuItem>
                <a
                  onClick={() => handleOpenDeleteDialog(dataRow.id)}
                  className="block data-focus:bg-red-500 data-focus:text-white px-2 py-1 text-red-600 cursor-pointer rounded-md"
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
            {!showBorrowerBTN ? (
              <button
                onClick={handleOpen}
                className="bg-gray-800 text-white py-3 px-4 rounded-sm cursor-pointer"
              >
                Add Borrower
              </button>
            ) : (
              <button
                onClick={loanFormOpen}
                className="bg-gray-800 text-white py-3 px-4 rounded-sm cursor-pointer"
              >
                Take Loan
              </button>
            )}
          </div>
          <div className="mt-4">
            <Table columns={columns} loading={loadingBorrower} data={data} />
          </div>
        </div>
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
                      <div>
                        <label className="mt-1 block text-sm text-gray-700 font-medium">
                          Account Number
                        </label>
                        <input
                          type="number"
                          className=" mt-1 block w-full border rounded-sm border-gray-300 p-2"
                          name="number"
                          value={cellNumber}
                          onChange={(e) => setCellNumber(e.target.value)}
                          placeholder="Account Number(JazzCash,EasyPaisa)"
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

        <Dialog open={loanForm} onClose={loanFormClose} fullWidth maxWidth="sm">
          <DialogTitle>Make a loan Request</DialogTitle>
          <DialogContent dividers>
            <div>
              {!checkingBorrowerAdd ? (
                <CircularProgress size={19} />
              ) : (
                <>
                  <div>
                    <p className="mb-4 font-bold">Your Detail:</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <p className="font-medium">
                        Name:{" "}
                        <span className="text-gray-500">
                          {checkingBorrowerAdd?.name}
                        </span>
                      </p>
                      <p className="font-medium">
                        Email:{" "}
                        <span className="text-gray-500">
                          {checkingBorrowerAdd?.email}
                        </span>
                      </p>
                      <p className="font-medium">
                        Cnic:{" "}
                        <span className="text-gray-500">
                          {checkingBorrowerAdd?.cnic}
                        </span>
                      </p>
                      <p className="font-medium">
                        Account Number:{" "}
                        <span className="text-gray-500">
                          {checkingBorrowerAdd?.cellNumber}
                        </span>
                      </p>
                      <p className="font-medium">
                        Date Of Birth:{" "}
                        <span className="text-gray-500">
                          {checkingBorrowerAdd?.date
                            ? checkingBorrowerAdd.date
                                .toDate()
                                .toLocaleDateString("en-GB", {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                })
                            : "N/A"}
                        </span>
                      </p>
                    </div>
                    <div>
                      <div className="mt-5">
                        <label htmlFor="loan " className="font-medium ">
                          Loan Amount:
                        </label>
                        <input
                          type="number"
                          placeholder="Enter the amount"
                          required
                          value={loanAmount ?? ""}
                          onChange={(e) =>
                            setLoanAmount(
                              e.target.value === ""
                                ? null
                                : Number(e.target.value)
                            )
                          }
                          className="mt-1 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none border border-gray-400 focus:border-gray-800 focus:outline-none w-full py-3 px-2 rounded-sm"
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </DialogContent>
          <DialogActions>
            <div className="py-3 flex w-full items-center justify-end gap-4 px-3">
              <button
                onClick={loanFormClose}
                className="hover:bg-gray-200 px-4 py-2 rounded-md cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={sendLoanReq}
                disabled={loadingForLoan}
                className={`${
                  loadingForLoan
                    ? "bg-green-500 cursor-not-allowed"
                    : "bg-green-600 cursor-pointer"
                } px-4 py-2 rounded-sm text-white `}
              >
                {loadingForLoan ? (
                  <span className="flex items-center gap-2">
                    <CircularProgress size={19} />
                    <span>Sending..</span>
                  </span>
                ) : (
                  " Send Req"
                )}
              </button>
            </div>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
};

export default BorrowerForm;
