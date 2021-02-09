import express, {Request, Response, NextFunction, Router} from 'express';
const app = express();
const axios = require("axios");
const cheerio = require("cheerio");
const bodyParser = require("body-parser");

app.use(bodyParser.text());

//stockprice
app.post("/", function(req,res) {
  let ticker = req.body
  let url = `https://finance.yahoo.com/quote/${ticker}`;
  axios.get(url).then(function(html:any) {
    let $ = cheerio.load(html.data);
    let stockitem = (tag:string,num:string) => ($('div#quote-header-info').find(`${tag}[data-reactid=${num}]`).text());
    let stockinfo:object = {
      time : /\d[A-z0-9:\ ]*/.exec(stockitem('span','35'))![0],
      stock : /.*\./.exec(stockitem('h1','7'))![0],
      price : stockitem('span','32')!,
    }
    return res.json(stockinfo)
  }).catch(function(error:any) {
    console.log(error)
  });
});

//worldtime
app.get("/", function(req, res) {
  let now = new Date();
  let year =now.getFullYear();
  let month = now.getMonth() + 1;
  let date = now.getDate();
  let day = now.getDay();
  let days:any= {0 : '일', 1 : '월', 2 : '화', 3 : '수', 4 : '목', 5 : '금', 6 : '토',}
  let minutes = now.getMinutes();
  let seconds = now.getSeconds();
  
  interface strings {
    [key:string] : number;
  }
  const Countrysdata:strings = {
    "KOREA": 9,
    "CHINA": 10,
    "USA": -5,
    "USA_CST": -6,
    "USA_PST": -8
  }
  const country = req.query.country as string
  let countryTZ:number = Countrysdata[country]
  let hours = now.getHours()-9 + countryTZ

  if(hours >= 24){
    hours -= 24
    date += 1
    day += 1
  } else if (hours < 0){
    hours+=24
    date -= 1
    day -= 1
  };

  res.status(200).json(
    {
      "country":req.query.country,
      "year":year,
      "month":month,
      "date":day,
      "days":days[day],
      "hours":hours,
      "minutes":minutes,
      "seconds":seconds,
      "OtherCountrys":"KOREA, CHINA, USA, USA_CST, USA_PST"
    }
  )
})

app.listen(3000,()=>{
  console.log('start')
})