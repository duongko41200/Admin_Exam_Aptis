"use client";

import { SET_MODAL_NOTIFY } from "@/store/general";
import { useDispatch, useSelector } from "react-redux";

export default function ModalNotify({ children, label, subLabel = "" }) {
  const isModalNotify = useSelector(
    (state) => state.generalStore.isModalNotify
  );
  const dispatch = useDispatch();

  const handleClose = () => {
    dispatch(SET_MODAL_NOTIFY(false));
  };

  return (
    <div>
      {isModalNotify && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          onClick={handleClose}
        >
          <div
            className="bg-white p-6 rounded-lg shadow-xl w-11/12 md:w-96"
            onClick={handleClose}
          >
            <div className="text-lg font-semibold bg-green-100 text-green-800 border border-green-800 w-fit p-2 px-4 rounded-md" id="modal-modal-title">
              {label}
            </div>
            <div className="mt-4 text-md " >
              {subLabel}
            </div>
            <div className="text-right mt-4">{children}</div>
          </div>
        </div>
      )}
    </div>
  );
}
