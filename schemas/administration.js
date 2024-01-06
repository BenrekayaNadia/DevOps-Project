const mongoose= require("mongoose")
const Schema=mongoose.Schema;
const AdminSchema=new Schema({
name:{type:String
,unique:true},


govern:{type:mongoose.Types.ObjectId,ref:"Governorat"}
},
 { timestamps: true }
);
var Gover = mongoose.model('Administration', AdminSchema);
module.exports = Gover;
