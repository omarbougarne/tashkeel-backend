import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
    ) {}

    async register(email: string, password: string){
        const hashed = await bcrypt.hash(password, 10);
        const user = await this.usersService.createUser(email, hashed);

        const payload = {sub: user.id, email: user.email};
        const access_token = await this.jwtService.signAsync(payload);

        return { access_token, user: { id: user.id, email: user.email } };
    }

    async login(email: string, password: string) {
        const user = await this.usersService.findByEmail(email);
        if(!user) throw new UnauthorizedException('Invalid Credentials');

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) throw new UnauthorizedException('Invalid Credentials');

        const payload = { sub: user.id, email: user.email };
        const access_token = await this.jwtService.signAsync(payload);

        return { access_token, user: { id: user.id, email: user.email } };
    }
}
