import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/orders.entity';
import { Repository } from 'typeorm';
import { GenerateDto } from './dto/generate.dto';

@Injectable()
export class OrdersService {
    constructor(
        @InjectRepository(Order) 
        private readonly ordersRepo: Repository<Order>,
    ){}


    async createForUser(userId: number, data: Partial<Order>) {
    const order = this.ordersRepo.create({
      userId,
      ...data,
      paymentStatus: data.paymentStatus ?? 'pending',
      isDesignRequest: data.isDesignRequest ?? false,
    });

    return this.ordersRepo.save(order);
  }

  async findHistoryForUser(userId: number) {
    return this.ordersRepo.find({
      where: { userId },
      relations: ['uploads'],
      order: { createdAt: 'DESC' },
    });
  }

 async createDesignRequest(userId: number, dto: GenerateDto) {
  const order = this.ordersRepo.create({
    userId, 

    serviceType: 'product_design',
    title: dto.title,

    
    dimensions: dto.dimensions || undefined,

    notes: [
      `Description: ${dto.description}`,
      `ProjectType: ${dto.projectType ?? ''}`,
      `Usage: ${dto.usage ?? ''}`,
      `Output: ${dto.outputOption}`,
      dto.notes ? `Notes: ${dto.notes}` : '',
    ]
      .filter(Boolean)
      .join('\n'),

    isDesignRequest: true,

   
    paymentMethod: (dto.paymentMethod ?? 'cash_on_delivery') as any,
    paymentStatus: 'pending',

    
    quantity: 1,
    estimatedPrice: 500,
    depositAmount: 0,
    amountPaid: 0,
  });

  return this.ordersRepo.save(order);
}

}
