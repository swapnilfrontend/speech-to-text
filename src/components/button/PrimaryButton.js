import React from "react";
import "./PrimaryButton.css";

export const PrimaryButton = ({ children, ...restProps }) => {
  return (
    <button className="btn primary" {...restProps}>
      {children}
    </button>
  );
};
