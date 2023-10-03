import InQueueCW from "@/components/counter-tv/inQueueCW";
import InQueueCWRecent from "@/components/counter-tv/inQueueCWRecent";
import NowServingCW from "@/components/counter-tv/nowServingCW";
import React from "react";
import Image from "next/image";
import Logo from "../../../../src/assets/logo.png";
import { HiOutlineInformationCircle } from "react-icons/hi";

export default function tvCW() {
  return (
    <main className="flex min-h-screen flex-col bg-slate-300">
      {/* <main className="Inter bg-slate-200 text-gray-800">
      <div className="flex flex-row gap-2 four:gap-5 p-2 items-center shadow-md rounded-md bg-white four:h-40 four:p-5">
        <div className="w-10 h-10 four:w-28 four:h-28">
          <Image src={Logo} alt="GSCWD Logo" />
        </div>
        <h1 className="text-xl font-bold four:text-4xl">GSCWD - QMaster</h1>
      </div>
      <div className="p-5">
        <div className="grid grid-cols-3 gap-5">
          <div className="col-span-2">
            <div className="flex flex-col gap-4">
              <div className="row-span-3 gap-4">
                <div className="flex flex-col gap-2 p-3 shadow-md rounded-lg bg-white overflow-hidden truncate">
                  <div className="bg-blue-600 p-4 text-left four:h-40 four:flex four:flex-row four:items-center four:p-6">
                    <h1 className="text-5xl text-white font-bold four:text-9xl">
                      NOW SERVING
                    </h1>
                  </div>
                  <NowServingCW />
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2 p-3 shadow-md rounded-lg bg-white overflow-hidden truncate">
            <div className="p-4 text-left four:h-40 four:flex four:flex-row four:items-center four:p-6">
              <h1 className="text-5xl font-bold text-blue-700 four:text-9xl">
                In Queue
              </h1>
            </div>
            <InQueueCW />
          </div>
          <div className="col-span-2">
            <div className="flex flex-col gap-2 p-3 shadow-md rounded-lg bg-white">
              <div className="flex flex-row items-center gap-2 bg-blue-200 p-4 text-2xl four:text-4xl">
                <HiOutlineInformationCircle />
                <h1 className="four:text-4xl">Announcements</h1>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2 p-3 shadow-md rounded-lg bg-white overflow-hidden truncate">
            <div className="p-4 text-left four:h-40 four:flex four:flex-row four:items-center four:p-6">
              <h1 className="text-5xl font-bold text-blue-700 four:text-9xl">
                Latest
              </h1>
            </div>
            <InQueueCWRecent />
          </div>
        </div>
      </div>
    </main> */}
      {/* <div className="flex flex-grow">
        <nav className="w-64 space-y-6 bg-white p-6 shadow-sm">Navbar</nav>
        <main className="flex-1 bg-gray-100 p-6">Content will go here</main>
      </div> */}
      {/* <div>
        <div className="flex flex-row gap-2 four:gap-5 p-2 items-center shadow-md rounded-md bg-white four:h-40 four:p-5">
          <div className="w-10 h-10 four:w-28 four:h-28">
            <Image src={Logo} alt="GSCWD Logo" />
          </div>
          <h1 className="text-xl font-bold four:text-4xl">GSCWD - QMaster</h1>
        </div>
      </div> */}
      <div className="flex flex-grow pt-3">
        <div className="w-3/5">
          <div className="h-1/2 px-4">
            <div className="bg-blue-600 p-4 text-left four:h-40 four:flex four:flex-row four:items-center four:p-6">
              <h1 className="text-5xl text-white font-bold four:text-9xl">
                NOW SERVING
              </h1>
            </div>
            <NowServingCW />
          </div>
          <div className="h-1/2 px-4">
            <div className="flex flex-col gap-2 p-3 shadow-md rounded-lg bg-white">
              <div className="flex flex-row items-center gap-2 bg-blue-200 p-4 text-2xl four:text-4xl">
                <HiOutlineInformationCircle />
                <h1 className="four:text-4xl">Announcements</h1>
              </div>
            </div>
          </div>
        </div>
        <div className="w-2/5">
          <div className="h-1/2 px-4">
            <div className="flex flex-col gap-2 p-3 shadow-md rounded-lg bg-white overflow-hidden truncate">
              <div className="text-left four:h-40 four:flex four:flex-row four:items-center four:p-2">
                <h1 className="text-5xl font-bold text-blue-700 four:text-9xl">
                  In Queue
                </h1>
              </div>
              <InQueueCW />
            </div>
          </div>
          <div className="h-1/2 px-4">
            <div className="flex flex-col gap-2 p-3 shadow-md rounded-lg bg-white overflow-hidden truncate">
              <div className="text-left four:h-40 four:flex four:flex-row four:items-center four:p-6">
                <h1 className="text-5xl font-bold text-blue-700 four:text-9xl">
                  Latest
                </h1>
              </div>
              <InQueueCWRecent />
            </div>
          </div>
        </div>
      </div>
      {/* <div>3</div> */}
    </main>
  );
}
