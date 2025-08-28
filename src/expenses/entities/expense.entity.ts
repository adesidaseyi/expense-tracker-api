import { Category } from 'src/categories/entities/category.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Expense {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.expenses, { nullable: false })
  user: User;

  @ManyToOne(() => Category, (category) => category.expenses, {
    nullable: false,
  })
  category: Category;

  @Column()
  amount: number;

  @Column()
  currency: string;

  @Column()
  note?: string;

  @Column({ type: 'timestamptz' })
  spentAt: Date;

  @Column()
  receiptUrl?: string;

  @CreateDateColumn()
  createdAt: Date;
}
