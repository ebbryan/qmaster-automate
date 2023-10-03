//API
const API_Consumer_Transaction = process.env.BACKEND_API_CONSUMER_TRANSACT;
const API_Backend_Main = process.env.BACKEND_API;
const API_NowServing_PAY =
  process.env.BACKEND_API_CONSUMER_TRANSACT_NOW_SERVE_PAY;
const API_Sub_Transact = process.env.BACKEND_API_SUB_TRANSACT_TYPE;
const API_Transfer = process.env.BACKEND_API_TRANSFERRED_CONSUMER_FROM;
import { AppPrioContext } from "@/pages/counter-personnel/application";
//API

import { ConsumerTransactionType } from "@/types/queue.type";
import axios from "axios";
import { FunctionComponent, useCallback, useEffect, useState } from "react";
// import { WelfareTableContext } from "./WelfareServing";
import React from "react";
import io from "socket.io-client";
// import { WelfarePrioContext } from "@/pages/counter-personnel/customer-welfare";

type ConsumerProps = {
  consumerTransactionType: ConsumerTransactionType[];
};

export const AppPriority: FunctionComponent<ConsumerProps> = () => {
  const [regular, setRegular] = useState<Array<ConsumerTransactionType>>([]);
  const [priority, setPriority] = useState<Array<ConsumerTransactionType>>([]);
  const [selectedRow, setSelectedRow] = useState<number | null>(null);
  const visibleDataRegular = regular.slice(0, 5);
  const visibleDataPriority = priority.slice(0, 5);
  const [enable, setEnable] = useState(true);
  const { consumerTransaction, setConsumerTransaction } =
    React.useContext(AppPrioContext);
  const [selectedConsumer, setSelectedConsumer] = useState(null);

  const handleConsumerSelect = (consumer: any) => {
    setSelectedConsumer(consumer);
  };

  const getConsumerDataRegular = useCallback(async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const resultRegular = await axios.get(
        `${API_Consumer_Transaction}/transactionstatus?consumerPriority=1&transactionStatus=1&transactionType=2`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`, // include the access token in the Authorization header
          },
        }
      );
      setRegular(resultRegular.data);
      console.log("New data:", resultRegular.data);
    } catch (error) {}
  }, []);
  const getConsumerDataPriority = useCallback(async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const resultPriority = await axios.get(
        `${API_Consumer_Transaction}/transactionstatus?consumerPriority=2&transactionStatus=1&transactionType=1`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`, // include the access token in the Authorization header
          },
        }
      );
      setPriority(resultPriority.data);
      // console.log("New data:", result.data);
    } catch (error) {
      console.error(error);
    }
  }, []);

  const handleRowClick = (consumer: any) => {
    setConsumerTransaction(consumer);
    setSelectedConsumer(consumer);
    setSelectedRow(consumer.id);
  };

  const renderRowsInline = () => {
    return visibleDataRegular.map((row) => {
      return (
        <tr
          key={row.id}
          onClick={() => handleRowClick(row)}
          className={`${
            selectedRow === row.id ? "bg-blue-500 text-white" : ""
          } cursor-pointer hover:bg-blue-500 hover:text-white hover:rounded-lg mx-1 gap-1`}
        >
          <td className="uppercase text-xl flex flex-grow py-2 px-4">
            {row.name}
          </td>
        </tr>
      );
    });
  };
  const renderRowsPriority = () => {
    return visibleDataPriority.map((row) => {
      return (
        <tr
          key={row.id}
          onClick={() => handleRowClick(row)}
          className={`${
            selectedRow === row.id ? "bg-blue-500 text-white" : ""
          } cursor-pointer hover:bg-blue-500 hover:text-white hover:rounded-lg mx-1 gap-1`}
        >
          <td className="uppercase text-xl flex flex-grow py-2 px-4">
            {row.name}
          </td>
        </tr>
      );
    });
  };

  // const renderRowsPriority = () => {
  //   return visibleDataPriority.map((row) => {
  //     return (
  //       <tr
  //         key={row.id}
  //         onClick={() => handleRowClick(row)}
  //         className={`${
  //           selectedRow === row.id ? "bg-blue-500 text-white" : ""
  //         } cursor-pointer hover:bg-blue-500 hover:text-white hover:rounded-lg`}
  //       >
  //         <td className="pr-36 pl-4 py-2 mb-2 uppercase text-xl">{row.name}</td>
  //       </tr>
  //     );
  //   });
  // };

  useEffect(() => {
    const socket = io(`${API_Backend_Main}`);

    socket.on("connect", () => {
      console.log("Connected to socket server");
    });

    socket.on("consumerTransactionUpdated", (updatedTransaction) => {
      // console.log("Updated transaction received:", updatedTransaction);
      // Call getConsumerData function again to update the data in state
      getConsumerDataRegular();
      getConsumerDataPriority();
    });

    socket.on("consumerTransactionDeleted", (deletedTransaction) => {
      // console.log("Deleted transaction received:", deletedTransaction);
      getConsumerDataRegular();
      getConsumerDataPriority();
    });

    socket.on("transactionCreated", (newTransaction) => {
      // console.log("New transaction received:", newTransaction);
      // Update the UI with the new transaction data, only for consumerPriority=1
      // if (newTransaction.transactionType === 2) {
      //   setRegular((prevData) => [...prevData, newTransaction]);
      //   setPriority((prevData) => [...prevData, newTransaction]);
      // } // Update the UI with the new transaction data, only for consumerPriority=1
      getConsumerDataRegular();
      getConsumerDataPriority();
    });

    // Call getConsumerData function when the component mounts to fetch the initial data
    getConsumerDataRegular();
    getConsumerDataPriority();

    // Return a cleanup function to disconnect the socket when the component unmounts
    return () => {
      socket.disconnect();
      // console.log("Disconnected from socket server");
    };
  }, []);
  return (
    <div className="">
      <div className="flex flex-grow">
        <table className="flex flex-col flex-grow mx-2">
          <tbody className="flex flex-col flex-grow">
            {renderRowsPriority()}
          </tbody>
        </table>
      </div>
      {/* <div className="">
        <table>
          <thead>
            <tr className="text-xl font-montserrat py-2 px-4 mx-1 rounded-md shadow-sm font-bold uppercase text-white bg-blue-800">
              <td className="py-2 px-4 mx-1">Priority</td>
            </tr>
          </thead>
          <tbody>{renderRowsPriority()}</tbody>
        </table>
      </div> */}
    </div>
  );
};
export default AppPriority;
