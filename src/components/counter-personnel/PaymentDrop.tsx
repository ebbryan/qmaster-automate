//API
const API_Backend_Main = process.env.BACKEND_API;
// const dropCurrentDate = process.env.BACKEND_API_CONSUMER_TRANSACT_STATUS;
const API_Consumer_Transaction = process.env.BACKEND_API_CONSUMER_TRANSACT;
//API

import { ConsumerTransactionType } from "@/types/queue.type";
import axios from "axios";
import { FunctionComponent, useCallback, useEffect, useState } from "react";

import React from "react";
import { io } from "socket.io-client";
import { PaymentTableContext } from "./PaymentServing";
// import { AppTableContext } from "./AppServing";
// import { WelfareTableContext } from "./WelfareServing";

type ConsumerProps = {
  consumerTransactionType: ConsumerTransactionType[];
};

export const PaymentDrop: FunctionComponent<ConsumerProps> = () => {
  const [data, setData] = useState<Array<ConsumerTransactionType>>([]);
  const [selectedRow, setSelectedRow] = useState<number | null>(null);
  const visibleTableData = data.slice(0, 4);
  const [inputValue, setInputValue] = useState("");
  const { consumerTransaction, setConsumerTransaction } =
    React.useContext(PaymentTableContext);

  const handleInputChange = (event: any) => {
    setInputValue(event.target.value);
  };

  // RowClick
  const handleRowClick = (consumer: ConsumerTransactionType) => {
    setConsumerTransaction(consumer);
    setSelectedRow(consumer.id);
  };

  // Render table rows
  const renderRows = () => {
    return (
      visibleTableData &&
      filteredConsumerData.map((row) => {
        return (
          <tr
            key={row.id}
            onClick={() => handleRowClick(row)}
            className={`${
              selectedRow === row.id ? "bg-blue-500 text-white" : ""
            } cursor-pointer hover:bg-blue-500 hover:text-white hover:rounded-lg`}
          >
            <td className="pr-36 pl-4 py-2 mb-2 uppercase text-xl">
              {row.name}
            </td>
          </tr>
        );
      })
    );
  };

  const getWelfareData = useCallback(async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const result = await axios.get(
        // `${API_Consumer_Transaction}/transactionstatus?transactionStatus=4&transactionType=2`,
        `${API_Consumer_Transaction}/transactionstatus?transactionStatus=4&transactionType=3`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`, // include the access token in the Authorization header
          },
        }
      );
      setData(result.data);
      // console.log("New data:", result.data);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    const socket = io(`${API_Backend_Main}`);

    socket.on("connect", () => {
      // console.log("Connected to socket server");
    });

    socket.on("consumerTransactionUpdated", (updatedTransaction) => {
      // console.log("Updated transaction received:", updatedTransaction);
      if (updatedTransaction.transactionStatus === 4) {
        setData((prevData) => [...prevData, updatedTransaction]);
      }
      getWelfareData();
    });

    socket.on("consumerTransactionDeleted", (deletedTransaction) => {
      // console.log("Deleted transaction received:", deletedTransaction);
      getWelfareData();
    });

    socket.on("transactionCreated", (newTransaction) => {
      // console.log("New transaction received:", newTransaction);
      // Update the UI with the new transaction data, only for consumerPriority=1
      if (newTransaction.transactionStatus === 4) {
        setData((prevData) => [...prevData, newTransaction]);
      }
    });

    // Call getConsumerData function when the component mounts to fetch the initial data
    getWelfareData();

    // Return a cleanup function to disconnect the socket when the component unmounts
    return () => {
      socket.disconnect();
      // console.log("Disconnected from socket server");
    };
  }, [getWelfareData]);

  const filteredConsumerData = data.filter((item) =>
    item.name.toLowerCase().includes(inputValue.toLowerCase())
  );

  return (
    <div>
      <div className="flex flex-col flex-grow">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Search consumers..."
          className="px-2 py-1 uppercase text-lg rounded-md mx-3"
        />
        <table className="flex flex-col flex-grow mx-2">
          <tbody className="flex flex-col flex-grow">{renderRows()}</tbody>
        </table>
      </div>
    </div>
  );
};
