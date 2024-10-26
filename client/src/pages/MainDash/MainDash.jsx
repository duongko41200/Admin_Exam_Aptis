import React, { useEffect, useLayoutEffect, useState } from "react";
import Cards from "./Cards/Cards";
import "./MainDash.css";
import Bars from "../../components/Bar/Bar";
import RightSide from "./RigtSide/RightSide";
import { useSelector } from "react-redux";
import { Button } from "@mui/material";

import { Outlet, useNavigate } from "react-router-dom";
const MainDash = () => {
  const auth = useSelector((state) => state.authStore.user);
  const navigate = useNavigate();

  const moveToExam = () => {
    navigate("/exam-test");
  };

  return (
    <div className="MainDash">
      <section
        className="bg-between section-top margin-navbar position-relative"
        style={{
          backgroundColor: "#edf2f9",
          backgroundImage: `url('https://luyenthivstep.vn/public/image/banner/luyen-thi-vstep-banner-index-1.png?1728781647'), url('https://luyenthivstep.vn/public/image/banner/luyen-thi-vstep-banner-index-2.png?1728781626')`,
        }}
      >
        <div className=" absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="row justify-center col-12 col-md-10 col-lg-3">
            <div className="text-center">
              <h1 className="font-medium text-black ">
                Thi thử ApTis trực tuyến miễn phí
              </h1>
              <p
                className="text-lg justify-center text-gray-700"
                style={{ color: `var(--text-color)` }}
              >
                Tra cứu toàn bộ thông tin về chứng chỉ tiếng Anh VSTEP, lịch thi
                VSTEP mới nhất, thi thử VSTEP trực tuyến miễn phí.
              </p>
              <Button
                variant="contained"
                className="pt-3 btn btn-primary shadow lift me-1 mr-1"
                onClick={moveToExam}
              >
                Vào thi ngay <i className="fe fe-headphones ms-2"></i>
              </Button>
              <Button
                variant="outlined"
                className="m-2 pt-3 w-fit btn btn-primary shadow"
              >
                Lịch thi mới nhất
              </Button>
            </div>
          </div>
        </div>
        <div className="position-absolute bottom-0 left-1/2 transform -translate-x-1/2 mb-2">
          <a
            href="#dichvu"
            className="btn btn-outline-primary btn-rounded-circle shadow"
          >
            <i className="fe fe-chevrons-down"></i>
          </a>
        </div>
      </section>
    </div>
  );
};

export default MainDash;
