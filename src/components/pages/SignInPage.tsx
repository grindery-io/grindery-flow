import React, { useEffect, useState } from "react";
import { useGrinderyNexus } from "use-grindery-nexus";
import styled from "styled-components";
import { useNavigate, useSearchParams } from "react-router-dom";
import { SCREEN } from "../../constants";
import Logo from "../shared/Logo";
import SignInForm from "../shared/SignInForm";
import useSignInContext from "../../hooks/useSignInContext";
import ConnectMetamask from "../shared/ConnectMetamask";
import ConfirmEmailMessage from "../shared/ConfirmEmailMessage";
import WorkspaceSelectorMini from "../shared/WorkspaceSelectorMini";

const Container = styled.div`
  padding: 0;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: center;
  flex-wrap: nowrap;
  min-height: calc(100vh - 140px);
  max-width: 470px;
  margin: 0 auto;
  @media (min-width: ${SCREEN.TABLET}) {
    margin: 0 auto;
    min-height: calc(100vh - 180px);
  }
`;

const TopSection = styled.div`
  padding: 64px 40px 32px;
  background: #fff;
`;

const BottomSection = styled.div`
  padding: 32px 40px 64px;
  background: #e0edee;

  h2 {
    font-size: 24px;
    font-style: normal;
    font-weight: 700;
    line-height: 120%;
    margin: 0 0 24px;
    padding: 0;
  }

  ol {
    margin: 0 0 24px;
    padding: 0 0 0 20px;

    li {
      padding: 0;
      margin: 0;
      font-size: 16px;
      font-style: normal;
      font-weight: 400;
      line-height: 150%;
    }
  }

  p {
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 150%;
    margin: 0;
    padding: 0;
  }
`;

const Desc = styled.p`
  font-weight: 400;
  font-size: 16px;
  line-height: 150%;
  text-align: center;
  color: #0b0d17;
  padding: 0;
  margin: 0 0 14px;
`;

const Disclaimer = styled.div`
  font-weight: 400;
  font-size: 12px;
  line-height: 150%;
  text-align: center;
  color: #0b0d17;
  opacity: 0.5;
  max-width: 500px;
  margin: 14px auto 0;
`;

const LogoWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  flex-wrap: nowrap;
  gap: 10px;
  margin-bottom: 24px;
`;

type Props = {};

const SignInPage = (props: Props) => {
  const { user, code, disconnect } = useGrinderyNexus();
  const {
    accessAllowed,
    verifying,
    chekingOptIn,
    isOptedIn,
    setIsOptedIn,
    authCode,
    workspaces,
  } = useSignInContext();
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
  }, [user, code, disconnect]);

  useEffect(() => {
    if (user && authCode) {
      //window.open("https://gateway.grindery.org/", "_blank", "noreferrer");
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
          }code=${authCode}${state ? "&state=" + state : ""}`;
        } else {
          navigate("/dashboard");
        }
      }, 300);
    }
  }, [user, redirect_uri, navigate, response_type, authCode, state]);

  useEffect(() => {
    if (accessAllowed) {
      setEmailSubmitted(true);
    }
  }, [accessAllowed]);

  return (
    <Container>
      <Wrapper>
        <TopSection>
          <LogoWrapper>
            <img
              src="/images/grindery-iso-square-dark.svg"
              alt="Grindery logo"
            />
          </LogoWrapper>
          {!user ? (
            <>
              <Desc>
                Grindery Gateway allows you to exchange data on over a dozen
                blockchains without a single line of code.
              </Desc>
              <ConnectMetamask />
              <Disclaimer>
                Grindery Gateway uses{" "}
                <a href="https://metamask.io/" target="_blank" rel="noreferrer">
                  MetaMask
                </a>{" "}
                to authenticate users.
              </Disclaimer>
            </>
          ) : (
            <>
              {authCode && <Desc>Redirecting...</Desc>}

              {!authCode && !accessAllowed && !verifying && !emailSubmitted && (
                <SignInForm
                  onSubmit={() => {
                    setEmailSubmitted(true);
                  }}
                />
              )}

              {!authCode &&
                accessAllowed &&
                !chekingOptIn &&
                !isOptedIn &&
                emailSubmitted && (
                  <ConfirmEmailMessage
                    onContinue={() => {
                      setIsOptedIn(true);
                    }}
                  />
                )}
              {!authCode &&
                ((accessAllowed && isOptedIn) ||
                  (!accessAllowed && emailSubmitted)) && (
                  <WorkspaceSelectorMini />
                )}
            </>
          )}
        </TopSection>
        {!user && (
          <BottomSection>
            <h2>Kickstart Steps</h2>
            <ol>
              <li>Create an account</li>
              <li>Confirm your email to activate it</li>
              <li>Build your workflows!</li>
            </ol>
            <p>
              To get support check links in the email or use the in-app chat
            </p>
          </BottomSection>
        )}
      </Wrapper>
    </Container>
  );
};

export default SignInPage;
