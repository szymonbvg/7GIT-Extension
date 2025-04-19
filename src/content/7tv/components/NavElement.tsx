import { useVersion } from "../hooks/useVersion";
import GithubLogo from "../../../assets/github-logo.svg";
import HideOnMobile from "./HideOnMobile";
import { useAuth } from "../hooks/useAuth";

export default function NavElement() {
  const { payload, status } = useAuth();
  const { v2 } = useVersion();

  const redirect = () => {
    window.location.href = import.meta.env.VITE_7GIT_WEBSITE_URL;
  };

  return (
    <>
      {status ? (
        <div id={v2 ? "new-sevengit-user" : "sevengit-user"} onClick={redirect}>
          <div id={v2 ? "new-sevengit-avatar" : "sevengit-avatar"}>
            <img src={payload?.avatar_url} />
          </div>
          <HideOnMobile>
            <p>{payload?.login}</p>
          </HideOnMobile>
        </div>
      ) : (
        <div id={v2 ? "new-sevengit-login" : "sevengit-login"} onClick={redirect}>
          <img src={GithubLogo} />
          <HideOnMobile>
            <p>Login with GitHub to use 7GIT</p>
          </HideOnMobile>
        </div>
      )}
    </>
  );
}
