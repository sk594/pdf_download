const express = require('express');
const app = express();
var http = require('http');
const excel = require('exceljs');

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
app.get("/download/excel", function (req, res) {

        // -> Query data from MySQL
        con.query("SELECT * FROM risk_Record", function (err, risk, fields) {
            if (err) throw err;

            const jsonCustomers = JSON.parse(JSON.stringify(risk));
            console.log(jsonCustomers);
            /**
                [ { id: 1, address: 'Jack Smith', age: 23, name: 'Massachusetts' },
                  { id: 2, address: 'Adam Johnson', age: 27, name: 'New York' },
                  { id: 3, address: 'Katherin Carter', age: 26, name: 'Washington DC' },
                  { id: 4, address: 'Jack London', age: 33, name: 'Nevada' },
                  { id: 5, address: 'Jason Bourne', age: 36, name: 'California' } ]
            */

            let workbook = new excel.Workbook(); //creating workbook
            let worksheet = workbook.addWorksheet('Risk'); //creating worksheet

            //  WorkSheet Header
            worksheet.columns = [  { header: 'Name', key: 'name1', width: 30 },
                { header: 'Id', key: 'id', width: 10 },

                { header: 'Address', key: 'address', width: 30},
            ];

            // Add Array Rows
            worksheet.addRows(jsonCustomers);

            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', 'attachment; filename=' + 'risk.xlsx');

            return workbook.xlsx.write(res)
                  .then(function() {
                        res.status(200).end();
                  });
        });

});

app.listen(3000, (req, res) => {
  console.log("server run on port no 3000")
})
