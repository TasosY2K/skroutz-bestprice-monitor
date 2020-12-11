const fs = require('fs');
const cheerio = require('cheerio');
const axios = require('axios');
const chalk = require('chalk');
const moment = require('moment');
const Discord = require('discord.js');

// If you want to scan for an other product all you have to do is change the product URL variables

// A message will be sent to this webhook when the product reaches the threshold price or lower
// The id is the first part code of the URL you get when creating a webhook in a channel 
const webhookId = "<YOUR-ID>";

// The token is the second part
const webhookToken = "<YOUR-TOKEN>";

const webhook = new Discord.WebhookClient(webhookId, webhookToken);

// How many seconds to wait before checking availability
// Set it atleast 5 as to not get IP banned since i haven't implemented proxies
const seconds = 5;
const interval = seconds * 1000;

// The name of the log file
const logFile = "log.txt";

// The name of the product
const productName = "AMD Ryzen 5 5600X";

// If the products price drops or is equal to threshold the webhook is sent
const threshold = 350;

// URL's of the products
const skroutzUrl = "https://www.skroutz.gr/s/25549852/AMD-Ryzen-5-5600X-Box.html";
const bestPriceUrl = "https://www.bestprice.gr/item/2156351449/amd-ryzen-5-5600x-box-with-wraith.html";

const checkSkroutz = url => {
    axios.get(url).then(response => {

        const $ = cheerio.load(response.data);

        let prods = [];
        $(".js-product-link.product-link.content-placeholder").each((i, elem) => {
            prods.push([elem.children[0].data, elem.attribs.href]);
        });

        if (prods.length > 0) {
            console.log(`[${moment().format('HH:mm:ss')}] ${chalk.green('info')} :: [skroutz] [x${prods.length}] [${productName}] :: ${chalk.green('IN STOCK')}`);
            fs.appendFileSync(logFile, `[${moment().format('HH:mm:ss')}] info:: [skroutz] [x${prods.length}] [${productName}] :: IN STOCK\n`);
        } else {
            console.log(`[${moment().format('HH:mm:ss')}] ${chalk.green('info')} :: [skroutz] [x0] [${productName}] :: ${chalk.red('OUT OF STOCK')}`);
            fs.appendFileSync(logFile, `[${moment().format('HH:mm:ss')}] info :: [skroutz] [x0] [${productName}] :: OUT OF STOCK\n`);
        }

        lowest = parseInt(prods[0][0].substring(0, prods[0][0].length - 1).replace(',', '.'));

        if (lowest <= threshold) {
            console.log(`[${moment().format('HH:mm:ss')}] ${chalk.green('info')} :: [skroutz] [${productName}] :: ${chalk.green('REACHED THRESHOLD')} [${lowest}€]`);
            console.log(`[${moment().format('HH:mm:ss')}] ${chalk.green('info')} :: ${chalk.blue('SENDING WEBHOOK...')}`);
            const data =`${productName} is in stock at https://www.skroutz.gr${prods[0][1]} for ${lowest}€`;
            webhook.send(data).catch(console.error);
        }

    }).catch(error => {
        console.log(error);
    });
}

const checkBestPrice = url => {
    axios.get(url).then(response => {

        const $ = cheerio.load(response.data);

        let prods = [];
        $(".prices__price").each((i, elem) => {
            prods.push([elem.children[0].children[0].data, elem.children[0].attribs.href]);
        });

        if (prods.length > 0) {
            console.log(`[${moment().format('HH:mm:ss')}] ${chalk.green('info')} :: [bestprice] [x${prods.length}] [${productName}] :: ${chalk.green('IN STOCK')}`);
            fs.appendFileSync(logFile, `[${moment().format('HH:mm:ss')}] info:: [bestprice] [x${prods.length}] [${productName}] :: IN STOCK\n`);
        } else {
            console.log(`[${moment().format('HH:mm:ss')}] ${chalk.green('info')} :: [bestprice] [x0] [${productName}] :: ${chalk.red('OUT OF STOCK')}`);
            fs.appendFileSync(logFile, `[${moment().format('HH:mm:ss')}] info :: [bestprice] [x0] [${productName}] :: OUT OF STOCK\n`);
        }

        lowest = parseInt(prods[0][0].substring(0, prods[0][0].length - 1).replace(',', '.'));

        if (lowest <= threshold) {
            console.log(`[${moment().format('HH:mm:ss')}] ${chalk.green('info')} :: [bestprice] [${productName}] :: ${chalk.green('REACHED THRESHOLD')} [${lowest}€]`);
            console.log(`[${moment().format('HH:mm:ss')}] ${chalk.green('info')} :: ${chalk.blue('SENDING WEBHOOK...')}`);
            const data =`${productName} is in stock at https://www.bestprice.gr${prods[0][1]} for ${lowest}€`;
            webhook.send(data).catch(console.error);
        }
        
    }).catch(error => {
        console.log(error);
    });
}

setInterval(() => {
    checkSkroutz(skroutzUrl);
    checkBestPrice(bestPriceUrl); 
}, interval);
