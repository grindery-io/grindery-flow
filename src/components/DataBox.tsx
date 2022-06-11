import React from "react";

type Props = {
  size?: "large" | "small";
  LeftComponent?: React.ReactNode;
  RightComponent?: React.ReactNode;
  BottomLeftComponent?: React.ReactNode;
  BottomRightComponent?: React.ReactNode;
  CenterComponent?: React.ReactNode;
};

const DataBox = (props: Props) => {
  const {
    size = "small",
    LeftComponent,
    CenterComponent,
    RightComponent,
    BottomLeftComponent,
    BottomRightComponent,
  } = props;

  return (
    <div
      style={{
        border: "1px solid #D3DEEC",
        borderRadius: size === "small" ? "5px" : "10px",
        padding: size === "small" ? "10px" : "15px",
      }}
    >
      {size === "small" && (
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-start",
            flexWrap: "nowrap",
          }}
        >
          {!!LeftComponent && (
            <div
              style={{
                marginRight: "auto",
              }}
            >
              {LeftComponent}
            </div>
          )}
          {!!CenterComponent && (
            <div
              style={{
                marginRight: "auto",
                marginLeft: "auto",
              }}
            >
              {CenterComponent}
            </div>
          )}
          {!!RightComponent && (
            <div
              style={{
                marginLeft: "auto",
              }}
            >
              {RightComponent}
            </div>
          )}
        </div>
      )}
      {size === "large" && (
        <>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "flex-start",
              flexWrap: "nowrap",
            }}
          >
            {!!LeftComponent && (
              <div
                style={{
                  marginRight: "auto",
                }}
              >
                {LeftComponent}
              </div>
            )}
            {!!CenterComponent && (
              <div
                style={{
                  marginRight: "auto",
                  marginLeft: "auto",
                }}
              >
                {CenterComponent}
              </div>
            )}
            {!!RightComponent && (
              <div
                style={{
                  marginLeft: "auto",
                }}
              >
                {RightComponent}
              </div>
            )}
          </div>
          <div
            style={{
              marginTop:
                !!BottomLeftComponent || !!BottomRightComponent ? 10 : 0,
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "flex-start",
                flexWrap: "nowrap",
              }}
            >
              {!!BottomLeftComponent && (
                <div
                  style={{
                    marginRight: "auto",
                  }}
                >
                  {BottomLeftComponent}
                </div>
              )}

              {!!BottomRightComponent && (
                <div
                  style={{
                    marginLeft: "auto",
                  }}
                >
                  {BottomRightComponent}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DataBox;
