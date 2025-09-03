// {
//     import React, { useEffect, useState } from "react";
// import Modal from "@mui/material/Modal";
// import {
//   Box,
//   CircularProgress,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogTitle,
// } from "@mui/material";
// import { DatePicker } from "@mui/x-date-pickers/DatePicker";
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
// import Tab from "@mui/material/Tab";
// import TabContext from "@mui/lab/TabContext";
// import TabList from "@mui/lab/TabList";
// import TabPanel from "@mui/lab/TabPanel";
// import { toast } from "react-toastify";
// import {
//   doc,
//   addDoc,
//   collection,
//   deleteDoc,
//   getDocs,
//   onSnapshot,
// } from "firebase/firestore";
// import { db } from "../constant/Firebase";
// import Table from "../components/Table";
// import MoreVert from "@mui/icons-material/MoreVert";
// import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
// import { authProvider } from "../context/MyProvider";
// import { HiOutlineExclamationCircle } from "react-icons/hi";

// const Borrower = () => {
//   const { allBorrowerList, loadingBorrower } = authProvider();
//   const [open, setOpen] = useState(false);
//   const [deleteDialog, setDeleteDialog] = useState(false);
//   const [tabValue, setTabValue] = useState("basic");
//   const [loading, setLoading] = useState(false);
//   const [dob, setDOB] = useState(null);
//   const [deleteBorrowerId, setDeleteBorrowerId] = useState("");
//   const [loadingForAdd, setLoadingForAdd] = useState(false);
//   console.log(deleteBorrowerId);

//   const handleOpenDeleteDialog = (id) => {
//     setDeleteDialog(true);
//     setDeleteBorrowerId(id);
//   };
//   const handleCloseDeleteDialog = () => setDeleteDialog(false);

//   const [basicInfo, setBasicInfo] = useState({
//     name: "",
//     email: "",
//     gender: "",
//   });
//   const [addressInfo, setAddressInfo] = useState({
//     address: "",
//     cnic: "",
//     employ: "",
//   });

//   const handleOpen = () => setOpen(true);
//   const handleClose = () => setOpen(false);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setBasicInfo((prev) => ({ ...prev, [name]: value }));
//   };

//   const addressInputChange = (e) => {
//     const { name, value } = e.target;
//     setAddressInfo((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleChange = (event, newValue) => {
//     setTabValue(newValue);
//   };

//   const addDetail = async () => {
//     const { name, email, gender } = basicInfo;
//     const { address, employ, cnic } = addressInfo;
//     try {
//       setLoadingForAdd(true);
//       const date = dob?.toDate();
//       await addDoc(collection(db, "borrower"), {
//         name,
//         email,
//         gender,
//         date,
//         address,
//         cnic,
//         employ,
//       });
//       toast.success("Successfully added");
//     } catch (err) {
//       toast.error(err);
//     } finally {
//       setLoadingForAdd(false);
//     }
//   };

//   const deleteBorrower = async (id) => {
//     setLoading(true);
//     try {
//       await deleteDoc(doc(db, "borrower", id));
//       toast.success("Delete Successfully");
//     } catch (err) {
//       toast.error("Borrower Delete Successfully");
//     } finally {
//       setLoading(false);
//       setDeleteBorrowerId("");
//       setDeleteDialog(false);
//     }
//   };

//   const columns = [
//     {
//       header: "Name",
//       accessor: "name",
//     },
//     { header: "Email", accessor: "email" },
//     { header: "CNIC", accessor: "cnic" },
//     { header: "Account Number", accessor: "cellNumber" },
//     { header: "Employment", accessor: "employ" },
//     { header: "Gender", accessor: "gender" },
//     {
//       header: "Date",
//       accessor: "date",
//       render: (row) => <div>{row.date?.toDate().toLocaleDateString()}</div>,
//     },
//     { header: "Address", accessor: "address" },
//     {
//       header: "Action",
//       disableSort: true,
//       render: (dataRow) => (
//         <>
//           <Menu>
//             <MenuButton className="focus:outline-none">
//               <MoreVert className="cursor-pointer " />
//             </MenuButton>
//             <MenuItems
//               anchor="left-start"
//               className="bg-gray-200 w-45 rounded-md py-2 space-y-1 focus:outline-none"
//             >
//               <MenuItem>
//                 <a className="block data-focus:bg-gray-400 px-2 py-1" href="#">
//                   View
//                 </a>
//               </MenuItem>
//               <MenuItem>
//                 <a className="block data-focus:bg-gray-400 px-2 py-1 " href="#">
//                   View Transaction
//                 </a>
//               </MenuItem>
//               <MenuItem>
//                 <a
//                   onClick={() => handleOpenDeleteDialog(dataRow.id)}
//                   className="block data-focus:bg-red-500 data-focus:text-white px-2 py-1 text-red-600 cursor-pointer"
//                 >
//                   Delete
//                 </a>
//               </MenuItem>
//             </MenuItems>
//           </Menu>
//         </>
//       ),
//     },
//   ];

//   return (
//     <>
//       <div className="pt-8">
//         <span className="font-bold text-3xl">Borrower</span>
//         <div className=" mt-3">
//           <div className="add-borrower flex justify-end">
//             <button
//               onClick={handleOpen}
//               className="bg-gray-800 text-white py-3 px-4 rounded-sm cursor-pointer"
//             >
//               Add Borrower
//             </button>
//           </div>

//           <div className="mt-5">
//             <Table
//               columns={columns}
//               data={allBorrowerList}
//               loading={loadingBorrower}
//             />
//           </div>
//           <p>Perosn list show here</p>
//           <Modal
//             sx={{
//               display: "flex",
//               justifyContent: "center",
//               alignItems: "center",
//             }}
//             open={open}
//             onClose={handleClose}
//           >
//             <Box
//               sx={{
//                 bgcolor: "background.paper",
//                 padding: 2,
//                 maxWidth: "70%",
//                 width: "100%",
//                 borderRadius: "8px",
//               }}
//             >
//               <TabContext value={tabValue}>
//                 <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
//                   <TabList onChange={handleChange}>
//                     <Tab label="Basic Info" value="basic" />
//                     <Tab label="Address" value="address" />
//                   </TabList>
//                 </Box>
//                 <TabPanel value="basic">
//                   <div>
//                     <span className="font-semibold text-2xl ">
//                       Basic Information
//                     </span>
//                     <div className="mt-4 max-h-[80vh] overflow-y-auto ">
//                       <form>
//                         <div>
//                           <label className="block text-sm text-gray-700 font-medium">
//                             Full Name
//                           </label>
//                           <input
//                             type="text"
//                             className=" mt-1 block w-full border rounded-sm border-gray-300 p-2"
//                             name="name"
//                             id="name"
//                             required
//                             placeholder="Enter Full Name"
//                             value={basicInfo.name}
//                             onChange={handleInputChange}
//                           />
//                         </div>
//                         <div>
//                           <label className="mt-1 block text-sm text-gray-700 font-medium">
//                             Email Address
//                           </label>
//                           <input
//                             type="email"
//                             className=" mt-1 block w-full border rounded-sm border-gray-300 p-2"
//                             name="email"
//                             id="email"
//                             placeholder="Enter Your Email"
//                             onChange={handleInputChange}
//                             value={basicInfo.email}
//                             required
//                           />
//                         </div>
//                         <div>
//                           <label className=" mt-1 block text-sm text-gray-700 font-medium">
//                             Gender
//                           </label>
//                           <input
//                             type="gender"
//                             className=" mt-1 block w-full border rounded-sm border-gray-300 p-2"
//                             name="gender"
//                             id="gender"
//                             placeholder="Your Gender"
//                             value={basicInfo.gender}
//                             onChange={handleInputChange}
//                           />
//                         </div>
//                         <div>
//                           <label className="mt-1 mb-1 block text-sm text-gray-700 font-medium">
//                             Date of Birth
//                           </label>
//                           <LocalizationProvider dateAdapter={AdapterDayjs}>
//                             <DatePicker
//                               sx={{ width: "100%" }}
//                               value={dob}
//                               onChange={(newValue) => setDOB(newValue)}
//                               required
//                             />
//                           </LocalizationProvider>
//                         </div>
//                       </form>
//                       <div>
//                         <button
//                           onClick={() => setTabValue("address")}
//                           className="cursor-pointer w-full bg-gray-800 text-white rounded-sm mt-3 py-3 px-4 text-xl"
//                         >
//                           Next
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 </TabPanel>
//                 <TabPanel value={"address"}>
//                   <div>
//                     <span className="font-semibold text-2xl ">
//                       Address & Identity
//                     </span>
//                     <div className="mt-4 max-h-[80vh] overflow-y-auto ">
//                       <form>
//                         <div>
//                           <label className="block text-sm text-gray-700 font-medium">
//                             Current Address
//                           </label>
//                           <input
//                             type="text"
//                             className=" mt-1 block w-full border rounded-sm border-gray-300 p-2"
//                             name="address"
//                             id="address"
//                             required
//                             value={addressInfo.address}
//                             onChange={addressInputChange}
//                             placeholder="Enter Your Current Address"
//                           />
//                         </div>
//                         <div>
//                           <label className="mt-1 block text-sm text-gray-700 font-medium">
//                             National ID / CNIC Number
//                           </label>
//                           <input
//                             type="cnic"
//                             className=" mt-1 block w-full border rounded-sm border-gray-300 p-2"
//                             name="cnic"
//                             id="cnic"
//                             required
//                             value={addressInfo.cnic}
//                             onChange={addressInputChange}
//                             placeholder="Enter Your CNIC Number"
//                           />
//                         </div>
//                         <div>
//                           <label className="mt-1 block text-sm text-gray-700 font-medium">
//                             Employment Status
//                           </label>
//                           <input
//                             type="employ"
//                             className=" mt-1 block w-full border rounded-sm border-gray-300 p-2"
//                             name="employ"
//                             id="employ"
//                             value={addressInfo.employ}
//                             onChange={addressInputChange}
//                             placeholder="Employment Status (employed, self-employed, unemployed)"
//                           />
//                         </div>
//                       </form>
//                       <div>
//                         <button
//                           disabled={loadingForAdd}
//                           onClick={addDetail}
//                           className={` w-full text-white rounded-sm mt-3 py-3 px-4 text-xl ${
//                             loadingForAdd
//                               ? "bg-gray-600 cursor-not-allowed"
//                               : " bg-gray-800 cursor-pointer"
//                           }`}
//                         >
//                           <span className="flex items-center gap-2 justify-center">
//                             {loadingForAdd && (
//                               <CircularProgress size={20} color="inherit" />
//                             )}
//                             {loadingForAdd ? "Saving" : " Add"}
//                           </span>
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 </TabPanel>
//               </TabContext>
//             </Box>
//           </Modal>

//           <Dialog open={deleteDialog} onClose={handleCloseDeleteDialog}>
//             <DialogTitle>
//               <div></div>
//             </DialogTitle>
//             <DialogContent>
//               <div>
//                 <HiOutlineExclamationCircle className="mb-4  w-14 h-14 mx-auto text-gray-400 dark:text-gray-200" />
//                 <p
//                   className="
//                 text-lg font-medium text-gray-500 dark:text-gray-400"
//                 >
//                   Are you sure you want to delete this product?
//                 </p>
//               </div>
//             </DialogContent>
//             <DialogActions>
//               <div className="flex gap-4 px-4 mb-4">
//                 <button
//                   onClick={handleCloseDeleteDialog}
//                   className="hover:bg-gray-200 px-4 py-2 rounded-md cursor-pointer"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={() => deleteBorrower(deleteBorrowerId)}
//                   disabled={loading}
//                   className="bg-red-600 px-4 py-2 rounded-md text-white cursor-pointer hover:bg-red-700"
//                 >
//                   {loading ? (
//                     <span className="flex items-center gap-2">
//                       <CircularProgress size={17} />
//                       <p>Deleting...</p>
//                     </span>
//                   ) : (
//                     "Delete"
//                   )}
//                 </button>
//               </div>
//             </DialogActions>
//           </Dialog>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Borrower;

// }
