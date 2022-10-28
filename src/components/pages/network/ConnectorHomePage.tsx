import React from "react";
import styled from "styled-components";
import { CircularProgress } from "grindery-ui";
import Button from "../../network/Button";
import { useNavigate } from "react-router";

const Title = styled.h3`
  font-weight: 700;
  font-size: 32px;
  line-height: 120%;
  color: #0b0d17;
  padding: 0;
  margin: 0 0 20px;
`;

const Card = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-start;
  flex-wrap: nowrap;
  gap: 20px;
  border: 1px solid #dcdcdc;
  border-radius: 5px;
  padding: 15px 20px;
  margin-bottom: 20px;
`;

const CardContent = styled.div`
  width: 68%;
`;

const CardCTA = styled.div`
  margin-left: auto;
`;

const CardTitle = styled.h5`
  font-weight: 500;
  font-size: 20px;
  line-height: 150%;
  margin: 0;
  padding: 0;
  color: #0b0d17;
`;

const CardDescription = styled.p`
  font-weight: 400;
  font-size: 14px;
  line-height: 150%;
  margin: 10px 0 0;
  padding: 0;
  color: #898989;
`;

type Props = {
  data: any;
  setData: any;
};

const ConnectorHomePage = (props: Props) => {
  let navigate = useNavigate();
  const { data } = props;

  return data && data.cds ? (
    <div>
      <Title>Connector Home</Title>
      <div>
        <Card>
          <CardContent>
            <CardTitle>Settings</CardTitle>
            <CardDescription>
              Provide connector name, icon and other common details.
            </CardDescription>
          </CardContent>
          <CardCTA>
            <Button
              onClick={() => {
                navigate(`/network/connector/${data.id}/settings`);
              }}
            >
              Set Up Settings
            </Button>
          </CardCTA>
        </Card>
        <Card>
          <CardContent>
            <CardTitle>Triggers</CardTitle>
            <CardDescription>
              Help users to catch new data as soon as it is available. Triggers
              listen to smart-contract events.
            </CardDescription>
          </CardContent>
          <CardCTA>
            <Button
              onClick={() => {
                navigate(`/network/connector/${data.id}/triggers`);
              }}
            >
              Manage Triggers
            </Button>
          </CardCTA>
        </Card>
        <Card>
          <CardContent>
            <CardTitle>Actions</CardTitle>
            <CardDescription>
              Help users to call functions. Actions send transactions to the
              smart-contract.
            </CardDescription>
          </CardContent>
          <CardCTA>
            <Button
              onClick={() => {
                navigate(`/network/connector/${data.id}/actions`);
              }}
            >
              Manage Actions
            </Button>
          </CardCTA>
        </Card>
        <Card>
          <CardContent>
            <CardTitle>Publish</CardTitle>
            <CardDescription>
              Publish your connector when you are ready. You can keep it private
              to yourself, your workspace, or you can share it with all users of
              the Nexus.
            </CardDescription>
          </CardContent>
          <CardCTA>
            <Button
              onClick={() => {
                navigate(`/network/connector/${data.id}/publish`);
              }}
            >
              Publish Connector
            </Button>
          </CardCTA>
        </Card>
      </div>
    </div>
  ) : (
    <div
      style={{
        textAlign: "center",
        color: "#8C30F5",
        width: "100%",
        margin: "40px 0",
      }}
    >
      <CircularProgress color="inherit" />
    </div>
  );
};

export default ConnectorHomePage;