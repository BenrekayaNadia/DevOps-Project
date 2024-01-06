const mongoose= require("mongoose")
const Schema=mongoose.Schema;
const GoverSchema=new Schema({
name:{type:String
,unique:true}}, { timestamps: true }
);
GoverSchema.set('toObject', { virtuals: true });
GoverSchema.set('toJSON', { virtuals: true });
GoverSchema.virtual("admins", {
    ref : "Administration", 
    foreignField: "govern", 
    localField : "_id"
   });
var Gover = mongoose.model('Governorat', GoverSchema);
module.exports = Gover;