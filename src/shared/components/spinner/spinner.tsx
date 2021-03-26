import React from "react";
import "./spinner.scss";

const Spinner = () => {
  return (
    <div className="spinner">
      <div className="spinner__inner">
        <div className="spinner__content">
          <span className="spinner__icon"></span>
        </div>
      </div>
    </div>
  );
};

export default Spinner;
