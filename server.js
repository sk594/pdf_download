const express = require('express');
const app = express();
var http = require('http');
// const mysql = require('mysql');
var multer = require('multer');
var upload = multer();
app.use(express.static(__dirname + '/public'));
var con = require("./databases");
var PDFDocument = require('pdfkit');

const doc = new PDFDocument();

app.get("/upload", (req, res) => {
 res.sendFile(__dirname + "/index.html");
})

var storage =   multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './uploads');
  },
  filename: function (req, file, callback) {
    callback(null, file.fieldname + '-' + Date.now());
  }
});

var upload = multer({ storage : storage}).single('userPhoto');
app.post('/api/photo',function(req,res){
    upload(req,res,function(err) {
        if(err) {
            return res.end("Error uploading file.");
        }
        res.end("File is uploaded");
    })});

app.get("/data", (req, res) => {
  var data = "SELECT * FROM risk_Record";
  con.query(data, function(err, result){
    if(err){
      console.log("111111111",err)
    }else{
      console.log("<<<<<<<<<<<",result[0].name)
      var title        = 'sa sa sa sa';
      var content      = result[0].name;
      var publish_date = 'aaaaaaaaaaaa';
      var author_name  = 'sanjay';
      var link         = 'sasa';
      var filename     = encodeURIComponent(author_name) + '.pdf';
      res.setHeader('Content-disposition', 'attachment; filename="' + filename + '"');
      res.setHeader('Content-type', 'application/pdf');
      doc.font('Times-Roman', 18)
        .fontSize(25)
        .text(author_name, 100, 50);
      doc.fontSize(15)
         .fillColor('blue')
         .text('Read Full Article', 100, 100)
         .link(100, 100, 160, 27, link);
      doc.moveDown()
         .fillColor('red')
         .text("Author: "+author_name);

      doc.moveDown()
         .fillColor('black')
         .fontSize(15)
         .text(content , {
           align: 'justify',
           indent: 30,
           height: 300,
           ellipsis: true
           });
           doc.pipe(res);

           doc.end();

      // res.status(200).json(result)

  }}
)});



app.listen(3000, (req, res) => {
  console.log("server run on port no 3000")
})
