const API_Login = process.env.BACKEND_API_AUTH_LOGIN;

import React, { useState } from "react";
import LoginImageComp from "./LoginImage";
import axios from "axios";
import { useRouter } from "next/router";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const result = await axios.post(`${API_Login}`, {
        username,
        password,
      });
      const {
        accessToken,
        transactionType: { name },
        sub,
      } = result.data;
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("transactionType", name);
      // localStorage.setItem("transactionType", name);
      localStorage.setItem("sub", sub);

      if (name === "APPLICATION") {
        router.push("/counter-personnel/application");
      } else if (name === "CUSTOMER WELFARE") {
        router.push("/counter-personnel/customer-welfare");
      } else if (name === "PAYMENT") {
        router.push("/counter-personnel/payment");
      } else if (name === "ADMIN") {
        router.push("/admin");
      }
    } catch (error) {
      window.alert("Invalid Login");
    }
  };

  const handleKeyPress = (event: { key: string }) => {
    if (event.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <div className="Inter">
      <div className="max-w-4xl bg-white border border-gray-200 rounded-lg shadow-lg mx-auto my-auto mt-12">
        <div className="grid grid-cols-2">
          <div>
            <LoginImageComp />
          </div>
          <div>
            <div className="relative">
              <div className="absolute top-48 left-0 w-full h-full flex justify-center items-center">
                <h3 className="text-black text-2xl font-bold font-poppins">
                  WELCOME !
                </h3>
              </div>
              <div className="absolute top-60 left-0 w-full h-full flex justify-center items-center mt-20">
                <div className="flex justify-center">
                  <div>
                    <div>
                      <input
                        type="text"
                        id="username"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-lg rounded-md focus:ring-blue-500 focus:border-blue-500 block w-80 p-2.5"
                        placeholder="Username"
                        required
                        onChange={(e) => setUsername(e.target.value)}
                      />
                      <input
                        type="password"
                        id="password"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-lg rounded-md focus:ring-blue-500 focus:border-blue-500 block w-80 p-2.5 mt-3"
                        placeholder="Password"
                        required
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyDown={handleKeyPress} // Add event listener for key press
                      />
                      <button
                        onClick={() => handleLogin()}
                        className="bg-blue-400 hover:bg-blue-500 text-white font-bold py-4 px-4 border border-blue-500
               rounded mt-4 container"
                      >
                        LOGIN
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
