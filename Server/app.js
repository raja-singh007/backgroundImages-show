const express = require('express');
const path = require('path');
const app = express();
const bodyParser = require("body-parser");
const router = express.Router();
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, '..','build')));
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
const Collection = {
  COMP_BG: 'compressed_bg',
  ORIGIN_BG: 'original_bg'
}


const InitModule = require('./InitModule');
const initObject = new InitModule();

let dbObject;
initObject.getMongoDB()
  .then(dbo => {
    dbObject = dbo;
    console.log('MOngodb connected')
  })
  .catch(e => {
    console.log("Mongo Connection Failed", e);
  });


app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '..','build', 'index.html'));
});

//api username 
router.get('/getImages',async(req,res)=>{
  try{
    let params = req.query,
    pageNo = params.pageNo,
    pageSize = params.pageSize
    console.log(params)
    const images = await dbObject.collection(Collection.COMP_BG).find().project({_id:0,url:1}).skip((pageNo-1)*pageSize).limit(pageNo*pageSize).toArray();
    res.send({status:'PASS',data: images.map(item => {
      return {
        url: item.url
      }
    })})
  }catch(err){
      res.send({status:"FAIL",message:err.message})
  }
})

app.use('/', router);

app.listen(3002);
