import React from "react";
import { Text } from "grindery-ui";
import Check from "./icons/Check";
import { useAppContext } from "../context/AppContext";

type Props = {};

const WorkflowProgress = (props: Props) => {
  const { activeStep } = useAppContext();

  if (!activeStep) {
    return null;
  }

  const renderIcon = (index: number) => (
    <>
      {activeStep > index && <Check color="#8C30F5" />}
      {activeStep === index && (
        <div
          style={{
            display: "flex",
            margin: "0 auto 4px",
            alignItems: "center",
            justifyContent: "center",
            width: 24,
            height: 24,
            borderRadius: 12,
            background: "#8C30F5",
            color: "white",
          }}
        >
          <Text value={index.toString()} variant="body2" />
        </div>
      )}
      {activeStep < index && (
        <div
          style={{
            display: "flex",
            margin: "0 auto 4px",
            alignItems: "center",
            justifyContent: "center",
            width: 24,
            height: 24,
            borderRadius: 12,
            background: "#F4F5F7",
            color: "white",
          }}
        ></div>
      )}
    </>
  );

  const renderStep = (step: any) => (
    <div
      style={{
        width: "calc(100% / 3 - 20px)",
        textAlign: "center",
        position: "relative",
      }}
      key={step.index}
    >
      {renderIcon(step.index)}
      <Text value={step.label} variant="body2" />
      {step.index < 3 && (
        <div
          style={{
            height: 1,
            background: "#DCDCDC",
            position: "absolute",
            left: "calc(50% + 20px)",
            top: "12.5px",
            transform: "translateY(-50%)",
            width: 82,
          }}
        />
      )}
    </div>
  );

  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        flexWrap: "nowrap",
        flexDirection: "row",
        gap: 30,
        padding: "30px 20px 0",
      }}
    >
      {[
        { index: 1, label: "Connect Apps" },
        { index: 2, label: "Set Up Trigger" },
        { index: 3, label: "Set Up Action" },
      ].map((step) => renderStep(step))}
    </div>
  );
};

export default WorkflowProgress;