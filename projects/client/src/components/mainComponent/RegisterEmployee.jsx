import React from "react";
import { FormControl, FormErrorMessage } from "@chakra-ui/react";
import { useFormik } from "formik";
import * as yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "../../api/axios";
import { ArrowLeftIcon, EyeIcon } from "@heroicons/react/24/outline";
import { NumericFormat } from "react-number-format";

const RegisterEmployee = () => {
  const [errMsg, setErrMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [salary, setSalary] = useState(0);
  const [isSuccess, setIsSuccess] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const registerUser = async (values, { setStatus, setValues }) => {
    values.salary = Number(salary);
    try {
      await axios.post("/auth/register", values, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      setIsSuccess("register successfully");
      setStatus({ success: true });
      setValues({
        email: "",
        password: "",
        confirmPassword: "",
        first_name: "",
        last_name: "",
        birth_date: "",
        join_date: "",
        salary: "",
      });
      setTimeout(() => {
        navigate("/dashboard-admin");
      }, 2000);
    } catch (err) {
      if (!err.response) {
        setErrMsg("No Server Response");
      } else {
        setErrMsg(err.response?.data?.message);
      }
    }
  };

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      confirmPassword: "",
      first_name: "",
      last_name: "",
      birth_date: "",
      join_date: "",
      salary: "",
    },
    onSubmit: registerUser,
    validationSchema: yup.object().shape({
      email: yup.string().required("email wajib diisi").email(),
      password: yup
        .string()
        .min(6)
        .required()
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[-_+=!@#$%^&*])(?=.{8,})/,
          "The password must contain uppercase, lowercase, numbers and special characters"
        ),
      confirmPassword: yup
        .string()
        .oneOf(
          [yup.ref("password"), null],
          "Password confirmation must match the password"
        )
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[-_+=!@#$%^&*])(?=.{8,})/,
          "The password must contain uppercase, lowercase, numbers and special characters"
        )
        .required("Password confirmation is required"),
      first_name: yup.string().required("first name is required"),
      last_name: yup.string().required("last name is required").min(3).max(20),
      birth_date: yup.date().required("birthday date is required"),
      join_date: yup.date().required("join date is required"),
      salary: yup.string().required("salary is required"),
    }),
    validateOnChange: false,
    validateOnBlur: false,
  });

  const handleForm = (event) => {
    const { target } = event;
    formik.setFieldValue(target.name, target.value);
  };

  const handleChange = (value) => {
    setSalary(value);
  };

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };
  const toggleConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };
  return (
    <div className="w-full flex flex-col justify-center items-center h-screen ">
      {/* MOBILE */}
      <div className="mt-10 flex w-full justify-around lg:hidden">
        <Link to="/dashboard-admin">
          <ArrowLeftIcon className="w-5 ml-2 text-white " />
        </Link>
        <h1 className="font-bold text-white mb-2 mr-14">
          register new employee
        </h1>
      </div>
      <div className="bg-white rounded-xl pb-5 mb-5 lg:w-96">
        <form onSubmit={formik.handleSubmit} className="lg:rounded-xl">
          {errMsg ? (
            <div className="w-56 mx-auto rounded-xl text-sm bg-red-200 text-red-700 h-7 flex justify-center items-center mt-2 lg:w-full">
              <p className="bg-inherit">{errMsg}</p>
            </div>
          ) : isSuccess ? (
            <div className="w-60 mx-auto rounded-xl text-sm  bg-blue-200 text-blue-700 h-7 flex justify-center items-center mt-2 lg:mx-auto">
              <p className="bg-inherit">{isSuccess}</p>
            </div>
          ) : null}
          <div className="grid lg:rounded-xl">
            <FormControl
              className="flex flex-col mt-2"
              isInvalid={formik.errors.email}
            >
              <label htmlFor="" className="ml-3 text-xs">
                email
              </label>
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
              className="flex flex-col mt-2"
              isInvalid={formik.errors.first_name}
            >
              <label htmlFor="" className="ml-3 text-xs">
                first name
              </label>
              <input
                onChange={handleForm}
                placeholder="first name"
                type="text"
                name="first_name"
                className="py-1 px-2 rounded-md bg-zinc-200 mx-3 text-green-strong"
                autoComplete="off"
                value={formik.values.first_name}
              />
              <FormErrorMessage className="text-red-500 text-sm font-medium mx-3">
                {formik.errors.first_name}
              </FormErrorMessage>
            </FormControl>
            <FormControl
              className="flex flex-col mt-2"
              isInvalid={formik.errors.last_name}
            >
              <label htmlFor="" className="ml-3 text-xs">
                last name
              </label>
              <input
                onChange={handleForm}
                placeholder="last name"
                type="text"
                name="last_name"
                className="py-1 px-2 rounded-md bg-zinc-200 mx-3 text-green-strong"
                autoComplete="off"
                value={formik.values.last_name}
              />
              <FormErrorMessage className="text-red-500 text-sm font-medium mx-3">
                {formik.errors.last_name}
              </FormErrorMessage>
            </FormControl>
            <FormControl
              className="flex flex-col mt-2"
              isInvalid={formik.errors.birth_date}
            >
              <label htmlFor="" className="ml-3 text-xs">
                birthday date
              </label>
              <input
                onChange={handleForm}
                placeholder="birthday date"
                type="date"
                name="birth_date"
                className="py-1 px-2 rounded-md bg-zinc-200 mx-3 text-green-strong"
                autoComplete="off"
                value={formik.values.birth_date}
              />
              <FormErrorMessage className="text-red-500 text-sm font-medium mx-3">
                {formik.errors.birth_date}
              </FormErrorMessage>
            </FormControl>
            <FormControl
              className="flex flex-col mt-2"
              isInvalid={formik.errors.join_date}
            >
              <label htmlFor="" className="ml-3 text-xs">
                join date
              </label>
              <input
                onChange={handleForm}
                placeholder="birthday date"
                type="date"
                name="join_date"
                className="py-1 px-2 rounded-md bg-zinc-200 mx-3 text-green-strong"
                autoComplete="off"
                value={formik.values.join_date}
              />
              <FormErrorMessage className="text-red-500 text-sm font-medium mx-3">
                {formik.errors.join_date}
              </FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={formik.errors.salary}>
              <label htmlFor="" className="ml-3 text-xs">
                salary
              </label>
              <NumericFormat
                type="text"
                className="bg-gray-200 text-gray-900 text-base rounded-lg focus:ring-green-strong focus:border-green-strong block w-fit mx-auto p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-strong dark:focus:focus:border-green-strong lg:w-[360px]"
                onChange={handleForm}
                placeholder="salary"
                name="salary"
                autoComplete="off"
                value={formik.values.salary}
                thousandSeparator={true}
                prefix={"Rp"}
                decimalScale={0}
                onValueChange={(values) => {
                  formik.setFieldValue("salary", values.value);
                  handleChange(values.value);
                }}
              />
              <FormErrorMessage className="text-red-500 text-sm font-medium mx-3">
                {formik.errors.salary}
              </FormErrorMessage>
            </FormControl>
            <FormControl
              className="flex flex-col mt-2"
              isInvalid={formik.errors.password}
            >
              <label htmlFor="" className="ml-3 text-xs">
                password
              </label>
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
            <FormControl
              className="flex flex-col mt-2"
              isInvalid={formik.errors.confirmPassword}
            >
              <label htmlFor="" className="ml-3 text-xs">
                confirm password
              </label>
              <input
                onChange={handleForm}
                placeholder="confirm password"
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                className="py-1 px-2 rounded-md bg-zinc-200 mx-3 text-green-strong"
                autoComplete="off"
                value={formik.values.confirmPassword}
              />
              <button
                type="button"
                className="w-full flex justify-end rounded-md text-center items-center mt-1"
                onClick={toggleConfirmPassword}
              >
                <span className="flex text-xs mr-2 items-center">
                  show password <EyeIcon className="w-5" />
                </span>
              </button>
              <FormErrorMessage className="text-red-500 text-sm font-medium mx-3">
                {formik.errors.confirmPassword}
              </FormErrorMessage>
            </FormControl>

            <div className="flex flex-col lg:flex-row justify-center items-center  lg:rounded-lg lg:justify-around lg:mt-2">
              <button
                type="submit"
                className="hidden lg:block bg-red-500 w-fit p-2 rounded-md text-center text-white font-poppins hover:bg-red-800 transition-all"
              >
                <Link to="/dashboard-admin">cancel registration</Link>
              </button>
              <button
                type="submit"
                className="bg-blue-button w-fit p-2 rounded-md text-center text-white font-poppins hover:bg-blue-800 transition-all"
              >
                Register Account
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterEmployee;
