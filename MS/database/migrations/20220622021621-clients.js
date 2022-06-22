module.exports = {
    up: (queryInterface, DataTypes) => {
        return queryInterface.createTable('Clients', {
            id: {
                allowNull: false,
                autoIncrement: false,
                primaryKey: true,
                type: DataTypes.UUID,
                unique: true,
            },
            full_name: {
                allowNull: true,
                type: DataTypes.STRING,
            },
            email: {
                allowNull: true,
                type: DataTypes.STRING,
            },
            password: {
                allowNull: false,
                type: DataTypes.STRING,
            },
            phone: {
                allowNull: true,
                type: DataTypes.STRING,
            },
            cpf_number: {
                allowNull: true,
                type: DataTypes.STRING,
            },
            address: {
                allowNull: true,
                type: DataTypes.STRING,
            },
            city: {
                allowNull: true,
                type: DataTypes.STRING,
            },
            state: {
                allowNull: true,
                type: DataTypes.STRING,
            },
            zipcode: {
                allowNull: true,
                type: DataTypes.STRING,
            },
            current_balance: {
                allowNull: true,
                type: DataTypes.FLOAT,
            },
            average_salary: {
                allowNull: true,
                type: DataTypes.FLOAT,
            },
            status: {
                allowNull: true,
                type: DataTypes.STRING,
            },
            createdAt: {
                allowNull: false,
                type: DataTypes.DATE,
            },
            updatedAt: {
                allowNull: false,
                type: DataTypes.DATE,
            },
        });
    },

    down: (queryInterface) => {
        return queryInterface.dropTable('Clients');
    },
};
