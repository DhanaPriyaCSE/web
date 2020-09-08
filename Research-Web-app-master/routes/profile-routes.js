const express = require('express');
const router = require('express').Router();
const { User, callpaper, callproposal, callfellowship, fundingagency, discipline, typeofpaper, indexedin, typeoffellowship, university}  = require('../db/userdb');
const authCheck = (req,res,next) =>{
    if(!req.user)
    {
        res.redirect('/');
    }
    else{
        next();
    }
}
const adminCheck =(req,res,next)=>{
    if(req.user.admin){
        next();
    }
    else{
        req.logout();
        req.flash('message', 'Login as Admin!!');
        res.redirect('/login');
    }
}
router.use(express.urlencoded({
    extended: true
}));
router.use(express.json());
router.post('/promoteUserPriviledge',authCheck,adminCheck,(req,res)=>{
    if(req.body._id){
        User.findOneAndUpdate({ _id: req.body._id},{admin : true}).then((doc)=>{
            if(doc){
                res.send("Promoted user successfully!");
            }
            else{
                res.send("Unable to find user!");
            }
        }).catch(err =>{
            console.log(err);
        })
    }
    else{
        res.send('Data Insufficient!!');
    }
});
router.post('/demoteUserPriviledge',authCheck,adminCheck,(req,res)=>{
    if(req.body._id){
        User.findOneAndUpdate({_id : req.body._id},{admin : false}).then((doc)=>{
            if(doc){
                res.send("Demoted user successfully!");
            }
            else{
                res.send("Unable to find user!");
            }
        }).catch(err =>{
            console.log(err);
        })
    }
    else{
        res.send('Data Insufficient!!');
    }
})
router.post('/deleteUser',authCheck,adminCheck,(req,res)=>{
    if (req.body._id){
        User.deleteOne({ _id: req.body._id}).then((doc)=>{
            if (doc.deletedCount !== 0) {
                res.send("Deleted user successfully!");
            }
            else{
                res.send("Unable to find and delete user!");
            }
        }).catch(err =>{
            console.log(err);
        })
    }
    else{
        res.send('Data Insufficient!!');
    }
});

router.post('/deleteCallforProposal',authCheck,adminCheck,(req,res)=>{
    if(req.body._id){
        callproposal.deleteOne({
            _id :req.body._id
        }).then((doc)=>{
            if(doc.deletedCount !== 0 ){
                res.send("Deleted Successfully!!");
            }
            else{
                res.send('Unable to find and delete the proposal!');
            }
        })
    }
    else{
        res.send("Insufficient data !!");
    }
});
router.post('/deleteCallforFellowship',authCheck,adminCheck,(req,res)=>{
    if(req.body._id){
        callfellowship.deleteOne({
            _id :req.body._id
        }).then((doc)=>{
            if (doc.deletedCount !== 0) {
                res.send("Deleted Successfully!!");
            }
            else{
                res.send('Unable to find and delete the fellowship!');
            }
        })
    }
    else{
        res.send("Insufficient data !!");
    }
});
router.post('/deleteCallforPaper',authCheck,adminCheck,(req,res)=>{
    if(req.body._id){
        callpaper.deleteOne({
            _id :req.body._id
        }).then((doc)=>{
            if(doc.deletedCount !== 0 ){
                res.send("Deleted Successfully!!");
            }
            else{
                res.send('Unable to find and delete the paper!');
            }
        })
    }
    else{
        res.send("Insufficient data !!");
    }
});
router.post('/addOrChangeCallforProposal',authCheck,adminCheck,(req,res)=>{
    if(req.body._id && req.body.name.trim() && req.body.description && (req.body.agencyId.length !== 0) && req.body.link && (req.body.disciplineId.length !== 0) && req.body.publishdate && req.body.lastdate){
        callproposal.findOneAndUpdate({
            _id: req.body._id
        },{
            name : req.body.name.trim(),
            description : req.body.description,
            link: req.body.link,
            fundingagency : req.body.agencyId,
            discipline : req.body.disciplineId,
            publishdate : (new Date(req.body.publishdate)).toISOString(),
            lastdate : (new Date(req.body.lastdate)).toISOString()
        }).then((doc)=>{
            if(doc){
                res.send("Proposal edited successfully");
            }
            else{
                res.send("Proposal not found!!!");
            }
        })
    }
    else if (req.body.name.trim() && req.body.description && (req.body.agencyId.length !== 0) && req.body.link && (req.body.disciplineId.length !== 0) && req.body.publishdate && req.body.lastdate) {
        new callproposal({
            name: req.body.name.trim(),
            description: req.body.description,
            link: req.body.link,
            fundingagency: req.body.agencyId,
            discipline: req.body.disciplineId,
            publishdate: (new Date(req.body.publishdate)).toISOString(), 
            lastdate: (new Date(req.body.lastdate)).toISOString()
        }).save().then((doc)=>{
            if(doc){
                res.send('Proposal added successfully!');
            }
            else{
                res.send('Unable to add Proposal!');
            }
        }).catch((err)=>{
            console.log(err);
        });
    }
    else {
        res.send("Insufficient data !!");
    }
            
});
router.post('/addOrChangeCallforPaper',authCheck,adminCheck,(req,res)=>{
    if (req.body._id && req.body.name.trim() && req.body.description && req.body.conferencevenue && req.body.link && req.body.typeofpaper && req.body.indexedin && req.body.publishdate && req.body.lastdatesubmission) {
        callpaper.findOneAndUpdate({
            _id: req.body._id
        },{
            name : req.body.name.trim(),
            description: req.body.description,
            conferencevenue : req.body.conferencevenue,
            link : req.body.link,
            typeofpaper: req.body.typeofpaper,
            indexedin : req.body.indexedin,
            publishdate : (new Date(req.body.publishdate)).toISOString(),
            lastdatesubmission : (new Date(req.body.lastdatesubmission)).toISOString()
        }).then((doc)=>{
            if(doc){
                res.send("Paper edited successfully");
            }
            else{
                res.send("Paper not found!!!");
            }
        })
    }
    else if (req.body.name.trim() && req.body.description && req.body.conferencevenue && req.body.link && req.body.typeofpaperId && req.body.indexedinId && req.body.publishdate && req.body.lastdatesubmission) {
        new callpaper({
            name: req.body.name.trim(),
            description: req.body.description,
            conferencevenue: req.body.conferencevenue,
            link: req.body.link,
            typeofpaper: req.body.typeofpaperId,
            indexedin: req.body.indexedinId,
            publishdate: (new Date(req.body.publishdate)).toISOString(),
            lastdatesubmission: (new Date(req.body.lastdatesubmission)).toISOString()
        }).save().then((doc)=>{
            if(doc){
                res.send('Paper added successfully!');
            }
            else{
                res.send('Unable to add Paper!');
            }
        }).catch((err)=>{
            console.log(err);
        });
    }
    else {
        res.send("Insufficient data !!");
    }
            
});
router.post('/addOrChangeCallforFellowship', authCheck,adminCheck, (req, res) => {
    if (req.body._id && req.body.researchtopic.trim() && req.body.description && req.body.publishdate && req.body.lastdateapplication && req.body.link && req.body.typeoffellowshipId && req.body.universityId) {
        callfellowship.findOneAndUpdate({
            _id: req.body._id
        }, {
            researchtopic: req.body.researchtopic.trim(),
            description: req.body.description,
            publishdate: (new Date(req.body.publishdate)).toISOString(),
            lastdateapplication: (new Date(req.body.lastdateapplication)).toISOString(),
            link: req.body.link,
            typeoffellowship : req.body.typeoffellowshipId,
            university : req.body.universityId
        }).then((doc) => {
            if (doc) {
                res.send("Fellowship edited successfully");
            }
            else {
                res.send("Fellowship not found!!!");
            }
        })
    }
    else if (req.body.researchtopic.trim() && req.body.description && req.body.publishdate && req.body.lastdateapplication && req.body.link && req.body.typeoffellowshipId && req.body.universityId) {
        new callfellowship({
            researchtopic: req.body.researchtopic.trim(),
            description: req.body.description,
            publishdate: (new Date(req.body.publishdate)).toISOString(),
            lastdateapplication: (new Date(req.body.lastdateapplication)).toISOString(),
            link: req.body.link,
            typeoffellowship: req.body.typeoffellowshipId,
            university: req.body.universityId
        }).save().then((doc) => {
            if (doc) {
                res.send('Fellowship added successfully!');
            }
            else {
                res.send('Unable to add Fellowship!');
            }
        }).catch((err) => {
            console.log(err);
        });
    }
    else {
        res.send("Insufficient data !!");
    }

});
router.post('/addFundingagency', authCheck, adminCheck, (req, res) => {
    if (!req.body.name.trim()) {
        res.send("Insufficient data !!");
    }
    fundingagency.findOne({ name: req.body.name.trim() }).then((fundingagencyDetails) => {
        if (fundingagencyDetails) {
            res.send('Fundingagency already exists');
        }
        else {
            new fundingagency({
                name: req.body.name.trim()
            }).save().then((newFundingagency) => {
                if (newFundingagency) {
                    res.send('Fundingagency created successfully!');
                }
                else {
                    res.send('Unable to create fundingagency!');
                }
            }).catch((err) => {
                console.log(err);
            });
        }
    })
});
router.post('/updateFundingagency',authCheck,adminCheck,(req,res)=>{
    if(req.body._id && req.body.name.trim()){
        fundingagency.findOneAndUpdate({ _id : req.body._id },{ name : req.body.name.trim() }).then((doc)=>{
            if(doc){
                res.send('Updated Successfully!!');
            }
            else{
                res.send('Fundingagency not found!!!');
            }
        });
    }
    else{
        res.send('Insufficient data !!');
    }
});
router.post('/deleteFundingagency', authCheck, adminCheck, (req, res) => {
    let proposalDetails;
    if (req.body._id) {
        callproposal.find({ fundingagency: req.body._id }).then((proposalDetails) => {
            if (proposalDetails.length == 0) {
            fundingagency.deleteOne({
                _id: req.body._id
            }).then((doc) => {
                if (doc.deletedCount !== 0) {
                    res.send("Deleted Successfully!!");
                } else {
                    res.send('Unable to find and delete the fundingagency!');
                }
            })
            }
            else {
                res.send("cannot delete!!!");
            }
        })
    }
    else {
        res.send("Insufficient data !!");
    }
});

router.post('/addDiscipline',authCheck,adminCheck,(req,res)=>{
    if (!req.body.name.trim()) {
        res.send("Insufficient data !!");
    }
    discipline.findOne({name : req.body.name.trim()}).then((disciplineDetails)=>{
        if(disciplineDetails){
            res.send('Discipline already exists');
        }
        else{
            new discipline({
                name : req.body.name.trim().trim()
            }).save().then((newDiscipline)=>{
                if(newDiscipline){
                    res.send('Discipline created successfully!');
                }
                else{
                    res.send('Unable to create discipline!');
                }
            }).catch((err)=>{
                console.log(err);
            });
        }
    })
});

router.post('/updateDiscipline', authCheck, adminCheck, (req, res) => {
    if (req.body._id && req.body.name.trim()) {
        
        
        discipline.findOneAndUpdate({ _id: req.body._id }, { name: req.body.name.trim() }).then((doc) => {
            if (doc) {
                res.send('Updated Successfully!!');
            }
            else {
                res.send('Discipline not found!!!');
            }
        }).catch((err)=>{
            console.log(err);
        });
    }
    else {
        res.send('Insufficient data !!');
    }
});

router.post('/deleteDiscipline', authCheck, adminCheck, (req, res) => {
    let proposalDetails;
    if(req.body._id){
    callproposal.find({ discipline: req.body._id }).then((proposalDetails) => {
        if (proposalDetails.length == 0) {
        discipline.deleteOne({
            _id: req.body._id
        }).then((doc) => {
            if (doc.deletedCount !== 0) {
                res.send("Deleted Successfully!!");
            } else {
                res.send('Unable to find and delete the discipline!');
            }
        })
        } 
        else  {
            res.send("cannot delete!!!");
        }
    })
    }
    else {
        res.send("Insufficient data !!");
    }
});

router.post('/addTypeofpaper', authCheck, adminCheck, (req, res) => {
    if (!req.body.name.trim()) {
        res.send("Insufficient data !!");
    }
    typeofpaper.findOne({ name: req.body.name.trim() }).then((typeofpaperDetails) => {
        if (typeofpaperDetails) {
            res.send('Typeofpaper already exists');
        }
        else {
            new typeofpaper({
                name: req.body.name.trim()
            }).save().then((newTypeofpaper) => {
                if (newTypeofpaper) {
                    res.send('Typeofpaper created successfully!');
                }
                else {
                    res.send('Unable to create typeofpaper!');
                }
            }).catch((err) => {
                console.log(err);
            });
        }
    })
});

router.post('/updateTypeofpaper', authCheck, adminCheck, (req, res) => {
    if (req.body._id && req.body.name.trim()) {
        typeofpaper.findOneAndUpdate({
            _id: req.body._id
        }, {
            name: req.body.name.trim()
        }).then((doc) => {
            if (doc) {
                res.send('Updated Successfully!!');
            } else {
                res.send('Typeofpaper not found!!!');
            }
        });
    } else {
        res.send('Insufficient data !!');
    }
});

router.post('/deleteTypeofpaper', authCheck, adminCheck, (req, res) => {
    let paperDetails;
    if (req.body._id) {
        callpaper.find({ typeofpaper: req.body._id }).then((paperDetails) => {
            if (paperDetails.length == 0) {
        typeofpaper.deleteOne({
            _id: req.body._id
        }).then((doc) => {
            if (doc.deletedCount !== 0) {
                res.send("Deleted Successfully!!");
            } else {
                res.send('Unable to find and delete the typeofpaper!');
            }
        })
            }
            else {
                res.send("cannot delete!!!");
            }
        })
    }
    else {
        res.send("Insufficient data !!");
    }
});
router.post('/addIndexedin', authCheck, adminCheck, (req, res) => {
    if (!req.body.name.trim()) {
        res.send("Insufficient data !!");
    }
    indexedin.findOne({ name: req.body.name.trim() }).then((indexedinDetails) => {
        if (indexedinDetails) {
            res.send('Indexedin already exists');
        }
        else {
            new indexedin({
                name: req.body.name.trim()
            }).save().then((newIndexedin) => {
                if (newIndexedin) {
                    res.send('Indexedin created successfully!');
                }
                else {
                    res.send('Unable to create indexedin!');
                }
            }).catch((err) => {
                console.log(err);
            });
        }
    })
});
router.post('/updateIndexedin',authCheck,adminCheck,(req,res)=>{
    if (req.body._id && req.body.name.trim()) {
        indexedin.findOneAndUpdate({
            _id: req.body._id
        }, {
            name: req.body.name.trim()
        }).then((doc) => {
            if (doc) {
                res.send('Updated Successfully!!');
            } else {
                res.send('Indexedin not found!!!');
            }
        });
    } else {
        res.send('Insufficient data !!');
    }
});

router.post('/deleteIndexedin', authCheck, adminCheck, (req, res) => {
    let paperDetails;
    if (req.body._id) {
        callpaper.find({ indexedin: req.body._id }).then((paperDetails) => {
            if (paperDetails.length == 0) {

        indexedin.deleteOne({
            _id: req.body._id
        }).then((doc) => {
            if (doc.deletedCount !== 0) {
                res.send("Deleted Successfully!!");
            } else {
                res.send('Unable to find and delete the indexedin!');
            }
        })
            }
            else {
                res.send("cannot delete!!!");
            }
        })
    }
    else {
        res.send("Insufficient data !!");
    }
});
router.post('/addTypeoffellowship', authCheck, adminCheck, (req, res) => {
    if (!req.body.name.trim()) {
        res.send("Insufficient data !!");
    }
    typeoffellowship.findOne({ name: req.body.name.trim() }).then((typeoffellowshipDetails) => {
        if (typeoffellowshipDetails) {
            res.send('Typeoffellowship already exists');
        }
        else {
            new typeoffellowship({
                name: req.body.name.trim()
            }).save().then((newTypeoffellowship) => {
                if (newTypeoffellowship) {
                    res.send('Typeoffellowship created successfully!');
                }
                else {
                    res.send('Unable to create typeoffellowship!');
                }
            }).catch((err) => {
                console.log(err);
            });
        }
    })
});

router.post('/updateTypeoffellowship', authCheck, adminCheck, (req, res) => {
    if (req.body._id && req.body.name.trim()) {
        typeoffellowship.findOneAndUpdate({
            _id: req.body._id
        }, {
            name: req.body.name.trim()
        }).then((doc) => {
            if (doc) {
                res.send('Updated Successfully!!');
            } else {
                res.send('Typeoffellowship not found!!!');
            }
        });
    } else {
        res.send('Insufficient data !!');
    }
});

router.post('/deleteTypeoffellowship', authCheck, adminCheck, (req, res) => {
    let fellowshipDetails;
    if (req.body._id) {
        callfellowship.find({ typeoffellowship: req.body._id }).then((fellowshipDetails) => {
            if (fellowshipDetails.length == 0) {
        typeoffellowship.deleteOne({
            _id: req.body._id
        }).then((doc) => {
            if (doc.deletedCount !== 0) {
                res.send("Deleted Successfully!!");
            } else {
                res.send('Unable to find and delete the typeoffellowship!');
            }
        })
            }
            else {
                res.send("cannot delete!!!");
            }
        })
    }
    else {
        res.send("Insufficient data !!");
    }
});

router.post('/addUniversity', authCheck, adminCheck, (req, res) => {
    if (!req.body.name.trim()) {
        res.send("Insufficient data !!");
    }
    university.findOne({ name: req.body.name.trim() }).then((universityDetails) => {
        if (universityDetails) {
            res.send('University already exists');
        }
        else {
            new university({
                name: req.body.name.trim()
            }).save().then((newUniversity) => {
                if (newUniversity) {
                    res.send('University created successfully!');
                }
                else {
                    res.send('Unable to create university!');
                }
            }).catch((err) => {
                console.log(err);
            });
        }
    })
});

router.post('/updateUniversity', authCheck, adminCheck, (req, res) => {
    if (req.body._id && req.body.name.trim()) {
        university.findOneAndUpdate({
            _id: req.body._id
        }, {
            name: req.body.name.trim()
        }).then((doc) => {
            if (doc) {
                res.send('Updated Successfully!!');
            } else {
                res.send('University not found!!!');
            }
        });
    } else {
        res.send('Insufficient data !!');
    }
});

router.post('/deleteUniversity', authCheck, adminCheck, (req, res) => {
    let fellowshipDetails;
    if (req.body._id) {
        callfellowship.find({ university: req.body._id }).then((fellowshipDetails) => {
            if (fellowshipDetails.length == 0) {
        university.deleteOne({
            _id: req.body._id
        }).then((doc) => {
            if (doc.deletedCount !== 0) {
                res.send("Deleted Successfully!!");
            } else {
                res.send('Unable to find and delete the university!');
            }
        })
    }
    else {
        res.send("cannot delete!!!");
    }
})
    }
    else {
    res.send("Insufficient data !!");
}
});


router.get('/getFellowships',authCheck,(req,res)=>{
    let fellowshipDetails;
    callfellowship.find().sort({ lastdateapplication: 1 }).populate('typeoffellowship').populate('university').then((fellowshipDetails) => {
        if (fellowshipDetails.length !== 0) {
            res.json({fellowships : fellowshipDetails});
        } else {
            new callfellowship({
                    researchtopic: "Blockchain",
                    description: "A highly valued fellowship",
                    publishdate: new Date().toISOString(),
                    lastdateapplication: new Date('2020-07-28').toISOString(),
                    link: "https://drive.google.com/file/d/0B4btkH8NtYpiZFBMSGZ1YWFsRnpWWFF4bDZFS2JhbE5pWXM0/view?usp=sharing",
                typeoffellowship: "5f1c7219ebd3b3001786dfcd",
                university: "5f02d06a19a74204185bb18b"
                })
                .save()
                .then((fellowshipDetails) => {
                    res.json({fellowships : fellowshipDetails});
                }).catch((err)=>{
                    console.log(err);
                })
            }
        })
    });
router.get('/getProposals',authCheck,(req,res)=>{
    let proposalDetails;
    callproposal.find().sort({ lastdate: 1 }).populate('fundingagency').populate('discipline').then((proposalDetails) => {
        if (proposalDetails.length !== 0) {
            res.json({proposals : proposalDetails});
        } else {
            new callproposal({
                    name : "IIT Proposal",
                    description : "A highly valued proposal",
                    link:"https://drive.google.com/file/d/0B4btkH8NtYpiZFBMSGZ1YWFsRnpWWFF4bDZFS2JhbE5pWXM0/view?usp=sharing",
                    fundingagency: ["5f02d0721638351638c5448b"],
                    discipline: ["5f02d07286846117f4d6db57"],
                    publishdate : new Date().toISOString(),
                    lastdate : new Date('2020-07-28').toISOString()
                })
                .save()
                .then((proposalDetails) => {
                    res.json({proposals : proposalDetails});
                }).catch((err)=>{
                    console.log(err);
                })
            }
        })
    });
router.get('/getPapers',authCheck,(req,res)=>{
    let paperDetails;
    callpaper.find().sort({ lastdatesubmission : 1 }).populate('typeofpaper').populate('indexedin').then((paperDetails)=>{
        if (paperDetails.length !== 0 ) {
            res.json({papers : paperDetails});
        } else {
                    new callpaper({
                        name: "IIT Paper",
                        conferencevenue: "Chennai",
                        description: "A highly valued paper",
                        link: "https://drive.google.com/file/d/0B4btkH8NtYpiZFBMSGZ1YWFsRnpWWFF4bDZFS2JhbE5pWXM0/view?usp=sharing ",
                        typeofpaper: "5f02d07237bbe91184be59c5",
                        indexedin: "5f02d06819a74204185bb189",
                        publishdate: new Date().toISOString(),
                        lastdatesubmission: new Date('2020-07-28').toISOString()
                        })
                        .save()
                        .then((paperDetails) => {
                            res.json({papers : paperDetails});
                        }).catch((err)=>{
                            console.log(err);
                        })
            }
        })
    });
router.get('/getFundingagency',authCheck,(req,res)=>{
    let FundingagencyDetails;
    fundingagency.find().sort({ name: 1 }).then((FundingagencyDetails)=>{
        if (FundingagencyDetails.length !== 0 ) {
            res.json({ fundingagencies : FundingagencyDetails});
        } else {
            new fundingagency({
                name:"Department of science and technology"
            })
            .save()
                .then((FundingagencyDetails) => {
                    res.json({ fundingagencies : FundingagencyDetails});
                }).catch((err)=>{
                    console.log(err);
                })
            }
        })
    });
router.get('/getDiscipline',authCheck,(req,res)=>{
    let disciplineDetails;
    discipline.find().sort({ name: 1 }).then((disciplineDetails)=>{
        if (disciplineDetails.length !== 0 ) {
            res.json({disciplines : disciplineDetails});
        } else {
            new discipline({
                name:"AI"
            })
            .save()
            .then((disciplineDetails) => {
                    res.json({disciplines : disciplineDetails});
                }).catch((err)=>{
                    console.log(err);
                })
            }
        })
    });

router.get('/getTypeofpaper', authCheck, (req, res) => {
    let TypeofpaperDetails;
    typeofpaper.find().sort({ name: 1 }).then((TypeofpaperDetails) => {
        if (TypeofpaperDetails.length !== 0) {
            res.json({ typeofpapers: TypeofpaperDetails });
        } else {
            new typeofpaper({
                name: "Conference"
            })
                .save()
                .then((TypeofpaperDetails) => {
                    res.json({ typeofpapers: TypeofpaperDetails });
                }).catch((err) => {
                    console.log(err);
                })
        }
    })
});

router.get('/getIndexedin', authCheck, (req, res) => {
    let IndexedinDetails;
    indexedin.find().sort({ name: 1 }).then((IndexedinDetails) => {
        if (IndexedinDetails.length !== 0) {
            res.json({ indexedin: IndexedinDetails });
        } else {
            new indexedin({
                name: "Scopus, WoS"
            })
                .save()
                .then((IndexedinDetails) => {
                    res.json({ indexedin: IndexedinDetails });
                }).catch((err) => {
                    console.log(err);
                })
        }
    })
});

router.get('/getTypeoffellowship',authCheck, (req, res) => {
    let TypeoffellowshipDetails;
    typeoffellowship.find().sort({ name: 1 }).then((TypeoffellowshipDetails) => {
        if (TypeoffellowshipDetails.length !== 0) {
            res.json({ typeoffellowships: TypeoffellowshipDetails });
        } else {
            new typeoffellowship({
                name: "Young India Fellowship"
            })
                .save()
                .then((TypeoffellowshipDetails) => {
                    res.json({ typeoffellowships: TypeoffellowshipDetails });
                }).catch((err) => {
                    console.log(err);
                })
        }
    })
});
router.get('/getUniversity',authCheck, (req, res) => {
    let UniversityDetails;
    university.find().sort({ name: 1 }).then((UniversityDetails) => {
        if (UniversityDetails.length !== 0) {
            res.json({ universities: UniversityDetails });
        } else {
            new university({
                name: "Gdansk University of Technology, Department of Physical Chemistry"
            })
                .save()
                .then((UniversityDetails) => {
                    res.json({ Universities : UniversityDetails });
                }).catch((err) => {
                    console.log(err);
                })
        }
    })
});
router.get('/getUser',authCheck,adminCheck, (req, res) => {
    let userDetials;
    User.find().where('Email').ne(req.user.Email).sort({userName: 1 }).then((userDetails) => {
        if (userDetails.length !== 0) {
            res.json({ users: userDetails });
        } else {
            console.log("error");
        }
    })
});
        
    // callpaper.findOne({
    //     name: "IIT Paper",
    //     ministry: "5ef2fcc1cfceda46d93484e7",
    //     discipline: "5ef2fcc1cfceda46d93484e7"
    // },function (err,res) {
    //     console.log(err,res);
        
    // })
    // then((paperDetails) => {
    //     console.log(paperDetails);
    //     if (paperDetails) {
    //         res.json(paperDetails);
    //     } else {
    //         new callpaper({
    //                 name : "IIT Paper",
    //                 description : "A highly valued paper",
    //                 ministry: "5ef2fcc1cfceda46d93484e7",
    //                 discipline: "5ef2fcc1cfceda46d93484e7",
    //                 publishdate : new Date().toISOString(),
    //                 lastdate : new Date('2020-06-28').toISOString()
    //             })
    //             .save()
    //             .then((paperDetails) => {
    //                 res.json(paperDetails);
    //             }).catch((err)=>{
    //                 console.log(err);
    //             })
    //     }
    // });
router.get('/',authCheck,(req,res)=>{
    if(req.user.admin){
        res.render('admin',{user : req.user});
    }
    else{
        res.render('profile',{user : req.user});
    }
});

module.exports = router;