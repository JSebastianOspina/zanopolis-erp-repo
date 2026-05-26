import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
  Query,
} from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { SearchClientDto } from './dto/search-client.dto';
import type { IClientService } from '../../domain/input-ports/client.service.interface';
import { ClientService } from '../../application/client.service';
import { UserId } from '@/common/decorators/user-id.decorator';
import { JsonApiSerializer } from '@/common/utils/json-api';
import {
  ApplyCreateClientDocs,
  ApplySearchClientsDocs,
  ApplyGetClientByIdDocs,
  ApplyUpdateClientDocs,
  ApplyDeleteClientDocs,
} from '../../../../../docs/api/v1/client/client.swagger';

@Controller('clients')
export class ClientController {
  constructor(
    @Inject(ClientService)
    private readonly clientService: IClientService,
  ) {}

  @ApplyCreateClientDocs()
  @Post()
  async create(
    @Body() createClientDto: CreateClientDto,
    @UserId() userId: string,
  ) {
    const result = await this.clientService.create(createClientDto, userId);
    return JsonApiSerializer.serialize(result);
  }

  @ApplySearchClientsDocs()
  @Get()
  async search(
    @Query() searchParams: SearchClientDto,
    @UserId() userId: string,
  ) {
    const paginationParams = {
      limit: searchParams.limit,
      offset: searchParams.offset,
    };
    const result = await this.clientService.search({}, paginationParams, {
      userId,
    });
    return JsonApiSerializer.serializeMany(result);
  }

  @ApplyGetClientByIdDocs()
  @Get(':id')
  async getById(@Param('id') id: string) {
    const result = await this.clientService.get(id);
    return JsonApiSerializer.serialize(result);
  }

  @ApplyUpdateClientDocs()
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateClientDto: UpdateClientDto,
  ) {
    const result = await this.clientService.update(id, updateClientDto);
    return JsonApiSerializer.serialize(result);
  }

  @ApplyDeleteClientDocs()
  @Delete(':id')
  async delete(@Param('id') id: string, @UserId() userId: string) {
    await this.clientService.delete(id, userId);
    return { message: 'Entity deleted successfully' };
  }
}
