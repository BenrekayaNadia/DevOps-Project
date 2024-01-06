const express=require('express');
const app=new express();
const mongoose=require('mongoose');
const csv=require("csvtojson");
const cors=require('cors');
const Governorat=require('./schemas/gouvernorat');
const Administration=require('./schemas/administration');
const Ecolepublic=require('./schemas/ecolepublic');
var bodyParser = require('body-parser');
mongoose.connect("mongodb://127.0.0.1:27017/dbclassquiz", { useNewUrlParser: true }
).then(()=>{
  console.log("connected");
}).catch((e)=>console.log(e));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
const Router=express.Router();
app.use(cors({
  origin:"http://localhost:3000",
  methods:['GET',"POST",'PUT','DELETE'],
  optionsSuccessStatus: 200, // For legacy browser support
  credentials: true, // This is important.
}))
Router.get('/govern',async(req,res)=>{
const jsonArray=await csv().fromFile('./data/outputpublic.csv');
let govern=[];
jsonArray.forEach(async(element) => {
    if(!govern.includes(element.Organization)){
        await Governorat.create({name:element.Organization}).then((e)=>{
            govern.push(element.Organization);
        }).catch((e)=>{
        })
    }
    
});
res.send('finished');
});
Router.get('/administration',async(req,res)=>{
let govn={};
  const govern=await Governorat.find({});
  govern.forEach(governa => {
govn[governa.name]=governa._id;
  });

  const jsonArray=await csv().fromFile('./data/outputpublic.csv');
  let admin=[];

  jsonArray.forEach(async(element) => {
      if(!admin.includes(element.Administration)){
          await Administration.create({name:element.Administration,govern:new mongoose.Types.ObjectId(govn[element.Organization])}).then((e)=>{
              admin.push(element.Administration);
          }).catch((e)=>{
          })
      }
      
  });
  res.send('finished');
  });
  Router.get('/ecole',async(req,res)=>{
    let adm={};
      const admins=await Administration.find({});
      admins.forEach(admina => {
    adm[admina.name]=admina._id;
      });
    
      const jsonArray=await csv().fromFile('./data/outputpublic.csv');
      let admin=[];
    
      jsonArray.forEach(async(element) => {
          if(!admin.includes(element.Nom)){
              await Ecolepublic.create({name:element.Nom,codepost:element['Code Postale'],
              quality:element['Quality'],nbclasses:element['Total des classes'],nbetudiants:element["Nombre total d'étudiants"],
              admin:new mongoose.Types.ObjectId(adm[element.Administration])}).then((e)=>{
                  admin.push(element.Nom);
              }).catch((e)=>{
              })
          }
          
      });
      res.send('finished');
      }); 
Router.get('/api/ecolepublics',async(req,res)=>{
  let filter={name:{$regex: req.query.name,
    $options: 'i'}};
    if(req.query.admin && req.query.admin!='all'){
      filter.admin=req.query.admin;
    }
  let ecolepublics = await Ecolepublic.find(filter).populate({
    path:'admin',model:Administration,populate:({
      path:'govern',model:Governorat 
    })
   
  
  });
  console.log(ecolepublics);
  if(req.query.govern && req.query.govern!='all'){
      ecolepublics=ecolepublics.filter((e)=>{return e.admin.govern._id==req.query.govern})
  }
  console.log('after');
  console.log(ecolepublics);
  return res.json({'ecolepublics':ecolepublics,'pages':Math.ceil(ecolepublics.length/12)});
})
Router.get('/api/governs',async(req,res)=>{
  
  let governs=await Governorat.find({}).populate({path:'admins',model:Administration});
  return res.json(governs);
})
app.use('',Router);


  app.listen("5000", () => {
    console.log("Server is running!");
  });