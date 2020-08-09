import React from "react";
import "./Typography.css";

export const Heading1 = ({ children, ...restProps }) => (
  <h1 className="heading1" {...restProps}>
    {children}
  </h1>
);
