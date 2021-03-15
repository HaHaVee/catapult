import { GoogleLogout } from "react-google-login";
import { User } from "./App";
import "./header.css";

interface Params {
  user: User | undefined;
  setUser: React.Dispatch<React.SetStateAction<User | undefined>>;
}

export const Header: React.FC<Params> = ({ user, setUser }) => {
  const onGoogleLogoutSuccess = async () => {
    await fetch("/api/logout", {
      method: "POST",
    });

    setUser(undefined);
  };

  const onGoogleLogoutFailure = () => {
    console.error("logout failure");
  };

  return (
    <>
      {user && <span className="user-info">Logged in as {user.firstName}</span>}

      <GoogleLogout
        clientId="813326410155-omqteml1cvqdg170eclm2ctilt1mgpd5.apps.googleusercontent.com"
        buttonText="Sign out"
        onLogoutSuccess={onGoogleLogoutSuccess}
        onFailure={onGoogleLogoutFailure}
      />
    </>
  );
};
