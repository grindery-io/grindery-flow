import React, { useState } from "react";
import { CircularProgress } from "grindery-ui";
import styled from "styled-components";
import HubspotForm from "react-hubspot-form";
import { HS_FORM_ID, HS_PORTAL_ID, ICONS } from "../../constants";
import useAppContext from "../../hooks/useAppContext";

const Wrapper = styled.div`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100vh;
  left: 0;
  background: rgba(23, 11, 16, 0.4);
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-end;
  flex-wrap: nowrap;
  z-index: 9999;
`;

const FormWrapper = styled.div`
  padding: 60px 30px;
  background: #ffffff;
  overflow: auto;

  & iframe:nth-child(2) {
    display: none !important;
  }
`;

const FormContent = styled.div`
  max-width: 604px;
  margin: 0 auto;
  color: #000000;
`;

const FormTitle = styled.h2`
  font-weight: 700;
  font-size: 40px;
  line-height: 130%;
  text-align: center;
  color: #000000;
  margin: 0 0 10px;
  padding: 0;
`;

const FormDesc = styled.p`
  font-weight: 400;
  font-size: 20px;
  line-height: 130%;
  text-align: center;
  color: #000000;
  margin: 0 0 20px;
  padding: 0;
`;

const SubtitleWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  flex-wrap: nowrap;
  margin: 10px 0 20px;
`;

const Subtitle = styled.p`
  font-weight: 400;
  font-size: 16px;
  line-height: 150%;
  text-align: center;
  color: #0b0d17;
  margin: 0;
  padding: 0 10px;
`;

const Line = styled.div`
  height: 1px;
  flex: 1;
  background: #b1c3c9;
`;

const Socials = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  flex-wrap: nowrap;
  gap: 20px;

  & img {
    width: 40px;
    height: 40px;
  }
`;

type Props = {};

const EarlyAccessModal = (props: Props) => {
  const { user, accessAllowed } = useAppContext();
  const [loading, setLoading] = useState(true);
  const savedEmail = localStorage.getItem("gr_user_email");
  const [emailSaved, setEmailSaved] = useState(!!savedEmail);

  return user && !accessAllowed && !emailSaved ? (
    <Wrapper>
      <FormWrapper>
        <FormContent>
          <FormTitle>Get early access!</FormTitle>
          <FormDesc>
            Grindery Nexus is currently in private beta. If you would like to
            get early access please provide us with en email address to notify
            you as soon as a sot become available
          </FormDesc>
          <HubspotForm
            portalId={HS_PORTAL_ID}
            formId={HS_FORM_ID}
            onSubmit={() => {
              localStorage.setItem("gr_user_email", "true");
              setEmailSaved(true);
            }}
            onReady={() => {
              setLoading(false);
            }}
            loading={
              <div
                style={{ marginTop: 40, textAlign: "center", color: "#8C30F5" }}
              >
                <CircularProgress color="inherit" />
              </div>
            }
          />
          {!loading && (
            <>
              <SubtitleWrapper>
                <Line />
                <Subtitle>Or stay tuned via</Subtitle>
                <Line />
              </SubtitleWrapper>
              <Socials>
                <a
                  href="https://discord.gg/PCMTWg3KzE"
                  target="_blank"
                  rel="noreferrer"
                >
                  <img src={ICONS.SOCIAL_DISCORD} alt="Discord" />
                </a>
                <a
                  href="https://t.me/grinderyio"
                  target="_blank"
                  rel="noreferrer"
                >
                  <img src={ICONS.SOCIAL_TG} alt="Telegram" />
                </a>
                <a
                  href="https://twitter.com/grindery_io"
                  target="_blank"
                  rel="noreferrer"
                >
                  <img src={ICONS.SOCIAL_TWITTER} alt="Twitter" />
                </a>
              </Socials>
            </>
          )}
        </FormContent>
      </FormWrapper>
    </Wrapper>
  ) : null;
};

export default EarlyAccessModal;
