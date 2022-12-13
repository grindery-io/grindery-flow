import React, { useEffect, useState } from "react";
import { useGrinderyNexus } from "use-grindery-nexus";
import styled from "styled-components";
import { useNavigate, useSearchParams } from "react-router-dom";
import ConnectButton from "../shared/ConnectButton";
import { SCREEN } from "../../constants";
import Logo from "../shared/Logo";
import SignInForm from "../shared/SignInForm";
import useSignInContext from "../../hooks/useSignInContext";

const Container = styled.div`
  padding: 80px 20px 60px;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: center;
  flex-wrap: nowrap;
  min-height: calc(100vh - 140px);
  @media (min-width: ${SCREEN.TABLET}) {
    margin: 0;
    height: calc(100vh - 180px);
    max-height: calc(100vh - 140px);
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

const LogoWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  flex-wrap: nowrap;
  gap: 10px;
`;

const Title = styled.h1`
  font-weight: 700;
  font-size: 22px;
  line-height: 150%;
  color: #0b0d17;
  margin: 0;
  padding: 0;
`;

type Props = {};

const SignInPage = (props: Props) => {
  const { user, code, disconnect } = useGrinderyNexus();
  const { accessAllowed, verifying } = useSignInContext();
  let [searchParams] = useSearchParams();
  let navigate = useNavigate();
  const redirect_uri = searchParams.get("redirect_uri");
  const response_type = searchParams.get("response_type");
  const state = searchParams.get("state");
  const [emailSubmitted, setEmailSubmitted] = useState(false);

  useEffect(() => {
    if (user && !code) {
      disconnect();
    }
  }, [user, code]);

  useEffect(() => {
    if (user && code && emailSubmitted && !verifying) {
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
          window.location.href = `${redirect_uri}${
            /\?/.test(redirect_uri) ? "&" : "?"
          }code=${code}${state ? "&state=" + state : ""}`;
        } else {
          navigate("/dashboard");
        }
      }, 200);
    }
  }, [
    user,
    redirect_uri,
    navigate,
    code,
    response_type,
    emailSubmitted,
    verifying,
  ]);

  useEffect(() => {
    if (accessAllowed) {
      setEmailSubmitted(true);
    }
  }, [accessAllowed]);

  return (
    <Container>
      <Wrapper>
        <LogoWrapper>
          <Logo variant="square" width="40px" />
          <Title>Gateway</Title>
        </LogoWrapper>
        {!user ? (
          <>
            <Desc>
              Grindery Gateway allows you to implement Zapier workflows that
              read and write data from over 10 blockchains without a single line
              of code and without having any tokens. The easiest way to Web3 is
              just one click away!
            </Desc>
            <ConnectButton />
            <Disclaimer>
              Grindery Gateway uses{" "}
              <a href="https://metamask.io/" target="_blank" rel="noreferrer">
                MetaMask
              </a>{" "}
              and{" "}
              <a
                href="https://developers.flow.com/tools/fcl-js"
                target="_blank"
                rel="noreferrer"
              >
                Flow Client Library
              </a>{" "}
              to authenticate users.
            </Disclaimer>
          </>
        ) : user && !code ? (
          <Desc>Loading...</Desc>
        ) : (
          <>
            {user && emailSubmitted && <Desc>Redirecting...</Desc>}
            {user && !accessAllowed && !verifying && !emailSubmitted && (
              <SignInForm
                onSubmit={() => {
                  setEmailSubmitted(true);
                }}
              />
            )}
          </>
        )}
      </Wrapper>
    </Container>
  );
};

export default SignInPage;
