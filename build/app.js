"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var app = express_1.default();
var axios = require("axios");
var cheerio = require("cheerio");
var bodyParser = require("body-parser");
app.use(bodyParser.text());
//stockprice
app.post("/", function (req, res) {
    var ticker = req.body;
    var url = "https://finance.yahoo.com/quote/" + ticker;
    axios.get(url).then(function (html) {
        var $ = cheerio.load(html.data);
        var stockitem = function (tag, num) { return ($('div#quote-header-info').find(tag + "[data-reactid=" + num + "]").text()); };
        var stockinfo = {
            time: /\d[A-z0-9:\ ]*/.exec(stockitem('span', '35'))[0],
            stock: /.*\./.exec(stockitem('h1', '7'))[0],
            price: stockitem('span', '32'),
        };
        return res.json(stockinfo);
    }).catch(function (error) {
        console.log(error);
    });
});
//worldtime
app.get("/", function (req, res) {
    var now = new Date();
    var year = now.getFullYear();
    var month = now.getMonth() + 1;
    var date = now.getDate();
    var day = now.getDay();
    var days = { 0: '일', 1: '월', 2: '화', 3: '수', 4: '목', 5: '금', 6: '토', };
    var minutes = now.getMinutes();
    var seconds = now.getSeconds();
    var Countrysdata = {
        "KOREA": 9,
        "CHINA": 10,
        "USA": -5,
        "USA_CST": -6,
        "USA_PST": -8
    };
    var country = req.query.country;
    var countryTZ = Countrysdata[country];
    var hours = now.getHours() - 9 + countryTZ;
    if (hours >= 24) {
        hours -= 24;
        date += 1;
        day += 1;
    }
    else if (hours < 0) {
        hours += 24;
        date -= 1;
        day -= 1;
    }
    ;
    res.status(200).json({
        "country": req.query.country,
        "year": year,
        "month": month,
        "date": day,
        "days": days[day],
        "hours": hours,
        "minutes": minutes,
        "seconds": seconds,
        "OtherCountrys": "KOREA, CHINA, USA, USA_CST, USA_PST"
    });
});
app.listen(3000, function () {
    console.log('start');
});
