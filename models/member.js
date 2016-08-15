"use strict";

module.exports = function(sequelize, DataTypes) {
  var Member = sequelize.define("Member", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name_jp: DataTypes.STRING,
    name_cn: DataTypes.STRING,
    name_en: DataTypes.STRING,
    group: DataTypes.STRING,
    birth: DataTypes.STRING,
    constellation: DataTypes.STRING,
    height: DataTypes.STRING,
    birthplace: DataTypes.STRING,
    blood: DataTypes.STRING
  }, {
    classMethods: {
      
    }
  });

  return Member;
};