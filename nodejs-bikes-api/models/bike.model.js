module.exports = (sequelize, Sequelize) => {
    const { DataTypes } = require("sequelize");
    const Bike = sequelize.define('bike', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: true,
                notEmpty: true
            }
        },
        year: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: true,
                notEmpty: true
            }
        },
        price: {
            type: DataTypes.DOUBLE,
            allowNull: false,
            validate: {
                notNull: true,
                notEmpty: true

            }
        },
    });
    return Bike;
};

