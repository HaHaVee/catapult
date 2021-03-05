import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  BaseEntity,
} from "typeorm";
import { GasMeterEntity } from "./GasMeterEntity";

@Entity("gas_meter_readings")
export class GasMeterReadingEntity extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  gasMeterId: string;

  @Column()
  value: number;

  @CreateDateColumn({ type: "timestamptz" })
  date: Date;

  /** gasMeterRelation */
  @ManyToOne(
    (type) => GasMeterEntity,
    (gasMeter) => gasMeter.gasMeterReadings,
    {
      nullable: true,
    }
  )
  gasMeter: GasMeterEntity | null;

  public static async findGasMeterXPast24HourReadings(gasMeterId: string) {
    return await this.find({
      where: {
        gasMeterId,
      },
      order: { date: "DESC" },
      take: 24,
    });
  }
}
