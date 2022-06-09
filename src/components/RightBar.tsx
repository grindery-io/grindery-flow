import React from "react";
import AppHeader from "./AppHeader";

type Props = {
  children?: React.ReactNode;
};

const RightBar = (props: Props) => {
  const { children } = props;
  return (
    <div
      style={{
        maxWidth: 375,
        margin: "0 0 0 auto",
        borderLeft: "1px solid #DCDCDC",
        borderRight: "1px solid #DCDCDC",
        minHeight: "100vh",
        background: "#FFFFFF",
      }}
    >
      <AppHeader />
      {children}
    </div>
  );
};

export default RightBar;
