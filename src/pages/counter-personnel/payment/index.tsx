//imports
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";

//types
import {
  ConsumerTransactionType,
  SubTransactionType,
} from "@/types/queue.type";

//components
import { Header } from "@/components/counter-personnel/Header";
import { ServingPayment } from "@/components/counter-personnel/PaymentServing";

export type PaymentPrioContextState = {
  consumerTransaction: ConsumerTransactionType | undefined;
  setConsumerTransaction: (transaction: ConsumerTransactionType) => void;
};

export const PaymentPrioContext = React.createContext(
  {} as PaymentPrioContextState
);

export default function Payment() {
  const [data, setData] = useState<Array<ConsumerTransactionType>>([]);
  const [subdata, setSubdata] = useState<Array<SubTransactionType>>([]);
  const router = useRouter();
  const [selectedConsumer, setSelectedConsumer] =
    useState<ConsumerTransactionType>();

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

        // console.log(result.data);
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
      <ServingPayment consumerTransactionType={data} />
    </div>
  );
}