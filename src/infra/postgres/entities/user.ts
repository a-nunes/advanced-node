import { Column, Entity, PrimaryColumn } from 'typeorm';
import { v4 } from 'uuid';

@Entity({ name: 'usuarios' })
export class PgUser {
  @PrimaryColumn()
  id!: string;

  @Column()
  email!: string;

  @Column({ name: 'nome', nullable: true })
  name?: string;

  @Column({ name: 'id_facebook', nullable: true })
  facebookId?: string;

  constructor() {
    if (!this.id) {
      this.id = v4();
    }
  }
}
