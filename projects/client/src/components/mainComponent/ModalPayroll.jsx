"use client";

import { BellAlertIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Button, Modal } from "flowbite-react";
import { useState } from "react";
import axios from "../../api/axios";

export default function ModalPayroll() {
  const [openModal, setOpenModal] = useState("");
  const [resPayroll, setResPayroll] = useState({});
  const [errMsg, setErrMsg] = useState("");
  const [isSuccess, setIsSuccess] = useState("");
  const token = localStorage.getItem("token");

  const props = { openModal, setOpenModal };

  const handlePayrollEmployee = () => {
    try {
      axios
        .post("/payroll", {}, { headers: { Authorization: `Bearer ${token}` } })
        .then((res) => setResPayroll(res))
        .catch((res) => setErrMsg(res.response?.data?.message));
    } catch (error) {}
  };

  return (
    <>
      {errMsg ? (
        <div className="w-60 mx-auto rounded-md absolute top-5 right-7 bg-red-200 text-red-700 h-10 flex justify-center items-center mt-2 lg:mx-auto text-sm px-1 lg:flex  lg:justify-center lg:static">
          <p className="bg-inherit">{errMsg}</p>
          <button
            className="w-5 absolute right-1 lg:static"
            onClick={() => {
              setErrMsg("");
            }}
          >
            <XMarkIcon />
          </button>
        </div>
      ) : resPayroll ? (
        <div className="w-60 mx-auto rounded-md absolute top-5 right-7 bg-blue-200 text-blue-700 h-10 flex justify-center items-center mt-2 lg:mx-auto text-sm px-1 lg:flex  lg:justify-center lg:static">
          <p className="bg-inherit">{resPayroll.data?.message}</p>
          <button
            className="w-5 absolute right-1"
            onClick={() => {
              setResPayroll("");
            }}
          >
            <XMarkIcon />
          </button>
        </div>
      ) : null}
      <Button
        onClick={() => props.setOpenModal("pop-up")}
        className="bg-green-payroll w-64 text-white px-3 mt-2 rounded-md transition-all"
      >
        Pay The Employee
      </Button>
      <Modal
        show={props.openModal === "pop-up"}
        size="md"
        popup
        onClose={() => props.setOpenModal(undefined)}
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <BellAlertIcon className="mx-auto mb-4 h-14 w-14 transition-all text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Are you sure you want to{" "}
              <span className="font-semibold">pay the employee now?</span>
            </h3>
            <div className="flex justify-center gap-4">
              <Button
                className="bg-green-payroll transition-all"
                onClick={() => {
                  handlePayrollEmployee();
                  props.setOpenModal(undefined);
                }}
              >
                Yes, I'm sure
              </Button>
              <Button
                className="bg-red-500"
                onClick={() => props.setOpenModal(undefined)}
              >
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
