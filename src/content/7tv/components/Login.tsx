import GithubLogo from "../../../assets/github-logo.svg";

export default function Login() {
  const redirect = () => {
    window.location.href = import.meta.env.VITE_7GIT_WEBSITE_URL;
  };

  return (
    <div id="sevengit-login" onClick={redirect}>
      <img src={GithubLogo} id="github-login-logo" />
      <p>Login with GitHub to use 7GIT</p>
    </div>
  );
}
