import React, { useEffect } from "react";
import { CircularProgress } from "grindery-ui";
import { useGrinderyLogin } from "use-grindery-login";

type Props = {
  children: React.ReactNode;
};

const UserAuthController = ({ children }: Props) => {
  const { connect, isAuthenticating, token } = useGrinderyLogin();
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    if (!isAuthenticating) {
      setTimeout(() => {
        if (token?.access_token) {
          setLoading(false);
        } else {
          connect();
        }
      }, 1000);
    }
  }, [token, isAuthenticating, connect]);

  if (loading) {
    return (
      <div style={{ textAlign: "center", margin: "80px auto" }}>
        <CircularProgress />
      </div>
    );
  }
  return <>{children}</>;
};

export default UserAuthController;
