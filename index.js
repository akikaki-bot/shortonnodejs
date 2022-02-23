const Keyv = require('keyv')
const shurl = new Keyv('sqlite://db.sqlite', {
  table: 'short'
})
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
global.document = new JSDOM("/").window.document;

const express = require("express")
const app = express()
const PORT = process.env.PORT || 8080
const cors = require('cors')
const os = require('os');


app.set(express.static(__dirname + '/javascripts'));
//=============================Main Page!===============================
app.get("/", (req, res) => {
  const { create } = require('./javascripts/create.js')
 // try{
  if (req.protocol == 'http:') {
    res.redirect="https://s5.f5.si?message=httpからアクセスしてたので自動的にhttpsページにリダイレクトされました。&Style=Notice"
  }
  let color
  if(req.query.style === "Error") color = "is-danger"
  if(req.query.style === "Notice") color = "is-link"
  if(req.query.message){
    res.send('<!DOCTYPE html><html><head><meta name="viewport" content="width=device-width, initial-scale=1"><link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.3/css/bulma.min.css"><style>hr{background-color:#E67;}</style><title>しょーと</title><script type="text/javascript">function make(){var url = document.getElementById("url");var custom_check = document.getElementById("custom");var custom_name = document.getElementById("custom_name");var r18_check = document.getElementById("r18");var result = document.getElementById("result");if(!url.value){var Error = "URLがなにもないです！";result.innerHTML = Error;};if(custom_check.checked === true){if(!custom_name.value){var Error = "カスタムネームの欄になにも記入されていません。";result.innerHTML = Error}else{if(r18_check.checked === true){var Result = `<a href="https://s5.f5.si/c?u=${url.value}&cn=${custom_name.value}&r18=true"> 作成！ </a>`;result.innerHTML = Result;}else{var Result = `<a href="https://s5.f5.si/c?u=${url.value}&cn=${custom_name.value}"> 作成！ </a>`;result.innerHTML = Result;}}}else if(r18_check.checked === true){var Result = `<a href="https://s5.f5.si/c?u=${url.value}&r18=true"> 作成！ </a>`;result.innerHTML = Result;} else {var Result = `<a href="https://s5.f5.si/c?u=${url.value}"> 作成</a>`;result.innerHTML = Result;}} </script></head><body><section class="section"><div class="notification '+color+' "><strong>'+req.query.message+'</strong></div><h1 class="title">s5.f5.si</h1><p class="subtitle">高速で日本製の短縮URLサービス</p><br><hr><br><p class="subtitle">🔧簡単作成ツール</p><input type="text" id="url" size="50"></input></br><p class="text">🛠️詳細設定</p><input type="checkbox" id="custom">カスタムネーム : </input><input type="text" id="custom_name" size="30"></input></br><input type="checkbox" id="r18">R18モード</input></br><input type="button" value="作成！" onclick="make()"><div id="result" size="30"></div><br><hr><h2>/c?u=< Url >で作成(https://は不要です) <br>/s?q=< 作成されたコード > で転送 </h2></section></body></html>"')
  }
  /*
   if(!url.value){
  var Error = "URLがなにもないです！"
  result.innerHTML = Error
}

var Result = "https://plsh.f5.si/c?u=${url.value}&cn=${custom_name.value}"
var Result = "https://plsh.f5.si/c?u=${url.value}&cn=${custom_name.value}&r18=true"
var Result = "https://plsh.f5.si/c?u=${url.value}"
   */
      res.send('<!DOCTYPE html><html><head><meta name="viewport" content="width=device-width, initial-scale=1"><link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.3/css/bulma.min.css"><style>hr{background-color:#E8822A;}</style><title>しょーと</title><script type="text/javascript">function make(){var url = document.getElementById("url");var custom_check = document.getElementById("custom");var custom_name = document.getElementById("custom_name");var r18_check = document.getElementById("r18");var result = document.getElementById("result");if(!url.value){var Error = "URLがなにもないです！";result.innerHTML = Error;};if(custom_check.checked === true){if(!custom_name.value){var Error = "カスタムネームの欄になにも記入されていません。";result.innerHTML = Error}else{if(r18_check.checked === true){var Result = `<a href="https://s5.f5.si/c?u=${url.value}&cn=${custom_name.value}&r18=true"> 作成！ </a>`;result.innerHTML = Result;}else{var Result = `<a href="https://s5.f5.si/c?u=${url.value}&cn=${custom_name.value}"> 作成！ </a>`;result.innerHTML = Result;}}}else if(r18_check.checked === true){var Result = `<a href="https://s5.f5.si/c?u=${url.value}&r18=true"> 作成！ </a>`;result.innerHTML = Result;} else {var Result = `<a href="https://s5.f5.si/c?u=${url.value}"> 作成</a>`;result.innerHTML = Result;}} </script></head><body><section class="section"><h1 class="title">s5.f5.si</h1><p class="subtitle">高速で日本製の短縮URLサービス</p><br><hr><br><p class="subtitle">🔧簡単作成ツール</p><input type="text" id="url" size="50"></input></br><p class="text">🛠️詳細設定</p><input type="checkbox" id="custom">カスタムネーム : </input><input type="text" id="custom_name" size="30"></input></br><input type="checkbox" id="r18">R18モード</input></br><input type="button" value="作成！" onclick="make()"><div id="result" size="30"></div><br><hr><h2>/c?u=< Url >で作成(https://は不要です) <br>/s?q=< 作成されたコード > で転送 </h2></section></body></html>"')
 // }catch(e){
  //  res.send(e.message)
  //}
})

app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}でサーバーを開始しました。`)
  })

const path = require('path')
app.use(express.static(path.join(__dirname, 'status')));

//=============================Redirect Main============================
app.get("/s",async (req,res) => {
  try{
  if(!req.query.q) return res.redirect("/?message=ページが見つかりません。&style=Error")
  else {
    const redirecturl = await shurl.get(req.query.q)
    const warn = await shurl.get(`${req.query.q}_warn`)
    const r18 = await shurl.get(`${req.query.q}_r18`)
    if(warn){
      res.send(`<head><meta name="viewport" content="width=device-width, initial-scale=1"><meta http-equiv="Refresh" content="5; url=https://s5.f5.si/"><link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.3/css/bulma.min.css">
      <style>
      hr{background-color:#E87}
      </style>
      </head><title>Block by s5「 S 」System</title><body><section class="section"><h1 class="title">これは危険なサイトです。</h1><hr><h2 class="subtitle">あなたがアクセスしようとしているのは危険と分類されたコードです。この先には進めません。<br>5秒後にメインページにリダイレクトされます。</h2></section></body>`)
    }else if(r18){
      res.send(`<!DOCTYPE html><html><head><meta name="viewport" content="width=device-width, initial-scale=1"><link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.3/css/bulma.min.css"><style>hr{background-color:#E87}</style></head>
      <title>Block by Plsh「 S 」System</title><body><section class="section"><h2 class="title">このURLはR18指定されています。</h2><hr><h2 class="subtitle">見たくないよ～って人は<a href="/">ここに</a></br>すすむってひとは<a href="/s/r?q=${req.query.q}">ここ</a>に進んでね </h2></body></html>
      `)
    }
    else {
    if(!redirecturl) return res.redirect("/?message=ページが見つかりません。&style=Error")
    let check = redirecturl.indexOf("https://")
    if(check = -1){
      res.redirect("https://"+redirecturl)
    }
    res.redirect(redirecturl)
      }
    }
  }catch(e){
    console.log(e.message)
  }
})
app.get("/s/r",async(req,res) => {
    try{
  if(!req.query.q) return res.redirect("/")
  else {
    const redirecturl = await shurl.get(req.query.q)
  if(!redirecturl) return res.redirect("/?message=ページが見つかりません。&style=Error")
    let check = redirecturl.indexOf("https://")
    if(check = -1){
      res.redirect("https://"+redirecturl)
    }
    res.redirect(redirecturl)
      }
  }catch(e){
    console.log(e.message)
  }
})

//=============================Api Create Redirect======================
app.get("/a/c",async (req,res) => {
  try{
    if(!req.query.u) return res.json({"error":"url require"})
  //let checkcode = req.query.u
  else {
  var S = "ABCDEFGabcdefg1234567890"
    var N = 7
    let code = Array.from(Array(N)).map(()=>S[Math.floor(Math.random()*S.length)]).join('')
    const check = shurl.get(code)
    if(check){
        var S = "ABCDEFGabcdefg1234567890"
        var N = 7
        let code = Array.from(Array(N)).map(()=>S[Math.floor(Math.random()*S.length)]).join('')
        shurl.set(code, req.query.u)
        res.json({"url":"https://s5.f5.si/s?q="+code,"message":"Thanks for use!"})
    }
    res.json({"url":"https://s5.f5.si/s?q="+code})
  }
  }catch(e){
  console.log(e.message)
  }
})
//=============================Create Redirect Url =====================
app.get("/c", async (req,res) => {
  if(!req.query.u) return res.redirect("/?message=使い方 : /c?u=example.com＆cn=お好みで&style=Notice")
  
  else {
  let r18 
  if(req.query.r18) r18 = true
  if(!req.query.r18) r18 = false 
  if(!req.query.cn){
  var S = "ABCDEFGabcdefg1234567890"
    var N = 7
    let code = Array.from(Array(N)).map(()=>S[Math.floor(Math.random()*S.length)]).join('')
    const check = await shurl.get(code)
    if(check){
        var S = "ABCDEFGabcdefg1234567890"
        var N = 7
        let code = Array.from(Array(N)).map(()=>S[Math.floor(Math.random()*S.length)]).join('')
        shurl.set(code, req.query.u)
        shurl.set(`${code}_r18`, r18)
        res.redirect("/ok?url="+code)
    } 
    shurl.set(code, req.query.u)
    shurl.set(`${code}_r18`, r18)
    res.redirect("/ok?url="+code)
  }else{
    var name = req.query.cn
    shurl.get(name).then((checkname) => {
    if(checkname) return res.send(`<!DOCTYPE html><html><head><meta name="viewport" content="width=device-width, initial-scale=1"><meta http-equiv="Refresh" content="5; url=https://s5.f5.si/"><link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.3/css/bulma.min.css"><style>hr{background-color:#E87}</style></head>
      <title>しょーと</title><body><section class="section"><h2 class="title">この名前は登録済みです。</h2><hr><h2 class="subtitle">申し訳ありませんが、この名前は登録済みです。</br>ほかの名前をお試しください。(5秒後に自動的にメインページにリダイレクトされます。)</h2></body></html>`)
    else {
      shurl.set(name, req.query.u)
      shurl.set(`${name}_r18`, r18)
      res.redirect("/ok?url="+name)
    }
    })
  }
  }
})
//=============================Delete Redirect==========================
app.get("/warn",(req,res) => {
  if(req.query.warn){
    var warnurl = req.query.warn
    shurl.get(warnurl).then(v => {
      if(!v) return res.send('<h3>その短縮IDは存在しないぞ？</h3>')
      shurl.set(`${warnurl}_warn`, "危険")
      res.send('設定完了')
    })
  }
  if(req.query.unwarn){
    var warnurl = req.query.unwarn
    shurl.get(warnurl).then(v => {
      if(!v) return res.send('<h3>その短縮IDは存在しないぞ？</h3>')
      shurl.delete(`${warnurl}_warn`)
      res.send('設定完了')
    })
  }
  if(!req.query){
    res.send('<h1>短縮URL設定</h1><br><h2>短縮URLの危険設定 Query in ?warn=code</br>解除 Query in ?unwarn=code')
  }
})
app.get("/d", async (req,res) => {
  if(!req.query.c) return res.redirect('/')
  const checksitaurl = await shurl.get(req.query.c)
  if(checksitaurl){
    shurl.delete(req.query.c)
    res.redirect('/su')
  }else {
    res.send('<h1>そのリダイレクト先コードは存在しません。</h1>')
  }
})
app.get("/su", (req,res) => {
  res.send('<h1> ok </h1>')
})
app.get("/ok",(req,res) => {
  if(!req.query.url) return res.redirect("/?message=Queryが空です。&Style=Error")
  else {
    const url = req.query.url
    const mazinourl = "https://s5.f5.si/s?q="+url
    res.send(`<!DOCTYPE html><html><head><meta name="viewport" content="width=device-width, initial-scale=1"><link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.3/css/bulma.min.css"><style>hr{background-color:#E87} .info{background-color:#ff8c00}</style></head>
      <title>しょーと</title><body><section class="section"><h2 class="title">正常に作成されました。</h2><hr><h2 class="subtitle">コードは: ${url}<br>URLは${mazinourl}です。<hr class="info"><a href=${mazinourl}> ${mazinourl} に飛ぶ </a></h2></body></html>`)
  }
})

var performance = class {
    constructor() {
        this.timer = null;  // Interval Timer用
        this.info = {};     // 測定情報
    }
    // 測定開始
    start(interval, max_history) {
        // 既存タイマーの停止
        this.stop();
        // 基本の情報の作成
        let old_os = os.cpus();
        let platform = `${os.platform()} ${os.release()} (${os.arch()})`
        this.info = { 'platform': platform, 'interval': interval, 'max_history': max_history, 'items': {}};
        for(let index = 0; index < old_os.length; index++) {
            this.info.items['cpu' + index] = {'model': old_os[index].model, history:[]};
        }
        // タイマーの開始
        let info = this.info;
        this.timer = setInterval(function() {
            // 各CPU使用率を算出
            let now_os = os.cpus();
            for(let index = 0; index < now_os.length; index++) {
                // 1CPUずつCPU使用率を算出
                let total = 0;
                for (let type in now_os[index].times) { total += now_os[index].times[type]; }
                for (let type in old_os[index].times) { total -= old_os[index].times[type]; }
                let idle = now_os[index].times.idle - old_os[index].times.idle;
                let cpu_per = Math.floor(100 - (100 * idle / total));
                info.items['cpu' + index].history.unshift(cpu_per); // 先頭に最新情報追加
            }
            old_os = now_os;
            // 履歴件数超過時に古い情報削除
            for(let item in info.items) {
                while (info.items[item].history.length > max_history) { 
                    info.items[item].history.pop(); // 末尾の情報を削除
                }
            }
        }, interval);
    }
    // 測定停止
    stop() {
        if (this.timer) { 
            clearInterval(this.timer); 
            this.timer = null;
        }
    }
    // 測定履歴の取得
    get_info() {
        return this.info;
    }
};

var pref = new performance();
pref.start(1000, 100);

app.get("/status", (req, res, next) => { res.send(pref.start(5000 , 10))
}
);


