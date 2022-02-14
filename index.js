const Keyv = require('keyv')
const shurl = new Keyv('sqlite://db.sqlite', {
  table: 'short'
})

const express = require("express")
const app = express()
const PORT = process.env.PORT || 8080

app.get("/", (req, res) => {
  if(req.query.message){
    res.send(`Error : ${req.query.message}<br><h1>高速で日本製の短縮URLサービス</h1><br><h2>/c?u=< Url >で作成 <br> /s?code = < 作成されたコード > で転送 </h2>`)
  }
  res.send('<h1>高速で日本製の短縮URLサービス</h1><br><h2>/c?u=< Url >で作成 <br> /s?code = < 作成されたコード > で転送 </h2>')
})

app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}でサーバーを開始しました。`)
  })

app.get("/s",async (req,res) => {
  try{
  if(!req.query.q) return res.redirect("/")
  else {
    const redirecturl = await shurl.get(req.query.q)
    if(!redirecturl) return res.redirect("/?message=notfoundpage")
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

app.get("/c", (req,res) => {
  if(!req.query.u) return res.redirect("/")
  //let checkcode = req.query.u
  else {
  var S = "abcdefg1234567890"
    var N = 7
    let code = Array.from(Array(N)).map(()=>S[Math.floor(Math.random()*S.length)]).join('')
    const check = shurl.get(code)
    if(check){
        var S = "abcdefg1234567890"
        var N = 7
        let code = Array.from(Array(N)).map(()=>S[Math.floor(Math.random()*S.length)]).join('')
        shurl.set(code, req.query.u)
        res.redirect("/ok?url="+code)
    } 
    shurl.set(code, req.query.u)
    res.redirect("/ok?url="+code)
   
  }
})

app.get("/d", (req,res) => {
  if(!req.query.c) return res.redirect('/')
  const checksitaurl = shurl.get(req.query.c)
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
  if(!req.query.url) return res.redirect("/")
  else {
    const url = req.query.url
    const mazinourl = "https://short.ryofuruhashi823.repl.co/s?q="+url
    res.send("<h1>"+mazinourl + `です<br><a href=${mazinourl}> here </a></h1>`)
  }
})