import Image from "next/image";
import LOGO from "../../assets/logo.png";

export default function TabletHeader() {
  return (
    <div className="flex flex-col items-center justify-center bg-blue-500 lg:h-400 md:h-400 xl:h-800 rounded-b-none rounded-2xl">
      <div className="grid lg:w-1/2 lg:h-1/2 grid-cols-1 sm:grid-rows-1 lg:m-3 lg:p-3 p-4">
        <div className="flex flex-col sm:justify-center sm:h-200 items-center gap-3">
          <Image src={LOGO} alt="GSCWD Logo" width={80} height={80} />
          <h1 className="text-2xl text-white text-center font-bold font-montserrat">
            GSCWD - QMaster
          </h1>
        </div>
      </div>
    </div>
  );
}
