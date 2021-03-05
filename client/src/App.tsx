import { useEffect, useState } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { DashboardView } from "./DashboardView";
import { GasMeterView } from "./GasMeterView";

export interface GasMeter {
  id: string;
  client: string;
}

export const App = () => {
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
