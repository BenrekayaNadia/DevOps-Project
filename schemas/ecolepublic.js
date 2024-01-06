const mongoose= require("mongoose")
const Schema=mongoose.Schema;
const EcolepSchema=new Schema({
name:{type:String
,unique:true},
codepost:{type:String},
quality:{type:String},
nbclasses:{type:Number},
nbetudiants:{type:Number},
admin:{type:mongoose.Types.ObjectId,ref:"Administration"}
},
 { timestamps: true }
);
var Ecolepublic = mongoose.model('Ecolepublic', EcolepSchema);
module.exports = Ecolepublic;