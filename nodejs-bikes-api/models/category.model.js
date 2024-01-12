module.exports = (sequelize, Sequelize) => {
    const { DataTypes } = require("sequelize");
    const Category = sequelize.define('category', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        name: DataTypes.STRING,
    });
    return Category;
};