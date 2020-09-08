const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    userName : String,
    Name : String,
    Email : String,
    Password : String,
    Thumbnail : String,
    admin : { type: Boolean , default: false}
    
});

const paper = new Schema({
    name: { type: String, required: true },
    conferencevenue: { type: String, required: true },
    link: { type: String, required: true },
    description: { type: String, required: true },
    typeofpaper: { type: Schema.Types.ObjectId, ref: 'typeofpaper' },
    indexedin: { type: Schema.Types.ObjectId, ref: 'indexedin' },
    publishdate: { type: Date, required: true },
    lastdatesubmission: { type: Date, required: true }

});

const proposal = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    link: { type: String, required: true },
    discipline: [{ type: Schema.Types.ObjectId, ref: 'discipline' }],
    fundingagency: [{ type: Schema.Types.ObjectId, ref: 'fundingagency' }],
    publishdate: { type: Date, required: true },
    lastdate: { type: Date, required: true }
});
const fellowship = new Schema({
    researchtopic : { type : String, required: true },
    description: { type: String, required: true },
    lastdateapplication : { type : String, required: true },
    publishdate: { type: String, required: true },
    link: { type: String, required: true },
    typeoffellowship: { type : Schema.Types.ObjectId, ref:'typeoffellowship' },
    university : { type : Schema.Types.ObjectId, ref:'university' }
});

const fundingagencydb = new Schema({
    name : String
});

const disciplinedb = new Schema({
    name: String 
});

const tpeofpaperdb = new Schema({
    name: String
});

const indexedindb = new Schema({
    name: String
});

const typeoffellowshipdb = new Schema({
    name: String
});

const universitydb = new Schema({
    name: String
});
paper.index({'name' : 1, 'ministry' : 1, 'discipline' : 1},{unique : true});
// paper.on('index',(err)=>{
//     console.log(err.message);
    
// })
// mongoose.set('useCreateIndex',true);
const User = mongoose.model('user',userSchema);
const  callpaper = mongoose.model('callforpaper',paper);
const callproposal = mongoose.model('callforproposal', proposal);
const callfellowship = mongoose.model('callforfellowship',fellowship);
const fundingagency = mongoose.model('fundingagency',fundingagencydb);
const discipline = mongoose.model('discipline',disciplinedb);
const typeofpaper = mongoose.model('typeofpaper',tpeofpaperdb);
const indexedin = mongoose.model('indexedin',indexedindb);
const typeoffellowship = mongoose.model('typeoffellowship',typeoffellowshipdb);
const university = mongoose.model('university',universitydb);

module.exports =  {callpaper,User,callfellowship,callproposal,fundingagency,discipline,typeofpaper,indexedin,typeoffellowship,university};
// module.exports = callpaper;
// module.exports = callproposal;
// module.exports = callfellowship;
// module.exports = ministry;
// module.exports = discipline;