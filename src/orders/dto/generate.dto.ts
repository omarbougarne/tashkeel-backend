import { IsIn, IsOptional, IsString, MaxLength } from 'class-validator';

export class GenerateDto {
  @IsString()
  @MaxLength(120)
  title: string;

  @IsString()
  @MaxLength(5000)
  description: string;

  @IsIn(['product', 'prototype', 'part', 'custom'])
  projectType: 'product' | 'prototype' | 'part' | 'custom';

  @IsOptional()
  @IsString()
  @MaxLength(500)
  usage?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  dimensions?: string;

  @IsIn(['design_only', 'design_and_manufacturing'])
  outputOption: 'design_only' | 'design_and_manufacturing';

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  notes?: string;

  @IsOptional()
  @IsIn(['full_payment', 'cash_on_delivery'])
  paymentMethod?: 'full_payment' | 'cash_on_delivery';
}