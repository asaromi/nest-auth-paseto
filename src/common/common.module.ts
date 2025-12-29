import { ConfigModule } from '@nestjs/config';
import { Global, Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { WinstonModule } from 'nest-winston';
import winston from 'winston';
import { ErrorHandler } from './error.handler';
import { HelperUtil } from './helper.util';
import { PrismaService } from './prisma.service';
import { ValidationService } from './validation.service';

@Global()
@Module({
  imports: [
    WinstonModule.forRoot({ format: winston.format.json(), transports: [new winston.transports.Console()] }),
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  providers: [{ provide: APP_FILTER, useClass: ErrorHandler }, HelperUtil, PrismaService, ValidationService],
  exports: [HelperUtil, PrismaService, ValidationService],
})
export class CommonModule {}
