const express = require('express');
const cheerio = require('cheerio');
const request = require('request');
const fs = require('fs');

const app = express();

const log = console.log;

app.get('/scrape', (req, res) => {
    // web sraping logic
    const url = 'http://www.imdb.com/title/tt1229340/';

    request(url, (error, response, html) => {
        if (!error) {
            const $ = cheerio.load(html);
            let title;
            let release;
            let rating;
            const json = {
                title: '',
                release: '',
                rating: ''
            };

            $('.title_wrapper h1').filter(function () {
                const data = $(this);

                title = data.text().trim();
                release = title.slice(-5, -1);
                json.title = title.slice(0, -6).trim();
                json.release = release;
            })

            $('.ratingValue').filter(function () {
                const data = $(this);

                rating = data.children('strong').children('span').text();
                json.rating = rating;
            })

            fs.writeFile('output.json', JSON.stringify(json, null, 4), err => {
                log('File successfully written! - Check your project directory for output.json file');
            })
        }
    })
    res.send('Check your console!')
})

app.listen('8081');
console.log('Server running on port 8081');

exports = module.exports = app;