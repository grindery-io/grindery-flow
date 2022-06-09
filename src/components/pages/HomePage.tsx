import React from "react";
import RightBar from "../RightBar";
import WorkflowConstructor from "../WorkflowConstructor";

type Props = {};

const HomePage = (props: Props) => {
  return (
    <div>
      <RightBar>
        <WorkflowConstructor />
      </RightBar>
    </div>
  );
};

export default HomePage;
