import { Column, CreateDateColumn, Entity, Generated, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

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

    @CreateDateColumn()
    updatedAt!:Date;
}
