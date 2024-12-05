import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedService } from './seed.service';
import Role from '../entities/roles.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Role])],
  providers: [SeedService],
  exports: [SeedService],
})
export class SeedsModule {}
