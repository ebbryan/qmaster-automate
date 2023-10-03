//API
const API_Consumer_Transaction = process.env.BACKEND_API_CONSUMER_TRANSACT;
const API_Backend_Main = process.env.BACKEND_API;
const API_NowServing_CW =
  process.env.BACKEND_API_CONSUMER_TRANSACT_NOW_SERVE_CW;
const API_Sub_Transact = process.env.BACKEND_API_SUB_TRANSACT_TYPE;
const API_Transfer = process.env.BACKEND_API_TRANSFERRED_CONSUMER_FROM;
//API

import { FunctionComponent, useCallback, useEffect, useState } from "react";
import {
  HiChevronDoubleRight,
  HiSpeakerphone,
  HiSwitchHorizontal,
  HiCheckCircle,
  HiBan,
} from "react-icons/hi";

import axios from "axios";
import React from "react";
import {
  ConsumerTransactionType,
  SubTransactionType,
  TransferredFrom,
} from "@/types/queue.type";
import { io } from "socket.io-client";
// import { WelfareUnattendedTable } from "./WelfareUnattended";
import { Elsie } from "next/font/google";
import { useForm } from "react-hook-form";
import { AppPrioContext } from "@/pages/counter-personnel/application";
import AppRegular from "./AppRegular";
import AppPriority from "./AppPriority";
import { AppDrop } from "./AppDrop";
import DropApp from "./DropApp";
import PriorityApp from "./PriorityApp";
import RegularApp from "./RegularApp";
// import WelfareRegular from "./WelfareRegular";
// import WelfarePriority from "./WelfarePriority";
// import { WelfarePrioContext } from "@/pages/counter-personnel/customer-welfare";
// import { WelfareDrop } from "./WelfareDrop";

type ServingProps = {
  consumerTransactionType: ConsumerTransactionType[];
};

export type AppTableContextState = {
  consumerTransaction: ConsumerTransactionType | undefined;
  setConsumerTransaction: (transaction: ConsumerTransactionType) => void;
};
export const AppTableContext = React.createContext({} as AppTableContextState);

export const ServingApp: FunctionComponent<ServingProps> = ({}) => {
  const [consumerData, setconsumerData] = useState<
    Array<ConsumerTransactionType>
  >([]);
  const [transferDataPayment, setTransferPayment] = useState<
    Array<TransferredFrom>
  >([]);
  const [transferDataWelfare, setTransferDataWelfare] = useState<
    Array<TransferredFrom>
  >([]);
  const now = new Date();
  const currentTime = now.toTimeString().slice(0, 8);
  const [selectedConsumer, setSelectedConsumer] =
    useState<ConsumerTransactionType | null>(null); // diri

  const [subTransaction, setSubTransaction] = useState<
    Array<SubTransactionType>
  >([]);
  const [sub, setSub] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [note, setNote] = useState("");
  const [transfer, setTransfer] = useState("");
  const [speaking, setSpeaking] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isClicked, setIsClicked] = useState(false);
  // const [isEnable, setIsEnable] = useState(true);
  // const [consumerData1, setConsumerData] = useState([]);

  const dropTime = new Date(now.getTime() + 60 * 60 * 1000); // Adding 1 hour in milliseconds
  const dropTimeExpiration = dropTime.toTimeString().slice(0, 8); // "11:54:49"

  // const { reset } = useForm();

  interface Transaction {
    id: number;
    name: string;
    counterPersonnel: {
      tag: string;
    };
    status: number;
  }

  const speak = async (consumer: ConsumerTransactionType | undefined) => {
    if (!speaking && consumer) {
      const lastText = "Please proceed to Application.";
      const consumerNames = consumerData.map((consumer) => consumer.name);
      const consumers = `${consumer.name}`;
      const message = new SpeechSynthesisUtterance(consumers + lastText);
      speechSynthesis.speak(message);
      setSpeaking(true);
    }
  };
  const speakServe = useCallback(() => {
    if (!speaking) {
      const lastText = "Please proceed to Application.";
      const consumerNames = consumerData.map((consumer) => consumer.name);
      const message = new SpeechSynthesisUtterance(
        consumerNames.join(" , ") + lastText
      );
      speechSynthesis.speak(message);
      setSpeaking(true);

      // Reset the speaking state to false after speech has finished
      message.onend = () => {
        setSpeaking(false);
      };
    }
  }, [consumerData]);

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  const fetchNowServing = useCallback(async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const result = await axios.get(`${API_NowServing_CW}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`, // include the access token in the Authorization header
        },
      });
      setTransactions(result.data);
      //console.log("New data:", result.data);
    } catch (error) {
      console.error(error);
    }
  }, []);
  //API_Consumer_Transaction
  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const subID = localStorage.getItem("sub");
    const getSubTransactionData = async () => {
      try {
        const subtransaction = await axios.get(
          `${API_Sub_Transact}/transaction-type?transactionType=1`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setSubTransaction(subtransaction.data);
      } catch (error) {}
    };
    const getConsumer = async () => {
      try {
        const consumer = await axios.get(
          `${API_Consumer_Transaction}/transactionstatus?transactionStatus=2&transactionType=1&counterPersonnel=${subID}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`, // include the access token in the Authorization header
            },
          }
        );
        setconsumerData(consumer.data);
        setSpeaking(false);
      } catch (error) {}
    };
    const getTransferFromPayment = async () => {
      // const transaction = localStorage.getItem("transactionType");
      try {
        const transferResult = await axios.get(
          `${API_Transfer}/transfer-from?transactionFrom=PAYMENT&transactionType=1`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`, // include the access token in the Authorization header
            },
          }
        );

        setTransferPayment(transferResult.data);
        // console.log(transaction);
      } catch (error) {}
    };
    const getTransferFromWelfare = async () => {
      // const transaction = localStorage.getItem("transactionType");
      try {
        const transferResult = await axios.get(
          `${API_Transfer}/transfer-from?transactionFrom=APPLICATION&transactionType=1`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`, // include the access token in the Authorization header
            },
          }
        );

        setTransferDataWelfare(transferResult.data);
        // console.log(transaction);
      } catch (error) {}
    };
    fetchNowServing();
    getTransferFromWelfare();
    getTransferFromPayment();
    getSubTransactionData();
    getConsumer();

    const socket = io(`${API_Backend_Main}`);
    socket.on("connect", () => {
      // console.log("Connected to socket server");
    });
    socket.on("consumerTransactionUpdated", (updatedTransaction) => {
      if (updatedTransaction.counterPersonnel === subID) {
        setData((prevData) => [...prevData, updatedTransaction]);
      }
      fetchNowServing();
      getTransferFromWelfare();
      getTransferFromPayment();
      getConsumer();
    });
    socket.on("consumerTransactionDeleted", (deletedTransaction) => {
      fetchNowServing();
      getTransferFromWelfare();
      getTransferFromPayment();
      getConsumer();
    });
    socket.on("transactionCreated", (newTransaction) => {
      fetchNowServing();
      getTransferFromWelfare();
      getTransferFromPayment();
      getConsumer();
    });
    fetchNowServing();
    getTransferFromWelfare();
    getTransferFromPayment();
    getConsumer();
    return () => {
      socket.disconnect();
    };
  }, [fetchNowServing]);

  const handleComplete = async (consumer: ConsumerTransactionType) => {
    try {
      if (sub === null) {
        alert("Please Select Transaction");
      } else {
        const accessToken = localStorage.getItem("accessToken");
        await axios.patch(
          `${API_Consumer_Transaction}/${consumer.id}`,
          {
            transactionStatus: 3,
            subTransactionType: sub,
            timeEndTransaction: currentTime,
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
      }
      // alert("Please Select Transaction");
      // location.reload();
      setSub("");
      setconsumerData([]);
    } catch (error) {}
  };

  const handlePatchServe = async (
    consumer: ConsumerTransactionType | undefined
  ) => {
    if (consumer) {
      try {
        const accessToken = localStorage.getItem("accessToken");
        const subID = localStorage.getItem("sub");

        await axios.patch(
          `${API_Consumer_Transaction}/${consumer.id}`,
          {
            transactionStatus: 2,
            counterPersonnel: subID, //diri nagstop
            timeStartTransaction: currentTime,
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        // window.location.reload();
        // router.push("/welfare");
        // console.log(handlePatchServe);
        setSelectedConsumer(null); // diri
      } catch (error) {
        // console.error(error);
      }
    }
  };

  const handlePatchDrop = async (
    consumer: ConsumerTransactionType | undefined
  ) => {
    if (consumer) {
      try {
        const accessToken = localStorage.getItem("accessToken");

        await axios.patch(
          `${API_Consumer_Transaction}/${consumer.id}`,
          {
            transactionStatus: 4,
            dropTime: currentTime,
            dropExpiration: dropTimeExpiration,
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        // window.location.reload();
        // router.push("/welfare");
      } catch (error) {
        // console.error(error);
      }
    }
  };
  const handleTransfer = async (consumer: ConsumerTransactionType) => {
    const subID = localStorage.getItem("sub");
    try {
      const accessToken = localStorage.getItem("accessToken");
      await axios.patch(
        `${API_Consumer_Transaction}/${consumer.id}`,
        {
          // name: name,
          // accountNumber: number,
          transactionType: transfer,
          transactionStatus: 1,
          // transactionNote: note,
          // transferredFrom: `${subID}`,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      // window.location.reload();
      alert("Succesfully Transferred!");
    } catch (error) {}
  };
  const handleTransferPost = async (consumer: ConsumerTransactionType) => {
    // const consumerId = consumer.consumerTransaction?.id;
    try {
      const accessToken = localStorage.getItem("accessToken");
      const transactionStorage = localStorage.getItem("transactionType");
      await axios.post(
        `${API_Transfer}`,
        {
          transactionNote: note,
          consumerTransaction: `${consumer.id}`,
          transactionFrom: `${transactionStorage}`,
          transactionType: transfer,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      // window.location.reload();
      // alert("Succesfully post!");
    } catch (error) {}
  };

  const handleClick = () => {
    if (isMapDataComplete()) {
      setIsClicked(true);
    } else {
      setSelectedConsumer(null);
    }
  };

  const isMapDataComplete = () => {
    for (const consumer of consumerData) {
      if (!consumer.name || !consumer.accountNumber) {
        return false; // Data is incomplete
      }
    }
    return true; // Data is complete
  };

  return (
    <div>
      <div className="grid grid-cols-3">
        <div>
          <h1 className="px-9 py-2 mx-2 bg-blue-800 flex flex-col justify-center font-montserrat font-bold uppercase text-lg text-white">
            Up Next
          </h1>
          <RegularApp
            consumerData={consumerData}
            handleComplete={handleComplete}
            speak={speak}
            sub={sub}
          />

          {/* <AppTableContext.Provider
            value={{
              consumerTransaction: selectedConsumer || undefined, // diri
              setConsumerTransaction: setSelectedConsumer,
            }}
          > */}
          {/* <WelfareRegular consumerTransactionType={[]} /> */}
          {/* <AppRegular consumerTransactionType={[]} /> */}
          {/* <AppTable consumerTransactionType={[]} /> */}
          {/* </AppTableContext.Provider> */}
        </div>
        <div>
          <h1 className="px-9 py-2 mx-2 bg-blue-800 flex flex-col justify-center font-montserrat font-bold uppercase text-lg text-white">
            Priority
          </h1>
          <PriorityApp
            consumerData={consumerData}
            handleComplete={handleComplete}
            speak={speak}
            sub={sub}
          />
          {/* <AppPrioContext.Provider
            value={{
              consumerTransaction: selectedConsumer || undefined, // diri
              setConsumerTransaction: setSelectedConsumer,
            }}
          > */}
          {/* <WelfarePriority consumerTransactionType={[]} /> */}
          {/* <AppPriority consumerTransactionType={[]} /> */}
          {/* <AppTable consumerTransactionType={[]} /> */}
          {/* </AppPrioContext.Provider> */}
        </div>
        <div className="">
          <h1 className="px-9 py-2 mx-1 bg-red-800 flex flex-col justify-center font-montserrat font-bold uppercase text-lg text-white">
            Unattended
          </h1>
          <DropApp
            consumerData={consumerData}
            handleComplete={handleComplete}
            speak={speak}
            sub={sub}
          />
          {/* <AppTableContext.Provider
            value={{
              consumerTransaction: selectedConsumer || undefined, // diri
              setConsumerTransaction: setSelectedConsumer,
            }}
          >
            <AppDrop consumerTransactionType={[]} /> */}
          {/* <WelfareDrop consumerTransactionType={[]} /> */}
          {/* <WelfareRegular consumerTransactionType={[]} /> */}
          {/* <AppTable consumerTransactionType={[]} /> */}
          {/* </AppTableContext.Provider> */}
        </div>
      </div>
      {/* <div className="grid grid-cols-3 gap-4 mx-2 my-4">
        <div>
          <button
            id="myButton"
            // disabled={!isMapDataComplete()}
            onClick={(e) => {
              e.preventDefault();
              handleClick();
              if (selectedConsumer) {
                // Perform actions with the selectedConsumer
                handlePatchServe(selectedConsumer);
                handleComplete(consumerData[0]);
                speak(selectedConsumer);
              } else {
                alert("Please select a consumer first.");
              }
            }}
            className="bg-white text-gray-800 px-3 py-2 border border-blue-900 flex items-center rounded-md hover:shadow-lg hover:bg-blue-800 hover:text-white transition-all font-poppins font-medium text-xl container"
          >
            <HiChevronDoubleRight className="text-5xl mr-2" /> Next
          </button>
        </div>
        <div>
          <button
            id="myButton"
            // disabled={!isMapDataComplete()}
            onClick={(e) => {
              e.preventDefault();
              handleClick();
              if (selectedConsumer) {
                // Perform actions with the selectedConsumer
                handleComplete(consumerData[0]);
                handlePatchServe(selectedConsumer);
                speak(selectedConsumer);
              } else {
                alert("Please select a consumer first.");
              }
            }}
            className="bg-white text-gray-800 px-3 py-2 border border-blue-900 flex items-center rounded-md hover:shadow-lg hover:bg-blue-800 hover:text-white transition-all font-poppins font-medium container text-xl"
          >
            <HiChevronDoubleRight className="text-5xl mr-2" /> Next
          </button>
        </div>
        <div>
          <button
            id="myButton"
            // disabled={!isMapDataComplete()}
            onClick={(e) => {
              e.preventDefault();
              handleClick();
              if (selectedConsumer) {
                // Perform actions with the selectedConsumer
                handleComplete(consumerData[0]);
                handlePatchServe(selectedConsumer);
                speak(selectedConsumer);
              } else {
                alert("Please select a consumer first.");
              }
            }}
            className="bg-white text-gray-800 px-3 py-2 border border-blue-900 flex items-center rounded-md hover:shadow-lg hover:bg-blue-800 hover:text-white transition-all font-poppins font-medium container text-xl"
          >
            <HiChevronDoubleRight className="text-5xl mr-2" /> Next
          </button>
        </div>
      </div> */}
      <div className="grid grid-cols-2">
        <div>
          <h1 className="font-montserrat font-black text-blue-800 text-4xl ml-5">
            NOW SERVING
          </h1>
          <div className="px-9 py-2 bg-blue-900 rounded-lg mt-3 ml-5 flex flex-col justify-center">
            <div className="flex items-center justify-between">
              <form>
                {consumerData.map((consumer) => {
                  {
                    consumerData
                      .map(
                        (consumer) =>
                          `${consumer.name} - ${consumer.accountNumber}`
                      )
                      .join(" ");
                  }
                  return (
                    <h1
                      key={consumer.id}
                      className="font-montserrat uppercase text-white text-5xl font-bold"
                    >
                      {consumer.name} - {consumer.accountNumber}
                    </h1>
                  );
                })}
              </form>
            </div>
          </div>
          <select
            name=""
            id=""
            className="border border-gray-700 w-80 p-1 rounded-md mt-3 ml-5 mb-2 hover:shadow-md text-gray-900 font-poppins overflow-y-scroll text-lg"
            onChange={(e) => setSub(e.target.value)}
            value={sub}
            // onChange={(e) => console.log(e.target.value)}
          >
            <option value="">Please Select Transaction:</option>
            {subTransaction.map((transaction) => {
              return (
                <option
                  key={transaction.id}
                  value={transaction.id}
                  className="text-lg"
                >
                  {transaction.name}
                </option>
              );
            })}
          </select>
          <div className="grid grid-cols-3 gap-2 mx-5">
            <button
              onClick={() => {
                handlePatchDrop(consumerData[0]);
              }}
              className="bg-white text-gray-800 px-3 py-2 border border-blue-900 flex items-center rounded-md hover:shadow-lg hover:bg-red-500 hover:text-white hover:border-red-900 transition-all font-poppins font-medium container"
            >
              <HiBan className="text-3xl mr-2" /> DROP
            </button>
            <button
              onClick={speakServe}
              className="bg-white text-gray-800 col-span-2 px-3 py-2 border border-blue-900 flex items-center rounded-md hover:shadow-lg hover:bg-blue-800 hover:text-white transition-all font-poppins font-medium container"
            >
              <HiSpeakerphone className="text-3xl mr-2" /> CALL
            </button>
            <button
              onClick={toggleModal}
              className="bg-white text-gray-800 col-span-3 px-3 py-2 border border-blue-900 flex items-center rounded-md hover:shadow-lg hover:bg-blue-800 hover:text-white transition-all font-poppins font-medium container"
            >
              <HiSwitchHorizontal className="text-3xl mr-2" /> TRANSFER
            </button>
          </div>
          {isOpen && (
            <div className="fixed z-10 inset-0 overflow-y-auto">
              <div className="flex items-center justify-center min-h-screen">
                <div className="fixed inset-0 transition-opacity">
                  <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                </div>
                <div className="bg-white rounded-lg overflow-hidden z-50 px-6 py-6">
                  <h2 className="text-2xl font-montserrat font-bold text-center text-blue-900 mb-2">
                    TRANSFER
                  </h2>
                  <div>
                    <div className="p-2">
                      <label
                        htmlFor="staffNote"
                        className="text-lg text-gray-700 font-montserrat font-medium "
                      >
                        Additional Note:
                      </label>
                      <textarea
                        name="staffNote"
                        id="note"
                        onChange={(e) => setNote(e.target.value)}
                        className="w-full border border-blue-800 rounded-sm py-1 px-2"
                        required
                      ></textarea>
                    </div>
                    <div className="p-2 flex items-center gap-3">
                      <h1 className="text-lg text-gray-700 font-montserrat font-medium ">
                        Transfer to:
                      </h1>
                      <select
                        name="transfer"
                        id="transfer"
                        onChange={(e) => setTransfer(e.target.value)}
                        className="w-1/2 border border-blue-800 rounded-sm py-1 px-2 text-lg"
                        // onChange={(e) => console.log(e.target.value)}
                      >
                        <option value="">Choose Transaction:</option>
                        <option value="2">Customer Welfare</option>
                        <option value="3">Payment</option>
                      </select>
                    </div>
                    <div className="mt-6 flex items-center justify-end gap-3">
                      <h1
                        onClick={() => {
                          setIsOpen(false);
                        }}
                        className="cursor-pointer"
                      >
                        Cancel
                      </h1>
                      <button
                        onClick={() => {
                          {
                            // handleTransfer(consumerData[0]);
                            handleTransfer(consumerData[0]);
                            handleTransferPost(consumerData[0]);
                            setIsOpen(false);
                          }
                        }}
                        type="submit"
                        className="flex justify-center py-2 px-3 border border-transparent text-md font-medium rounded-md text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:border-blue-700 focus:shadow-outline-blue active:bg-blue-700 transition duration-150 ease-in-out"
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="grid grid-cols-2">
          <div className="">
            <h1 className="text-lg font-montserrat py-2 px-7 mx-2  rounded-md shadow-sm font-medium text-white bg-blue-800">
              Notifications
            </h1>
            <div className="px-7 mx-2 rounded-md shadow-md">
              {transferDataPayment.map((transactionTransfer) => {
                return (
                  <h1
                    key={transactionTransfer.id}
                    className="text-lg text-black capitalize"
                  >
                    {transactionTransfer.transactionNote} - from{" "}
                    {transactionTransfer.transactionFrom} - to{" "}
                    {transactionTransfer.transactionType?.name} - by{" "}
                    {transactionTransfer.consumerTransaction?.name}
                  </h1>
                );
              })}
              {transferDataWelfare.map((transactionTransfer) => {
                return (
                  <h1
                    key={transactionTransfer.id}
                    className="text-lg text-black capitalize"
                  >
                    {transactionTransfer.transactionNote} - from{" "}
                    {transactionTransfer.transactionFrom} - to{" "}
                    {transactionTransfer.transactionType?.name} - by{" "}
                    {transactionTransfer.consumerTransaction?.name}
                  </h1>
                );
              })}
            </div>
          </div>
          <div className="">
            <h1 className="text-lg font-montserrat py-2 px-7 mx-2 rounded-md shadow-sm font-medium text-white bg-blue-800">
              Now Serving
            </h1>
            <div>
              {transactions.map((transaction, index) => (
                <div
                  className={`bg-${
                    index % 2 === 0 ? "blue-100" : "white"
                  } p-2 font-medium flex flex-row justify-between items-center rounded-md mx-2 my-1`}
                  key={transaction.id}
                >
                  <h2 className="text-lg font-bold four:text-7xl">
                    {transaction.counterPersonnel.tag}
                  </h2>
                  <h2 className="text-lg four:text-xl capitalize">
                    {transaction.name}
                  </h2>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
function setData(arg0: (prevData: any) => any[]) {
  throw new Error("Function not implemented.");
}
