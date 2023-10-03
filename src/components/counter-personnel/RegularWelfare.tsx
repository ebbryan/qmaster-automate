import { ConsumerTransactionType } from "@/types/queue.type";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import React from "react";
import { HiChevronDoubleRight } from "react-icons/hi2";
import { io } from "socket.io-client";
import { useForm } from "react-hook-form";

// API
const consumerTransaction = process.env.BACKEND_API_CONSUMER_TRANSACT;
const main = process.env.BACKEND_API;
const API_Consumer_Transaction = process.env.BACKEND_API_CONSUMER_TRANSACT;

const RegularWelfare = ({
  consumerData,
  sub,
  speak,
  handleComplete,
}: {
  consumerData: Array<any>;
  sub: any;
  speak: any;
  handleComplete: any;
}) => {
  const [data, setData] = useState<Array<ConsumerTransactionType>>([]);
  const [selectedTopRow, setSelectedTopRow] = useState(0);
  const visibleData = data.slice(0, 5);
  const now = new Date();
  const currentTime = now.toTimeString().slice(0, 8);
  // const [speaking, setSpeaking] = useState(false);

  const fetchData = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const res = await axios.get(
        `${consumerTransaction}/transactionstatus?consumerPriority=1&transactionStatus=1&transactionType=2`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      // console.log(res.data);
      setData(res.data);
    } catch (error) {}
  };

  useEffect(() => {
    fetchData();
  }, []);

  // useEffect(() => {
  //   setSelectedTopRow(0);

  //   console.log(selectedTopRow);
  // }, [selectedTopRow]);
  useEffect(() => {
    setSelectedTopRow(0);
    handleRowClick(selectedTopRow); // Auto-trigger handleRowClick with the initial selectedTopRow value
  }, [data]);

  const renderRows = () => {
    return visibleData.map((row, index) => {
      const isSelected = selectedTopRow === index;
      return (
        <tr
          key={index}
          className={`${
            isSelected ? "bg-blue-800 rounded-lg mx-2 text-white" : ""
          } mx-1 gap-1`}
          // onClick={() => handleRowClick(index)} // Attach the onClick event
        >
          <td className="uppercase text-xl mx-2 flex flex-grow py-2 px-4">
            {row.name}
          </td>
        </tr>
      );
    });
  };
  // const { reset } = useForm();

  const handlePatchServe = async (
    consumer: ConsumerTransactionType | undefined
  ) => {
    if (consumer) {
      try {
        const accessToken = localStorage.getItem("accessToken");
        const subID = localStorage.getItem("sub");

        await axios.patch(
          `${consumerTransaction}/${consumer.id}`,
          {
            transactionStatus: 2,
            counterPersonnel: subID, // diri nagstop
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
        console.log("success");
        // setSelectedConsumer(null); // diri
      } catch (error) {
        console.error(error);
      }
    }
  };

  // const speak = async (consumer: ConsumerTransactionType | undefined) => {
  //   if (!speaking && consumer) {
  //     const lastText = "Please proceed to Customer Welfare.";
  //     const consumerNames = data.map((consumer) => consumer.name);
  //     const consumers = `${consumer.name}`;
  //     const message = new SpeechSynthesisUtterance(consumers + lastText);
  //     speechSynthesis.speak(message);
  //     setSpeaking(true);
  //   }
  // };

  // const speakServe = useCallback(() => {
  //   if (!speaking) {
  //     const lastText = "Please proceed to Customer Welfare.";
  //     const consumerNames = data.map((consumer) => consumer.name);
  //     const message = new SpeechSynthesisUtterance(
  //       consumerNames.join(" , ") + lastText
  //     );
  //     speechSynthesis.speak(message);
  //     setSpeaking(true);

  //     // Reset the speaking state to false after speech has finished
  //     message.onend = () => {
  //       setSpeaking(false);
  //     };
  //   }
  // }, [consumerData]);

  const handleRowClick = (index: any) => {
    setSelectedTopRow(index);
  };

  useEffect(() => {
    const socket = io(`${main}`);

    socket.on("connect", () => {
      console.log("Connected to socket server");
    });

    socket.on("consumerTransactionUpdated", (updatedTransaction) => {
      fetchData();
    });

    socket.on("consumerTransactionDeleted", (deletedTransaction) => {
      fetchData();
    });

    socket.on("transactionCreated", (newTransaction) => {
      fetchData();
    });

    fetchData();

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="flex flex-col flex-grow my-1">
      {/* flex flex-col flex-grow mx-2 */}
      <table className="h-52">
        <tbody className="flex flex-col flex-grow">{renderRows()}</tbody>
      </table>
      <button
        id="myButton"
        onClick={(e) => {
          e.preventDefault();
          if (selectedTopRow === null && consumerData.length === 1) {
            handleComplete(consumerData[0]);
          } else {
            if (consumerData.length === 1 && !sub) {
              alert("Please Select a Transaction First");
            } else {
              handlePatchServe(data[selectedTopRow]);
              handleComplete(consumerData[0]);
              speak(data[selectedTopRow]);
            }
          }
        }}
        disabled={consumerData.length === null}
        className={`bg-white text-gray-800 mx-2 my-2 py-2 border border-blue-900 flex items-center rounded-md hover:shadow-lg hover:bg-blue-800 hover:text-white transition-all font-poppins font-medium text-xl  ${
          consumerData.length === 1 && !sub
            ? "opacity-50 cursor-not-allowed"
            : ""
        }`}
      >
        <HiChevronDoubleRight className="text-5xl mr-2" /> Next
      </button>
    </div>
  );
};
// handlePatchServe(data[selectedTopRow]);
export default RegularWelfare;
