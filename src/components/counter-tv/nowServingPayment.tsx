const backendApiUrl = process.env.BACKEND_API;
const backendApiNowServePayUrl =
  process.env.BACKEND_API_CONSUMER_TRANSACT_NOW_SERVE_PAY;

import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import React from "react";
import { ConsumerTransactionType } from "@/types/queue.type";

export default function NowServingPayment() {
  const [transactions, setTransactions] = useState<ConsumerTransactionType[]>(
    []
  );
  // interface Transaction {
  //   id: number;
  //   name: string;
  //   counterPersonnel: {
  //     tag: string;
  //   };
  //   status: number;
  // }

  const fetchNowServing = useCallback(async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const result = await axios.get(`${backendApiNowServePayUrl}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setTransactions(result.data);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    const socket = io(`${backendApiUrl}`);

    socket.on("consumerTransactionUpdated", () => {
      fetchNowServing();
    });

    socket.on("transactionCreated", () => {
      fetchNowServing();
    });

    fetchNowServing();

    return () => {
      socket.disconnect();
    };
  }, [fetchNowServing]);

  return (
    <div className="flex flex-col gap-2 overflow-hidden truncate">
      {transactions.map((transaction, index) => (
        <div
          className={`bg-${
            index % 2 === 0 ? "blue-100" : "white"
          } p-2 font-medium flex flex-row justify-between items-center truncate`}
          key={transaction.id}
        >
          <div className="flex flex-row flex-grow">
            <div className="grid grid-cols-3 gap-x-2 flex-grow">
              <div className="flex flex-grow">
                <h2 className="text-4xl font-bold four:text-7xl">
                  {transaction.counterPersonnel.tag}
                </h2>
              </div>
              <div className="flex flex-row flex-grow col-span-2 gap-x-2">
                <h2 className="text-4xl four:text-7xl truncate">
                  {transaction.name}
                </h2>
                <h2 className="text-4xl four:text-7xl">
                  {transaction.transactionType.id}
                  {transaction.rng}
                </h2>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
