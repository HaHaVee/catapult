import { GoogleLogin } from "react-google-login";
import { User } from "./App";
import "./unauthenticatedApp.css";

interface Params {
  setUser: React.Dispatch<React.SetStateAction<User | undefined>>;
}

export const UnauthenticatedApp: React.FC<Params> = ({ setUser }) => {
  const onGoogleLoginSuccess = async (response) => {
    const loginResponse = await fetch("/api/login", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token: response.tokenId }),
    });

    const data = await loginResponse.json();

    setUser({
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
    });
  };

  const onGoogleLoginFailure = (response) => {
    console.error(response);
  };

  return (
    <div className="login-container">
      <h2>Please authenticate yourself</h2>
      <GoogleLogin
        clientId="813326410155-omqteml1cvqdg170eclm2ctilt1mgpd5.apps.googleusercontent.com"
        buttonText="Sign In with Google"
        onSuccess={onGoogleLoginSuccess}
        onFailure={onGoogleLoginFailure}
        cookiePolicy={"single_host_origin"}
      />
    </div>
  );
};
