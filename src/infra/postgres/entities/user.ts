import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'usuarios' })
export class PgUser {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  email!: string;

  @Column({ name: 'nome', nullable: true })
  name?: string;

  @Column({ name: 'id_facebook', nullable: true })
  facebookId?: string;
}
