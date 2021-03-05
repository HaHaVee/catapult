import express from "express";
import "reflect-metadata";
import { createConnection } from "typeorm";
import { ClientEntity } from "./entity/ClientEntity";
import { GasMeterEntity } from "./entity/GasMeterEntity";
import { GasMeterReadingEntity } from "./entity/GasMeterReadingEntity";

const app = express();

// create typeorm connection
createConnection()
  .then(async () => {
    app.post("/api/simulate", async ({ res }) => {
      let allGasMeters = await GasMeterEntity.find();

      // find latest reading time
      const [latestReading] = await GasMeterReadingEntity.find({
        order: { date: "DESC" },
        take: 1,
      });
      const latestReadingTime = latestReading ? latestReading.date : undefined;

      // create readings for all gas meters
      for (const gasMeter of allGasMeters) {
        let gasMeterReading = new GasMeterReadingEntity();
        // values from 1 to 100
        gasMeterReading.value = Math.floor(Math.random() * 100) + 1;

        if (!latestReadingTime) {
          gasMeterReading.date = new Date();
        } else {
          // set reading time to 1 hour after the latest reading
          gasMeterReading.date = new Date(
            latestReadingTime.getTime() + 60 * 60 * 1000
          );
        }

        gasMeterReading.gasMeter = gasMeter;

        await gasMeterReading.save();
      }

      res.sendStatus(200);
    });

    app.get("/api/24h", async ({ res }) => {
      const allGasMeters = await GasMeterEntity.find();

      let combinedHourlyGasMeterStatistics = new Array(24).fill(0);

      // sum up all gas meter readings per hour into an array
      for (const meter of allGasMeters) {
        const past24HourReadings = await GasMeterReadingEntity.findGasMeterXPast24HourReadings(
          meter.id
        );

        for (let i = 0; i < past24HourReadings.length; i++) {
          combinedHourlyGasMeterStatistics[i] += past24HourReadings[i].value;
        }
      }

      let prettifiedStatistics = new Array();
      for (let i = 0; i < combinedHourlyGasMeterStatistics.length; i++) {
        prettifiedStatistics.push({
          hour: i + 1,
          value: combinedHourlyGasMeterStatistics[i],
        });
      }

      res.send(prettifiedStatistics);
    });

    app.get("/api/24h/:gasMeterId", async (req, res) => {
      const gasMeterId = req.params.gasMeterId;

      const past24HourReadings = await GasMeterReadingEntity.findGasMeterXPast24HourReadings(
        gasMeterId
      );

      let prettifiedStatistics = new Array();
      for (let i = 0; i < past24HourReadings.length; i++) {
        prettifiedStatistics.push({
          hour: i + 1,
          value: past24HourReadings[i].value,
        });
      }

      res.send(prettifiedStatistics);
    });

    app.get("/api/existingGasMeters", async (req, res) => {
      const existingGasMeters = await GasMeterEntity.find();

      const metersAndClientsPromise = existingGasMeters.map(async (meter) => {
        let client = await ClientEntity.findOne({
          where: { id: meter.clientId },
        });
        return { id: meter.id, client: client?.name };
      });

      const metersAndClients = await Promise.all(metersAndClientsPromise);

      res.send(metersAndClients);
    });
  })
  .catch((error) => console.log(error));

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
