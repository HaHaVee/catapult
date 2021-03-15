import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";

@Entity("users")
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  firstName?: string;

  @Column({ nullable: true })
  lastName?: string;
}
