import React, { useEffect, useState } from "react";
import { authProvider } from "../../context/MyProvider";
import { collection, doc, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../../constant/Firebase";
import { CircularProgress } from "@mui/material";

const UserWallet = () => {
  const { userInfo, user } = authProvider();
  const [userBalance, setUserBalance] = useState(null);
  const [loading, setLoading] = useState(true);
  console.log(userBalance);
  console.log(user);

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

        <div className=" w-full bg-gray-800 h-40 flex flex-col sm:flex-row justify-between items-center p-6 rounded-lg">
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
              <button className="text-white font-medium bg-gray-600 px-4 py-3 rounded-md cursor-pointer hover:bg-gray-700">
                Setup Your Wallet
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default UserWallet;
