import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { AccountsService } from '../../accounts/accounts.service';
import { JWTPayload } from '../types/jwt.payload';
import { AccountMapper } from '@app/database/mongoose/mappers/account.mapper';
import { RefreshTokenOuputDto } from '../dtos/refresh-token.dto';

const EXPIRE_TIME = 20 * 60 * 1000; // 20분

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly accountsService: AccountsService,
  ) {}

  async validateAccount(email: string, pass: string): Promise<any> {
    const account = await this.accountsService.findOneByEmail(email);
    if (account && bcrypt.compareSync(pass, account.password)) {
      return account;
    }
    return null;
  }

  refreshToken(_payload: any): RefreshTokenOuputDto {
    if (!_payload || !_payload.sub || !_payload.email || !_payload.role) {
      throw new BadRequestException();
    }

    const payload: JWTPayload = {
      sub: _payload.sub,
      email: _payload.email,
      role: _payload.role,
    };

    return {
      access_token: this.jwtService.sign(payload, {
        secret: this.configService.get('JWT_SECRET'),
        expiresIn: '20m',
      }),
      refresh_token: this.jwtService.sign(payload, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
        expiresIn: '30d',
      }),
      expiresIn: new Date().setTime(new Date().getTime() + EXPIRE_TIME),
    };
  }

  login(account: any) {
    if (!account || !account.account_id || !account.email || !account.role) {
      throw new BadRequestException();
    }
    const payload: JWTPayload = {
      sub: account.account_id,
      email: account.email,
      role: account.role,
    };

    return {
      account: AccountMapper.toDto(account),
      access_token: this.jwtService.sign(payload, {
        secret: this.configService.get('JWT_SECRET'),
        expiresIn: '20m',
      }),
      refresh_token: this.jwtService.sign(payload, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
        expiresIn: '30d',
      }),
      expiresIn: new Date().setTime(new Date().getTime() + EXPIRE_TIME),
    };
  }
}
