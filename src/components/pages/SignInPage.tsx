import React, { useEffect } from "react";
import { useGrinderyNexus } from "use-grindery-nexus";
import styled from "styled-components";
import { useNavigate, useSearchParams } from "react-router-dom";
import ConnectButton from "../shared/ConnectButton";
import { SCREEN } from "../../constants";
import Logo from "../shared/Logo";

const Container = styled.div`
  @media (min-width: ${SCREEN.TABLET}) {
    padding: 60px 106px;
    margin: 40px 20px 0;
  }
`;

const Wrapper = styled.div`
  padding: 24px 20px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: center;
  flex-wrap: nowrap;
  min-height: calc(100vh - 150px);
  @media (min-width: ${SCREEN.TABLET}) {
    padding: 40px 0;
    margin: 0;
    height: calc(100vh - 280px);
    max-height: calc(100vh - 350px);
    min-height: auto;
  }
`;

const Desc = styled.p`
  font-weight: 400;
  font-size: 16px;
  line-height: 150%;
  text-align: center;
  color: #0b0d17;
  padding: 0;
  margin: 25px 0 15px;
  @media (min-width: ${SCREEN.TABLET}) {
    max-width: 576px;
    margin: 25px auto 15px;
  }
`;

const Disclaimer = styled.div`
  font-weight: 400;
  font-size: 12px;
  line-height: 150%;
  text-align: center;
  color: #0b0d17;
  opacity: 0.5;
  max-width: 500px;
  margin: 0 auto;
`;

type Props = {};

const SignInPage = (props: Props) => {
  const { user, code, disconnect } = useGrinderyNexus();
  let [searchParams] = useSearchParams();
  let navigate = useNavigate();
  const redirect_uri = searchParams.get("redirect_uri");
  const response_type = searchParams.get("response_type");

  useEffect(() => {
    if (user && !code) {
      disconnect();
    }
  }, [user, code]);

  useEffect(() => {
    if (user && code) {
      setTimeout(() => {
        if (
          response_type &&
          response_type === "code" &&
          redirect_uri &&
          // eslint-disable-next-line no-useless-escape
          /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi.test(
            redirect_uri
          )
        ) {
          console.log("redirect to", redirect_uri);

          window.location.href = `${redirect_uri}${
            /\?/.test(redirect_uri) ? "&" : "?"
          }code=${code}`;
        } else {
          navigate("/dashboard");
        }
      }, 1000);
    }
  }, [user, redirect_uri, navigate, code, response_type]);

  return (
    <Container>
      <Wrapper>
        <Logo variant="horizontal" width="200px" />
        {!user ? (
          <>
            <Desc>
              Grindery Nexus is the easiest way for people and organizations to
              connect Apps and dApps across chains and protocols.
            </Desc>
            <ConnectButton />
            <Disclaimer>
              Grindery Ping uses{" "}
              <a href="https://metamask.io/" target="_blank" rel="noreferrer">
                MetaMask
              </a>{" "}
              to authenticate users.
            </Disclaimer>
          </>
        ) : user && !code ? (
          <Desc>Loading...</Desc>
        ) : (
          <Desc>Redirecting...</Desc>
        )}
      </Wrapper>
    </Container>
  );
};

export default SignInPage;
