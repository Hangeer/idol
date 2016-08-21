const fs = require('fs');
const path = require('path');
const http = require('http');
const cheerio = require('cheerio');
const request = require('request');
const mysql = require('mysql');

let pro = new Promise ((resolve, reject) => {
    let url = `http://www.nogizaka46.com/member/`;
    request(url, (err, res, body) => {
        if (err) {
            reject(err);
        }
        let $ = cheerio.load(body);
        let obj_links = $('.clearfix .unit a');
        let links = Array.prototype.map.call(obj_links, (item, index) => {
            return url + (item.attribs.href).replace(/^\.\//, "");
        });
        resolve(links);
    });
}).then((links) => {
    return Promise.all(links.map((item, index) => {
        return new Promise((resolve, reject) => {
            request(item, (err, res, body) => {
                if (err) {
                    reject(err);
                }

                let $ = cheerio.load(body);
                let data = {};
                let img_url = ``;

                [
                    data.name_jp,
                    data.name_cn,
                    data.group,
                    data.birth,
                    data.blood,
                    data.constellation,
                    data.height,
                    data.status
                ] = [
                    $('.txt h2 span').text(),
                    $('.txt h2').text().replace($('.txt h2 span').text().trim(), ""),
                    `Nokizaka46`,
                    $('.txt dl dd')[0].children[0].data,
                    $('.txt dl dd')[1].children[0].data,
                    $('.txt dl dd')[2].children[0].data,
                    $('.txt dl dd')[3].children[0].data,
                    $('.txt .status').text().replace(/\n+/g, " ")
                ].map(item => {return item.trim()});

                //  获取照片可以写在这儿 反正 = = 异步

                resolve(data);
            });
        });
    })); 
    
}).then((arr) => {
    console.log(arr);
}).catch((err) => {
    console.log(err);
});