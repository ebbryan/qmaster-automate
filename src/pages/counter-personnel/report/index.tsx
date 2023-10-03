import { Header } from "@/components/counter-personnel/Header";
import { ConsumerTransactionType } from "@/types/queue.type";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

interface ConsumerTransactionObj {
  [key: string]: number;
}

function Report() {
  const [data, setData] = useState<Array<ConsumerTransactionType>>([]);
  const [transaction, setTransaction] = useState<
    Array<ConsumerTransactionType>
  >([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  useEffect(() => {
    const socket = io("http://172.20.110.65:3000");
    const subID = localStorage.getItem("sub");
    socket.on("connect", () => {
      // console.log("Connected to socket server");
    });

    socket.on("consumerTransactionUpdated", (updatedTransaction) => {
      // console.log("Updated transaction received:", updatedTransaction);
      if (updatedTransaction.counterPersonnel === subID) {
        setData((prevData) => [...prevData, updatedTransaction]);
      }
      handleView();
    });

    socket.on("transactionCreated", (newTransaction) => {
      // console.log("New transaction received:", newTransaction);
      handleView();
    });
    handleView();

    return () => {
      socket.disconnect();
    };
  }, []);

  function handleStartDateChange(event: any) {
    setStartDate(event.target.value);
  }

  function handleEndDateChange(event: any) {
    setEndDate(event.target.value);
  }

  // console.log(startDate, endDate);

  const handleView = async () => {
    if (!startDate || !endDate) {
      setTransaction([]);
      return;
    }

    try {
      const accessToken = localStorage.getItem("accessToken");
      const subID = localStorage.getItem("sub");
      const response = await axios.get(
        `http://172.20.110.65:3000/consumer-transaction/transactionstatus?startDate=${startDate}&endDate=${endDate}&counterPersonnel=${subID}&subTransactionType`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (response.data.length === 0) {
        alert(`No transactions found for ${startDate} - ${endDate}`);
        setTransaction([]);
        return;
      }
      setTransaction(response.data);
      // console.log(response.data);
    } catch (error) {}
  };
  const handlePrint = () => {
    const printContent = document.getElementById("print-content");
    const header =
      "<h1 style='text-align: center;'>General Santos City Water District</h1>";
    const header1 =
      "<h5 style='text-align: center;'>Summary of Piac Personnel Transaction</h5>";
    const header2 =
      "<h5 style='text-align: center;'>E.Fernandez St., Lagao, General Santos City</h5>";
    const windowPrint = window.open();
    windowPrint?.document.write(
      header + header1 + header2 + printContent?.innerHTML
    );
    windowPrint?.print();
    windowPrint?.close();
  };

  const calculateTotalTransactions = () => {
    const ConsumerTransactionObj: ConsumerTransactionObj = {};

    transaction.forEach((transaction) => {
      const { subTransactionType } = transaction;
      if (subTransactionType != null) {
        const { name } = subTransactionType;
        const key = `${name}`;

        if (ConsumerTransactionObj[key]) {
          ConsumerTransactionObj[key] += 1;
        } else {
          ConsumerTransactionObj[key] = 1;
        }
      }
    });

    return ConsumerTransactionObj;
  };

  const ConsumerTransactionObj = calculateTotalTransactions();

  const consumertransactionElements = Object.entries(
    ConsumerTransactionObj
  ).map(([consumertransaction, totalTransactions]) => (
    <div key={consumertransaction}>
      {consumertransaction}: {totalTransactions}
    </div>
  ));

  const renderRows = () => {
    return transaction.map((row) => {
      return (
        <tr key={row.id}>
          <td className="px-4 py-2 mb-2 uppercase text-xl">{row.name}</td>
          <td className="px-4 py-2 mb-2 uppercase text-xl">
            {row.subTransactionType?.name}
          </td>
          <td className="px-4 py-2 mb-2 uppercase text-xl">{row.date}</td>
          <td className="px-4 py-2 mb-2 uppercase text-xl">
            {row.timeStartTransaction}
          </td>
          <td className="px-4 py-2 mb-2 uppercase text-xl">
            {row.timeEndTransaction}
          </td>
        </tr>
      );
    });
  };

  return (
    <div className="Inter">
      <div className="py-3">
        <Header transactionType={data} />
      </div>
      <div className="flex items-left gap-3 ml-5">
        <label>Date from:</label>
        <input
          className="border-2 border-gray-700 px-3 py-1 font-poppins rounded-md"
          type="date"
          onChange={handleStartDateChange}
          required
        />

        <label>Date to:</label>
        <input
          className="border-2 border-gray-700 px-3 py-1 font-poppins rounded-md"
          type="date"
          onChange={handleEndDateChange}
          required
        />
        <button
          onClick={() => handleView()}
          className="bg-blue-700 px-9 py-2 font-poppins text-white font-medium rounded-md"
        >
          View
        </button>
        <button
          onClick={handlePrint}
          className="bg-blue-700 px-9 py-2 font-poppins text-white font-medium rounded-md"
        >
          Print
        </button>
      </div>
      <div
        id="print-content"
        className="bg-white border border-gray-200 rounded-lg mx-auto my-auto mt-2 px-24"
      >
        <table id="print-area" className="w-full table-auto px-4">
          <thead className="bg-blue-700">
            <tr>
              <th className="px-4 py-2 text-left text-lg font-bold text-white">
                Name
              </th>
              <th className="px-4 py-2 text-left text-lg font-bold text-white">
                Transaction
              </th>
              <th className="px-4 py-2 text-left text-lg font-bold text-white">
                Date
              </th>
              <th className="px-4 py-2 text-left text-lg font-bold text-white">
                Time Served
              </th>
              <th className="px-4 py-2 text-left text-lg font-bold text-white">
                Time Completed
              </th>
            </tr>
          </thead>
          <tbody>{renderRows()}</tbody>
        </table>
        <div className="ml-4">{consumertransactionElements}</div>
      </div>
    </div>
  );
}

export default Report;
