/*
*   index.js 挂载在 '/' 路径下面
* */

const express = require('express');
const router = express.Router();
const models = require('../models');

router.get('/', (req, res) => {

  models.Member.findAll().then((data) => {
    let members = [];

    data.forEach((item, index) => {
      members.push(item.dataValues);
    });

    res.render('index', {
      title: 'Home page',
      members: members
    });
  });
  
});

/**
 *  hbs 会自动寻找模板文件夹下的 layouts.hbs 作为默认入口
 *  title 什么的直接写在里面
 */

module.exports = router;