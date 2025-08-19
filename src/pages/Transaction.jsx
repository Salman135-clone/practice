import { Backdrop, Box, CircularProgress, Modal } from "@mui/material";
import React, { useEffect, useState } from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import {
  collection,
  getDocs,
  doc,
  onSnapshot,
  query,
  where,
  addDoc,
} from "firebase/firestore";
import { db } from "../constant/Firebase";
import { toast } from "react-toastify";
import { FaDollarSign } from "react-icons/fa6";
import Table from "../components/Table";
import { authProvider } from "../context/MyProvider";
import MoreVert from "@mui/icons-material/MoreVert";
import {
  Menu,
  MenuButton,
  MenuItems,
  MenuItem as HMenuItem,
} from "@headlessui/react";

const Transaction = () => {
  const { allBorrowerList, loading } = authProvider();
  const [selectedCnic, setSelectedCnic] = useState("");
  const [borrowerList, setBorrowerList] = useState([]);
  const [PersonDetail, setPersonDetail] = useState("");
  const [loanAmount, setLoanAmount] = useState("");
  const [transactionData, setTransactionData] = useState([]);
  const [loadingRender, setLoadingRender] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState("");
  const [open, setOpen] = useState(false);
  const handelOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const merge = transactionData?.map((trans) => {
    const borrower = allBorrowerList.find(
      (item) => item.id === trans.borrowerID
    );
    return {
      ...borrower,
      ...trans,
    };
  });
  const loanType = [
    {
      id: 1,
      value: "Loan",
    },
  ];

  const sendingPayment = async () => {
    if (!loanAmount || !selectedLoan || !PersonDetail?.id || !selectedCnic) {
      toast.error(" Please fill in all fields and select a user CNIC.");
      return;
    }
    setPaymentLoading(true);
    try {
      await addDoc(collection(db, "transaction"), {
        borrowerID: PersonDetail?.id,
        loan: selectedLoan,
        Amount: loanAmount,
        status: "pending",
      });
      toast.success("Payment Send Successfully");
    } catch (err) {
      toast.error(err);
    } finally {
      setPaymentLoading(false);
      setLoanAmount(""),
        setSelectedLoan(""),
        setPersonDetail(""),
        setSelectedCnic("");
      setOpen(false);
    }
  };

  const selectedCnicPersonDetail = async () => {
    if (!selectedCnic) return;

    setLoadingRender(true);
    try {
      const dbQuery = query(
        collection(db, "borrower"),
        where("cnic", "==", selectedCnic)
      );
      const fetching = await getDocs(dbQuery);

      if (!fetching.empty) {
        const docData = fetching.docs[0];
        const result = { id: docData.id, ...docData.data() };
        setPersonDetail(result);
      }
    } catch (err) {
      toast.error(err);
    } finally {
      setLoadingRender(false);
    }
  };

  useEffect(() => {
    selectedCnicPersonDetail();
  }, [selectedCnic]);

  useEffect(() => {
    const fetchBorrower = onSnapshot(
      collection(db, "borrower"),
      (q) => {
        const getResult = q.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setBorrowerList(getResult);
      },
      (error) => {
        toast.error(error);
      }
    );
    return () => fetchBorrower();
  }, []);

  useEffect(() => {
    const transactionFetch = onSnapshot(
      collection(db, "transaction"),
      (snapshot) => {
        const fetchResult = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTransactionData(fetchResult);
      },
      (error) => {
        toast.error(error);
      }
    );
    return () => transactionFetch();
  }, []);

  const columns = [
    {
      header: "Borrower Name",
      accessor: "name",
    },
    { header: "Email", accessor: "email" },
    { header: "CNIC", accessor: "cnic" },
    { header: "Loan Amount", accessor: "Amount" },
    { header: "Loan Status", accessor: "status" },
    {
      header: "Action",
      disableSort: true,
      render: () => (
        <Menu>
          <MenuButton className="focus:outline-none">
            <MoreVert className="cursor-pointer " />
          </MenuButton>
          <MenuItems
            anchor="left-start"
            className="bg-gray-200 w-45 rounded-md py-2 space-y-1 focus:outline-none"
          >
            <HMenuItem>
              <button
                className="block cursor-pointer w-full text-left data-focus:bg-gray-400 px-2 py-1"
                href="#"
              >
                Success
              </button>
            </HMenuItem>

            <HMenuItem>
              <button
                className="block w-full text-left data-focus:bg-red-500 data-focus:text-white px-2 py-1 text-red-600"
                href="#"
              >
                Delete
              </button>
            </HMenuItem>
          </MenuItems>
        </Menu>
      ),
    },
  ];

  return (
    <>
      <div className="pt-8">
        <span className="font-bold text-3xl">Transaction</span>
        <div className="mt-3">
          <div className="payment-btn-container flex items-center justify-between">
            <div className="flex items-center">
              <span className="font-semibold text-2xl">Balance:</span>
              <span className="text-gray-500 mt-0.5 text-xl">10,000</span>
            </div>
            <div>
              <button
                onClick={handelOpen}
                className="bg-gray-800 text-white py-3 px-4 rounded-sm cursor-pointer"
              >
                New Transaction
              </button>
            </div>
          </div>
          <div className="mt-5">
            <Table columns={columns} loading={loading} data={merge} />
          </div>
        </div>
        <Modal open={open} onClose={handleClose}>
          <Box
            sx={{
              bgcolor: "background.paper",
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%,-50%)",
              width: "100%",
              maxWidth: "70%",
              borderRadius: "4px",
              outline: "none",
            }}
          >
            <div className="px-3 py-5 ">
              <div className="header-continer flex justify-between items-center  pb-4">
                <div className="header font-bold text-2xl ">
                  Create Transition
                </div>
                <div>
                  <span
                    onClick={handleClose}
                    className="text-gray-500 font-semibold text-lg cursor-pointer"
                  >
                    X
                  </span>
                </div>
              </div>
              <div>
                <div className="dropList mt-2">
                  <FormControl fullWidth>
                    <InputLabel>Search Cnic</InputLabel>
                    <Select
                      value={selectedCnic}
                      onChange={(e) => setSelectedCnic(e.target.value)}
                      label="Search Cnic"
                    >
                      {borrowerList?.map((item) => (
                        <MenuItem key={item.id} value={item.cnic}>
                          {item.cnic}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
                {loadingRender ? (
                  <div className="w-full h-[400px] flex items-center justify-center">
                    <CircularProgress />
                  </div>
                ) : PersonDetail ? (
                  <div className="mt-3">
                    <span className="font-semibold text-lg">
                      Person Detail:
                    </span>
                    <div>
                      <div className="mt-3">
                        <label className="text-black font-medium">ID:</label>
                        <span className="text-gray-500 ml-2">
                          {PersonDetail.id}
                        </span>
                      </div>
                      <div className="mt-3">
                        <label className="text-black font-medium">Name:</label>
                        <span className="text-gray-500 ml-2">
                          {PersonDetail.name}
                        </span>
                      </div>
                      <div className="mt-3">
                        <label className="text-black font-medium">Email:</label>
                        <span className="text-gray-500 ml-2">
                          {PersonDetail.email}
                        </span>
                      </div>
                      <div className="mt-3">
                        <label className="text-black font-medium">
                          Date of birth:
                        </label>
                        <span className="text-gray-500 ml-2">
                          {PersonDetail.date?.toDate().toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="loanContainer mt-4">
                      <span className="font-semibold text-lg mt-3">
                        Loan Detail:
                      </span>
                      <div className="loan-detail-container flex gap-4  justify-between mt-3">
                        <div className="flex-1">
                          <FormControl fullWidth>
                            <InputLabel>Type of loan</InputLabel>
                            <Select
                              label="Type of loan"
                              value={selectedLoan}
                              onChange={(e) => setSelectedLoan(e.target.value)}
                            >
                              {loanType?.map((loan) => (
                                <MenuItem key={loan.id} value={loan.value}>
                                  {loan.value}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </div>
                        <div className="flex-1">
                          <div className="input-field relative ">
                            <input
                              type="text"
                              value={loanAmount}
                              onChange={(e) => setLoanAmount(e.target.value)}
                              placeholder="Loan Amount"
                              className=" border border-gray-300 pl-[25px]  py-4 rounded-md w-full "
                            />
                            <FaDollarSign className="absolute top-5.5 left-1 text-gray-400 " />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  ""
                )}
              </div>
              <div className="button pb-6 mt-6 ">
                <div className="flex gap-4 w-full justify-end">
                  <button
                    onClick={handleClose}
                    className="cancelBTN w-30 text-center hover:bg-gray-200 py-3 px-4 rounded-sm cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={sendingPayment}
                    disabled={paymentLoading}
                    className={`sendBTN w-30 ${
                      paymentLoading
                        ? "bg-gray-600 cursor-not-allowed"
                        : "bg-gray-800  hover:bg-gray-900 cursor-pointer"
                    } text-center text-white  py-3 px-4 rounded-sm `}
                  >
                    <span className="flex gap-2 items-center justify-center">
                      {paymentLoading && <CircularProgress size={19} />}
                      {paymentLoading ? "Sending" : "Send"}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </Box>
        </Modal>
      </div>
    </>
  );
};

export default Transaction;
