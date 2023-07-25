import React, { useState } from "react";
import { RichInput, Select } from "grindery-ui";
import styled from "styled-components";
import { ICONS, isLocalOrStaging } from "../../constants";
import useAppContext from "../../hooks/useAppContext";
import Button from "./Button";
import CheckBox from "./CheckBox";
import useSignInContext from "../../hooks/useSignInContext";
import { validateEmail } from "../../helpers/utils";

const Wrapper = styled.div`
  max-width: 740px;
  margin: 0 auto;
`;

const FormWrapper = styled.div`
  padding: 30px;
  background: #ffffff;
`;

const FormContent = styled.div`
  max-width: 740px;
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

const CheckboxWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-start;
  flex-wrap: nowrap;
  gap: 15px;
  margin-bottom: 10px;
`;

const CheckboxLabel = styled.label`
  font-weight: 400;
  font-size: 14px;
  line-height: 150%;
  color: #0b0d17;
`;

const ErrorWrapper = styled.p`
  font-weight: 400;
  font-size: 14px;
  line-height: 150%;
  color: #ff5858;
  margin: 20px 0 10px;
  padding: 0;
  text-align: center;
`;

const SuccessMessage = styled.div`
  font-weight: 400;
  font-size: 20px;
  line-height: 130%;
  text-align: center;
  color: #000000;
  margin: 10px 0 20px;
  padding: 0;
  white-space: pre-wrap;
`;

const CheckboxTitle = styled.p`
  font-size: 14px;
  line-height: 150%;
  text-align: left;
  color: rgb(11, 13, 23);
  font-style: normal;
  font-weight: 400;
  margin: 20px 0 2px;
  padding: 0;
`;
const CheckboxSubTitle = styled.p`
  font-size: 12px;
  line-height: 150%;
  text-align: left;
  color: rgb(11, 13, 23);
  font-style: normal;
  font-weight: 400;
  margin: 0 0 6px;
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

type Props = {
  onSubmit?: () => void;
};

const SignInForm = (props: Props) => {
  const { user, accessAllowed, verifying, client } = useSignInContext();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [interest, setInterest] = useState([""]);
  const [skill, setSkill] = useState([""]);
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState({ type: "", text: "" });
  const [success, setSuccess] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");

  const validate = () => {
    if (!email) {
      setError({ type: "email", text: "Email is required" });
      return;
    }
    if (!validateEmail(email)) {
      setError({ type: "email", text: "Email is not valid" });
      return;
    }
    if (!consent) {
      setError({
        type: "consent",
        text: "Please, agree with our Terms of Service and Privacy Policy",
      });
      return;
    }
    requestEarlyAccess();
  };

  const handleEmailChange = (value: string) => {
    setError({ type: "", text: "" });
    setEmail(value || "");
  };

  const requestEarlyAccess = async () => {
    setLoading(true);
    setError({ type: "", text: "" });
    const res = await client
      ?.requestEngine("or_requestEarlyAccess", {
        email,
        source: "nexus.grindery.org/sign-in",
        app: "Requested to Gateway",
        firstname,
        lastname,
        interest: interest.join(";"),
        skill: skill.join(";"),
        trackSource: isLocalOrStaging
          ? "urn:grindery-staging:nexus"
          : "urn:grindery:nexus",
      })
      .catch((err) => {
        console.error(
          "or_requestEarlyAccess error",
          err.response.data.error.message
        );
        setError({
          type: "server",
          text:
            err.response.data.error.message ||
            "Server error, please, try again",
        });

        setLoading(false);
      });
    if (res) {
      setSuccess(
        `We just sent a confirmation email to ${email}. Please check your email and confirm to activate your account.`
      );
    }

    setLoading(false);
  };

  return user && !accessAllowed && !verifying ? (
    <Wrapper>
      <FormWrapper>
        <FormContent>
          {success ? (
            <>
              <img
                src="/images/thank-you.png"
                alt="thank you"
                style={{
                  marginBottom: "10px",
                  width: "604px",
                  maxWidth: "100%",
                  height: "auto",
                }}
              />
              <FormTitle>Thank you!</FormTitle>
              <SuccessMessage>{success}</SuccessMessage>
              {props.onSubmit && (
                <Button
                  value="Continue"
                  onClick={() => {
                    if (props.onSubmit) {
                      props.onSubmit();
                    }
                  }}
                />
              )}
            </>
          ) : (
            <>
              <FormTitle>Seems like you are new to Grindery.</FormTitle>
              <FormDesc>
                Please provide your email address so we can activate your
                account.
              </FormDesc>
              <RichInput
                label="Email"
                placeholder=""
                value={email}
                onChange={handleEmailChange}
                error={error.type === "email" && error.text ? error.text : ""}
                required
                options={[]}
              />

              <RichInput
                label="First Name"
                value={firstname}
                onChange={(value: string) => {
                  setFirstname(value);
                }}
                options={[]}
              />
              <RichInput
                label="Last Name"
                value={lastname}
                onChange={(value: string) => {
                  setLastname(value);
                }}
                options={[]}
              />
              <CheckboxTitle>What brings you here?</CheckboxTitle>
              <CheckboxSubTitle>
                When we know what you are trying to do we can help you and
                personalize information and emails for you!
              </CheckboxSubTitle>
              {[
                {
                  value: "dApp2Zapier",
                  label: "Connect a specific dApp to Zapier",
                },
                {
                  value: "MyDapp2Zapier",
                  label: "Publish my dApp on Zapier",
                },
                { value: "Learn", label: "Browse and learn" },
                { value: "else", label: "Something else" },
              ].map((option) => (
                <CheckboxWrapper
                  tabIndex={0}
                  onKeyDown={(event: React.KeyboardEvent) => {
                    if (event.key === "Enter") {
                      if (interest.includes(option.value)) {
                        setInterest([
                          ...interest.filter((i: string) => i !== option.value),
                        ]);
                      } else {
                        setInterest([...interest, option.value]);
                      }
                    }
                  }}
                  onClick={() => {
                    if (interest.includes(option.value)) {
                      setInterest([
                        ...interest.filter((i: string) => i !== option.value),
                      ]);
                    } else {
                      setInterest([...interest, option.value]);
                    }
                  }}
                  style={{ cursor: "pointer" }}
                >
                  <CheckBox
                    checked={interest.includes(option.value)}
                    onChange={() => {}}
                  />
                  <CheckboxLabel style={{ cursor: "pointer" }}>
                    {option.label}
                  </CheckboxLabel>
                </CheckboxWrapper>
              ))}

              <CheckboxTitle>What describes you best?</CheckboxTitle>
              <CheckboxSubTitle>
                When we better understand your skills we can show you the right
                tutorials and courses.
              </CheckboxSubTitle>
              {[
                {
                  value: "web3",
                  label: "I'm a web3 buildler",
                },
                {
                  value: "zapier",
                  label: "I'm a Zapier guru",
                },
                { value: "code", label: "I'm a coding wizard" },
                { value: "human", label: "I'm only human" },
              ].map((option) => (
                <CheckboxWrapper
                  tabIndex={0}
                  onKeyDown={(event: React.KeyboardEvent) => {
                    if (event.key === "Enter") {
                      if (skill.includes(option.value)) {
                        setSkill([
                          ...skill.filter((i: string) => i !== option.value),
                        ]);
                      } else {
                        setSkill([...skill, option.value]);
                      }
                    }
                  }}
                  onClick={() => {
                    if (skill.includes(option.value)) {
                      setSkill([
                        ...skill.filter((i: string) => i !== option.value),
                      ]);
                    } else {
                      setSkill([...skill, option.value]);
                    }
                  }}
                  style={{ cursor: "pointer" }}
                >
                  <CheckBox
                    checked={skill.includes(option.value)}
                    onChange={() => {}}
                  />
                  <CheckboxLabel style={{ cursor: "pointer" }}>
                    {option.label}
                  </CheckboxLabel>
                </CheckboxWrapper>
              ))}

              <CheckboxWrapper style={{ marginTop: "40px" }}>
                <CheckBox
                  checked={consent}
                  onChange={(val) => {
                    setError({ type: "", text: "" });
                    setConsent(val);
                  }}
                  onKeyDown={(event: React.KeyboardEvent) => {
                    if (event.key === "Enter") {
                      setConsent(!consent);
                    }
                  }}
                  style={{ marginTop: "4px" }}
                  tabIndex={0}
                />
                <CheckboxLabel>
                  To communicate with you we need you to provide us with
                  information. To learn more, see our{" "}
                  <a
                    href="https://docs.google.com/document/u/1/d/e/2PACX-1vROgga4q_jago0wilXMB28BxXoymaaegLv5pwCSVZMi8QRCp7oXmfxIhMEXeVC8Hrg3eBBGooMMa641/pub"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a
                    href="https://www.grindery.io/privacy"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Privacy Policy
                  </a>
                </CheckboxLabel>
              </CheckboxWrapper>
              {error &&
                (error.type === "server" || error.type === "consent") &&
                error.text && <ErrorWrapper>{error.text}</ErrorWrapper>}
              <Button
                value="Continue"
                onClick={() => {
                  validate();
                }}
                loading={loading}
                disabled={loading}
              />

              <SubtitleWrapper>
                <Line />
                <Subtitle>Stay tuned via</Subtitle>
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

export default SignInForm;
