//imports
import React, { useEffect, useState } from "react";
import axios from "axios";
// import { useRouter } from "next/router";

//types
import {
  ConsumerTransactionType,
  SubTransactionType,
} from "@/types/queue.type";

//components
import { Header } from "@/components/counter-personnel/Header";
import { ServingWelfare } from "@/components/counter-personnel/WelfareServing";

export type WelfarePrioContextState = {
  consumerTransaction: ConsumerTransactionType | undefined;
  setConsumerTransaction: (transaction: ConsumerTransactionType) => void;
};

export const WelfarePrioContext = React.createContext(
  {} as WelfarePrioContextState
);

export default function Welfare() {
  const [data, setData] = useState<Array<ConsumerTransactionType>>([]);
  // const router = useRouter();

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const getConsumerData = async () => {
      try {
        const result = await axios.get(
          "http://172.20.110.65:3000/consumer-transaction",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`, // include the access token in the Authorization header
            },
          }
        );
        setData(result.data);
        // router.push("/welfare");
        // console.log(result.data);
      } catch (error) {
        console.error(error);
      }
    };
    getConsumerData();
  });

  return (
    <div className="flex flex-col gap-5">
      <div className="col-span-4">
        <div className="">
          <Header transactionType={data} />
        </div>
      </div>
      <ServingWelfare consumerTransactionType={data} />
    </div>
  );
}