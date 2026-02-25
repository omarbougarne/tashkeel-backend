import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import type { StringValue } from 'ms';
@Module({
    imports: [
        PassportModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService): JwtModuleOptions => {
                const secret = configService.get<string>('JWT_SECRET');
                if (!secret) throw new Error('JWT_SECRET is missing in environment variables');
                const expiresIn = (configService.get<string>('JWT_EXPIRES_IN') ?? '1d') as StringValue;

                return {
                    secret,
                    signOptions: {
                        expiresIn,
                    },
                };
            },
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy],
    exports: [JwtModule],
})
export class AuthModule { }
