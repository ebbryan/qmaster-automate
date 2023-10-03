const BackendApiConsumerTransaction = process.env.BACKEND_API_CONSUMER_TRANSACT;
const BackendApi = process.env.BACKEND_API;

import axios from "axios";
import TableSummary from "../../../components/Admin/TableSummary";
import { useEffect, useState } from "react";
import { consumerTransaction } from "@/types/admin.type";
import Logo from "../../../assets/logo.png";
import Image from "next/image";
import { HiPower } from "react-icons/hi2";
import router from "next/router";
import { io } from "socket.io-client";

export default function Summary() {
  const [data, setData] = useState<Array<consumerTransaction>>([]);

  const handleHome = async () => {
    router.push("/admin");
  };
  const handleUser = async () => {
    router.push("/admin/users");
  };
  const handleReport = async () => {
    router.push("/admin/summary");
  };

  const handleLogout = () => {
    try {
      // Clear access token and transaction type from local storage
      localStorage.removeItem("accessToken");
      localStorage.removeItem("transactionType");
      localStorage.removeItem("sub");

      router.push("/login");
      alert("Are you sure you want to logout ?");
    } catch (error) {
      console.log("Invalid login");
    }
  };

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken"); // get access token from local storage
    console.log(accessToken);

    const getconsumerTransaction = async () => {
      try {
        const result = await axios.get(`${BackendApiConsumerTransaction}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`, // include the access token in the Authorization header
          },
        });
        setData(result.data);
      } catch (error) {
        console.error(error);
      }
    };

    getconsumerTransaction();
    const socket = io(`${BackendApi}`);
    socket.on("connect", () => {
      console.log("Connected to socket server");
    });
    socket.on("consumerTransactionUpdated", (updatedTransaction) => {
      if (updatedTransaction.counterPersonnel) {
        setData((prevData) => [...prevData, updatedTransaction]);
      }
      getconsumerTransaction();
    });

    socket.on("transactionCreated", (newTransaction) => {
      getconsumerTransaction();
    });
    getconsumerTransaction();
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="w-auto h-auto font-Inter shadow-lg rounded-lg">
      <header className="border-4 border-black">
        <div className="bg-white  p-12 sticky border-b-4 border-black h-14 flex shadow-lg items-center text-lg font-bold uppercase">
          <div className="flex justify-between w-full">
            <div className="flex items-center">
              <Image
                src={Logo}
                alt={""}
                width={100}
                height={100}
                className="ml-2 mr-5"
              />
              GENERAL SANTOS WATER DISTRICT
            </div>
            <div className=" flex items-center gap-4">
              <button
                onClick={handleHome}
                className="uppercase transition ease-in-out delay-80 hover:-translate-y-1 shadow-xl p-2 rounded-lg text-blue-500 hover:bg-blue-800 hover:text-white  focus:outline-none  duration-300 active:ring-4 text-xl focus:text-black font-bold"
              >
                dashboard
              </button>
              <button
                onClick={handleUser}
                className="uppercase transition ease-in-out delay-80 hover:-translate-y-1 shadow-xl p-2 rounded-lg text-blue-500 hover:bg-blue-800 hover:text-white focus:outline-none  duration-300 active:ring-4 text-xl font-bold focus:text-black"
              >
                User
              </button>
              <button
                onClick={handleReport}
                className="uppercase transition ease-in-out delay-80 hover:-translate-y-1 shadow-xl p-2 shadow-blue-700  border-b-2 border-black rounded-lg text-black hover:bg-blue-800 hover:text-white focus:outline-none  duration-300 active:ring-4 text-xl font-bold focus:text-black"
              >
                report
              </button>
              <button
                onClick={handleLogout}
                className="text-xl ml-5 flex transition ease-in-out delay-80 hover:-translate-y-1 items-center mt-5 mb-5 p-2 border-l-4 border-black font-bold text-black hover:text-red-600 cursor-pointer"
              >
                <HiPower className="w-8 h-8 mr-2" />
                Log-out
              </button>
            </div>
          </div>
        </div>
      </header>
      <div className="font-bold text-4xl border-b-4 uppercase text-black rounded-t-lg mt-5 mb-5 border border-black text-center">
        Summary Report
      </div>
      <div style={{ minWidth: "100%" }}>
        <TableSummary />
      </div>
    </div>
  );
}
