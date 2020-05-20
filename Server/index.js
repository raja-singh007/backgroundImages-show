const InitModule = require('./InitModule');
const initObject = new InitModule();
const Axios = require('axios');
const csv=require('csvtojson');

const Collection = {
  COMP_BG: 'compressed_bg',
  ORIGIN_BG: 'original_bg'
}

async function run (){

  let csvFilePath1=`../compressed-bg.csv`;
  let csvFilePath2=`../original-bg.csv`;
  try {
    let dbObject;
    await initObject.getMongoDB()
      .then(dbo => {
        dbObject = dbo;
        console.log("connected to db");
      })
      .catch(e => {
        console.log("Mongo Connection Failed", e);
      });
    //console.log(dbObject);
    let comp_bgJsonObj = await csv().fromFile(csvFilePath1)
    let urls_c = comp_bgJsonObj.map(item => item.url)
    for(let i =0;i<urls_c.length;i++){
      console.log(urls_c[i])
      
await dbObject.collection(Collection.COMP_BG)
  .findOne({url: urls_c[i]},function(err,response){
      if(err) throw err;
      if(response){
        console.log("present already")
      } else{
        dbObject.collection(Collection.COMP_BG)
        .insertOne({url:urls_c[i]},async(err,response)=>{
          if(err) throw err;
          if(response){
            console.log("db updated")
          } else{
            console.log("nothing happened")
          }
        })
      }
    })
     // await dbObject.collection(Collection.COMP_BG).insert({url:urls_c[i]});
    }
    let origin_bgJsonObj = await csv().fromFile(csvFilePath2)
    let urls = origin_bgJsonObj.map(item => item.url)
    for(let i =0;i<urls.length;i++){
      console.log(urls[i])
      await dbObject.collection(Collection.ORIGIN_BG)
  .findOne({url: urls[i]},function(err,response){
      if(err) throw err;
      if(response){
        console.log("present already")
      } else{
        dbObject.collection(Collection.ORIGIN_BG)
        .insertOne({url:urls[i]},async(err,response)=>{
          if(err) throw err;
          if(response){
            console.log("db updated")
          } else{
            console.log("nothing happened")
          }
        })
      }
    })
      //await dbObject.collection(Collection.ORIGIN_BG).insert({url:urls[i]});
    }
    
   
  } catch (err) {
    console.log(err)
  }
  }
  run();