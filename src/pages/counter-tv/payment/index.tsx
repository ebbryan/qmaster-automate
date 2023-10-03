import InQueuePayment from "@/components/counter-tv/inQueuePayment";
import InQueuePaymentRecent from "@/components/counter-tv/inQueuePaymentRecent";
import NowServingPayment from "@/components/counter-tv/nowServingPayment";
import React from "react";
import Image from "next/image";
import Logo from "../../../../src/assets/logo.png";
import { HiOutlineInformationCircle } from "react-icons/hi";

export default function tvPayment() {
  return (
    // <main className="Inter bg-slate-200 text-gray-800">
    //   <div className="flex flex-row gap-2 four:gap-5 p-2 items-center shadow-md rounded-md bg-white four:h-40 four:p-5">
    //     <div className="w-10 h-10 four:w-28 four:h-28">
    //       <Image src={Logo} alt="GSCWD Logo" />
    //     </div>
    //     <h1 className="text-xl font-bold four:text-4xl">GSCWD - QMaster</h1>
    //   </div>
    //   <div className="p-5">
    //     <div className="grid grid-cols-3 gap-5">
    //       <div className="col-span-2">
    //         <div className="flex flex-col gap-4">
    //           <div className="row-span-3 gap-4">
    //             <div className="flex flex-col gap-2 p-3 shadow-md rounded-lg bg-white overflow-hidden truncate">
    //               <div className="bg-blue-600 p-4 text-left four:h-40 four:flex four:flex-row four:items-center four:p-6">
    //                 <h1 className="text-5xl text-white font-bold four:text-9xl">
    //                   NOW SERVING
    //                 </h1>
    //               </div>
    //               <NowServingPayment />
    //             </div>
    //           </div>
    //         </div>
    //       </div>
    //       <div className="flex flex-col gap-2 p-3 shadow-md rounded-lg bg-white overflow-hidden truncate">
    //         <div className="p-4 text-left four:h-40 four:flex four:flex-row four:items-center four:p-6">
    //           <h1 className="text-5xl font-bold text-blue-700 four:text-9xl">
    //             In Queue
    //           </h1>
    //         </div>
    //         <InQueuePayment />
    //       </div>
    //       <div className="col-span-2">
    //         <div className="flex flex-col gap-2 p-3 shadow-md rounded-lg bg-white">
    //           <div className="flex flex-row items-center gap-2 bg-blue-200 p-4 text-2xl four:text-4xl">
    //             <HiOutlineInformationCircle />
    //             <h1 className="four:text-4xl">Announcements</h1>
    //           </div>
    //         </div>
    //       </div>
    //       <div className="flex flex-col gap-2 p-3 shadow-md rounded-lg bg-white overflow-hidden truncate">
    //         <div className="p-4 text-left four:h-40 four:flex four:flex-row four:items-center four:p-6">
    //           <h1 className="text-5xl font-bold text-blue-700 four:text-9xl">
    //             Latest
    //           </h1>
    //         </div>
    //         <InQueuePaymentRecent />
    //       </div>
    //     </div>
    //   </div>
    // </main>
    <main className="flex min-h-screen flex-col bg-slate-300">
      <div className="flex flex-grow pt-3">
        <div className="w-3/5">
          <div className="h-1/2 px-4">
            <div className="bg-blue-600 p-4 text-left four:h-40 four:flex four:flex-row four:items-center four:p-6">
              <h1 className="text-5xl text-white font-bold four:text-9xl">
                NOW SERVING
              </h1>
            </div>
            <NowServingPayment />
          </div>
          <div className="h-1/2 px-4 mt-14">
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
              <InQueuePayment />
            </div>
          </div>
          <div className="h-1/2 px-4">
            <div className="flex flex-col gap-2 p-3 shadow-md rounded-lg bg-white overflow-hidden truncate">
              <div className="text-left four:h-40 four:flex four:flex-row four:items-center four:p-6">
                <h1 className="text-5xl font-bold text-blue-700 four:text-9xl">
                  Latest
                </h1>
              </div>
              <InQueuePaymentRecent />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
