import React, { useState } from "react";
import { RichInput, Select } from "grindery-ui";
import styled from "styled-components";
import { ICONS } from "../../constants";
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
        interest: interest.join(";"),
        skill: skill.join(";"),
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

              <Select
                options={[
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
                ]}
                type={"default"}
                multiple={true}
                value={interest}
                onChange={(value: string[]) => {
                  setError({ type: "", text: "" });
                  setInterest(value);
                }}
                label="What brings you here?"
                placeholder=""
                texthelper="When we know what you are trying to do we can help you and personalize information and emails for you!"
              ></Select>
              <Select
                options={[
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
                ]}
                type={"default"}
                multiple={true}
                value={skill}
                onChange={(value: string[]) => {
                  setError({ type: "", text: "" });
                  setSkill(value);
                }}
                label="What describes your best?"
                placeholder=""
                texthelper="When we better understand your skills we can show you the right tutorials and courses."
              ></Select>

              <CheckboxWrapper>
                <CheckBox
                  checked={consent}
                  onChange={(val) => {
                    setError({ type: "", text: "" });
                    setConsent(val);
                  }}
                  style={{ marginTop: "4px" }}
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
            </>
          )}
        </FormContent>
      </FormWrapper>
    </Wrapper>
  ) : null;
};

export default SignInForm;
