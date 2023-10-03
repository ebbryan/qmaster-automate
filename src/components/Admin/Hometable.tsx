import { CounterPersonnel, consumerTransaction } from "@/types/admin.type";
import axios from "axios";
import React, { FunctionComponent, useEffect, useRef, useState } from "react";
import { HiUserGroup } from "react-icons/hi2";
import { io } from "socket.io-client";
import { Chart, ChartConfiguration } from "chart.js/auto";
import { HiChartBarSquare, HiChartBar } from "react-icons/hi2";

const BackendApi = process.env.BACKEND_API;
const BackendApiForConsumerTransact = process.env.BACKEND_API_CONSUMER_TRANSACT;

type TableReportProps = {
  counterPersonnel: CounterPersonnel[];
  consumertransaction: consumerTransaction[];
};

export const Hometable: FunctionComponent<TableReportProps> = ({
  counterPersonnel,
  consumertransaction,
}) => {
  const [data, setData] = useState<Array<consumerTransaction>>([]);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken"); // get access token from local storage
    const subID = localStorage.getItem("sub");

    const getconsumerTransaction = async () => {
      try {
        const result = await axios.get(
          `${BackendApiForConsumerTransact}/transactionstatus?transactionStatus=3`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`, // include the access token in the Authorization header
            },
          }
        );
        setData(result.data);
      } catch (error) {
        console.error(error);
      }
    };

    // call getconsumerTransaction and fetch initial data
    getconsumerTransaction();

    const socket = io(`${BackendApi}`);
    socket.on("connect", () => {
      console.log("Connected to socket server");
    });

    socket.on("consumerTransactionUpdated", (updatedTransaction) => {
      if (updatedTransaction.counterPersonnel === subID) {
        setData((prevData) => [...prevData, updatedTransaction]);
      }
      getconsumerTransaction();
    });

    // socket.on("transactioncreated", );

    socket.on("counterPersonnelUpdated", (updatedconsumertransaction) => {
      if (updatedconsumertransaction.consumertransaction === subID) {
        setData((prevData) => [...prevData, updatedconsumertransaction]);
      }
      getconsumerTransaction();
    });
    getconsumerTransaction();

    // return cleanup function to disconnect socket
    return () => {
      socket.disconnect();
    };
  }, []);

  //////counter personnel sorting user
  const applicationCounterPersonnel = counterPersonnel.filter(
    (cp) => cp.transactionType?.name === "APPLICATION"
  );

  // calculate the total count of APPLICATION counterPersonnel
  const totalApplication = applicationCounterPersonnel.reduce(
    (total, cp) => total + 1,
    0
  );

  // filter the counterPersonnel that have a transaction type of CUSTOMER WELFARE
  const customerWelfareCounterPersonnel = counterPersonnel.filter(
    (cp) => cp.transactionType?.name === "CUSTOMER WELFARE"
  );

  // calculate the total count of CUSTOMER WELFARE counterPersonnel
  const totalCustomerWelfare = customerWelfareCounterPersonnel.reduce(
    (total, cp) => total + 1,
    0
  );

  // filter the counterPersonnel that have a transaction type of PAYMENT
  const paymentCounterPersonnel = counterPersonnel.filter(
    (cp) => cp.transactionType?.name === "PAYMENT"
  );

  // calculate the total count of PAYMENT counterPersonnel
  const totalPayment = paymentCounterPersonnel.reduce(
    (total, cp) => total + 1,
    0
  );

  /////transaction sorting transactiontype

  const applicationCountertransaction = consumertransaction.filter(
    (cp) => cp.transactionType?.name === "APPLICATION"
  );

  // calculate the total count of APPLICATION counterPersonnel
  const totalApplicationtransaction = applicationCounterPersonnel.reduce(
    (total, cp) => total + 1,
    0
  );

  // filter the counterPersonnel that have a transaction type of CUSTOMER WELFARE
  const customerWelfaretransaction = consumertransaction.filter(
    (cp) => cp.transactionType?.name === "CUSTOMER WELFARE"
  );

  // calculate the total count of CUSTOMER WELFARE counterPersonnel
  const totalCustomerWelfaretransaction =
    customerWelfareCounterPersonnel.reduce((total, cp) => total + 1, 0);

  // filter the counterPersonnel that have a transaction type of PAYMENT
  const paymenttransaction = consumertransaction.filter(
    (cp) => cp.transactionType?.name === "PAYMENT"
  );

  // calculate the total count of PAYMENT counterPersonnel
  const totalPaymenttransaction = paymentCounterPersonnel.reduce(
    (total, cp) => total + 1,
    0
  );

  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstanceRef = useRef<Chart | null>(null);

  const [showGraph, setShowGraph] = useState(false);

  useEffect(() => {
    const applicationCounterTransaction = consumertransaction.filter(
      (cp) => cp.transactionType?.name === "APPLICATION"
    );
    const totalApplicationTransaction = applicationCounterTransaction.length;

    const customerWelfareTransaction = consumertransaction.filter(
      (cp) => cp.transactionType?.name === "CUSTOMER WELFARE"
    );
    const totalCustomerWelfareTransaction = customerWelfareTransaction.length;

    const paymentTransaction = consumertransaction.filter(
      (cp) => cp.transactionType?.name === "PAYMENT"
    );
    const totalPaymentTransaction = paymentTransaction.length;

    const labels = ["Application", "Customer Welfare", "Payment"];
    const ctx = chartRef.current?.getContext("2d");
    if (ctx) {
      if (showGraph) {
        if (chartInstanceRef.current) {
          chartInstanceRef.current.destroy(); // Destroy the previous Chart instance
        }

        chartInstanceRef.current = new Chart(ctx, {
          type: "bar",
          data: {
            labels: labels,
            datasets: [
              {
                label: "Application",
                data: [totalApplicationTransaction, 0, 0],
                backgroundColor: "rgba(54, 162, 235, 1)", // Assign a color for the "Application" label
                barPercentage: 0.8,
              },
              {
                label: "Customer Welfare",
                data: [0, totalCustomerWelfareTransaction, 0],
                backgroundColor: "rgba(255, 99, 132, 1)", // Assign a color for the "Customer Welfare" label
              },
              {
                label: "Payment",
                data: [0, 0, totalPaymentTransaction],
                backgroundColor: "rgba(75, 192, 192, 1)", // Assign a color for the "Payment" label
                barPercentage: 0.8,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              title: {
                display: true,
                text: "TRANSACTION TODAY",
              },
            },
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  callback: function (value) {
                    if (Number.isInteger(value)) {
                      return value.toString();
                    }
                  },
                },
              },
            },
          },
        });
      } else {
        // Clear the canvas when hiding the graph
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      }
    }
  }, [consumertransaction, showGraph]);

  const handleClick = () => {
    setShowGraph(!showGraph);
  };

  return (
    <div className="border-4 font-Inter h-full px-4 w-full">
      <div className="flex  gap-4 px-5 items-center justify-center ">
        <div className=" border text-center transition ease-in-out delay-80 cursor-pointer hover:-translate-y-1 w-full text-white shadow-2xl focus:outline-none duration-300 active:ring-4 bg-blue-400 hover:bg-blue-800 text-2xl rounded-xl font-bold ">
          APPLICATION
          <div className="text-lg text-center mb-2 ml-2 text-white mt-5">
            <div className="text-center ml-2 mr-5 flex items-center justify-center text-3xl">
              <HiUserGroup className=" text-green-400 h-10 w-10" />{" "}
              {"Total of:"} {""}
              {totalApplication} {"Personnel"}
            </div>
          </div>
        </div>
        <div className=" border text-center transition ease-in-out delay-80 cursor-pointer hover:-translate-y-1 w-full text-white shadow-2xl focus:outline-none duration-300 active:ring-4 bg-blue-400 hover:bg-blue-800 text-2xl rounded-xl font-bold ">
          CUSTOMER WELFARE
          <div className="text-lg text-center mb-2 ml-2 text-white mt-5">
            <div className="text-center flex ml-2 mr-5 items-center justify-center text-3xl">
              <HiUserGroup className=" text-yellow-400 h-10 w-10" />{" "}
              {"Total of:"} {""}
              {totalCustomerWelfare} {"Personnel"}
            </div>
          </div>
        </div>
        <div className=" border text-center  transition ease-in-out delay-80 cursor-pointer hover:-translate-y-1 w-full text-white shadow-2xl focus:outline-none duration-300 active:ring-4 bg-blue-400 hover:bg-blue-800 text-2xl rounded-xl font-bold ">
          PAYMENT
          <div className="text-lg text-center mb-2 ml-2 text-white mt-5">
            <div className="text-center ml-2 mr-5 flex items-center justify-center text-3xl">
              <HiUserGroup className=" text-red-800 h-10 w-10" /> {"Total of:"}{" "}
              {""}
              {totalPayment} {"Personnel"}
            </div>
          </div>
        </div>
      </div>
      <div>
        <div className="flex justify-between">
          <div>
            <button
              className="border-b-4 mt-5 flex items-center border-blue-400 active:scale-x-75 transition ease-in-out delay-80 hover:-translate-y-1  hover:bg-white hover:text-black text-blue-400 active:bg-blue-400 font-bold uppercase text-sm p-2 rounded shadow hover:shadow-2xl duration-150"
              onClick={handleClick}
            >
              Toggle Graph
              <HiChartBar className="ml-2 text-2xl" />
            </button>
          </div>
          <div className="font-bold text-blue-600 mr-5 mt-5 mb-5">
            Total Transaction Today: {""}
            {data.length}
          </div>
        </div>
        <div className="font-bold bg-white ml-5 m-2 uppercase shadow-sm text-white text-xl">
          {showGraph && (
            <div
              style={{ position: "relative", width: "100%", height: "400px" }}
            >
              <canvas ref={chartRef}></canvas>
            </div>
          )}
        </div>
      </div>
      <div
        style={{
          height: "380px",
          overflowY: "scroll",
        }}
        className="w-full border mb-5 border-black shadow py-2 rounded-lg"
      >
        <div style={{ minWidth: "100%" }}>
          <table className=" font-bold  rounded-md leading-normal">
            <thead className="font-bold text-xl">
              <tr>
                <th className="px-5 py-3 border-r-2 border-black bg-gray-100 text-center text-lg font-bold text-black uppercase">
                  Personnel
                </th>
                <th className="px-10 py-3 border-b-2 border-black bg-gray-100 text-center text-lg font-bold text-black uppercase">
                  Tag
                </th>
                <th className="px-5 py-3 border-b-2 border-black bg-gray-100 text-center text-lg font-bold text-black uppercase">
                  Date
                </th>
                <th className="px-5 py-3 border-b-2 border-black bg-gray-100 text-center text-lg font-bold text-black uppercase">
                  Time Generated
                </th>
                <th className="px-5 py-3 border-b-2 border-black bg-gray-100 text-center text-lg font-bold text-black uppercase">
                  Transaction Type
                </th>

                <th className="px-5 py-3 border-b-2 border-black bg-gray-100 text-center text-lg font-bold text-black uppercase">
                  SubTransaction Type
                </th>
                <th className="px-5 py-3 border-b-2 border-black bg-gray-100 text-center text-lg font-bold text-black uppercase">
                  Transaction Status
                </th>
                <th className="px-5 py-3 border-b-2 border-black bg-gray-100 text-center text-lg font-bold text-black uppercase">
                  Time Start Transaction
                </th>
                <th className="px-5 py-3 border-b-2 border-black bg-gray-100 text-center text-lg font-bold text-black uppercase">
                  Time End Transaction
                </th>
              </tr>
            </thead>
            <tbody className="text-xl">
              {data.map((data) => (
                <tr key={data.id}>
                  <td className="px-5 py-5 border-b text-center border-black bg-white text-sm ">
                    {data.counterPersonnel?.firstname}{" "}
                    {data.counterPersonnel?.lastname}{" "}
                  </td>
                  <td className="px-5 py-5 border-b border-black text-center bg-white text-sm ">
                    {data.counterPersonnel?.tag}
                  </td>
                  <td className="px-5 py-5 border-b-2 border-black text-center bg-white text-sm ">
                    {data.date}
                  </td>
                  <td className="px-5 py-5 border-b-2 border-black text-center bg-white text-sm ">
                    {data.timeGeneratedQueue}
                  </td>
                  <td className="px-5 py-5 border-b border-black text-center bg-white text-sm ">
                    {data.transactionType?.name}
                  </td>
                  <td className="px-5 py-5 border-b border-black text-center bg-white text-sm ">
                    {data.subTransactionType?.name}
                  </td>
                  <td className="px-5 py-5 border-b border-black text-center bg-white text-sm ">
                    {data.transactionStatus?.name}
                  </td>
                  <td className="px-5 py-5 border-b border-black text-center bg-white text-sm ">
                    {data.timeStartTransaction}
                  </td>
                  <td className="px-5 py-5 border-b border-black text-center bg-white text-sm ">
                    {data.timeEndTransaction}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Hometable;
