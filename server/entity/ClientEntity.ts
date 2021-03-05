import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  BaseEntity,
} from "typeorm";
import { GasMeterEntity } from "./GasMeterEntity";

@Entity("clients")
export class ClientEntity extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true })
  name: string;

  /** gasMeterRelation */
  @OneToOne((type) => GasMeterEntity, (gasMeter) => gasMeter.id, {
    nullable: true,
  })
  gasMeter: GasMeterEntity | null;
}
