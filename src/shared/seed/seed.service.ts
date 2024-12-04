import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../entities/roles.entity';
import { defaultRoles } from '../util/roles';

@Injectable()
export class SeedService implements OnModuleInit {
  constructor(
    @InjectRepository(Role)
    private roleRepo: Repository<Role>,
  ) {}

  async onModuleInit() {
    await this.seedRoles();
  }

  private async seedRoles() {
    try {
      const existingRoles = await this.roleRepo.count();

      if (existingRoles === 0) {
        const roles = defaultRoles.map((roleName) =>
          this.roleRepo.create({ role_name: roleName }),
        );
        await this.roleRepo.save(roles);
        console.log('Default roles seeded successfully.');
      } else {
        console.log('Roles already exist.');
      }
    } catch (error) {
      console.error('Error seeding roles:', error);
    }
  }
}
