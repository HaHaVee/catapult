import { useEffect, useState } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { User } from "./App";
import { DashboardView } from "./DashboardView";
import { GasMeterView } from "./GasMeterView";
import { Header } from "./Header";

interface Params {
  user: User | undefined;
  setUser: React.Dispatch<React.SetStateAction<User | undefined>>;
}

export interface GasMeter {
  id: string;
  client: string;
}

export const AuthenticatedApp: React.FC<Params> = ({ user, setUser }) => {
  /* fetch gas meters */
  useEffect(() => {
    fetchGasMeters();
  }, []);

  const [existingGasMeters, setExistingGasMeters] = useState<GasMeter[]>([]);

  const fetchGasMeters = async () => {
    const response = await fetch("/api/existingGasMeters");
    const data = await response.json();
    setExistingGasMeters(data);
  };

  return (
    <BrowserRouter>
      <Header user={user} setUser={setUser} />
      <Switch>
        <Route path="/" exact>
          <DashboardView
            existingGasMeters={
              existingGasMeters.length > 0 ? existingGasMeters : undefined
            }
          />
        </Route>
        <Route path="/:gasMeterId" exact>
          <GasMeterView
            existingGasMeters={
              existingGasMeters.length > 0 ? existingGasMeters : undefined
            }
          />
        </Route>
      </Switch>
    </BrowserRouter>
  );
};
