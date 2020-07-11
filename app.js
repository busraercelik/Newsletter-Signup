
const express = require("express");
const bodyParser = require("body-parser"); 
const request = require("request");
const https = require("https");
const app = express();

//Once statik dosyalari tek bir klasor altinda toplarim. public path'i belirtir.
//Sonra lokaldeki css ve img dosyalarini alabilmek icin bu kodu kullaniriz:
app.use(express.static("public"));
//signup formundaki datayi alir
//app.use ile uygulamamiza bodyParser'i kullanmamiz gerektigini soyleriz.
app.use(bodyParser.urlencoded({extended:true}));

// ana sayfama istek gonderdigimde server geriye html'i dondurur.
// artik get ile localhost:3000 uzerinden html'e erisebilirim.
app.get("/", function (req, res) {
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res){
    //html'deki name attribute'na ne yazildiysa ona referans et.
    const fname = req.body.fname;
    const lname = req.body.lname;
    const email = req.body.email;

    //mailchimp request body parametrelerini yazdik.
    //bu javascript objesini flat-packed json formatina donusturelim.
    const data = {
        members: [{
            email_address: email,
            status: "subscribed",
            merge_fields: {
                FNAME: fname,
                LNAME: lname
            }
        }]
    };

app.post("/failure.html", function (req, res) {  
    //ana sayfaya geri dondurur.
    res.redirect("/");
});

    // js datami stringe cevirip, json formatina sokmus olurum.
    const jsonData = JSON.stringify(data);


    const url = "https://us10.api.mailchimp.com/3.0/lists/8a2ff44ac8";
    const options = {
        method: "POST",
        auth: "busra:4c927aa76eaa0281fb99f2944a4420c6-us10"
    };
    //external resource'dan datayi post edecegiz.
    //mailchimp serverdan response alacagiz.
    const request = https.request(url, options, function (response) {

        if(response.statusCode === 200){
            res.sendFile(__dirname + "/success.html");
        }else{
            res.sendFile(__dirname + "/failure.html");
        }
        //bize gonderilen datayi check edelim 
        response.on("data", function (data) {
            console.log(JSON.parse(data));
        });
    });

    //json formatindaki datayi mailchimp serverina gonderdim.
    request.write(jsonData);
    //request ile isim bitti.
    request.end();
});

//lokal port yerine heroku'nun tanimlayacagi dinamik port kullanilir.
//heroku portu diledigi degere atayabilir.(3000, 4000 vs.)
// server lokalde dinlerse 3000 port secenegini de ekledik.
app.listen(process.env.PORT || 3000, function () {
    console.log("Server is running on port 3000.");
})

//API key
//4c927aa76eaa0281fb99f2944a4420c6-us10

//List ID
//8a2ff44ac8

//heroku'ya uygulamamizi nasil baslatacagimizi soyler & hangi dosyanin server kodunu icerdigini soyler.
//web: node app.js