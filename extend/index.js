const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');
const request = require('request');
const mysql = require('mysql');

let num = ``;
let site_url = ``;
let img_url = ``;
let arr = [];
let promise_arr = [];
let max_num = 35;
/**
 *  num 计数器 用来记录当前的 member
 *  site_url 网站 URL
 *  img_url 图片 url
 *  arr 用来存 member 的信息
 *  promise_arr 用来存 promise 数组
 *  max_num 循环次数
 */

 let connection = mysql.createConnection({
     host: 'localhost',
     port: '1469',
     user: 'root',
     password: 'fuck',
     database: 'chat'
 });
 connection.connect((err) => {
     if (err) {
         console.error('error connecting: ' + err.stack);
         return;
     }
 });
 connection.query('TRUNCATE  TABLE Members', (err) => {
     if (err) {
         throw err;
     }
     console.log('Clear table');
 });
 /**
  *  连接 mysql
  */

function getData (site_url, img_url) {
    return new Promise ((resolve, reject) => {
            request(site_url, (err, res, body) => {
            if (!err && res.statusCode == 200) {
                $ = cheerio.load(body);
                if (($('p.furigana').text().trim().length) > 0) {   
                    let data = {};   
                    data.name_jp = $('p.furigana').text().trim();
                    data.name_cn = $('p.name').text().trim();
                    data.name_en = $('span.en').text().trim();
                    data.group = 'keyakizaka46';
                    data.birth = $('.box-info dl dt')[0].children[0].data.trim();
                    data.constellation = $('.box-info dl dt')[1].children[0].data.trim();
                    data.height = $('.box-info dl dt')[2].children[0].data.trim();
                    data.birthplace = $('.box-info dl dt')[3].children[0].data.trim();
                    data.blood = $('.box-info dl dt')[4].children[0].data.trim();
                    
                    let query = 'INSERT INTO Members SET ?';
                    connection.query(query, data, (err) => {
                        if (err) {
                            throw err;
                        }
                        console.log('insert success');
                    });

                    getImg (img_url, 
                        `${data.name_cn}.jpg`, 
                        path.resolve(__dirname, "../public", 
                        "images", 
                        "keyakizaka46"), 
                        (err) => {
                            if (err) {
                                throw err;
                            } else {
                                console.log(`Member ${data.name_cn} file && img get`);
                            }
                        });
                }
                resolve();
            }
        });
    });
}

function getImg (img_url, filename, pathname, callback) {
    request(img_url)
        .pipe(fs.createWriteStream(pathname + '/' + filename))
        .on('close', callback);
}

for (let i = 1; i <= max_num; i ++) {
        i < 10 
            ? num = '0' + i 
            : num = i;

            site_url = `http://www.keyakizaka46.com/mob/arti/artiShw.php?site=k46o&ima=1131&cd=${num}`;
            img_url = `http://www.keyakizaka46.com/img/14/orig/k46o/201/607/201607-${num}__400_320_102400_jpg.jpg`;

            promise_arr.push(getData(site_url, img_url));
            console.log(`length: ${promise_arr.length}`);
}

Promise.all(promise_arr).then((err) => {
    connection.end((err) => {
        if (err) {
            throw err;
        }
        console.log('Members data write complete');
    });
    /**
     *  成员信息和图片获取到之后
     *  再执行后续操作 （此处是关闭数据库连接）
     */
});

