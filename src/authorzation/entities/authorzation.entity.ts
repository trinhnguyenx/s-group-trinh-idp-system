import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, JoinColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity({ name: 'author' })
export class Author {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    user_id: number;

    @Column()
    client_id: string;

    @Column()
    secret_id: string;

    @Column()
    URI_callback: string;

    @Column()
    scope: string;
    @ManyToOne(() => User, { nullable: false }) 
    @JoinColumn({ name: 'user_id' }) 
    user: User;
}
