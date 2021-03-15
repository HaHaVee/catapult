import { useEffect, useState } from "react";
import { AuthenticatedApp } from "./AuthenticatedApp";
import { UnauthenticatedApp } from "./UnauthenticatedApp";

export interface User {
  email: string;
  firstName: string | undefined;
  lastName: string | undefined;
}

export const App = () => {
  const [user, setUser] = useState<User>();

  /* login/stay logged in if cookie is provided */
  useEffect(() => {
    const token = getCookie("session-token");

    if (!token) {
      setUser(undefined);
      return;
    }

    login(token);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  async function login(token: string) {
    const loginResponse = await fetch("/api/login", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
    });

    const data = await loginResponse.json();

    if (data.email === user?.email) {
      return;
    }

    setUser({
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
    });
  }

  return user ? (
    <AuthenticatedApp user={user} setUser={setUser} />
  ) : (
    <UnauthenticatedApp setUser={setUser} />
  );
};

// https://www.w3schools.com/js/js_cookies.asp
function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) === " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}
