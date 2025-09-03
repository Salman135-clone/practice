import React, { useEffect, useState } from "react";
import { authProvider } from "../../context/MyProvider";
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../constant/Firebase";
import {
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { toast } from "react-toastify";
const AdminWallet = () => {
  const { userInfo, user } = authProvider();
  const [userBalance, setUserBalance] = useState(null);
  const [defaultBalance, setDefaultBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingWallet, setLoadingWallet] = useState(false);
  const [open, setOpen] = useState(false);
  const [uId, setUId] = useState(null);

  console.log(userBalance);
  console.log(uId);
  console.log(defaultBalance);

  const handleOpen = (id) => {
    setUId(id);
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  const walletSetup = async () => {
    setLoadingWallet(true);
    try {
      await addDoc(collection(db, "wallet"), {
        uid: uId,
        balance: defaultBalance,
      });
      toast.success("Wallet Created Successfully");
    } catch (err) {
      toast.error(err);
    } finally {
      setLoadingWallet(false);
    }
  };

  useEffect(() => {
    if (!user.uid) return;
    const q = query(collection(db, "wallet"), where("uid", "==", user.uid));

    const fetchWallet = onSnapshot(
      q,
      (item) => {
        if (!item.empty) {
          const firstOneDataGet = item.docs[0];
          const finalResult = {
            id: firstOneDataGet.id,
            ...firstOneDataGet.data(),
          };
          setUserBalance(finalResult);
        } else {
          setUserBalance(null);
        }
        setLoading(false);
      },
      (error) => {
        throw error;
        setLoading(false);
      }
    );
    return () => fetchWallet();
  }, [user?.uid]);
  return (
    <>
      <div>
        <span className="font-bold text-3xl ">Wallet</span>
        <div className="mt-4 w-full bg-gray-800 h-40 flex flex-col sm:flex-row justify-between items-center p-6 rounded-lg">
          {loading ? (
            <CircularProgress size={19} />
          ) : userBalance ? (
            <>
              <div className="flex items-center">
                <p className="font-medium text-white text-xl">
                  Current Balance:
                </p>
                <span className="text-green-400 text-2xl tracking-wide font-bold">
                  PKR {userBalance?.balance}
                </span>
              </div>
              <button className="bg-green-600 hover:bg-green-700 shadow-lg px-4 py-3 rounded-md font-medium cursor-pointer">
                See Transaction
              </button>
            </>
          ) : (
            <>
              <div>
                <span className="text-2xl text-white font-medium tracking-wider">
                  No Wallet Found
                </span>
              </div>
              <button
                onClick={() => handleOpen(user?.uid)}
                className="text-white font-medium bg-gray-600 px-4 py-3 rounded-md cursor-pointer hover:bg-gray-700"
              >
                Setup Your Wallet
              </button>
            </>
          )}
        </div>
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
          <DialogTitle>
            <span>Setup Your Wallet</span>
          </DialogTitle>
          <DialogContent>
            <div>
              <div>
                <p className="font-medium">
                  User ID:
                  <span className="font-normal ml-1 text-gray-600">
                    {user?.uid}
                  </span>
                </p>
              </div>
            </div>
          </DialogContent>
          <DialogActions>
            <button
              onClick={handleClose}
              className="hover:bg-gray-200 px-4 py-2 rounded-md cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={walletSetup}
              disabled={loadingWallet}
              className={`${
                loadingWallet
                  ? "bg-green-400 cursor-not-allowed "
                  : "bg-green-600 cursor-pointer hover:bg-green-700"
              }  px-4 py-2 rounded-md text-white `}
            >
              {loadingWallet ? (
                <span className="flex items-center gap-2">
                  <CircularProgress size={19} />
                  <p className="text-sm">Processing...</p>
                </span>
              ) : (
                "Submit"
              )}
            </button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
};

export default AdminWallet;
