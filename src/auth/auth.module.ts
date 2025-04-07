import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy'; 
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],  
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}