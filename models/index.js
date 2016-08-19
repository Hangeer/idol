/**
 * [Sequelize 大写的是引入的模块]
 * sequelize 小写的是创建的对象
 */
"use strict";

const path = require('path');
const fs = require('fs');
const Sequelize = require('sequelize');
var config    = require(path.join(__dirname, '..', 'config', 'config.json'));

let db = {};

//let sequelize = new Sequelize(
//    'chat',     //  数据库名
//    'root',     //  用户名
//    'fuck',     //  passworld
//    {
//        'dialect': 'mysql',     //  数据库类型
//        'host': 'localhost',    //  数据库 host
//        'port': 1469,           //  端口
//        'define': {
//            'underscored': true
//        }
//    });
let sequelize = new Sequelize(config.database, config.username, config.password, config);
/**
 *  db 暴露出的模块对象
 *  sequelize 创建一个对象，config 如上
 *  ++  (待修改) 建议把数据库配置放到单独的配置文件里面 config.json
 */

fs.readdirSync(__dirname)
    .filter((file) => {
        return (file.indexOf(".") !== 0) && (file !== "index.js");
    })
    .forEach((file) => {
        let model = sequelize.import(path.join(__dirname, file));
        db[model.name] = model;
    });

/**
 *  读取当前目录下的文件
 *  除开隐藏文件和自身(index.js)
 *  把其他文件变成 sequelize 的 model
 */

Object.keys(db).forEach((modelName) => {
    if ("associate" in db[modelName]) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;

/**
 *  项目运行的时候会先看是否有 models 下对应的 table
 *  如果没有，自动创建表
 */