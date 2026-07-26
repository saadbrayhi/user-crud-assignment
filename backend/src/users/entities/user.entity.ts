import { Column, CreateDateColumn, Entity, Generated, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id!:number;

    @Column()
    firstName!:string;

    @Column()
    lastName!:string;

    @Column({unique:true})
    email!:string;

    @CreateDateColumn()
    createdAt!:Date;

    @UpdateDateColumn()
    updatedAt!:Date;
}
