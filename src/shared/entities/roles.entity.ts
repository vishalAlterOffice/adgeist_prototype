import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('role')
class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 50 })
  role_name: string; // e.g., 'ADMIN', 'MEMBER'
}

export default Role;
