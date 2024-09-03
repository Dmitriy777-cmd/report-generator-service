import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Report {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  serviceName: string;

  @Column()
  endpoint: string;

  @Column()
  headers: string;

  @Column({ default: 'pending' })
  status: string;

  @Column({ nullable: true })
  fileUrl: string;
}
