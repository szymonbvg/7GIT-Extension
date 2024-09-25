import { createContext, ReactNode, useEffect, useState } from "react";
import { Payload } from "../../../structures/Common";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext<{
  token?: string;
  status: boolean;
  payload?: Payload;
}>({
  status: false,
});

type AuthWrapperProps = {
  children: ReactNode;
};

export default function AuthWrapper(props: AuthWrapperProps) {
  const [token, setToken] = useState<string>();
  const [status, setStatus] = useState(false);
  const [payload, setPayload] = useState<Payload>();

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token) as Payload;
        if (decoded.id && decoded.avatar_url && decoded.login) {
          setPayload(decoded);
          setStatus(true);
        }
      } catch (e) {
        console.log("[7GIT] Invalid Token");
      }
    }
  }, [token]);

  useEffect(() => {
    chrome.storage.local.get("7git-token", (res) => {
      setToken(res["7git-token"]);
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        token: token,
        status: status,
        payload: payload,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}
