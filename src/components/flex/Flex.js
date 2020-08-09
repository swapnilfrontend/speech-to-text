import React from "react";
import "./Flex.css";

export const Flex = ({ children, ...restProps }) => (
  <div className="flex" {...restProps}>
    {children}
  </div>
);
