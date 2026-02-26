import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Upload } from '../../uploads/entities/upload.entity'

export type ServiceType = '3d_printing' | 'cnc_cutting' | 'sheet_metal' | 'product_design';
export type PaymentMethod = 'full_payment' | 'cash_on_delivery';
export type PaymentStatus = 'pending' | 'deposit_paid' | 'fully_paid';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: number;

  @Column({ type: 'varchar' })
  serviceType: ServiceType;

  @Column()
  title: string;

  @Column({ nullable: true })
  material: string;

  @Column({ nullable: true })
  dimensions: string;

  @Column({ type: 'int', default: 1 })
  quantity: number;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'float', default: 0 })
  estimatedPrice: number;

  @Column({ default: false })
  isDesignRequest: boolean;

  @Column({ type: 'varchar', nullable: true })
  paymentMethod: PaymentMethod;

  @Column({ type: 'varchar', default: 'pending' })
  paymentStatus: PaymentStatus;

  @Column({ type: 'float', default: 0 })
  depositAmount: number;

  @Column({ type: 'float', default: 0 })
  amountPaid: number;

  @OneToMany(() => Upload, (u) => u.order)
  uploads: Upload[];

  @CreateDateColumn()
  createdAt: Date;
}