import React, { useEffect, useState } from "react";
import { useGrinderyNexus } from "use-grindery-nexus";
import styled from "styled-components";
import { useNavigate, useSearchParams } from "react-router-dom";
import { SCREEN, isLocalOrStaging } from "../../constants";
import Logo from "../shared/Logo";
import SignInForm from "../shared/SignInForm";
import useSignInContext from "../../hooks/useSignInContext";
import ConfirmEmailMessage from "../shared/ConfirmEmailMessage";
import WorkspaceSelectorMini from "../shared/WorkspaceSelectorMini";
import ConnectMetamaskOld from "../shared/ConnectMetamaskOld";

type Props = {};

const SignInPageRedirect = (props: Props) => {
  useEffect(() => {
    const search = document.location.search;
    window.location.href = `${
      isLocalOrStaging
        ? "https://login-staging.grindery.io"
        : "https://login.grindery.io"
    }${search}`;
  }, []);
  return <></>;
};

export default SignInPageRedirect;
