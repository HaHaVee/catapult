import { createConnection } from "typeorm";
import { ClientEntity } from "../entity/ClientEntity";
import { GasMeterEntity } from "../entity/GasMeterEntity";

createConnection()
  .then(async (connection) => {
    let client1 = new ClientEntity();
    let gasMeter1 = new GasMeterEntity();
    client1.name = "Euronics";
    gasMeter1.client = client1;

    let client2 = new ClientEntity();
    let gasMeter2 = new GasMeterEntity();
    client2.name = "Hiiu pubi";
    gasMeter2.client = client2;

    let client3 = new ClientEntity();
    let gasMeter3 = new GasMeterEntity();
    client3.name = "Circle K";
    gasMeter3.client = client3;

    let client4 = new ClientEntity();
    let gasMeter4 = new GasMeterEntity();
    client4.name = "Saku Suurhall";
    gasMeter4.client = client4;

    let client5 = new ClientEntity();
    let gasMeter5 = new GasMeterEntity();
    client5.name = "A. Le Coq Arena";
    gasMeter5.client = client5;

    let client6 = new ClientEntity();
    let gasMeter6 = new GasMeterEntity();
    client6.name = "Polpo";
    gasMeter6.client = client6;

    let client7 = new ClientEntity();
    let gasMeter7 = new GasMeterEntity();
    client7.name = "Tartu linnavalitsus";
    gasMeter7.client = client7;

    let client8 = new ClientEntity();
    let gasMeter8 = new GasMeterEntity();
    client8.name = "Ramirent";
    gasMeter8.client = client8;

    let client9 = new ClientEntity();
    let gasMeter9 = new GasMeterEntity();
    client9.name = "SynLab";
    gasMeter9.client = client9;

    let client10 = new ClientEntity();
    let gasMeter10 = new GasMeterEntity();
    client10.name = "Rocca Al Mare keskus";
    gasMeter10.client = client10;

    await connection.manager.save([
      client1,
      gasMeter1,
      client2,
      gasMeter2,
      client3,
      gasMeter3,
      client4,
      gasMeter4,
      client5,
      gasMeter5,
      client6,
      gasMeter6,
      client7,
      gasMeter7,
      client8,
      gasMeter8,
      client9,
      gasMeter9,
      client10,
      gasMeter10,
    ]);
  })
  .catch((error) => console.log(error));
