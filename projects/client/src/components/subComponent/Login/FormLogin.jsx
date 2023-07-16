import React from "react";
import { FormControl, FormErrorMessage } from "@chakra-ui/react";
import { useFormik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { EyeIcon } from "@heroicons/react/24/outline";

import axios from "../../../api/axios";

const FormLogin = () => {
  const navigate = useNavigate();
  const [isSuccess, setIsSuccess] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const loginUser = async (values, { setStatus, setValues }) => {
    try {
      const response = await axios.post("/auth/login", values, {
        headers: { "Content-Type": "application/json" },
      });

      const token = response.data?.access_token;
      const roleUser = response?.data?.user_information?.role_id;

      if (response.status === 200) {
        setValues({
          email: "",
          password: "",
        });
        setStatus({
          success: true,
          message:
            "Sign up successful. Please check your email for verification.",
        });
        setIsSuccess("Login employee successful");
        localStorage.setItem("token", token);
        if (roleUser === 1) {
          setIsSuccess("admin login successfully");
          setTimeout(() => {
            navigate("/dashboard-admin");
          }, 2000);
        } else if (roleUser === 2) {
          setTimeout(() => {
            navigate("/dashboard-employee");
          }, 2000);
        }
      } else {
        throw new Error("Register Failed");
      }
    } catch (err) {
      setErrMsg(err.response?.data?.message);
      setValues({
        email: "",
        password: "",
      });
    }
  };

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: loginUser,
    validationSchema: yup.object().shape({
      email: yup.string().email().required("email is a required field"),
      password: yup.string().required(),
    }),
    validateOnChange: false,
    validateOnBlur: false,
  });

  const handleForm = (event) => {
    const { target } = event;
    formik.setFieldValue(target.name, target.value);
  };

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };
  return (
    <div>
      <form onSubmit={formik.handleSubmit} className="lg:rounded-xl">
        {errMsg ? (
          <div className="w-60 mx-auto rounded-md  bg-red-200 text-red-700 h-10 flex justify-center items-center mt-2 lg:mx-auto">
            <p className="bg-inherit">{errMsg}</p>
          </div>
        ) : isSuccess ? (
          <div className="w-60 mx-auto rounded-md  bg-blue-200 text-blue-700 h-10 flex justify-center items-center mt-2 lg:mx-auto">
            <p className="bg-inherit">{isSuccess}</p>
          </div>
        ) : null}

        <div className="mt-5 grid gap-y-5 lg:rounded-xl">
          <FormControl
            className="flex flex-col"
            isInvalid={formik.errors.email}
          >
            <input
              onChange={handleForm}
              placeholder="email"
              type="text"
              name="email"
              className="py-1 px-2 rounded-md bg-zinc-200 mx-3 text-green-strong"
              autoComplete="off"
              value={formik.values.email}
            />
            <FormErrorMessage className="text-red-500 text-sm font-medium mx-3">
              {formik.errors.email}
            </FormErrorMessage>
          </FormControl>

          <FormControl
            className="flex flex-col"
            isInvalid={formik.errors.password}
          >
            <input
              onChange={handleForm}
              placeholder="password"
              type={showPassword ? "text" : "password"}
              name="password"
              className="py-1 px-2 rounded-md bg-zinc-200 mx-3 text-green-strong"
              autoComplete="off"
              value={formik.values.password}
            />
            <button
              type="button"
              className="w-full flex justify-end rounded-md text-center items-center mt-1"
              onClick={togglePassword}
            >
              <span className="flex text-xs mr-2 items-center">
                show password <EyeIcon className="w-5" />
              </span>
            </button>
            <FormErrorMessage className="text-red-500 text-sm font-medium mx-3">
              {formik.errors.password}
            </FormErrorMessage>
          </FormControl>

          <div className="flex flex-col justify-center items-center lg:rounded-lg">
            <button
              type="submit"
              className="bg-blue-button w-52 p-2 mb-3 rounded-md text-center text-white font-poppins hover:bg-blue-800 transition-all"
            >
              Log in
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default FormLogin;
