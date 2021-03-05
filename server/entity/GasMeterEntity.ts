import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  OneToMany,
  BaseEntity,
} from "typeorm";
import { ClientEntity } from "./ClientEntity";
import { GasMeterReadingEntity } from "./GasMeterReadingEntity";

@Entity("gas_meters")
export class GasMeterEntity extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "text", nullable: true })
  clientId: string | null;

  /** clientRelation */
  @OneToOne((type) => ClientEntity, (client) => client.id, {
    nullable: true,
  })
  @JoinColumn()
  client: ClientEntity | null;

  /** gasMeterReadingRelation */
  @OneToMany((type) => GasMeterReadingEntity, (reading) => reading.gasMeter, {
    nullable: true,
  })
  gasMeterReadings: GasMeterReadingEntity[] | null;
}
