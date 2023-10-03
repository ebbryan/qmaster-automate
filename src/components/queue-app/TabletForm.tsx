import { SetStateAction, useEffect, useState } from "react";
import axios from "axios";
import {
  HeartIcon,
  CreditCardIcon,
  UserPlusIcon,
} from "@heroicons/react/24/solid";
import { useRef } from "react";

export default function TabletForm() {
  // -------------------------------------
  // ("") - string data type
  // (false) - boolean
  // Number / 0 - number
  // -------------------------------------
  const backendApiTransactTypeUrl = process.env.BACKEND_API_TRANSACT_TYPE;
  const backendApiConsumerTransactUrl =
    process.env.BACKEND_API_CONSUMER_TRANSACT;

  // initialize for variables
  let [name, setName] = useState("");
  let [isChecked, setIsChecked] = useState(false);
  let [consumerPriority, setconsumerPriority] = useState(Number);
  let [applicationNumber, setapplicationNumber] = useState("");
  let [accountNumber, setaccountNumber] = useState("");
  let [selectedOption, setSelectedOption] = useState<number | null>(null);
  const transactionStatus = 1;
  const [transactionType, setTransactionType] = useState<transactionType[]>([]);
  const now = new Date();
  const currentTime = now.toTimeString().slice(0, 8); // "10:54:49"
  const currentDate = now.toDateString();

  // sir jay
  const [finalDate, setFinalDate] = useState("");
  const [rng, setRng] = useState("");
  const [transactTime, setTransactTime] = useState("");

  // error messages init
  const [error, setError] = useState("");
  const [error1, setError1] = useState("");
  const [error2, setError2] = useState("");

  // -------------------------------------

  // clear form init
  const formRef = useRef<HTMLFormElement>(null);

  // show modal when submitting form

  let [showConfirmModal, setshowConfirmModal] = useState(false);
  let [showSuccessModal, setshowSuccessModal] = useState(false);

  // interface for TransactionType array
  interface transactionType {
    id: number;
    name: string;
  }

  // useEffect for fetching transaction-type
  useEffect(() => {
    async function fetchTransactionType() {
      const res = await fetch(`${backendApiTransactTypeUrl}`);
      const data = await res.json();
      setTransactionType(data);
    }
    fetchTransactionType();
  }, []);

  // You provided a `value` prop to a form field without an `onChange` handler. This will render a read-only field. If the field should be mutable use `defaultValue`. Otherwise, set either `onChange` or `readOnly`.
  const handleInputChange = (event: {
    target: { value: SetStateAction<string> };
  }) => {
    setaccountNumber(event.target.value);
  };

  const handleInputChange1 = (event: {
    target: { value: SetStateAction<string> };
  }) => {
    setapplicationNumber(event.target.value);
  };

  // checkbox for priority
  function handleCheckboxChange(event: React.ChangeEvent<HTMLInputElement>) {
    const checkboxValue = event.target.checked;
    setIsChecked(checkboxValue);
  }

  // appearing elements when clicking radio button and clearing inputs specified in ("")
  const [isVisible, setIsVisible] = useState(false);
  const [isVisible1, setIsVisible1] = useState(false);
  const [isVisible2, setIsVisible2] = useState(false);

  const handleButtonClick = () => {
    setIsVisible(true);
    setIsVisible1(false);
    setIsVisible2(false);
    setaccountNumber("");
    setapplicationNumber("");
  };

  const handleButtonClick1 = () => {
    setIsVisible(false);
    setIsVisible1(true);
    setIsVisible2(false);
    setaccountNumber("");
    setapplicationNumber("");
  };

  const handleButtonClick2 = () => {
    setIsVisible(false);
    setIsVisible1(false);
    setIsVisible2(true);
    setaccountNumber("");
    setapplicationNumber("");
  };

  // add icons to buttons
  const icons = [
    { id: 1, label: "Application", icon: <UserPlusIcon className="w-6 h-6" /> },
    {
      id: 2,
      label: "Customer Welfare",
      icon: <HeartIcon className="w-6 h-6" />,
    },
    { id: 3, label: "Payment", icon: <CreditCardIcon className="w-6 h-6" /> },
  ];

  // changing color for active radio
  const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedOption(Number(event.target.value));
  };

  // fade animation js - can it be grouped as one?
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setError("");
    }, 5000);

    return () => clearTimeout(timeoutId);
  }, [error]);

  useEffect(() => {
    const timeoutId1 = setTimeout(() => {
      setError1("");
    }, 5000);

    return () => clearTimeout(timeoutId1);
  }, [error1]);

  useEffect(() => {
    const timeoutId2 = setTimeout(() => {
      setError2("");
    }, 5000);

    return () => clearTimeout(timeoutId2);
  }, [error2]);

  // validate form before submission
  const validateForm = () => {
    let isValid = true;

    if (!name) {
      setError1("Please enter name");
      isValid = false;
    }
    if (!selectedOption) {
      setError("Please select an option");
      isValid = false;
    }
    if (selectedOption === 3 && accountNumber.length < 8) {
      setError2("Account number should be 8 characters");
      isValid = false;
    }
    if (selectedOption === 3 && !accountNumber) {
      setError2("Enter account number");
      isValid = false;
    }
    if (!isValid) {
      return false;
    }
    setshowConfirmModal(true);
    return true;
  };

  // form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  const handleShowDiv = async () => {
    const consumerTransaction = {
      name: name,
      transactionType: selectedOption,
      accountNumber,
      applicationNumber,
      consumerPriority: isChecked ? 2 : consumerPriority || 1,
      transactionStatus,
      timeGeneratedQueue: currentTime,
      date: currentDate,
      timeStartTransaction: null,
      timeEndTransaction: null,
      dropTime: null,
      dropExpiration: null,
    };

    setshowSuccessModal(true);
    setshowConfirmModal(false);

    try {
      const result = await axios.post(
        `${backendApiConsumerTransactUrl}`,
        consumerTransaction
      );

      //result by post

      setRng(result.data.rng);
      setFinalDate(result.data.date);
      setTransactTime(result.data.timeGeneratedQueue);
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  // cancelling modal / closing modal
  const closeModal = () => {
    setshowConfirmModal(false);
    setshowSuccessModal(false);
  };

  // cancelling modal using escape key
  useEffect(() => {
    const handleKeyDown = (event: { key: string }) => {
      if (event.key === "Escape") {
        closeModal();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [showConfirmModal]);

  function closeAfterSuccess() {
    formRef.current?.reset();
    setshowSuccessModal(false);
    setIsChecked(false);
    setconsumerPriority(Number);
    setaccountNumber("");
    setapplicationNumber("");
    setSelectedOption(null);
    setTransactionType([]);
    setName("");
  }

  return (
    <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
      {showConfirmModal && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-800 bg-opacity-50 z-50">
          <div className="p-5 bg-white rounded-lg flex flex-col gap-2 items-center">
            <div className="px-10 flex flex-col gap-8 items-center">
              <div className="flex flex-col items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="#FCAE1D"
                  className="w-20 h-20"
                >
                  <path
                    fillRule="evenodd"
                    d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z"
                    clipRule="evenodd"
                  />
                </svg>
                <h1 className="font-extrabold text-2xl">
                  Are Details Correct?
                </h1>
              </div>
              <div className="flex flex-col gap-1 text-lg">
                <div className="flex flex-row gap-2 justify-between">
                  <p>Name: </p>
                  <p className="font-bold">{name}</p>
                </div>
                <div className="flex flex-row gap-2 justify-between">
                  <p>Transaction: </p>
                  {selectedOption === 1 && (
                    <p className="font-bold">Application</p>
                  )}
                  {selectedOption === 2 && (
                    <p className="font-bold">Customer Welfare</p>
                  )}
                  {selectedOption === 3 && <p className="font-bold">Payment</p>}
                </div>
                {selectedOption === 1 && (
                  <div className="flex flex-row gap-2 justify-between">
                    <p>Application Number: </p>
                    <p className="font-bold">{applicationNumber}</p>
                  </div>
                )}
                {selectedOption === 2 && (
                  <div className="flex flex-row gap-2 justify-between">
                    <p>Account Number: </p>
                    <p className="font-bold">{accountNumber}</p>
                  </div>
                )}
                {selectedOption === 3 && (
                  <div className="flex flex-row gap-2 justify-between">
                    <p>Account Number: </p>
                    <p className="font-bold">{accountNumber}</p>
                  </div>
                )}
                <div className="flex flex-row gap-2 justify-between">
                  <p>Senior Citizen? </p>
                  {isChecked ? (
                    <p className="font-bold">Yes</p>
                  ) : (
                    <p className="font-bold">No</p>
                  )}
                </div>
                <div className="flex flex-row gap-2 justify-between">
                  <p>Date: </p>
                  <p className="font-bold">{currentDate}</p>
                </div>
                <div className="flex flex-row gap-2 justify-between">
                  <p>Time: </p>
                  <p className="font-bold">{currentTime}</p>
                </div>
              </div>
              <div className="flex flex-row gap-5">
                <button
                  onClick={handleShowDiv}
                  className="bg-blue-500 p-4 w-20 rounded-md hover:bg-blue-800 text-white font-bold transition-all"
                >
                  Yes
                </button>
                <button
                  onClick={() => setshowConfirmModal(false)}
                  className="bg-gray-200 p-4 w-20 rounded-md font-bold hover:bg-gray-600 hover:text-white transition-all"
                >
                  No
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showSuccessModal && (
        <div
          className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-800 bg-opacity-50 z-50"
          onClick={closeAfterSuccess}
        >
          <div className="p-5 bg-white rounded-lg flex flex-col gap-2 items-center">
            <div className="px-10 flex flex-col gap-8 items-center">
              <div className="flex flex-col items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="#00AB1C"
                  className="w-20 h-20"
                >
                  <path
                    fillRule="evenodd"
                    d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                    clipRule="evenodd"
                  />
                </svg>
                <h1 className="font-extrabold text-2xl">Queue Success!</h1>
              </div>
              <div className="flex flex-col gap-1 text-lg">
                <div className="flex flex-row gap-2 justify-between">
                  <p>Name: </p>
                  <p className="font-bold">
                    {name}-{selectedOption}
                    {rng}
                  </p>
                </div>
                <div className="flex flex-row gap-2 justify-between">
                  <p>Transaction: </p>
                  {selectedOption === 1 && (
                    <p className="font-bold">Application</p>
                  )}
                  {selectedOption === 2 && (
                    <p className="font-bold">Customer Welfare</p>
                  )}
                  {selectedOption === 3 && <p className="font-bold">Payment</p>}
                </div>
                {selectedOption === 1 && (
                  <div className="flex flex-row gap-2 justify-between">
                    <p>Application Number: </p>
                    <p className="font-bold">{applicationNumber}</p>
                  </div>
                )}
                {selectedOption === 2 && (
                  <div className="flex flex-row gap-2 justify-between">
                    <p>Account Number: </p>
                    <p className="font-bold">{accountNumber}</p>
                  </div>
                )}
                {selectedOption === 3 && (
                  <div className="flex flex-row gap-2 justify-between">
                    <p>Account Number: </p>
                    <p className="font-bold">{accountNumber}</p>
                  </div>
                )}
                <div className="flex flex-row gap-2 justify-between">
                  <p>Senior Citizen? </p>
                  {isChecked ? (
                    <p className="font-bold">Yes</p>
                  ) : (
                    <p className="font-bold">No</p>
                  )}
                </div>
                <div className="flex flex-row gap-2 justify-between">
                  <p>Date: </p>
                  <p className="font-bold">{finalDate}</p>
                </div>
                <div className="flex flex-row gap-2 justify-between">
                  <p>Time: </p>
                  <p className="font-bold">{transactTime}</p>
                </div>
              </div>
              <button
                onClick={closeAfterSuccess}
                className="bg-blue-500 p-4 w-20 rounded-md hover:bg-blue-800 text-white font-bold transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-2">
        <input
          type="text"
          value={consumerPriority}
          onChange={(event) => setconsumerPriority(Number(event.target.value))}
          hidden
        />
        <input type="text" defaultValue={transactionStatus} hidden />
        <h2 className="font-bold">Name</h2>
        <input
          type="text"
          className="p-2 rounded-xl bg-white bg-opacity-90 backdrop-blur-2xl shadow-xl border-2 border-gray-100 focus:border-blue-500 focus:outline-none"
          placeholder="Enter Name"
          name="full_name"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
        {error1 && (
          <div className="bg-red-600 rounded-md p-4 font-bold text-white animate-fade-in-out">
            {error1}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <h2 className="font-bold mt-5">Transaction</h2>
        <label className="flex flex-col gap-2">
          {icons.map((icons) => (
            <div key={icons.id}>
              <input
                type="radio"
                className="hidden peer"
                id={`${icons.id}`}
                name="transactionType"
                value={icons.id}
                checked={selectedOption === icons.id}
                onChange={handleOptionChange}
                onClick={
                  {
                    1: handleButtonClick,
                    2: handleButtonClick1,
                    3: handleButtonClick2,
                  }[icons.id]
                }
                required
              />
              <label
                htmlFor={`${icons.id}`}
                className={` ${
                  selectedOption === icons.id
                    ? "p-3 rounded-xl flex flex-row items-center gap-3 shadow-lg bg-blue-500 text-white font-bold transition-all"
                    : "p-3 rounded-xl flex flex-row items-center gap-3 shadow-lg bg-white"
                }`}
              >
                {icons.icon}
                {icons.label}
              </label>
            </div>
          ))}
          {error && (
            <div className="bg-red-600 rounded-md p-4 font-bold text-white animate-fade-in-out">
              {error}
            </div>
          )}
        </label>
        <div className="flex flex-col mt-5">
          <div>
            {isVisible && (
              <div className="flex flex-col gap-2">
                <h2 className="font-bold">Application Number (optional)</h2>
                <input
                  type="text"
                  className="p-2 rounded-xl bg-white bg-opacity-90 backdrop-blur-2xl shadow-xl border-2 border-gray-100 focus:border-blue-500 focus:outline-none"
                  placeholder="Enter Account Number"
                  name="application_number"
                  value={applicationNumber}
                  onChange={handleInputChange1}
                />
              </div>
            )}
          </div>
          <div>
            <div>
              {isVisible1 && (
                <div className="flex flex-col gap-2">
                  <h2 className="font-bold">Account Number (optional)</h2>
                  <input
                    type="text"
                    className="p-2 rounded-xl bg-white bg-opacity-90 backdrop-blur-2xl shadow-xl border-2 border-gray-100 focus:border-blue-500 focus:outline-none"
                    placeholder="Enter Account Number"
                    name="account_number_optional"
                    value={accountNumber}
                    onChange={handleInputChange}
                  />
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div>
              {isVisible2 && (
                <div className="flex flex-col gap-2">
                  <h2 className="font-bold">Account Number (required)</h2>
                  <input
                    type="text"
                    className="p-2 rounded-xl bg-white bg-opacity-90 backdrop-blur-2xl shadow-xl border-2 border-gray-100 focus:border-blue-500 focus:outline-none"
                    placeholder="Enter Account Number"
                    name="account_number_required"
                    onChange={handleInputChange}
                    value={accountNumber}
                  />
                </div>
              )}
            </div>
            {error2 && (
              <div className="bg-red-600 rounded-md p-4 font-bold text-white animate-fade-in-out">
                {error2}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-row gap-2 items-center mt-5">
        <input
          type="checkbox"
          className="h-6 w-6"
          name="priority_checkbox"
          checked={isChecked}
          onChange={handleCheckboxChange}
        />
        <span className="italic text-sm">
          Are you a senior citizen, PWD or pregnant woman?
        </span>
      </div>

      <input
        type="submit"
        className="flex flex-row font-bold items-center gap-2 p-4 rounded-xl bg-white backdrop-blur-2xl shadow-xl hover:bg-blue-500 hover:text-white transition-colors w-full cursor-pointer"
        value="Submit"
        onClick={validateForm}
      />
    </form>
  );
}
