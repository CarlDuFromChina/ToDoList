import { ToBoolean } from "src/transformer";
import { Column, CreateDateColumn, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class Task {
  @PrimaryColumn()
  id: string;

  @Column()
  task: string;

  @ToBoolean()
  @Column({ default: false })
  status: boolean;

  @ToBoolean()
  @Column({ default: false })
  star: boolean;

  @Column({ generated: 'increment' })
  order: number;

  @Column()
  user_code: string;

  @CreateDateColumn()
  created_at: Date;
}