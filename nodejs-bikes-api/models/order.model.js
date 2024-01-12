module.exports = (sequelize, Sequelize) => {
    const { DataTypes } = require("sequelize");
    const Order = sequelize.define('order', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        order_status: DataTypes.STRING,
        order_date: DataTypes.DATE,
        required_date: DataTypes.DATE,
        shipped_date: DataTypes.DATE,
    });
    return Order ;
};