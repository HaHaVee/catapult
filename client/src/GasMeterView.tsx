import { ResponsiveBar } from "@nivo/bar";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { GasMeter } from "./App";

interface Props {
  existingGasMeters: GasMeter[] | undefined;
}

export const GasMeterView: React.FC<Props> = ({ existingGasMeters }) => {
  const params = useParams();
  const [readingData, setReadingData] = useState([]);
  const [gasMeter, setGasMeter] = useState<any>();

  /* fetch initial reading data */
  useEffect(() => {
    fetchData();
  }, []);

  // find selected gas meter
  useEffect(() => {
    if (!existingGasMeters) {
      return;
    }

    const gasMeter = existingGasMeters.find(
      (meter) => meter.id === params.gasMeterId
    );
    setGasMeter(gasMeter);
  }, [existingGasMeters]);

  const fetchData = async () => {
    const response = await fetch(`/api/24h/${params.gasMeterId}`);
    const data = await response.json();
    setReadingData(data);
  };

  return (
    <div>
      <h1>Gas meter id: {params.gasMeterId}</h1>
      <h1>Client: {gasMeter ? gasMeter.client : "-"}</h1>
      <div style={{ height: "400px" }}>
        {readingData && (
          <ResponsiveBar
            margin={{
              top: 50,
              right: 60,
              bottom: 50,
              left: 60,
            }}
            data={readingData}
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
              legend: "GAS READING",
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
