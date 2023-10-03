import { TransactionType } from "@/types/queue.type";
import { useRouter } from "next/router";
import { FunctionComponent, useEffect, useState } from "react";
import Image from "next/image";
import LOGO from "../../assets/logo.png";
import { HiUserCircle } from "react-icons/hi";

type HeaderProps = {
  transactionType: TransactionType[];
};

export const Header: FunctionComponent<HeaderProps> = ({ transactionType }) => {
  const [storedTransactionType, setStoredTransactionType] = useState("");
  const router = useRouter();

  useEffect(() => {
    // Get the transactionType value from local storage
    const transactionTypeFromLocalStorage =
      localStorage.getItem("transactionType");

    if (transactionTypeFromLocalStorage) {
      // Set the transactionType value to state
      setStoredTransactionType(transactionTypeFromLocalStorage);
    }
  }, []);

  const handleLogout = () => {
    try {
      // Clear access token and transaction type from local storage
      localStorage.removeItem("accessToken");
      localStorage.removeItem("transactionType");
      localStorage.removeItem("sub");

      router.push("/login");
      // alert("Are you sure you want to logout ?");
    } catch (error) {
      console.log("Invalid login");
    }
  };
  const handleReport = () => {
    try {
      router.push("/counter-personnel/report");
    } catch (error) {}
  };

  return (
    <div className="flex items-center justify-between shadow-md Inter">
      <div className="flex flex-row gap-2 items-center">
        <Image src={LOGO} width={55} height={55} alt={"Water District Logo"} />
        <div>
          <span className="text-blue-900 font-montserrat text-sm">
            General Santos City Water District
          </span>
          {storedTransactionType && (
            <h1 className="text-gray-700 font-montserrat font-bold text-xl">
              {storedTransactionType}
            </h1>
          )}
        </div>
      </div>
      <div className="flex gap-4">
        {/* <HiUserCircle className="text-gray-800 h-12 w-12 cursor-pointer" /> */}
        <button
          onClick={handleReport}
          className="uppercase text-sm text-blue-800 border-2 bg-white px-3 py-1 rounded-md hover:bg-blue-800 hover:text-white transition-all"
        >
          Report
        </button>
        <button
          className="uppercase italic text-sm mr-8"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
};
