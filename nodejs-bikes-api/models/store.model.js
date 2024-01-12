module.exports = (sequelize, Sequelize) => {
    const { DataTypes } = require("sequelize");
    const Store = sequelize.define('store', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        phone: DataTypes.STRING,
        email: DataTypes.STRING,
        name: DataTypes.STRING,
        street: DataTypes.STRING,
        city: DataTypes.STRING,
        state: DataTypes.STRING,
        zipcode: DataTypes.STRING
    });
    return Store ; 
};
