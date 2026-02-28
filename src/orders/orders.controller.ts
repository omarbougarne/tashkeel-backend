import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Get,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OrdersService } from './orders.service';
import { UploadsService } from '../uploads/uploads.service';

@Controller('orders')
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly uploadsService: UploadsService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (_req, file, cb) => {
          const ext = extname(file.originalname);
          const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
          cb(null, unique);
        },
      }),
    }),
  )
  async uploadOrder(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: any,
    @Req() req: any,
  ) {
    if (!file) throw new BadRequestException('file is required');

    const userId = req.user.id;

    const order = await this.ordersService.createForUser(userId, {
      title: body.title,
      serviceType: body.serviceType,
      material: body.material,
      dimensions: body.dimensions,
      quantity: Number(body.quantity ?? 1),
      notes: body.notes,
      paymentMethod: body.paymentMethod,
      paymentStatus: 'pending',
      estimatedPrice: 0,
      isDesignRequest: false,
      depositAmount: 0,
      amountPaid: 0,
    });

    const upload = await this.uploadsService.createForOrder(userId, order.id, file);

    return {
      success: true,
      data: {
        order,
        upload: {
          id: upload.id,
          originalName: upload.originalName,
          mimeType: upload.mimeType,
          size: upload.size,
          path: `/${upload.path}`,
          createdAt: upload.createdAt,
        },
      },
    };
  }

  @UseGuards(JwtAuthGuard)
@Get('history')
async history(@Req() req: any) {
  const userId = req.user.id;
  const orders = await this.ordersService.findHistoryForUser(userId);

  
  return orders.map((o) => ({
    id: String(o.id),
    order_number: `ORD-${o.id}`,
    title: o.title,
    service_type: o.serviceType,
    status: 'received',                    
    estimated_price: o.estimatedPrice ?? null,
    created_at: o.createdAt,
    is_design_request: o.isDesignRequest,
    can_cancel: true,                      
    payment_status: o.paymentStatus ?? 'pending',
    amount_paid: o.amountPaid ?? 0,
    uploads: o.uploads ?? [],
  }));
}
}