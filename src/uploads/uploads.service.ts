import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Upload } from './entities/upload.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UploadsService {
    constructor(
        @InjectRepository(Upload)
        private readonly uploadsRepo: Repository<Upload>,
    ){}


    async createForOrder(userId: number, orderId: number, file: Express.Multer.File) {
    const upload = this.uploadsRepo.create({
      userId,
      orderId,
      originalName: file.originalname,
      filename: file.filename,
      mimeType: file.mimetype,
      size: file.size,
      path: `uploads/${file.filename}`,
    });

    return this.uploadsRepo.save(upload);
  }
}
