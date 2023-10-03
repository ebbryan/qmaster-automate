import React, { FunctionComponent, useEffect, useState } from "react";
import { Table } from "../../../components/Admin/Table";
import axios from "axios";
import { CounterPersonnel } from "@/types/admin.type";
import Logo from "../../../assets/logo.png";
import Image from "next/image";
import { HiPower } from "react-icons/hi2";
import router from "next/router";
import { io } from "socket.io-client";

export default function User({}) {
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

  return (
    <>
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
                  className="uppercase transition ease-in-out delay-80 hover:-translate-y-1 shadow-xl p-2 rounded-lg text-blue-500 hover:bg-blue-800 hover:text-white  focus:outline-none  duration-300 active:ring-4 text-xl  font-bold"
                >
                  dashboard
                </button>
                <button
                  onClick={handleUser}
                  className="uppercase transition ease-in-out delay-80 hover:-translate-y-1 border-b-2 border-black shadow-xl shadow-blue-700 p-2 rounded-lg text-black hover:bg-blue-800 hover:text-white focus:outline-none  duration-300 active:ring-4 text-xl font-bold "
                >
                  User
                </button>
                <button
                  onClick={handleReport}
                  className="uppercase transition ease-in-out delay-80 hover:-translate-y-1 shadow-xl p-2  rounded-lg text-blue-500 hover:bg-blue-800 hover:text-white focus:outline-none  duration-300 active:ring-4 text-xl font-bold "
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
        <div className="grid row-span-4">
          <div className="flex justify-between"></div>
        </div>
        <Table />
      </div>
    </>
  );
}
