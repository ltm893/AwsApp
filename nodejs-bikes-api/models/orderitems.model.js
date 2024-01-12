module.exports = (sequelize, Sequelize) => {
    const { DataTypes } = require("sequelize");
    const OrderItem = sequelize.define('orderitems', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        quantity: DataTypes.INTEGER
    });
    return OrderItem ;
};