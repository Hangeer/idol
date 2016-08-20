const fs = require('fs');
const path = require('path');
const http = require('http');
const cheerio = require('cheerio');
const request = require('request');
const mysql = require('mysql');

let site_url = `http://www.nogizaka46.com/member/`;

function getLinks (url) {
    request(url, (err, res, body) => {
        if (!err && res.statusCode == 200) {
            let $ = cheerio.load(body);
            let obj_links = $('.clearfix .unit a');
            let links = Array.prototype.map.call(obj_links, (item, index) => {
                return url + (item.attribs.href).replace(/^\.\//, "");
            });

            getInfo(links[0]);
            //console.log(links[0]);
        }
    });
}

function getInfo (link) {
    request(link, (err, res, body) => {
        let $ = cheerio.load(body);
        let data = {};
        let img_url = ``;

        data.name_jp = $('.txt h2 span').text().trim();
        data.name_cn = $('.txt h2').text()).replace($('.txt h2 span').text().trim(), "").trim();
        
    });
}

getLinks(site_url);