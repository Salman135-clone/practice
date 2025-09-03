import { Backdrop, Box, CircularProgress, Modal } from "@mui/material";
import React, { useEffect, useState } from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import {
  collection,
  getDocs,
  doc,
  onSnapshot,
  query,
  where,
  addDoc,
  updateDoc,
  runTransaction,
  getDoc,
  orderBy,
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
import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/react";
import { createFilterOptions } from "@mui/material/Autocomplete";
import { GrSearch } from "react-icons/gr";
import { MdOutlineClear } from "react-icons/md";
import { useDebounce } from "use-debounce";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const AdminTransaction = () => {
  const { allBorrowerList, loadingBorrower, roleName, user } = authProvider();
  const [selectedCnic, setSelectedCnic] = useState(null);
  // const [borrowerList, setBorrowerList] = useState([]);
  const [personDetail, setPersonDetail] = useState("");
  const [loanAmount, setLoanAmount] = useState("");
  const [transactionData, setTransactionData] = useState([]);
  const [loadingRender, setLoadingRender] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState("Loan");
  const [clickTransactionId, setClickTransactionId] = useState(null);
  const [idBorrower, setIdBorrower] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [results, setResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [open, setOpen] = useState(false);
  console.log(transactionData);
  console.log(idBorrower);

  const handelOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setPersonDetail("");
    clearTextField();
  };

  const clearTextField = () => {
    setSearchText("");
    setSelectedCnic("");
    setPersonDetail("");
  };

  useEffect(() => {
    const fetchResult = async () => {
      if (!searchText.trim()) {
        setResults([]);
        return;
      }

      setSearchLoading(true);
      try {
        const borrowerDB = collection(db, "borrower");
        const nameQuery = query(
          borrowerDB,
          where("name", ">=", searchText),
          where("name", "<=", searchText + "\uf8ff")
        );
        const emailQuery = query(
          borrowerDB,
          where("email", ">=", searchText),
          where("email", "<=", searchText + "\uf8ff")
        );
        const cnicQuery = query(
          borrowerDB,
          where("cnic", ">=", searchText),
          where("cnic", "<=", searchText + "\uf8ff")
        );
        const nameQuerySnap = await getDocs(nameQuery);
        const resultName = nameQuerySnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const emailQuerySnap = await getDocs(emailQuery);
        const resultEmail = emailQuerySnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const cnicQuerySnap = await getDocs(cnicQuery);
        const resultCnic = cnicQuerySnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const mergeAllQuery = [...resultName, ...resultEmail, ...resultCnic];
        setResults(mergeAllQuery);
      } catch (err) {
        throw new Error(err);
      } finally {
        setSearchLoading(false);
      }
    };

    fetchResult();
  }, [searchText]);

  const loanType = [
    {
      id: 1,
      value: "Loan",
    },
  ];

  const sendingPayment = async () => {
    if (!loanAmount || !personDetail?.id || !selectedCnic) {
      toast.error(" Please fill in all fields and select a user CNIC.");
      return;
    }
    setPaymentLoading(true);
    try {
      await addDoc(collection(db, "transaction"), {
        borrowerID: personDetail?.id,
        loan: selectedLoan,
        Amount: loanAmount,
        status: "pending",
        uid: user?.uid,
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
    if (!selectedCnic?.id) return;

    setLoadingRender(true);
    try {
      const fetchBorrower = await getDoc(doc(db, "borrower", selectedCnic?.id));
      if (fetchBorrower.exists()) {
        const resultBorrower = {
          id: fetchBorrower.id,
          ...fetchBorrower.data(),
        };
        setPersonDetail(resultBorrower);
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

  // useEffect(() => {
  //   const fetchBorrower = onSnapshot(
  //     collection(db, "borrower"),
  //     (q) => {
  //       const getResult = q.docs.map((doc) => ({
  //         id: doc.id,
  //         ...doc.data(),
  //       }));
  //       setBorrowerList(getResult);
  //     },
  //     (error) => {
  //       toast.error(error);
  //     }
  //   );
  //   return () => fetchBorrower();
  // }, []);

  useEffect(() => {
    if (roleName !== "Admin" && user?.uid) {
      const borrower = allBorrowerList.find((b) => b.createdBy === user?.uid);
      setIdBorrower(borrower?.id || null);
    }
  }, [roleName, user?.uid, allBorrowerList]);

  const mergeData = transactionData?.map((val) => {
    const borrowerData = allBorrowerList.find((b) => b.id === val.borrowerID);

    return {
      ...val,
      borrowerInfo: borrowerData || null,
    };
  });

  useEffect(() => {
    const dbRef = collection(db, "transaction");
    let q;
    if (roleName === "Admin") {
      q = query(dbRef, orderBy("createdAt", "desc"));
    } else if (idBorrower) {
      q = query(
        dbRef,
        where("borrowerID", "==", idBorrower),
        orderBy("createdAt", "desc")
      );
    } else {
      return;
    }

    const transactionFetch = onSnapshot(
      q,
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
  }, [idBorrower]);

  const sendingMoney = async (status) => {
    if (!user?.uid) return;
    toast.promise(
      async () => {
        const transactionRef = doc(db, "transaction", clickTransactionId);
        const transactionDocSnap = await getDoc(transactionRef);
        if (!transactionDocSnap.exists()) {
          // toast.error("Transaction  not found");
          return "Transaction";
        }
        const transactionDocSnapResult = transactionDocSnap.data();
        const loanAmountGet = transactionDocSnapResult.Amount;
        const userId = transactionDocSnapResult.uid;
        const borrowerid = transactionDocSnapResult.borrowerID;

        const walletRef = collection(db, "wallet");
        const adminWalletQuery = query(
          walletRef,
          where("uid", "==", user?.uid)
        );
        const adminDocSnap = await getDocs(adminWalletQuery);
        if (adminDocSnap.empty) {
          // toast.error("Admin wallet not found.");
          return "Admin Wallet";
        }
        const adminWalletResult = adminDocSnap.docs[0];

        const userWalletFoundQuery = query(
          walletRef,
          where("uid", "==", userId)
        );
        const getUserWallet = await getDocs(userWalletFoundQuery);
        if (getUserWallet.empty) {
          // toast.error("User wallet not found.");
          return "User Wallet";
        }
        const userWalletResult = getUserWallet.docs[0];

        const addToRepay = async () => {
          if (!clickTransactionId || !borrowerid || !user?.uid) {
            toast.error("Missing transaction details");
            return;
          }

          try {
            await addDoc(collection(db, "repayment"), {
              transactionId: clickTransactionId,
              LoanAmount: loanAmountGet,
              uid: userId,
              // repayAmount: Number(loanAmountGet),
              borrowerId: borrowerid,
              status: "Unpaid",
              createdAt: new Date(),
              paidOn: "—",
            });
          } catch (err) {
            toast.error(err.message || "Error adding repayment");
          }
        };

        if (status === "success") {
          await runTransaction(db, async (tx) => {
            const adminSnap = await tx.get(adminWalletResult.ref);
            const userSnap = await tx.get(userWalletResult.ref);

            const adminBalance = adminSnap.data().balance;
            const userBalance = userSnap.data().balance;

            if (adminBalance < loanAmountGet)
              throw new Error("Insufficient funds");
            tx.update(adminWalletResult.ref, {
              balance: adminBalance - loanAmountGet,
            });

            tx.update(userWalletResult.ref, {
              balance: userBalance + loanAmountGet,
            });

            tx.update(transactionRef, { status: "success" });
            // toast.success("Payment sent successfully!");
          });
          await addToRepay();
          return "Success";
        } else if (status === "revert") {
          await runTransaction(db, async (rv) => {
            const currentAdminDoc = await rv.get(adminWalletResult.ref);
            const currentUserDoc = await rv.get(userWalletResult.ref);

            const currentAdminBalance = currentAdminDoc.data().balance;
            const currentUserBalance = currentUserDoc.data().balance;
            if (currentUserBalance < loanAmountGet)
              throw new Error("Insufficient funds on user wallet");
            rv.update(adminWalletResult.ref, {
              balance: currentAdminBalance + loanAmountGet,
            });
            rv.update(userWalletResult.ref, {
              balance: currentUserBalance - loanAmountGet,
            });

            rv.update(transactionRef, { status: "revert" });
            // toast.success("Payment revert successfully!");
          });
          return "revert";
        } else {
          const checkingStatus = transactionDocSnap.data();
          const currentStatus = checkingStatus.status;

          if (currentStatus === "success" || currentStatus === "revert") {
            return "Already Process";
          } else if (currentStatus === "decline") {
            return "Already Decline";
          }
          await updateDoc(transactionRef, { status: status });
          return `${status}`;
        }
      },
      {
        pending: "Processing...",
        success: {
          render: (payload) => {
            const notiStatus = payload.data?.toLowerCase();
            switch (notiStatus) {
              case "success":
                return "Payment Send Successfully";
              case "revert":
                return "Payment revert Successfully";
              case "already process":
                return "This transaction is already processed and can’t be declined.";
              case "already decline":
                return "Transaction is already decline";
              case "user wallet":
                return "User wallet not found.";
              case "admin wallet":
                return "Admin wallet not found.";
              case "transaction":
                return "Transaction not found.";
              default:
                return `Transaction marked as ${notiStatus}`;
            }
          },
        },
        error: {
          render: (payload) => {
            return payload.data?.message || "Something Went Wrong";
          },
        },
      }
    );
  };

  const columns = [
    {
      header: "Borrower Name",
      accessor: "name",
      render: (dataRow) => dataRow.borrowerInfo?.name,
    },
    {
      header: "Email",
      accessor: "email",
      render: (dataRow) => dataRow.borrowerInfo?.email,
    },
    {
      header: "CNIC",
      accessor: "cnic",
      render: (dataRow) => dataRow.borrowerInfo?.cnic,
    },
    {
      header: "Loan Amount",
      accessor: "Amount",
      render: (dataRow) => `PKR ${dataRow.Amount.toLocaleString()}`,
    },
    {
      header: "Loan Status",
      accessor: "status",

      render: (dataRow) => {
        let statusClass = "";
        if (dataRow.status === "pending") {
          statusClass =
            "text-gray-500 border border-gray-300 px-2 py-1 rounded";
        } else if (dataRow.status === "success") {
          statusClass =
            "text-green-600 border border-green-300 px-2 py-1 rounded ";
        } else if (dataRow.status === "decline") {
          statusClass = "text-red-600 border border-red-300 px-2 py-1 rounded";
        } else if (dataRow.status === "revert") {
          statusClass =
            "border border-yellow-600 text-yellow-600 px-2 py-1 rounded-md";
        }
        return (
          <span className={`${statusClass} `}>
            {dataRow.status.charAt(0).toUpperCase() + dataRow.status.slice(1)}
          </span>
        );
      },
    },
    {
      header: "Action",
      disableSort: true,
      render: (dataRow) => (
        <>
          {roleName === "Admin" ? (
            <Menu>
              <MenuButton className="focus:outline-none">
                <MoreVert
                  onClick={() => setClickTransactionId(dataRow?.id)}
                  className="cursor-pointer "
                />
              </MenuButton>
              <MenuItems
                anchor="left-start"
                className="bg-gray-800 w-45 rounded-md py-2 px-1 space-y-1 focus:outline-none"
              >
                {dataRow?.status === "success" ? (
                  <HMenuItem>
                    <button
                      className="block cursor-pointer w-full text-left data-focus:bg-gray-600 px-2 py-1 text-white rounded-md"
                      onClick={() => sendingMoney("revert")}
                    >
                      Revert Transaction
                    </button>
                  </HMenuItem>
                ) : (
                  <HMenuItem>
                    <button
                      className="block cursor-pointer w-full text-left data-focus:bg-green-600 px-2 py-1 text-white hover:text-white rounded-md"
                      onClick={() => sendingMoney("success")}
                    >
                      Success
                    </button>
                  </HMenuItem>
                )}

                <HMenuItem>
                  <button
                    className="block w-full text-left data-focus:bg-red-500 hover:text-white cursor-pointer rounded-md px-2 py-1 text-red-500"
                    onClick={() => sendingMoney("decline")}
                  >
                    Decline
                  </button>
                </HMenuItem>
              </MenuItems>
            </Menu>
          ) : (
            <Menu>
              <MenuButton className="focus:outline-none">
                <MoreVert
                  onClick={() => setClickTransactionId(dataRow.id)}
                  className="cursor-pointer "
                />
              </MenuButton>
              <MenuItems
                anchor="left-start"
                className="bg-gray-800  w-40 rounded-md py-2 space-y-1 px-1 focus:outline-none"
              >
                <HMenuItem>
                  <button className="block w-full text-left data-focus:bg-gray-400 cursor-pointer text-white hover:text-black px-2 py-1 rounded-md">
                    View Transaction
                  </button>
                </HMenuItem>
                {/* <HMenuItem>
                    <button className="block w-full text-left data-focus:bg-red-700 cursor-pointer text-white px-2 py-1 rounded-md">
                      Delete
                    </button>
                  </HMenuItem> */}
              </MenuItems>
            </Menu>
          )}
        </>
      ),
    },
  ];

  return (
    <>
      <div className="pt-8">
        <span className="font-bold text-3xl">Transaction</span>
        <div className="mt-3">
          <div className="payment-btn-container flex items-center justify-end">
            {roleName === "Admin" ? (
              <>
                <div className="mr-2">
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="default" size="default">
                        New Transaction
                      </Button>
                    </SheetTrigger>
                    <SheetContent className="flex flex-col">
                      <SheetHeader>
                        <SheetTitle className="font-bold ">
                          Create Transition
                        </SheetTitle>
                        <SheetDescription>
                          Use this form to manually create a transition entry.
                        </SheetDescription>
                      </SheetHeader>

                      <div className="flex-1 ">
                        <>
                          <div className="relative mb-4">
                            <Combobox
                              value={selectedCnic}
                              onChange={(item) => setSelectedCnic(item)}
                            >
                              <div className="relavtive">
                                <ComboboxInput
                                  placeholder="Search by name, email or CNIC..."
                                  displayValue={(b) => b?.name || ""}
                                  // value={searchText}
                                  onChange={(e) =>
                                    setSearchText(e.target.value)
                                  }
                                  className={`border border-gray-300 ${
                                    searchText.length > 0
                                      ? "pr-[30px] pl-4 "
                                      : " pl-[30px]"
                                  } py-4 rounded-md w-full relative`}
                                />
                                {searchLoading ? (
                                  <CircularProgress
                                    size={20}
                                    className="absolute top-5 right-5 "
                                  />
                                ) : searchText.length > 0 ? (
                                  <MdOutlineClear
                                    className="absolute top-5 right-2 text-gray-400 hover:bg-gray-100 cursor-pointer "
                                    size={25}
                                    onClick={clearTextField}
                                  />
                                ) : (
                                  <GrSearch
                                    className="absolute top-5 left-2  text-gray-400 hover:bg-gray-100 cursor-pointer "
                                    size={20}
                                  />
                                )}
                              </div>
                              <ComboboxOptions className="bg-white shadow-lg absolute z-10 w-full max-h-[400px] overflow-y-auto rounded-b-sm">
                                {results.map((item) => (
                                  <ComboboxOption
                                    key={item?.id}
                                    value={item}
                                    className="py-1 px-2"
                                  >
                                    <li
                                      key={item?.id}
                                      className="px-3 py-2 flex flex-col hover:bg-gray-100 cursor-pointer"
                                    >
                                      <p className="text-sm font-medium text-gray-700">
                                        Name: {item.name}
                                      </p>
                                      {item.email && (
                                        <p className="text-xs font-medium text-gray-700">
                                          Email: {item.email}
                                        </p>
                                      )}
                                      {item.cnic && (
                                        <p className="text-xs font-medium text-gray-700">
                                          CNIC: {item.cnic}
                                        </p>
                                      )}
                                    </li>
                                  </ComboboxOption>
                                ))}
                              </ComboboxOptions>
                            </Combobox>
                          </div>
                          {loadingRender ? (
                            <div className="w-full h-[400px] flex items-center justify-center">
                              <CircularProgress />
                            </div>
                          ) : personDetail ? (
                            <div className="mt-3">
                              <span className="font-semibold text-lg">
                                Person Detail:
                              </span>
                              <div>
                                <div className="mt-3">
                                  <label className="text-black font-medium">
                                    ID:
                                  </label>
                                  <span className="text-gray-500 ml-2">
                                    {personDetail.id}
                                  </span>
                                </div>
                                <div className="mt-3">
                                  <label className="text-black font-medium">
                                    Name:
                                  </label>
                                  <span className="text-gray-500 ml-2">
                                    {personDetail.name}
                                  </span>
                                </div>
                                <div className="mt-3">
                                  <label className="text-black font-medium">
                                    Email:
                                  </label>
                                  <span className="text-gray-500 ml-2">
                                    {personDetail.email}
                                  </span>
                                </div>
                                <div className="mt-3">
                                  <label className="text-black font-medium">
                                    Date of birth:
                                  </label>
                                  <span className="text-gray-500 ml-2">
                                    {personDetail.date
                                      ?.toDate()
                                      .toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ) : (
                            ""
                          )}
                          <div className="loanContainer mt-4">
                            <span className="font-semibold text-lg mt-3">
                              Loan Detail:
                            </span>
                            <div className="loan-detail-container flex gap-4  justify-between mt-3">
                              <div className="flex-1">
                                <div className="input-field relative ">
                                  <input
                                    type="text"
                                    value={loanAmount}
                                    onChange={(e) =>
                                      setLoanAmount(e.target.value)
                                    }
                                    placeholder="Loan Amount"
                                    className=" border border-gray-300 pl-[25px]  py-4 rounded-md w-full "
                                  />
                                  <FaDollarSign className="absolute top-5.5 left-1 text-gray-400 " />
                                </div>
                              </div>
                            </div>
                          </div>
                        </>
                      </div>

                      <SheetFooter>
                        <Button
                          onClick={sendingPayment}
                          className={`sendBTN  ${
                            paymentLoading
                              ? "bg-gray-600 cursor-not-allowed"
                              : "bg-gray-800  hover:bg-gray-900 cursor-pointer"
                          }  `}
                          type="submit"
                        >
                          {paymentLoading && <CircularProgress size={20} />}
                          {paymentLoading ? "Sending" : "Send Money"}
                        </Button>
                        <SheetClose asChild>
                          <Button variant="outline">Close</Button>
                        </SheetClose>
                      </SheetFooter>
                    </SheetContent>
                  </Sheet>
                </div>
                {/* <div>
                  <button
                    onClick={handelOpen}
                    className="bg-gray-800 text-white py-3 px-4 rounded-sm cursor-pointer"
                  >
                    New Transaction
                  </button>
                </div> */}
              </>
            ) : (
              ""
            )}
          </div>
          <div className="mt-5">
            <Table
              columns={columns}
              loading={loadingBorrower}
              data={mergeData}
            />
          </div>
        </div>
        {/* <Modal open={open} onClose={handleClose}>
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
                <div className="header flex flex-col font-bold text-2xl ">
                  Create Transition
                  <span className="font-normal text-sm text-gray-500 mt-1 tracking-wide">
                    Use this form to manually create a transition entry.
                  </span>
                </div>
                <div>
                  <span onClick={handleClose}>
                    <MdOutlineClear
                      size={25}
                      className="text-gray-800 font-bold cursor-pointer hover:bg-gray-100 "
                    />
                  </span>
                </div>
              </div>
              <div>
                <div className="dropList mt-2">
                  <div>
                    <div className="relative mb-4">
                      <Combobox>
                        <div className="relavtive">
                          <ComboboxInput
                            placeholder="Search by name, email or CNIC..."
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            className={`border border-gray-300 ${
                              searchText.length > 0
                                ? "pr-[30px] pl-4 "
                                : " pl-[30px]"
                            } py-4 rounded-md w-full relative`}
                          />
                          {searchLoading ? (
                            <CircularProgress
                              size={25}
                              className="absolute top-4 right-5 "
                            />
                          ) : searchText.length > 0 ? (
                            <MdOutlineClear
                              className="absolute top-4 right-2 text-gray-400 hover:bg-gray-100 cursor-pointer "
                              size={25}
                              onClick={clearTextField}
                            />
                          ) : (
                            <GrSearch
                              className="absolute top-5 left-2  text-gray-400 hover:bg-gray-100 cursor-pointer "
                              size={20}
                            />
                          )}
                        </div>
                        <ComboboxOptions className="w- bg-white shadow-lg absolute z-10 w-full max-h-[400px] overflow-y-auto">
                          {results.map((item) => (
                            <ComboboxOption key={item?.id} value={item}>
                              <li
                                key={item.id}
                                className="px-3 flex  flex-col py-2 hover:bg-gray-100 cursor-pointer"
                              >
                                <p className="text-sm font-medium text-gray-700">
                                  Name: {item.name}
                                </p>
                                {item.email && (
                                  <p className="text-xs font-medium text-gray-700">
                                    Email: {item.email}
                                  </p>
                                )}
                                {item.cnic && (
                                  <p className="text-xs font-medium text-gray-700">
                                    CNIC: {item.cnic}
                                  </p>
                                )}
                              </li>
                            </ComboboxOption>
                          ))}
                        </ComboboxOptions>
                      </Combobox>
                    </div>
                  </div>
                  <FormControl fullWidth>
                    <InputLabel>Search Cnic</InputLabel>
                    <Select
                      value={selectedCnic}
                      onChange={(e) => setSelectedCnic(e.target.value)}
                      label="Search Cnic"
                    >
                      {allBorrowerList?.map((item) => (
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
                ) : personDetail ? (
                  <div className="mt-3">
                    <span className="font-semibold text-lg">
                      Person Detail:
                    </span>
                    <div>
                      <div className="mt-3">
                        <label className="text-black font-medium">ID:</label>
                        <span className="text-gray-500 ml-2">
                          {personDetail.id}
                        </span>
                      </div>
                      <div className="mt-3">
                        <label className="text-black font-medium">Name:</label>
                        <span className="text-gray-500 ml-2">
                          {personDetail.name}
                        </span>
                      </div>
                      <div className="mt-3">
                        <label className="text-black font-medium">Email:</label>
                        <span className="text-gray-500 ml-2">
                          {personDetail.email}
                        </span>
                      </div>
                      <div className="mt-3">
                        <label className="text-black font-medium">
                          Date of birth:
                        </label>
                        <span className="text-gray-500 ml-2">
                          {personDetail.date?.toDate().toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className=" ">
                      <div className="mt-3">
                        <span className="font-semibold text-lg">
                          Person Detail:
                        </span>
                      </div>
                    </div>
                  </>
                )}
              </div>
              <div className="loanContainer mt-4">
                <span className="font-semibold text-lg mt-3">Loan Detail:</span>
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
              <div className="button mt-6 ">
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
        </Modal> */}
      </div>
    </>
  );
};

export default AdminTransaction;
