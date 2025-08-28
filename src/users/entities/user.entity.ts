import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Role } from "../enums/roles.enum";
import { Category } from "src/categories/entities/category.entity";
import { Expense } from "src/expenses/entities/expense.entity";

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

    @OneToMany(() => Category, (category) => category.createdBy)
    categories: Category[];

    @OneToMany(() => Expense, (expense) => expense.user)
    expenses: Expense[];
}