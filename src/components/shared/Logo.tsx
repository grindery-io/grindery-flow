import React from "react";
import logo from "../../assets/images/nexus-logo.svg";
import logoHorizontal from "../../assets/images/nexus-logo-horizontal.svg";

type Props = {
  variant?: "horizontal";
};

const Logo = (props: Props) => {
  const { variant } = props;
  return (
    <div>
      <img
        src={variant && variant === "horizontal" ? logoHorizontal : logo}
        alt="Grindery Nexus logo"
        style={{ display: "block", margin: "0 auto" }}
      />
    </div>
  );
};

export default Logo;
