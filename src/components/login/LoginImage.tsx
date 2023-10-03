import React from "react";
import Image from "next/image";

//assets
import BgImage from "../../assets/flows.png";
import Logo from "../../assets/logo.png";

const LoginImageComp = () => {
  return (
    <div>
      <div className="relative">
        <Image
          priority
          src={BgImage}
          width={1366}
          height={768}
          alt=""
          className="bg-contain rounded-tl-lg w-full h-auto"
        />
        <div className="absolute -top-20 left-0 w-full h-full flex justify-center items-center">
          <Image src={Logo} width={100} height={100} alt="" />
        </div>
        <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center">
          <h3 className="text-black text-2xl font-bold font-poppins">
            GENERAL SANTOS CITY
          </h3>
        </div>
        <div className="absolute top-8 left-0 w-full h-full flex justify-center items-center">
          <h3 className="text-black text-2xl font-bold font-poppins">
            WATER DISTRICT
          </h3>
        </div>
      </div>
    </div>
  );
};

export default LoginImageComp;
