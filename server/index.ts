import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import { createConnection } from "typeorm";
import { OAuth2Client } from "google-auth-library";
import "reflect-metadata";
import { ClientEntity } from "./entity/ClientEntity";
import { GasMeterEntity } from "./entity/GasMeterEntity";
import { GasMeterReadingEntity } from "./entity/GasMeterReadingEntity";
import { UserEntity } from "./entity/UserEntity";

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

const clientId =
  "813326410155-omqteml1cvqdg170eclm2ctilt1mgpd5.apps.googleusercontent.com";
const client = new OAuth2Client(clientId);

// create typeorm connection
createConnection()
  .then(async () => {
    app.post("/api/simulate", checkAuthentication, async ({ res }) => {
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

    /* ALL DAILY READINGS */
    app.get("/api/24h", checkAuthentication, async ({ res }) => {
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

    /* METER X DAILY READINGS */
    app.get("/api/24h/:gasMeterId", checkAuthentication, async (req, res) => {
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

    /* EXISTING GAS METERS */
    app.get("/api/existingGasMeters", checkAuthentication, async (req, res) => {
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

    /* LOGIN */
    app.post("/api/login", async (req, res) => {
      const token = req.body.token;

      if (!token) {
        res.sendStatus(401);
        throw new Error("No token");
      }

      const { email, firstName, lastName } = await googleVerification(
        token,
        res
      );

      /* find existing user or create a new one */
      let account = await UserEntity.findOne({
        where: { email },
      });

      if (!account && email) {
        account = new UserEntity();
        account.email = email;
        account.firstName = firstName;
        account.lastName = lastName;

        await account.save();
      }

      res.cookie("session-token", token, {
        expires: new Date(Date.now() + 3600 * 1000 * 24),
      });

      res.send(account);

      return { req, res };
    });

    /* LOGOUT */
    app.post("/api/logout", async (req, res) => {
      req.user = undefined;

      res.clearCookie("session-token");
      res.sendStatus(200);

      return { req, res };
    });
  })
  .catch((error) => console.error(error));

/* LISTEN TO PORT */
const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

/* RESTRICT API CALLS IF NOT AUTHENTICATED */
async function checkAuthentication(req, res, next) {
  const token = req.cookies["session-token"];

  if (!token) {
    res.sendStatus(401);
    throw new Error("No token");
  }

  const { email, firstName, lastName } = await googleVerification(token, res);

  req.user = { email, firstName, lastName };

  next();
}

async function googleVerification(token: string, res) {
  let email, firstName, lastName;

  /* google verification */
  async function verify() {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: clientId,
    });

    const payload = ticket.getPayload();

    if (!payload) {
      throw new Error("No payload");
    }

    email = payload["email"];
    firstName = payload["given_name"];
    lastName = payload["family_name"];
  }
  await verify().catch(() => {
    res.clearCookie("session-token");
    res.sendStatus(401);
    throw new Error("Cannot verify token");
  });

  return { email, firstName, lastName };
}
