import React, { useEffect, useState } from "react";
import Table from "@/components/Table";
import { MoreHorizontal } from "lucide-react";
import { authProvider } from "@/context/MyProvider";
import Button from "@mui/material/Button";
import {
  onSnapshot,
  query,
  collection,
  orderBy,
  where,
  doc,
  getDoc,
  getDocs,
  runTransaction,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/constant/Firebase";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { toast } from "react-toastify";
import { CircularProgress } from "@mui/material";

const Repayment = () => {
  const { roleName, allBorrowerList, user } = authProvider();
  const [result, setResult] = useState([]);
  const [loading, setLoading] = useState(true);
  const [idBorrower, setIdBorrower] = useState(null);
  const [transId, setTransId] = useState(null);
  const [loader, setLoader] = useState(false);
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState("");

  const openForm = ({ trasactionid, status }) => {
    setOpen(true);
    setTransId(trasactionid);
    setStatus(status);
  };
  const onClose = () => setOpen(false);

  console.log(user?.uid);
  console.log(transId);

  const findName = result.map((item) => {
    const list = allBorrowerList.find((x) => x.id === item.borrowerId);
    return {
      ...item,
      name: list,
    };
  });

  console.log(findName);

  useEffect(() => {
    const dbRef = collection(db, "repayment");
    let q;

    if (roleName === "Admin") {
      q = query(dbRef, orderBy("createdAt", "desc"));
    } else {
      q = query(dbRef, where("uid", "==", user?.uid));
    }

    const fetchListener = onSnapshot(q, (snapshot) => {
      const resultData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setResult(resultData);
      setLoading(false);
    });
    return () => fetchListener();
  }, [roleName]);

  const repayment = async () => {
    if (!transId) {
      toast.error("Please click on the paynow button");
      return;
    }
    setLoader(true);
    try {
      const repaymentDocRef = doc(db, "repayment", transId);
      const repaymentDB = await getDoc(repaymentDocRef);
      if (!repaymentDB.exists()) {
        return toast.error("Transaction not found");
      }

      const repaymentData = repaymentDB.data();
      const loanAmount = repaymentData?.LoanAmount;
      const userId = repaymentData?.uid;

      console.log(userId);

      const walletDbRef = collection(db, "wallet");
      const q = query(walletDbRef, where("uid", "==", userId));
      const userWalletDb = await getDocs(q);
      if (userWalletDb.empty) return toast.error("User wallet not found");
      const userWalletResult = userWalletDb.docs[0];

      console.log(`User Wallet Balance:${userWalletResult?.data().balance}`);

      const adminWallet = query(
        walletDbRef,
        where("uid", "==", "sa4tG0yB9BbMxaWTGyxlQW9dGTh2")
      );
      const adminWalletDoc = await getDocs(adminWallet);
      const adminWalletResult = adminWalletDoc.docs[0];
      console.log(`User Wallet Balance:${adminWalletResult?.data().balance}`);

      await runTransaction(db, async (tx) => {
        const adminRef = await tx.get(adminWalletResult.ref);
        const userRef = await tx.get(userWalletResult.ref);
        const repaymetRef = await tx.get(repaymentDocRef);

        const adminBalance = adminRef.data().balance;
        const userBalance = userRef.data().balance;
        const loanStatus = repaymetRef.data().status;
        if (loanStatus === "Paid") {
          throw new Error("This loan is already marked as Paid.");
        }

        if (loanAmount > userBalance) {
          throw new Error("Your fund is less than loan amount.");
        }
        tx.update(userWalletResult.ref, { balance: userBalance - loanAmount });
        tx.update(adminWalletResult.ref, {
          balance: adminBalance + loanAmount,
        });
        tx.update(repaymentDocRef, { status, paidOn: serverTimestamp() });

        toast.success("Payment Successfully");
      });
    } catch (err) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoader(false);
      onClose();
    }
  };

  const columns = [
    {
      header: "Borrower Name",
      accessor: "name",
      render: (dataRow) => dataRow.name?.name,
    },
    {
      header: "Loan Amount (PKR)",
      accessor: "LoanAmount",
    },

    {
      header: "Status",
      accessor: "status",
      render: (dataRow) => {
        let statusColor = "";
        if (dataRow.status === "Unpaid") {
          statusColor = "text-red-700";
        } else if (dataRow.status === "Paid") {
          statusColor = "text-green-700";
        }
        return <span className={`${statusColor}`}>{dataRow?.status}</span>;
      },
    },
    {
      header: "Paid On",
      accessor: "paidOn",
      render: (dataRow) => (
        <span>
          {dataRow.paidOn && dataRow.paidOn.toDate
            ? dataRow.paidOn.toDate().toLocaleString("en-GB", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })
            : "N/A"}
        </span>
      ),
    },
    {
      header: "Action",
      disableSort: true,
      render: (dataRow) => (
        <div>
          <button
            onClick={() =>
              openForm({
                trasactionid: dataRow?.id,
                status: "Paid",
              })
            }
            className="bg-gray-800 text-white rounded-sm px-3 py-1  cursor-pointer"
          >
            Pay Now
          </button>
        </div>
      ),
    },
  ];
  return (
    <>
      <div className="pt-8">
        <span className="font-bold text-3xl">Repayment</span>
        <div className="mt-6">
          <Table columns={columns} data={findName} loading={loading} />
        </div>
        <Dialog open={open} onClose={onClose}>
          <DialogTitle>
            Are you sure you want to proceed with this repayment?
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              <span className="text-gray-400">
                Once confirmed, the amount will be deducted and marked as paid
                in your record. This action cannot be undone
              </span>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose} color="inherit" variant="outlined">
              Close
            </Button>

            <Button disabled={loader} onClick={repayment} variant="outlined">
              {loader ? (
                <>
                  <CircularProgress
                    size={14}
                    color="inherit"
                    className="mr-2"
                  />
                  Processing...
                </>
              ) : (
                "Confirm"
              )}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
};

export default Repayment;
