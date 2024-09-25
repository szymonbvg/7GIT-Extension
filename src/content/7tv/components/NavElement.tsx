import { useContext } from "react";
import { AuthContext } from "./AuthWrapper";
import Login from "./Login";

export default function NavElement() {
  const { payload, status } = useContext(AuthContext);

  const redirect = () => {
    window.location.href = import.meta.env.VITE_7GIT_WEBSITE_URL;
  };

  return (
    <>
      {status ? (
        <div id="sevengit-user" onClick={redirect}>
          <div id="sevengit-avatar">
            <img src={payload?.avatar_url} />
          </div>
          <p>{payload?.login}</p>
        </div>
      ) : (
        <Login />
      )}
    </>
  );
}
