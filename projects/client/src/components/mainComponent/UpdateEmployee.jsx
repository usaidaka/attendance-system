import React, { useEffect } from "react";
import { FormControl, FormErrorMessage } from "@chakra-ui/react";
import { useFormik } from "formik";
import * as yup from "yup";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import axios from "../../api/axios";
import { ArrowLeftIcon, EyeIcon } from "@heroicons/react/24/outline";

const UpdateEmployee = () => {
  const { token } = useParams();
  const [errMsg, setErrMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState("");
  const [getToken, setGetToken] = useState("");
  const [employeeData, setEmployeeData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setGetToken(token);
    axios
      .get(`/auth/employee-data/${getToken}`)
      .then((res) => setEmployeeData(res.data?.employeeData))
      .catch((err) => console.log(err));
  }, [getToken, token]);

  const updateUser = async (values, { setStatus, setValues }) => {
    try {
      await axios.patch(`/auth/employee-data/${getToken}`, values, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      setIsSuccess("update employee successfully");
      setStatus({ success: true });
      setValues({
        email: "",
        password: "",
        confirmPassword: "",
        first_name: "",
        last_name: "",
        birth_date: "",
        token_confirmation: "",
      });
      setTimeout(() => {
        navigate("/dashboard-employee");
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
      token_confirmation: "",
    },
    onSubmit: updateUser,
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
      token_confirmation: yup.string().required("OTP is a must"),
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
  const toggleConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  if (!employeeData) {
    return <p></p>;
  }

  return (
    <div className="w-full flex flex-col justify-center items-center h-screen ">
      {/* MOBILE */}
      <div className="mt-10 flex w-full justify-center ">
        <h1 className="font-bold text-white mb-2 ">Update Employee Data</h1>
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
                placeholder={employeeData.User?.email}
                type="text"
                name="email"
                className="py-1 px-2 rounded-md bg-zinc-200 mx-3 text-black text-sm"
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
                placeholder={employeeData.first_name}
                defaultValue={employeeData.first_name}
                type="text"
                name="first_name"
                className="py-1 px-2 rounded-md bg-zinc-200 mx-3 text-black text-sm"
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
                placeholder={employeeData.last_name}
                defaultValue={employeeData.last_name}
                type="text"
                name="last_name"
                className="py-1 px-2 rounded-md bg-zinc-200 mx-3 text-black text-sm"
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
                className="py-1 px-2 rounded-md bg-zinc-200 mx-3 text-black text-sm"
                autoComplete="off"
                value={formik.values.birth_date}
              />
              <FormErrorMessage className="text-red-500 text-sm font-medium mx-3">
                {formik.errors.birth_date}
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
                className="py-1 px-2 rounded-md bg-zinc-200 mx-3 text-black text-sm"
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
                className="py-1 px-2 rounded-md bg-zinc-200 mx-3 text-black text-sm"
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
            <FormControl
              className="flex flex-col mt-2"
              isInvalid={formik.errors.token_confirmation}
            >
              <label htmlFor="" className="ml-3 text-xs">
                OTP
              </label>
              <input
                onChange={handleForm}
                placeholder="OTP"
                type="text"
                name="token_confirmation"
                className="py-1 px-2 rounded-md bg-zinc-200 mx-3 text-black text-sm"
                autoComplete="off"
                value={formik.values.token_confirmation}
              />
              <FormErrorMessage className="text-red-500 text-sm font-medium mx-3">
                {formik.errors.token_confirmation}
              </FormErrorMessage>
            </FormControl>

            <div className="flex mt-5 flex-col lg:flex-row justify-center items-center  lg:rounded-lg lg:justify-around lg:mt-2">
              <button
                type="submit"
                className="bg-blue-button w-fit p-1 text-sm rounded-md text-center text-white font-poppins hover:bg-blue-800 transition-all"
              >
                Update Information
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateEmployee;
