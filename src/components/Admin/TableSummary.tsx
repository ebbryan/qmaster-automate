const BackendApiConsumerTransactionSelect =
  process.env.BACKEND_API_CONSUMER_TRANSACT_SELECT_DATE;
const BackendApi = process.env.BACKEND_API;

import React, { useRef, useState } from "react";
import { consumerTransaction } from "@/types/admin.type";
import axios from "axios";

interface CounterPersonnelObj {
  [key: string]: number;
}

export const TableSummary = ({}) => {
  const [filteredTransactions, setFilteredTransactions] = useState<
    consumerTransaction[]
  >([]);
  const [startDateInput, setStartDateInput] = useState<string>("");
  const [endDateInput, setEndDateInput] = useState<string>("");

  const handleDateInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.id === "start-date-input") {
      setStartDateInput(event.target.value);
    } else {
      setEndDateInput(event.target.value);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!startDateInput || !endDateInput) {
      setFilteredTransactions([]);
      return;
    }

    const response = await axios.get(
      `${BackendApiConsumerTransactionSelect}?startDate=${startDateInput}&endDate=${endDateInput}`
    );
    if (response.data.length === 0) {
      alert(`No transactions found for ${startDateInput} - ${endDateInput}`);
      setFilteredTransactions([]);
      return;
    }

    setFilteredTransactions(response.data);
  };

  const handlePrint = () => {
    const printContent = document.getElementById("print-content");
    const header = `
    <div style='display: flex; text-align: center; font-family: Inter;'>
      <img src="logo.jpg" style='width: 100px; height: 100px;' />
      <div style='flex: 1; font-family: Inter;'>
        <h1 style='text-align: center;'>General Santos City Water District</h1>
        <h5 style='text-align: center;font-size: 1.125rem;'>Summary of Piac Personnel Transaction</h5>
        <h5 style='text-align: center; font-size: 1.125rem;'>E.Fernandez St., Lagao, General Santos City</h5>
      </div>
    </div>
  `;
    const windowPrint = window.open();
    windowPrint?.document.write(header + printContent?.innerHTML);
    windowPrint?.print();
    windowPrint?.close();
  };

  const applicationTransaction = filteredTransactions.filter(
    (cp) => cp.transactionType?.name === "APPLICATION"
  );

  const totalApplication = applicationTransaction.reduce(
    (total, cp) => total + 1,
    0
  );

  const CustomerWelfareTransaction = filteredTransactions.filter(
    (cp) => cp.transactionType?.name === "CUSTOMER WELFARE"
  );

  const totalCustomerWelfare = CustomerWelfareTransaction.reduce(
    (total, cp) => total + 1,
    0
  );

  const PaymentTransaction = filteredTransactions.filter(
    (cp) => cp.transactionType?.name === "PAYMENT"
  );

  const totalPayment = PaymentTransaction.reduce((total, cp) => total + 1, 0);

  ///////

  const calculateTotalTransactions = () => {
    const counterPersonnelObj: CounterPersonnelObj = {};

    filteredTransactions.forEach((transaction) => {
      const { counterPersonnel } = transaction;
      if (counterPersonnel != null) {
        const { firstname, lastname } = counterPersonnel;
        const key = `${firstname} ${lastname}`;

        if (counterPersonnelObj[key]) {
          counterPersonnelObj[key] += 1;
        } else {
          counterPersonnelObj[key] = 1;
        }
      }
    });

    return counterPersonnelObj;
  };

  const counterPersonnelObj = calculateTotalTransactions();

  const counterPersonnelElements = Object.entries(counterPersonnelObj).map(
    ([counterPersonnel, totalTransactions]) => (
      <div key={counterPersonnel}>
        {counterPersonnel}: {totalTransactions}
      </div>
    )
  );

  return (
    <div className=" h-full w-full font-Inter">
      <form
        className="border-t-2 mt-5 flex items-center justify-center border-black rounded mb-4"
        onSubmit={handleSubmit}
      >
        <div className="p-2 cursor-pointer font-bold">
          <label className="text-xl mr-2" htmlFor="start-date-input">
            Enter start date:
          </label>
          <input
            className="border-4 rounded-lg cursor-pointer transition ease-in-out delay-80 hover:-translate-y-1 border-blue-300 active duration-150 hover:text-blue-500 text-2xl p-2 font-sans"
            type="date"
            id="start-date-input"
            required
            value={startDateInput}
            onChange={handleDateInput}
          />
          <label className="text-xl mx-2" htmlFor="end-date-input">
            Enter end date:
          </label>
          <input
            className="border-4 rounded-lg cursor-pointer transition ease-in-out delay-80 hover:-translate-y-1 border-blue-300 active duration-150 hover:text-blue-500 text-2xl p-2 font-sans"
            type="date"
            id="end-date-input"
            required
            value={endDateInput}
            onChange={handleDateInput}
          />

          <button
            className=" border border-b-4 border-blue-400 active:scale-x-75 transition ease-in-out delay-80 hover:-translate-y-1  hover:bg-green-500 hover:text-white text-blue-400 ml-5 active:bg-blue-400 font-bold uppercase text-sm p-3 rounded shadow hover:shadow-3xl duration-150"
            type="submit"
          >
            Filter Transactions
          </button>
        </div>
      </form>

      {startDateInput && endDateInput && filteredTransactions.length > 0 && (
        <div className="mt-5 ml-5 mr-5">
          <div className="flex items-end justify-end">
            <button
              className="bg-blue-800 mb-2 text-white rounded transform active:scale-x-75 transition-transform font-bold flex items-end justify-items-end p-3 mr-5 duration-150 hover:bg-blue-900 hover:text-green-500"
              type="button"
              onClick={handlePrint}
            >
              Print
            </button>
          </div>
          <div
            style={{ width: "100%", height: "400px", overflowY: "scroll" }}
            className="inline-block w-full shadow mr-5 rounded-lg"
          >
            <div style={{ minWidth: "100%" }}>
              <div id="print-content">
                <table className="min-w-full font-bold mr-5 border-4 border-black leading-normal">
                  <thead className="font-bold text-xl">
                    <tr>
                      <th className="px-10 py-3 border-b-2 border-black bg-gray-100 text-center text-lg font-bold text-black  uppercase tracking-wider">
                        counterPersonnel
                      </th>
                      <th className="px-10 py-3 border-b-2 border-black bg-gray-100 text-center text-lg font-bold text-black uppercase tracking-wider">
                        Tag
                      </th>
                      <th className="px-10  py-3 border-b-2 border-black bg-gray-100 text-center text-lg font-bold text-black uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-10  py-3 border-b-2 border-black bg-gray-100 text-center text-lg font-bold text-black  uppercase tracking-wider">
                        Time Generated Queue
                      </th>
                      <th className="px-10  py-3 border-b-2 border-black bg-gray-100 text-center text-lg font-bold text-black  uppercase tracking-wider">
                        Transaction Type
                      </th>
                      <th className="px-10  py-3 border-b-2 border-black bg-gray-100 text-center text-lg font-bold text-black  uppercase tracking-wider">
                        Account Number
                      </th>
                      <th className="px-10 py-3 border-b-2 border-black bg-gray-100 text-center text-lg font-bold text-black  uppercase tracking-wider">
                        Application Number
                      </th>
                      <th className="px-10 py-3 border-b-2 border-black bg-gray-100 text-center text-lg font-bold text-black  uppercase tracking-wider">
                        SubTransaction Type
                      </th>
                      <th className="px-10 py-3 border-b-2 border-black bg-gray-100 text-center text-lg font-bold text-black  uppercase tracking-wider">
                        Transaction Status
                      </th>
                      <th className="px-10 py-3 border-b-2 border-black bg-gray-100 text-center text-lg font-bold text-black  uppercase tracking-wider">
                        Time Start Transaction
                      </th>
                      <th className="px-10 py-3 border-b-2 border-black bg-gray-100 text-center text-lg font-bold text-black  uppercase tracking-wider">
                        Time End Transaction
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-xl">
                    {filteredTransactions.map((transaction) => (
                      <tr key={transaction.id}>
                        <td className="px-10 py-5 border-b text-center border-black bg-white text-sm ">
                          {transaction.counterPersonnel?.firstname}{" "}
                          {transaction.counterPersonnel?.lastname}{" "}
                        </td>
                        <td className="px-10 py-5 border-b border-black text-center bg-white text-sm ">
                          {transaction.counterPersonnel?.tag}
                        </td>
                        <td className="px-10 py-5 border-b border-black text-center bg-white text-sm ">
                          {transaction.date}
                        </td>
                        <td className="px-10 py-5 border-b border-black text-center bg-white text-sm ">
                          {transaction.timeGeneratedQueue}
                        </td>
                        <td className="px-10 py-5 border-b border-black text-center bg-white text-sm ">
                          {transaction.transactionType?.name}
                        </td>
                        <td className="px-10 py-5 border-b border-black text-center bg-white text-sm ">
                          {transaction.accountNumber}
                        </td>
                        <td className="px-10 py-5 border-b border-black text-center bg-white text-sm ">
                          {transaction.applicationNumber}
                        </td>
                        <td className="px-10 py-5 border-b border-black text-center bg-white text-sm ">
                          {transaction.subTransactionType?.name}
                        </td>
                        <td className="px-10 py-5 border-b border-black text-center bg-white text-sm ">
                          {transaction.transactionStatus?.name}
                        </td>
                        <td className="px-10 py-5 border-b border-black text-center bg-white text-sm ">
                          {transaction.timeStartTransaction}
                        </td>
                        <td className="px-10 py-5 border-b border-black text-center bg-white text-sm ">
                          {transaction.timeEndTransaction}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="mt-10 ml-5 text-3xl flex gap-10 justify-center">
                  <div className="">
                    Summary Per Transaction Type:
                    <div className="text-lg">
                      {"Total of APPLICATION Catered:"} {""}
                      {totalApplication}
                    </div>
                    <div className="text-lg">
                      {"Total of CUSTOMER WELFARE Catered:"} {""}
                      {totalCustomerWelfare}
                    </div>
                    <div className="text-lg border-b-4 border-black">
                      {"Total of PAYMENT Catered:"} {""}
                      {totalPayment}
                    </div>
                    <div>
                      {"Total:"} {""}
                      {filteredTransactions.length}
                    </div>
                  </div>
                  <div>
                    Summary Per Piac Personnel:
                    <div className="text-lg">{counterPersonnelElements}</div>
                    <div className="border-t-4 border-black">
                      {"Total:"} {""}
                      {filteredTransactions.length}
                    </div>
                  </div>
                </div>
                <div className="text-2xl mt-10 text-center mb-5">
                  Transactions from {startDateInput} to {endDateInput}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TableSummary;
