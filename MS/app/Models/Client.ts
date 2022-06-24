import {Table, Model, Column, DataType} from 'sequelize-typescript';

@Table({
    timestamps: false,
    tableName: 'clients',
})
export class Client extends Model {
    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    full_name!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    email!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    password!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    phone!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    cpf_number!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    address!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    city!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    state!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    zipcode!: string;

    @Column({
        type: DataType.FLOAT,
        allowNull: false,
    })
    current_balance!: number;

    @Column({
        type: DataType.FLOAT,
        allowNull: false,
    })
    average_salary!: number;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    status!: string;

    @Column({
        type: DataType.DATE,
        allowNull: false,
    })
    created_at!: string;

    @Column({
        type: DataType.DATE,
        allowNull: false,
    })
    updated_at!: string;
}
