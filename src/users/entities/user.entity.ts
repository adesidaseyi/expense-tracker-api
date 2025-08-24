import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Role } from "../enums/roles.enum";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column({ enum: Role, default: Role.USER })
    role: Role;
}