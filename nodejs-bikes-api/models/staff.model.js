module.exports = (sequelize, Sequelize) => {
    const { DataTypes } = require("sequelize");
    const Staff = sequelize.define('staff', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        first_name: DataTypes.STRING,
        last_name: DataTypes.STRING,
        phone: DataTypes.STRING,
        email: DataTypes.STRING,
        city: DataTypes.STRING,
        state: DataTypes.STRING,
        zipcode: DataTypes.STRING
    });
    return Staff ; 
};