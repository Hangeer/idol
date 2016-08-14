"use strict";

module.exports = function(sequelize, DataTypes) {
  let User = sequelize.define("User", {
    username: DataTypes.STRING,
    gender: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        User.hasMany(models.Task)
      }
    }
  });

  return User;
};