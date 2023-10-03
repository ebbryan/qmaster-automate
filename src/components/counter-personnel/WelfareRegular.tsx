//API
const API_Consumer_Transaction = process.env.BACKEND_API_CONSUMER_TRANSACT;
const API_Backend_Main = process.env.BACKEND_API;
const API_NowServing_PAY =
  process.env.BACKEND_API_CONSUMER_TRANSACT_NOW_SERVE_PAY;
const API_Sub_Transact = process.env.BACKEND_API_SUB_TRANSACT_TYPE;
const API_Transfer = process.env.BACKEND_API_TRANSFERRED_CONSUMER_FROM;
//APIimport { ConsumerTransactionType } from "@/types/queue.type";
import axios from "axios";
import { FunctionComponent, useCallback, useEffect, useState } from "react";
import { WelfareTableContext } from "./WelfareServing";
import React from "react";
import io from "socket.io-client";
import { ConsumerTransactionType } from "@/types/queue.type";

type ConsumerProps = {
  consumerTransactionType: ConsumerTransactionType[];
};

export const WelfareRegular: FunctionComponent<ConsumerProps> = () => {
  const [regular, setRegular] = useState<Array<ConsumerTransactionType>>([]);
  const [selectedRow, setSelectedRow] = useState<number | null>(null);
  const [selectedTopRow, setSelectedTopRow] = useState(0);
  const visibleDataRegular = regular.slice(0, 5);
  const [enable, setEnable] = useState(true);
  const { consumerTransaction, setConsumerTransaction } =
    React.useContext(WelfareTableContext);
  const [selectedConsumer, setSelectedConsumer] = useState(null);

  const getConsumerDataRegular = useCallback(async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const resultRegular = await axios.get(
        `${API_Consumer_Transaction}/transactionstatus?consumerPriority=1&transactionStatus=1&transactionType=2`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setRegular(resultRegular.data);
      console.log("New data:", resultRegular.data);
    } catch (error) {}
  }, []);

  const handleRowClick = (consumer: any) => {
    setConsumerTransaction(consumer);
    setSelectedConsumer(consumer);
    // setSelectedRow(consumer.id);
  };

  const renderRowsInline = () => {
    useEffect(() => {
      // Automatically select the top row when the component mounts
      handleRowClick(visibleDataRegular[0]);
    }, [visibleDataRegular]);

    return visibleDataRegular.map((row, index) => {
      const isSelected = selectedTopRow === index;

      return (
        <tr
          key={index}
          className={`${
            isSelected ? "bg-blue-500 text-white" : ""
          } cursor-pointer hover:bg-blue-500 hover:text-white hover:rounded-lg mx-1 gap-1`}
        >
          <td className="uppercase text-xl flex flex-grow py-2 px-4">
            {row.name}
          </td>
        </tr>
      );
    });
  };

  useEffect(() => {
    const socket = io(`${API_Backend_Main}`);

    socket.on("connect", () => {
      console.log("Connected to socket server");
    });

    socket.on("consumerTransactionUpdated", (updatedTransaction) => {
      getConsumerDataRegular();
    });

    socket.on("consumerTransactionDeleted", (deletedTransaction) => {
      getConsumerDataRegular();
    });

    socket.on("transactionCreated", (newTransaction) => {
      getConsumerDataRegular();
    });
    getConsumerDataRegular();

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    // Automatically select the top row when the component mounts
    setSelectedTopRow(0);
  }, [selectedTopRow]);

  // useEffect(() => {
  //   if (visibleDataRegular.length > 0 && selectedRow === null) {
  //     handleRowClick(visibleDataRegular[0]);
  //   }
  // }, [visibleDataRegular, selectedRow]);

  useEffect(() => {
    visibleDataRegular.forEach((row) => {
      if (visibleDataRegular.length > 0 && selectedRow === null) {
        handleRowClick(visibleDataRegular[0]);
      }
    });
  }, [visibleDataRegular, selectedRow, handleRowClick]);

  return (
    <div className="">
      <div className="flex flex-grow">
        <table className="flex flex-col flex-grow mx-2">
          <tbody className="flex flex-col flex-grow">
            {renderRowsInline()}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WelfareRegular;
