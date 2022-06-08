import React from "react";
import Logo from "./Logo";

type Props = {};

const AppHeader = (props: Props) => {
  return (
    <div
      style={{
        borderBottom: "1px solid #DCDCDC",
        padding: 16,
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
        flexDirection: "row",
        flexWrap: "nowrap",
      }}
    >
      <Logo variant="horizontal" />
    </div>
  );
};

export default AppHeader;
