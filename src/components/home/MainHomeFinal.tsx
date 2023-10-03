import { useRouter } from "next/router";
import React from "react";
import BG from "../../assets/bldg.png";
import Image from "next/image";
// import background from "../../assets/background.jpg";
import Logo from "@/../public/logo.png";
export default function MainHomeFinal() {
  const router = useRouter();

  const handleOpenStaff = async () => {
    router.push("/login");
  };
  const handleOpenTablet = async () => {
    router.push("/queue-app");
  };
  const handleOpenTVCW = async () => {
    router.push("/counter-tv/customer-welfare");
  };
  const handleOpenTVPay = async () => {
    router.push("/counter-tv/payment");
  };

  return (
    <div className="Inter">
      <div className="p-5">
        <div className="flex flex-row gap-3 four:gap-5 p-3 items-center shadow-md rounded-md bg-blue-500 four:h-40 four:p-5 h-24">
          <div className="w-14 h-14 four:w-28 four:h-28">
            <Image src={Logo} alt="GSCWD Logo" />
          </div>
          <h1 className="text-2xl text-white font-bold four:text-4xl">
            GSCWD - QMaster
          </h1>
        </div>
      </div>
      <div className="flex justify-center">
        <div className="m-10 grid grid-cols-3 w-1250w h-600h bg-blue-300 rounded-lg">
          <div className="flex flex-col justify-center p-5">
            <div className="flex flex-col gap-5 four:gap-7 items-center p-4">
              <button
                className="bg-white rounded-md hover:shadow-xl hover:bg-blue-800 hover:text-white hover:transition-all hover:font-bold font-poppins font-medium container hover:cursor-pointer shadow-md text-center p-4 four:text-2xl"
                onClick={handleOpenTablet}
              >
                Queue App
              </button>
              <button
                className="bg-white rounded-md hover:shadow-xl hover:bg-blue-800 hover:text-white hover:transition-all hover:font-bold font-poppins font-medium container hover:cursor-pointer shadow-md text-center p-4 four:text-2xl"
                onClick={handleOpenTVPay}
              >
                TV Display (Payment)
              </button>
              <button
                className="bg-white rounded-md hover:shadow-xl hover:bg-blue-800 hover:text-white hover:transition-all hover:font-bold font-poppins font-medium container hover:cursor-pointer shadow-md text-center p-4 four:text-2xl"
                onClick={handleOpenTVCW}
              >
                TV Display (CW)
              </button>
              <button
                className="bg-white rounded-md hover:shadow-xl hover:bg-blue-800 hover:text-white hover:transition-all hover:font-bold font-poppins font-medium container hover:cursor-pointer shadow-md text-center p-4 four:text-2xl"
                onClick={handleOpenStaff}
              >
                Staff
              </button>
              {/* <div
                className="bg-white border-2 border-blue-900 rounded-md hover:shadow-xl hover:bg-blue-800 hover:text-white hover:transition-all hover:font-bold font-poppins font-medium container hover:cursor-pointer shadow-md text-center p-4 four:text-2xl"
              ={handleOpenAdmin}
              >
                Admin
              </div> */}
            </div>
          </div>
          <div className="grid col-span-2">
            <div className="col-span-3">
              <Image
                src={BG}
                alt="GSCWD BLDG"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// export default MainHomeFinal;
