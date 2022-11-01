import React from "react";
import { Snackbar } from "grindery-ui";
import useConnectorContext from "../../hooks/useConnectorContext";

type Props = {
  children: React.ReactNode;
};

const SnackbarContainer = (props: Props) => {
  const { children } = props;
  const {
    state: { snackbar },
  } = useConnectorContext();
  return (
    <>
      {children}
      <Snackbar
        open={snackbar.opened}
        handleClose={snackbar.onClose}
        message={snackbar.message}
        hideCloseButton
        autoHideDuration={2000}
        severity={snackbar.severity || "success"}
      />
    </>
  );
};

export default SnackbarContainer;
