exports.create = () => {

var url = document.getElementById("url")
var custom_check = document.getElementById("custom")
var custom_name = document.getElementById("custom_name")
var r18_check = document.getElementById("r18")
var result = document.getElementById("result")

if(!url.value){
  var Error = "URLがなにもないです！"
  result.innerHTML = Error
}
if(custom_check.checked === true){
  if(!custom_name.value){
  var Error = "カスタムネームの欄になにも記入されていません。"
  result.innerHTML = Error
  }else{
    if(r18_check.checked === true){
      var Result = `https://plsh.f5.si/c?u=${url.value}&cn=${custom_name.value}&r18=true`
      result.innerHTML = Result
    }else{
      var Result = `https://plsh.f5.si/c?u=${url.value}&cn=${custom_name.value}`
      result.innerHTML = Result
    }
  }
} else {
  var Result = `https://plsh.f5.si/c?u=${url.value}`
  result.innerHTML = Result
}
}