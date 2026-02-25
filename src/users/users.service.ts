import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
    constructor (
        @InjectRepository(User)
        private readonly usersRepo: Repository<User>,
    ) {}

    async findByEmail(email: string): Promise<User | null> {
        return this.usersRepo.findOne({where: {email} });
    };

    async findById(id: number): Promise<User | null> {
        return this.usersRepo.findOne({ where: { id } });
    }

    async createUser(email: string, hashedPassword: string): Promise<User>{
        const existing = await this.findByEmail(email);
        if(existing) throw new ConflictException('Email Already in use');

        const user = this.usersRepo.create({
            email,
            password: hashedPassword
        })

        return this.usersRepo.save(user);
    }

}
