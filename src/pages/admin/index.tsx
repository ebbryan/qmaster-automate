import { CounterPersonnel, consumerTransaction } from "@/types/admin.type";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Hometable from "../../components/Admin/Hometable";
import Logo from "../../assets/logo.png";
import Image from "next/image";
import { HiPower } from "react-icons/hi2";
import router from "next/router";
import { io } from "socket.io-client";

const BackendApiCounterPersonnel = process.env.BACKEND_API_COUNTER_PERSONNEL;
const BackendApi = process.env.BACKEND_API;
const BackendApiForConsumerTransact = process.env.BACKEND_API_TRANSACT_STATUS;

export default function Home() {
  // const handleHome = async () => {
  //   router.push("/Home");
  // };
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
  const [data, setData] = useState<Array<CounterPersonnel>>([]);
  const [data1, setData1] = useState<Array<consumerTransaction>>([]);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const subID = localStorage.getItem("sub");

    const getcounterPersonnel = async () => {
      try {
        const result = await axios.get(
          `${BackendApiCounterPersonnel}/user?isActive=true`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`, // include the access token in the Authorization header
            },
          }
        );
        setData(result.data);
      } catch (error) {
        // handle error
        console.error(error);
      }
    };

    const getconsumerTransaction = async () => {
      try {
        const result = await axios.get(
          // `${backendApiConsumerTransactionComplete}`,
          `${BackendApiForConsumerTransact}/transactionstatus?transactionStatus=3`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`, // include the access token in the Authorization header
            },
          }
        );
        setData1(result.data);
      } catch (error) {
        console.error(error);
      }
    };
    getconsumerTransaction();
    getcounterPersonnel();
    const socket = io(`${BackendApi}`);
    socket.on("connect", () => {
      console.log("Connected to socket server");
    });
    socket.on("consumerTransactionUpdated", (updatedTransaction) => {
      if (updatedTransaction.counterPersonnel === subID) {
        setData((prevData) => [...prevData, updatedTransaction]);
      }
      getconsumerTransaction();
      getcounterPersonnel();
    });

    socket.on("transactionCreated", (newTransaction) => {
      getcounterPersonnel();
      getconsumerTransaction();
    });
    getcounterPersonnel();
    getconsumerTransaction();
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="w-auto h-auto font-Inter shadow-2xl border rounded-lg">
      <header className="border-4 border-black">
        <div className="bg-white p-12 sticky border-b-4 border-black h-14 flex shadow-lg items-center text-lg font-bold uppercase">
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
                // onClick={handleHome}
                className="uppercase transition ease-in-out delay-80 hover:-translate-y-1 border-b-2 border-black shadow-xl shadow-blue-700 p-2 rounded-lg text-black hover:bg-blue-800 focus:outline-none duration-300 active:ring-4 text-xl hover:text-white font-bold"
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
                className="uppercase shadow-xl p-2 rounded-lg text-blue-500 hover:bg-blue-800 hover:text-white focus:outline-none transition ease-in-out delay-80 hover:-translate-y-1 duration-300 active:ring-4 text-xl font-bold "
              >
                report
              </button>
              <button
                onClick={handleLogout}
                className="text-xl ml-5 flex border-l-4 border-black transition ease-in-out delay-80 hover:-translate-y-1 items-center mt-5 mb-5 p-2 font-bold text-black hover:text-red-600 cursor-pointer"
              >
                <HiPower className="w-8 h-8 mr-2" />
                Log-out
              </button>
            </div>
          </div>
        </div>
      </header>
      <div className="font-bold text-4xl border-b-4 uppercase text-black rounded-t-lg mt-5 mb-5 text-center">
        Welcome To Your Dashboard
      </div>

      <div style={{ minWidth: "100%" }} className=" h-auto w-auto rounded-sm">
        <Hometable counterPersonnel={data} consumertransaction={data1} />
      </div>
    </div>
  );
}
