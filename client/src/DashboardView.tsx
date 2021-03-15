import { ResponsiveBar } from "@nivo/bar";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { GasMeter } from "./AuthenticatedApp";
import "./dashboardView.css";

interface Props {
  existingGasMeters: GasMeter[] | undefined;
}

export const DashboardView: React.FC<Props> = ({ existingGasMeters }) => {
  let history = useHistory();

  const [combinedReadingsData, setCombinedReadingsData] = useState([]);

  /* fetch initial reading data */
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const response = await fetch("/api/24h");
    const data = await response.json();
    setCombinedReadingsData(data);
  };

  const simulateAndFetchData = async () => {
    await fetch("/api/simulate", { method: "POST" });
    fetchData();
  };

  return (
    <div>
      <h1>Catapult gas meter statistics</h1>
      <button onClick={() => simulateAndFetchData()}>
        Simulate an hour passing
      </button>
      <div className="gas-meter-selection">
        {existingGasMeters && <span>Gas meter: </span>}
        {existingGasMeters &&
          existingGasMeters.map((meter) => (
            <button onClick={() => history.push(`/${meter.id}`)} key={meter.id}>
              {meter.client}
            </button>
          ))}
      </div>

      <div style={{ height: "400px" }}>
        {combinedReadingsData && (
          <ResponsiveBar
            margin={{
              top: 50,
              right: 60,
              bottom: 50,
              left: 60,
            }}
            data={combinedReadingsData}
            keys={["value"]}
            indexBy="hour"
            colors={{ scheme: "set3" }}
            labelSkipHeight={10}
            /* gridYValues={[50, 100, 150, 200, 250, 300]} million errors */
            axisBottom={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: "HOURS PAST",
              legendPosition: "middle",
              legendOffset: 32,
            }}
            axisLeft={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: "COMBINED GAS READING",
              legendPosition: "middle",
              legendOffset: -40,
            }}
            animate={false}
          />
        )}
      </div>
    </div>
  );
};
