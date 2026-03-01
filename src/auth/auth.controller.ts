import { Controller, Body, Post, Req, Get } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { Public } from 'src/common/decorators/public.decorator';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor (private readonly authService: AuthService){}


    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get current authenticated user' })
    @ApiResponse({ status: 200, description: 'Returns the current user from JWT' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @Get('me')
    me(@Req() req: any) {
        return req.user;
    }
    
    
    @Public()
    @ApiOperation({ summary: 'Register a new user' })
    @ApiBody({ type: RegisterDto })
    @ApiResponse({ status: 201, description: 'User registered successfully' })
    @ApiResponse({ status: 409, description: 'Email already in use' })
    @Post('register')
    register (@Body() dto: RegisterDto) {
        return this.authService.register(dto.email, dto.password);
    }

    @Public()
    @ApiOperation({ summary: 'Log in and receive a JWT' })
    @ApiBody({ type: LoginDto })
    @ApiResponse({
        status: 200,
        description: 'Returns access token and user info',
        schema: {
        example: {
            access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
            user: { id: 1, email: 'omar@test.com' },
        },
        },
    })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
    @Post('login')
    login(@Body() dto: LoginDto) {
        return this.authService.login(dto.email, dto.password);
    }
}
