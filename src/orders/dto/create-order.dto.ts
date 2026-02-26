import { IsIn, IsInt, IsOptional, IsString, Min } from 'class-validator';
import type { PaymentMethod, ServiceType } from '../entities/orders.entity';

export class CreateOrderDto {
  @IsString()
  title: string;

  @IsIn(['3d_printing', 'cnc_cutting', 'sheet_metal', 'product_design'])
  serviceType: ServiceType;

  @IsOptional()
  @IsString()
  material?: string;

  @IsOptional()
  @IsString()
  dimensions?: string;

  @IsInt()
  @Min(1)
  quantity: number;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsIn(['full_payment', 'cash_on_delivery'])
  paymentMethod?: PaymentMethod;
}