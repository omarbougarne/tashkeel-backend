import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/orders.entity';
import { Repository } from 'typeorm';

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
}
