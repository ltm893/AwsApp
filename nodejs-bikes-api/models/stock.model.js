module.exports = (sequelize, Sequelize) => {
    const { DataTypes } = require("sequelize");
    const Stock = sequelize.define('stock', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        quantity: DataTypes.INTEGER,
    });
    return Stock;
};
