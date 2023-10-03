const BackendApiCounterPersonnel = process.env.BACKEND_API_COUNTER_PERSONNEL;
const BackendApiTransactType = process.env.BACKEND_API_TRANSACT_TYPE;
const BackendApi = process.env.BACKEND_API;

import React, {
  FormEvent,
  FunctionComponent,
  ReactNode,
  useEffect,
} from "react";
import { useState } from "react";

import {
  HiArchiveBoxArrowDown,
  HiOutlineUserPlus,
  HiMagnifyingGlassCircle,
} from "react-icons/hi2";
import { HiPencil } from "react-icons/hi2";
import axios from "axios";
import { CounterPersonnel } from "@/types/admin.type";
import Modal from "./Modal";
import { useForm } from "react-hook-form";
import io from "socket.io-client";
import { useRouter } from "next/router";
import { HiMenuAlt2 } from "react-icons/hi";

interface TransactionType {
  id: number;
  name: string;
}

interface UpdateCounterPersonnelDto {
  firstname: string;
  lastname: string;
  username: string;
  password: string;
  tag: string;
  // transactionType: number | null;
}

export const Table = ({}) => {
  const [search, setSearch] = useState("");
  const [data, setData] = useState<Array<CounterPersonnel>>([]);
  const [showModal, setShowModal] = React.useState(false);
  const [firstname, setfirstName] = useState<string>("");
  const [lastname, setlastName] = useState<string>("");
  const [username, setuserName] = useState<string>("");
  const [password, setpassword] = useState<string>("");
  const [tag, settag] = useState<string>("");
  const [transactionTypeOptions, setTransactionTypeOptions] = useState<
    TransactionType[]
  >([]);
  const [selectedTransactionType, setSelectedTransactionType] = useState<
    number | null
  >(null);
  const router = useRouter();

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken"); // get access token from local storage
    const subID = localStorage.getItem("sub");

    const getCounterPersonnel = async () => {
      try {
        const result = await axios.get(
          `${BackendApiCounterPersonnel}/user?isActive=true`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`, // include the access token in the Authorization header
            },
          }
        );
        setData(result.data);
        console.log(result.data);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchTransactionTypes = async () => {
      try {
        const response = await axios.get<TransactionType[]>(
          `${BackendApiTransactType}`
        );
        setTransactionTypeOptions(response.data);
      } catch (error) {
        console.log((error as Error).message);
      }
    };

    const socket = io(`${BackendApi}`);
    socket.on("connect", () => {
      console.log("Connected to socket server");
    });

    socket.on(
      "counterpersonnelUpdated",
      (updatedTransaction: CounterPersonnel) => {
        setData((prevData) =>
          prevData.map((counterPersonnel) =>
            counterPersonnel.id === updatedTransaction.id
              ? updatedTransaction
              : counterPersonnel
          )
        );
      }
    );

    socket.on("counterPersonnelUpdated", (updatedCounterPersonnel) => {
      if (updatedCounterPersonnel.counterPersonnel === subID) {
        setData((prevData) => [...prevData, updatedCounterPersonnel]);
      }
      getCounterPersonnel();
    });

    // call getCounterPersonnel and fetchTransactionTypes initially
    getCounterPersonnel();
    fetchTransactionTypes();

    // return cleanup function to disconnect socket
    return () => {
      socket.disconnect();
    };
  }, []);

  const handleadd = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      if (!username) {
        throw new Error("Empty username");
      }
      if (!password) {
        throw new Error("Empty password");
      }

      const response = await axios.post(`${BackendApiCounterPersonnel}`, {
        firstname,
        lastname,
        username,
        password,
        tag,
        transactionType: selectedTransactionType,
        isActive: true,
      });

      setData((prevData) => [...prevData, response.data]);
      setfirstName("");
      setlastName("");
      setuserName("");
      setpassword("");
      settag("");
      setSelectedTransactionType(null);
      alert("User created successfully");
      reset();
    } catch (error) {}
  };

  const [editCounterPersonnel, setEditCounterPersonnel] =
    useState<CounterPersonnel | null>(null);
  const [selectedRow, setSelectedRow] = useState<number | null>(null);
  const { register, handleSubmit, reset } = useForm();

  const handleEdit = (counterPersonnel: CounterPersonnel, rowIndex: number) => {
    if (selectedRow !== rowIndex) {
      reset();
      setEditCounterPersonnel({ ...counterPersonnel }); // Create a new object with the same properties
      setSelectedRow(rowIndex);
    } else {
      setEditCounterPersonnel(null);
      setSelectedRow(null);
    }
  };

  const handleUpdate = handleSubmit(async (formData) => {
    const updatedCounterPersonnel: UpdateCounterPersonnelDto = {
      firstname: formData.firstname,
      lastname: formData.lastname,
      username: formData.username,
      password: formData.password,
      tag: formData.tag,
    };
    try {
      const response = await axios.patch<CounterPersonnel>(
        `${BackendApiCounterPersonnel}/${editCounterPersonnel?.id}`,
        updatedCounterPersonnel
      );
      console.log("User updated successfully:", response.data);
      setEditCounterPersonnel(null);
      setSelectedRow(null);
      alert("Counter personnel successfully updated.");
    } catch (error) {
      console.log((error as Error).message);
    }
  });

  const handlePatchDrop = async (counter: CounterPersonnel | undefined) => {
    if (counter) {
      try {
        await axios.patch(`${BackendApiCounterPersonnel}/${counter.id}`, {
          isActive: false,
        });
        alert("Counter personnel has been deactivated.");
      } catch (error) {}
    }
  };

  const handleArchive = async () => {
    router.push("/admin/users/archive-list");
  };

  const handleSearchChange = (event: any) => {
    setSearch(event.target.value);
  };

  const filteredData = data.filter((item) => {
    const fullName = `${item.firstname} ${item.lastname}`.toLowerCase();
    return fullName.includes(search.toLowerCase());
  });

  return (
    <div className="px-4 font-Inter rounded-lg">
      <div className="font-bold mb-5 text-4xl border-b-4 uppercas text-black rounded-t-lg mt-2 text-center">
        USER LIST
      </div>
      <div className=" mr-5 grid grid-cols-2 ">
        <div className="row-span-1">
          {" "}
          <button
            className="mb-5 border-b-4 border-blue-400 active:scale-x-75 transition ease-in-out delay-80 hover:-translate-y-1  hover:bg-white hover:text-black text-blue-400 flex items-center active:bg-blue-400 font-bold uppercase text-sm p-2 rounded shadow hover:shadow-2xl duration-150 "
            onClick={handleArchive}
          >
            archive List
            <HiMenuAlt2 className="text-2xl ml-2" />
          </button>
          <div className="flex items-center transition ease-in-out delay-100 cursor-pointer hover:-translate-y-1">
            <input
              type="text"
              value={search}
              onChange={handleSearchChange}
              placeholder="Search Active User"
              className="border-2 border-gray-300 p-2 w-64 rounded-lg"
            />
            <HiMagnifyingGlassCircle className="text-3xl text-blue-400" />
          </div>
        </div>
        <div className="grid items-center justify-items-end">
          <button
            className="border-b-4 border-blue-400 active:scale-x-75 transition ease-in-out delay-80 hover:-translate-y-1  hover:bg-white hover:text-black text-blue-400 flex items-center active:bg-blue-400 font-bold uppercase text-sm p-2 rounded shadow hover:shadow-2xl duration-150"
            type="button"
            onClick={() => setShowModal(true)}
          >
            <HiOutlineUserPlus className="text-2xl" />
            Add User
          </button>
        </div>
      </div>
      <div className=" text-center mt-2 rounded-t-xl bg-blue-600 text-white uppercase font-bold text-xl">
        active user: {""} {data.length}
      </div>
      {showModal ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed mt-10 mb-10 rounded-lg inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto ">
              {/*content*/}
              <div className="border-2 shadow-lg relative flex flex-col w-ful bg-white outline-none focus:outline-none rounded-xl">
                {/*header*/}
                <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                  <h3 className="text-3xl font-semibold">Add User</h3>
                </div>
                {/*body*/}
                <div className="text-left border mt-10 py-16 px-24">
                  <form onSubmit={handleadd}>
                    <div
                      className=" flex
                             items-center gap-4"
                    >
                      <div>
                        <label
                          htmlFor="name"
                          className="block text-2xl font-medium text-gray-700 undefined"
                        >
                          FirstName
                        </label>
                        <div className="flex flex-col items-start">
                          <input
                            placeholder="Firstname"
                            type="text"
                            value={firstname}
                            required
                            onChange={(event) => {
                              const input = event.target.value.replace(
                                /[0-9]/g,
                                ""
                              ); // remove any numbers
                              setfirstName(input);
                            }}
                            className="block w-full mt-1 p-2 border-gray-300 rounded-md border shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                          />
                        </div>
                      </div>
                      <div>
                        <label
                          htmlFor="name"
                          className="block text-2xl font-medium text-gray-700 undefined"
                        >
                          LastName
                        </label>
                        <div className="flex flex-col items-start">
                          <input
                            placeholder="Lastname"
                            type="text"
                            value={lastname}
                            required
                            onChange={(event) => {
                              const input = event.target.value.replace(
                                /[0-9]/g,
                                ""
                              ); // remove any numbers
                              setlastName(input);
                            }}
                            className="block w-full mt-1 p-2 border-gray-300 rounded-md border shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="name"
                        className="block text-2xl font-medium text-gray-700 undefined"
                      >
                        UserName
                      </label>
                      <div className="flex flex-col items-start">
                        <input
                          placeholder="Username"
                          type="text"
                          value={username}
                          required
                          onChange={(event) => setuserName(event.target.value)}
                          className="block w-full mt-1 p-2 border-gray-300 rounded-md border shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                        />
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-2xl font-medium text-gray-700 undefined"
                      >
                        Tag
                      </label>
                      <div className="flex flex-col items-start">
                        <input
                          placeholder="example:CW-1, NSA-A, PAYMENT-1"
                          type="text"
                          value={tag}
                          required
                          onChange={(event) => {
                            settag(event.target.value); // set the tag state to the input value
                          }}
                          className="block w-full mt-1 p-2 border-gray-300 rounded-md border shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                        />
                      </div>
                    </div>

                    <div className="mt-4">
                      <label
                        htmlFor="password"
                        className="block text-2xl font-medium text-gray-700 undefined"
                      >
                        Password
                      </label>
                      <div className="flex flex-col items-start">
                        <input
                          placeholder="password"
                          value={password}
                          required
                          onChange={(event) => setpassword(event.target.value)}
                          className="block w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                        />
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="text-2xl">Assign</div>
                      <label className="">
                        <select
                          className="px-4 py-3 font font-semibold  border-2 rounded-lg"
                          id="transactionType"
                          required
                          value={selectedTransactionType || ""}
                          onChange={(e) =>
                            setSelectedTransactionType(Number(e.target.value))
                          }
                        >
                          <option className="border-b-2" value="">
                            Select Role:
                          </option>
                          {transactionTypeOptions.map((transactionType) => (
                            <option
                              className="font font-semibold"
                              key={transactionType.id}
                              value={transactionType.id}
                            >
                              {transactionType.name}
                            </option>
                          ))}
                        </select>
                      </label>
                    </div>
                    <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                      <button
                        className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                        type="button"
                        onClick={() => {
                          setShowModal(false);
                          reset();
                        }}
                      >
                        Close
                      </button>
                      <button
                        className="text-black bg-green-500 active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                        type="submit"
                      >
                        Add
                      </button>
                    </div>
                  </form>
                </div>
                {/*footer*/}
                <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b"></div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
      <div
        style={{
          width: "100%",
          overflowX: "scroll",
          height: "420px",
          overflowY: "scroll",
        }}
        className="inline-block w-full border-2 mb-5 border-black shadow rounded-b-xl"
      >
        <div style={{ minWidth: "100%" }}></div>
        <div className="inline-block min-w-full shadow mr-5 overflow-hidden">
          <table className="min-w-full font-bold px-5 leading-normal">
            <thead className="font-bold text-xl">
              <tr>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-lg font-bold text-black uppercase tracking-wider hidden">
                  ID
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-lg font-bold text-black uppercase tracking-wider">
                  Name
                </th>

                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-lg font-bold text-black uppercase tracking-wider">
                  Username
                </th>
                <th className="px-5  py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-lg font-bold text-black uppercase tracking-wider hidden">
                  Password
                </th>
                <th className="px-5  py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-lg font-bold text-black uppercase tracking-wider hidden">
                  Tag
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-lg font-bold text-black uppercase tracking-wider">
                  Transaction Type
                </th>

                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-lg font-bold text-black uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="">
              {filteredData.map((counterPersonnel, rowIndex) => {
                return (
                  <tr key={counterPersonnel.id}>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm hidden">
                      {counterPersonnel.id}
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      {counterPersonnel.firstname} {counterPersonnel.lastname}
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      {counterPersonnel.username}
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm hidden">
                      {counterPersonnel.password}
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm hidden">
                      {counterPersonnel.tag}
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      {counterPersonnel.transactionType?.name}
                    </td>

                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <div className="gap-3 text-lg flex">
                        <button
                          className="text-lg"
                          type="button"
                          onClick={() => handlePatchDrop(counterPersonnel)}
                        >
                          <HiArchiveBoxArrowDown className="rounded h-10 w-10 transition hover:text-red-500 ease-in-out delay-80 hover:-translate-y-1 text-white  bg-red-500 hover:bg-white text-3xl" />
                        </button>

                        <div className="gap-3 text-lg flex">
                          <button
                            className="text-lg"
                            type="button"
                            onClick={() =>
                              handleEdit(counterPersonnel, rowIndex)
                            }
                          >
                            <HiPencil className="rounded h-10 w-10 transition ease-in-out delay-80 hover:-translate-y-1 hover:text-green-500 text-white hover:bg-white bg-green-500 text-3xl" />
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {editCounterPersonnel && (
            <Modal
              onClose={() => {
                setEditCounterPersonnel(null);
                reset();
              }}
            >
              <form className=" px-10 m-5" onSubmit={handleUpdate}>
                <div className="border-b-4 text-3xl font-bold mb-10 mr-7">
                  Edit User
                </div>
                <label>
                  <div className="flex flex-col  text-lg font-bold items-start">
                    First Name:
                    <input
                      className=" flex p-2 mb-2 border"
                      type="text"
                      defaultValue={editCounterPersonnel.firstname}
                      {...register("firstname")}
                      onChange={(event) => {
                        const input = event.target.value.replace(/[0-9]/g, ""); // remove any numbers
                        event.target.value = input; // set the input value to the cleaned input
                      }}
                    />
                  </div>
                </label>
                <label>
                  <div className=" flex flex-col text-lg font-bold items-start">
                    Last Name:
                    <input
                      className="border p-2 mb-2"
                      type="text"
                      defaultValue={editCounterPersonnel.lastname}
                      {...register("lastname")}
                      onChange={(event) => {
                        const input = event.target.value.replace(/[0-9]/g, ""); // remove any numbers
                        event.target.value = input; // set the input value to the cleaned input
                      }}
                    />
                  </div>
                </label>

                <label htmlFor="">
                  <div className="flex flex-col text-lg font-bold items-start">
                    User Name:
                    <input
                      className="border mb-2 p-2"
                      type="text"
                      defaultValue={editCounterPersonnel.username}
                      {...register("username")}
                    />
                  </div>
                </label>
                <label htmlFor="">
                  <div className="flex flex-col text-lg font-bold items-start">
                    Password:
                    <input
                      className="border mb-2 p-2 text-lg "
                      type="text"
                      placeholder="new password"
                      required
                      defaultValue={""}
                      {...register("password")}
                    />
                  </div>
                </label>
                <label htmlFor="">
                  <div className="flex flex-col text-lg font-bold items-start">
                    Tag:
                    <div className="font-extralight">
                      (Choose only from number 1 - 3)
                    </div>
                    <input
                      className="border mb-2 p-2 text-lg"
                      type="text"
                      defaultValue={editCounterPersonnel.tag}
                      {...register("tag")}
                      onChange={(event) => {
                        const input = event.target.value.replace(/[^1-3]/g, ""); // remove any non-numeric characters
                        event.target.value = input.slice(0, 1); // set the input value to the first digit
                      }}
                    />
                  </div>
                </label>
                <button
                  className="text-xl font-bold bg-green-400 p-2 rounded-lg items-end"
                  type="submit"
                >
                  Save
                </button>
              </form>
            </Modal>
          )}
        </div>
      </div>
    </div>
  );
};

export default Table;
