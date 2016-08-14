"use strict";

module.exports = function(sequelize, DataTypes) {
  var Member = sequelize.define("Member", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: DataTypes.STRING,
    gender: DataTypes.STRING,
    group: DataTypes.STRING,
    age: DataTypes.STRING
  }, {
    classMethods: {
      
    }
  });

  return Member;
};