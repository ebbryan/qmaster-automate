const BackendApiCounterPersonnel = process.env.BACKEND_API_COUNTER_PERSONNEL;
const BackendApi = process.env.BACKEND_API;

import { CounterPersonnel } from "@/types/admin.type";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { HiWrenchScrewdriver } from "react-icons/hi2";
import Logo from "../../../../assets/logo.png";
import Image from "next/image";
import { HiPower } from "react-icons/hi2";
import router from "next/router";
import io from "socket.io-client";

export default function ArchiveList() {
  const [data, setData] = useState<Array<CounterPersonnel>>([]);
  const [search, setSearch] = useState("");
  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const subID = localStorage.getItem("sub");

    const getCounterPersonnel = async () => {
      try {
        const result = await axios.get(
          `${BackendApiCounterPersonnel}/user?isActive=false`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setData(result.data);
        console.log(result.data);
      } catch (error) {
        console.error(error);
      }
    };

    getCounterPersonnel();

    const socket = io(`${BackendApi}`);
    socket.on("connect", () => {
      console.log("Connected to socket server");
    });

    socket.on("counterPersonnelUpdated", (updatedCounterPersonnel) => {
      if (updatedCounterPersonnel.counterPersonnel === subID) {
        setData((prevData) => [...prevData, updatedCounterPersonnel]);
      }
      getCounterPersonnel();
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handlePatchDrop = async (counter: CounterPersonnel | undefined) => {
    if (counter) {
      try {
        await axios.patch(`${BackendApiCounterPersonnel}/${counter.id}`, {
          isActive: true,
        });
        const confirmMessage = "Counter personnel activated!";
        const result = window.confirm(confirmMessage);
        if (result) {
          // user clicked "OK"
          // do something
        } else {
          // user clicked "Cancel"
          // do something else
        }
        // update state with the new data from the server
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleHome = async () => {
    router.push("/admin");
  };
  const handleUser = async () => {
    router.push("/admin/users");
  };
  const handleReport = async () => {
    router.push("/admin/summary");
  };

  const handleSearchChange = (event: any) => {
    setSearch(event.target.value);
  };

  const filteredData = data.filter((item) => {
    const fullName = `${item.firstname} ${item.lastname}`.toLowerCase();
    return fullName.includes(search.toLowerCase());
  });
  return (
    <div className="font-Inter w-auto h-auto shadow-lg rounded-lg">
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
                onClick={handleHome}
                className="uppercase shadow-xl p-2 rounded-lg text-blue-500 hover:bg-blue-800 focus:outline-none ease-linear transition-all duration-300 active:ring-4 text-xl hover:text-white font-bold"
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
                className="uppercase shadow-xl p-2 rounded-lg text-blue-500 hover:bg-blue-800 hover:text-white focus:outline-none ease-linear transition-all duration-300 active:ring-4 text-xl font-bold "
              >
                report
              </button>
              <button className="text-xl ml-5 flex items-center mt-5 mb-5 p-2 border-l-4 border-black font-bold text-black hover:text-red-600 cursor-pointer">
                <HiPower className="w-8 h-8 mr-2" />
                Log-out
              </button>
            </div>
          </div>
        </div>
      </header>
      <div className="font-bold items-center mb-5 uppercase text-4xl text-black text-center m-2">
        archive List
      </div>
      <div className="flex items-start">
        <div className="grid ml-5 items-start transition ease-in-out delay-100 cursor-pointer hover:-translate-y-1">
          <input
            type="text"
            value={search}
            onChange={handleSearchChange}
            placeholder="Search by name"
            className="border-2 border-gray-300 p-2 w-64 rounded-lg"
          />
        </div>
      </div>
      <div className="px-4">
        <div className=" text-center mt-2 rounded-t-xl bg-blue-600 text-white uppercase font-bold text-xl">
          un-active user: {""} {data.length}
        </div>

        <div
          style={{
            width: "100%",
            overflowX: "scroll",
            height: "450px",
            overflowY: "scroll",
          }}
          className="inline-block w-full mb-5 border-black shadow  rounded-b-xl"
        >
          <div style={{ minWidth: "100%" }}></div>
          <div className="inline-block min-w-full shadow mr-5 overflow-hidden">
            <table className="min-w-full font-bold mr-5 border-4 leading-normal">
              <thead className="font-bold text-xl">
                <tr>
                  <th className="px-5  py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-lg font-bold text-black uppercase tracking-wider">
                    counterPersonnel
                  </th>
                  <th className="px-5  py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-lg font-bold text-black uppercase tracking-wider">
                    Username
                  </th>

                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-lg font-bold text-black uppercase tracking-wider">
                    Transaction Type
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-lg font-bold text-black uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="">
                {filteredData.map((item) => {
                  return (
                    <tr key={item.id}>
                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        {item.firstname} {item.lastname}
                      </td>
                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        {item.username}
                      </td>
                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        {item.transactionType?.name}
                      </td>
                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        <div className="gap-3 text-lg flex">
                          <button
                            className="text-lg"
                            type="button"
                            onClick={() => handlePatchDrop(item)}
                          >
                            <HiWrenchScrewdriver className="rounded h-10 w-10 transition ease-in-out delay-80 hover:-translate-y-1 text-white  bg-green-500 hover:text-green-500 hover:bg-white text-3xl" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
