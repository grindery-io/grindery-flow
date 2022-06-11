import React from "react";
import { Text } from "grindery-ui";
import DataBox from "./DataBox";
import { ICONS } from "../constants";

type Props = {};

const Dashboard = (props: Props) => {
  return (
    <div
      style={{
        padding: "24px 20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        justifyContent: "flex-start",
        flexWrap: "nowrap",
        gap: 15,
      }}
    >
      <DataBox
        size="large"
        LeftComponent={
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "flex-start",
              flexWrap: "nowrap",
              gap: 8,
            }}
          >
            <img
              src={ICONS.BELL}
              alt="notifications icon"
              style={{ width: 20 }}
            />
            <Text value="Notifications" variant="body2" />
          </div>
        }
        RightComponent={
          <div
            style={{
              width: 24,
              height: 24,
              borderRadius: 12,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              flexWrap: "nowrap",
              color: "#ffffff",
              background: "#FF5858",
            }}
          >
            <Text value={3} variant="body2" />
          </div>
        }
      />
      <DataBox
        size="large"
        LeftComponent={
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "flex-start",
              flexWrap: "nowrap",
              gap: 8,
            }}
          >
            <img src={ICONS.WALLET} alt="wallet icon" style={{ width: 20 }} />
            <Text value="Aggregated Balance" variant="body2" />
          </div>
        }
        BottomRightComponent={<Text value="$20.40" variant="h3" />}
      />
      <DataBox
        size="large"
        LeftComponent={
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "flex-start",
              flexWrap: "nowrap",
              gap: 8,
            }}
          >
            <img
              src={ICONS.WORKFLOWS}
              alt="Workflows icon"
              style={{ width: 20 }}
            />
            <Text value="Workflows" variant="body2" />
          </div>
        }
        BottomRightComponent={<Text value="5" variant="h3" />}
      />
      <DataBox
        size="large"
        LeftComponent={
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "flex-start",
              flexWrap: "nowrap",
              gap: 8,
            }}
          >
            <img src={ICONS.APPS} alt="(d)Apps icon" style={{ width: 20 }} />
            <Text value="(d)Apps" variant="body2" />
          </div>
        }
        BottomRightComponent={
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "flex-start",
              flexWrap: "nowrap",
              gap: 20,
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "flex-end",
                justifyContent: "flex-start",
                flexWrap: "nowrap",
                gap: 3,
              }}
            >
              <Text value="1" variant="h3" />
              <div style={{ marginBottom: 2 }}>
                <Text value="dApp" variant="caption" />
              </div>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "flex-end",
                justifyContent: "flex-start",
                flexWrap: "nowrap",
                gap: 3,
              }}
            >
              <Text value="4" variant="h3" />
              <div style={{ marginBottom: 2 }}>
                <Text value="Apps" variant="caption" />
              </div>
            </div>
          </div>
        }
      />
      <DataBox
        size="large"
        LeftComponent={
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "flex-start",
              flexWrap: "nowrap",
              gap: 8,
            }}
          >
            <img src={ICONS.HISTORY} alt="History icon" style={{ width: 20 }} />
            <Text value="History" variant="body2" />
          </div>
        }
        BottomRightComponent={
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "flex-start",
              flexWrap: "nowrap",
              gap: 20,
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "flex-end",
                justifyContent: "flex-start",
                flexWrap: "nowrap",
                gap: 3,
              }}
            >
              <Text value="1" variant="h3" />
              <div style={{ marginBottom: 2 }}>
                <Text value="Error" variant="caption" />
              </div>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "flex-end",
                justifyContent: "flex-start",
                flexWrap: "nowrap",
                gap: 3,
              }}
            >
              <Text value="3" variant="h3" />
              <div style={{ marginBottom: 2 }}>
                <Text value="Executed" variant="caption" />
              </div>
            </div>
          </div>
        }
      />
    </div>
  );
};

export default Dashboard;
