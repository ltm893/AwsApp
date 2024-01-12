module.exports = (sequelize, Sequelize) => {
    const { DataTypes } = require("sequelize");
    const Brand = sequelize.define('brand', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        name: DataTypes.STRING,
    });
    return Brand;
}; 
