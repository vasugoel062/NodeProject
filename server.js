// 1. Overview or Home Page ("HomePage","/","")
//2. Product Page ("product")
// "/api" => display data.json to browser
var http = require("http");
var fs = require("fs");
var url = require("url");
var template = fs.readFileSync("product.html");
var cardsTemplate = fs.readFileSync("card.html")+"";
var overviewTemplate = fs.readFileSync("overview.html")+"";
var json = fs.readFileSync("data.json");
template=template+"";// convert data in buffer to string
json = JSON.parse(json);
function replace(product,template){
    template = template.replace(/#Product Name#/g, product["productName"]);
    template = template.replace(/#image#/g, product["image"]);
    template = template.replace(/#from#/g, product["from"]);
    template = template.replace(/#nutrients#/g, product["nutrients"]);
    template = template.replace(/#quantity#/g, product["quantity"]);
    template = template.replace(/#price#/g, product["price"]);
    template = template.replace(/#Description#/g, product["description"]);
    if(!product["organic"]){
        template = template.replace(/#not-organic#/g, "not-organic");
    }
    template = template.replace(/#id#/g,product["id"]);
    return template;
}
var server = http.createServer(function(req,resp){
    var parseurl = url.parse((req.url),true)
    console.log(parseurl);
    if(req.url =="/" || req.url=="HomePage" || req.url== ""){
        var cards = "";
        for(var i=0;i<json.length;i++){
            cards = cards + replace(json[i],cardsTemplate);
            }
        overviewTemplate = overviewTemplate.replace(/{%cardsarea%}/g, cards)
        resp.write(overviewTemplate);
 } else if(parseurl["pathname"] == "/product"){
    var id = parseurl.query.id;
    var productPage = replace(json[id],template)
    resp.write(productPage);
 }else if(req.url=="/api"){
    resp.write(json);
 }
 else{
     resp.write("<h1>Error 404 not found")
 }
 resp.end();
})
var port = process.env.PORT||3000;
server.listen(3000, function () {
    console.log("Server has started on port 3000");
})