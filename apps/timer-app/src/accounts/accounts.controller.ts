import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  HttpCode,
  SerializeOptions,
} from '@nestjs/common';
import { Roles } from '../roles/roles.decorator';
import { RoleEnum } from '../roles/roles.enum';
import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { NullableType } from '../utils/types/nullable.type';
import { Account } from '../database/domain/account';

@Roles(RoleEnum.admin)
@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @SerializeOptions({
    groups: ['admin'],
  })
  @Post()
  create(@Body() createAccountDto: CreateAccountDto): Promise<Account> {
    return this.accountsService.create(createAccountDto);
  }

  @SerializeOptions({
    groups: ['admin'],
  })
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(
    @Param('id') id: Account['account_id'],
  ): Promise<NullableType<Account>> {
    return this.accountsService.findOne({ where: { account_id: id } });
  }

  @SerializeOptions({
    groups: ['admin'],
  })
  @Patch(':id')
  async update(
    @Param('id') id: Account['account_id'],
    @Body() updateAccountDto: UpdateAccountDto,
  ): Promise<null> {
    await this.accountsService.update(id, updateAccountDto);
    return null;
  }

  @Delete(':id')
  remove(@Param('id') id: Account['account_id']): Promise<void> {
    return this.accountsService.softDelete(id);
  }
}
