//imports
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";

//types
import { ConsumerTransactionType } from "@/types/queue.type";

//components
import { Header } from "@/components/counter-personnel/Header";
import { ServingApp } from "@/components/counter-personnel/AppServing";

export type AppPrioContextState = {
  consumerTransaction: ConsumerTransactionType | undefined;
  setConsumerTransaction: (transaction: ConsumerTransactionType) => void;
};
export const AppPrioContext = React.createContext({} as AppPrioContextState);

export default function Application() {
  const [data, setData] = useState<Array<ConsumerTransactionType>>([]);
  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const getConsumerData = async () => {
      try {
        const result = await axios.get(
          "http://172.20.110.65:3000/consumer-transaction",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setData(result.data);
      } catch (error) {
        console.error(error);
      }
    };

    getConsumerData();
  }, []);

  return (
    <div className="flex flex-col gap-5">
      <div className="col-span-4">
        <div className="py-3">
          <Header transactionType={data} />
        </div>
      </div>
      <ServingApp consumerTransactionType={[]} />
    </div>
  );
}
