const fs = require('fs');
const path = require('path');
const http = require('http');
const cheerio = require('cheerio');
const request = require('request');
const mysql = require('mysql');

let connection = mysql.createConnection({
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: 'Taylor13!@#$%',
    database: 'idol'
});
connection.connect((err) => {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }
    console.log("Database connect success");
});

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

                [
                    data.name_jp,
                    data.name_cn,
                    data.group,
                    data.birth,
                    data.blood,
                    data.constellation,
                    data.height,
                    data.status,
                    data.__img_url
                ] = [
                    $('.txt h2 span').text(),
                    $('.txt h2').text().replace($('.txt h2 span').text().trim(), ""),
                    `Nokizaka46`,
                    $('.txt dl dd')[0].children[0].data,
                    $('.txt dl dd')[1].children[0].data,
                    $('.txt dl dd')[2].children[0].data,
                    $('.txt dl dd')[3].children[0].data,
                    $('.txt .status').text().replace(/\n+/g, " "),
                    $('#profile img')[0].attribs.src
                ].map(item => {return item.trim()});
                
                resolve(data);
            });
        });
    })); 
    
}).then((arr) => {
    connection.query('TRUNCATE TABLE Nogizakas', (err) => {
        if (err) {
            throw err;
        }
        console.log('Clear table');
    });
    arr.forEach((item, index) => {
        getImg (item.__img_url, 
                `${item.name_cn}.jpg`, 
                path.resolve(__dirname, "../public", 
                "images", 
                "nogizaka46"), 
                (err) => {
                    if (err) {
                        throw err;
                    } else {
                        console.log(`Member ${item.name_cn} file && img get`);
                    }
                });
        delete item.__img_url;

        let query = 'INSERT INTO Nogizakas SET ?';
        connection.query(query, item, (err) => {
            if (err) {
                throw err;
            }
            console.log(`insert ${index} data success`);
        });
    });
}).then((err) => {
    if (err) {
        console.log(err);
    }
    connection.end((err) => {
        if (err) {
            throw err;
        }
        console.log('Write data complete');
    });
}).catch((err) => {
    console.log(err);
});

function getImg (img_url, filename, pathname, callback) {
    http.get(img_url, (res) => {
        let img_data = '';
        res.setEncoding("binary");
            res.on("data", function(chunk) {
                img_data += chunk;
            });
            res.on('end', () => {
                fs.writeFile(`${pathname}/${filename}`, img_data, 'binary', callback);
            });
    });
}