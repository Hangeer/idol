"use strict";

module.exports = function(sequelize, DataTypes) {
    var Nogizaka = sequelize.define("Nogizaka", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name_jp: DataTypes.STRING,
        name_cn: DataTypes.STRING,
        group: DataTypes.STRING,
        birth: DataTypes.STRING,
        blood: DataTypes.STRING,
        constellation: DataTypes.STRING,
        height: DataTypes.STRING,
        status: DataTypes.STRING
    }, {
        timestamps: false,
    });

    return  Nogizaka;
};