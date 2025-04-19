import { ReactNode, useEffect, useState } from "react";
import { Payload } from "../../../structures/Common";
import { jwtDecode } from "jwt-decode";
import AuthContext from "../contexts/AuthContext";

export default function AuthProvider(props: { children?: ReactNode }) {
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
        token,
        status,
        payload,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}
