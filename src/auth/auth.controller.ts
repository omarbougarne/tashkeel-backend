import { Controller, Body, Post, Req, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from 'src/common/decorators/public.decorator';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
    constructor (private readonly authService: AuthService){}


    @Get('me')
    me(@Req() req: any) {
        return req.user;
    }
    @Public()
    @Post('register')
    register (@Body() dto: RegisterDto) {
        return this.authService.register(dto.email, dto.password);
    }

    @Public()
    @Post('login')
    login(@Body() dto: LoginDto) {
        return this.authService.login(dto.email, dto.password);
    }
}
