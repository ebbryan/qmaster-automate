const backendApiUrl = process.env.BACKEND_API;
const backendApiInQueuePayLatest =
  process.env.BACKEND_API_CONSUMER_TRANSACT_IN_QUEUE_PAY_LATEST;

import { Inter } from "next/font/google";
import { useCallback, useEffect, useState } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import { ConsumerTransactionType } from "@/types/queue.type";
const inter = Inter({ subsets: ["latin"] });

export default function InQueuePaymentRecent() {
  const [consumerTransaction, setconsumerTransaction] = useState<
    ConsumerTransactionType[]
  >([]);
  const visibleTableData = consumerTransaction.slice(0, 4);
  // interface transactionType {
  //   id: number;
  //   name: string;
  //   accountNumber: string;
  //   applicationNumber: string;
  // }

  const getConsumerData = useCallback(async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const result = await axios.get(`${backendApiInQueuePayLatest}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setconsumerTransaction(result.data);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    const socket = io(`${backendApiUrl}`);

    socket.on("connect", () => {});

    const handleConsumerTransactionUpdated = () => {
      getConsumerData();
    };

    const handleTransactionCreated = () => {
      getConsumerData();
    };

    socket.on("consumerTransactionUpdated", handleConsumerTransactionUpdated);
    socket.on("transactionCreated", handleTransactionCreated);

    getConsumerData();

    return () => {
      socket.disconnect();
    };
  }, [getConsumerData]);

  return (
    <div className="flex flex-col align-right justify-between gap-2 overflow-hidden truncate">
      {visibleTableData.map((type, index) => (
        <div
          className={`bg-${
            index % 2 === 0 ? "blue-100" : "white"
          } p-2 font-medium text-4xl text-left four:text-7xl flex flex-row flex-grow`}
          key={index}
        >
          <div className="grid grid-cols-3 gap-2 flex-grow">
            <h1 className="col-span-2 truncate">{type.name}</h1>
            <h1 className="text-right">
              {type.transactionType.id}
              {type.rng}
            </h1>
          </div>
        </div>
      ))}
    </div>
  );
}
