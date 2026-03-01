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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OrdersService } from './orders.service';
import { UploadsService } from '../uploads/uploads.service';
import { GenerateDto } from './dto/generate.dto';


@ApiTags('Orders')
@ApiBearerAuth()
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
  @ApiOperation({ summary: 'Upload a manufacturing design file with order metadata' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['file'],
      properties: {
        file:          { type: 'string', format: 'binary' },
        title:         { type: 'string' },
        serviceType:   { type: 'string' },
        material:      { type: 'string' },
        dimensions:    { type: 'string' },
        quantity:      { type: 'number' },
        notes:         { type: 'string' },
        paymentMethod: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Order created with uploaded file' })
  @ApiResponse({ status: 400, description: 'File is required' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
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

  @ApiResponse({ status: 201, description: 'Order created with uploaded file' })
  @ApiResponse({ status: 400, description: 'File is required' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
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
  @ApiOperation({ summary: "Get the authenticated user's order history" })
  @ApiResponse({ status: 200, description: 'List of user orders' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
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

@UseGuards(JwtAuthGuard)
@Post('generate')
@ApiOperation({ summary: 'Create a design request (no file required)' })
@ApiBody({ type: GenerateDto })
@ApiResponse({ status: 201, description: 'Design request created successfully' })
@ApiResponse({ status: 401, description: 'Unauthorized' })
async generate(@Req() req: any, @Body() dto: GenerateDto) {
  const userId = req.user.id;
  const order = await this.ordersService.createDesignRequest(userId, dto);

  return {
    success: true,
    data: order,
  };
}
}