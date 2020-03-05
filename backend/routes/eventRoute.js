var express = require("express");
var route = express.Router();
const { generateToken, decryptToken } = require("../service/tokenservice");
const { generateUUID } = require("../service/uuidservice");
const passport = require("../authenticate/passport_init");
const key = require("../service/key");

const {
  student_basic_details
  // student_profile,
  // student_education,
  // student_skills
} = require("../db/index");
const {
  student_profile,
  student_education,
  student_skills,
  student_experience
} = require("../db/studentmodel");
const{
    event,studentevents
} = require('../db/eventmodel')
const {company_basic_details} =require('../db/comapnymodel')
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");



route.get('/',async(req,res)=>{
     console.log("----------getting jobs")
  Decryptedtoken = decryptToken(req.headers.authorization);
  try {
    await student_basic_details
      .findOne({
        where: {
          emailId: Decryptedtoken.email
        }
      })
      .then(tokenuser => {
        console.log(
          tokenuser.dataValues.student_basic_detail_id + "in details ------------------------"
        );
        studentId = tokenuser.dataValues.student_basic_detail_id;
        email = tokenuser.dataValues.emailId;
        name= tokenuser.dataValues.name;

      })
      .catch(err =>{
        console.log(`error posting student journey ${err}`)
      });
    
      const result = await event.findAll({
        include:[{
              model:company_basic_details
           
          }]
      }
      )
      console.log("sending jobs-----------------"+result)
      res.status(201).send(
        {
          result:result 
        }
      )
}
catch(err)
{
  console.log(`error getting jobs ${err}`)
  res.status(500).send({
    errors: {
      body: err
    }

})
}
})




route.get('/registered',async(req,res)=>{
     console.log("----------getting jobs")
  Decryptedtoken = decryptToken(req.headers.authorization);
  try {
    await student_basic_details
      .findOne({
        where: {
          emailId: Decryptedtoken.email
        }
      })
      .then(tokenuser => {
        console.log(
          tokenuser.dataValues.student_basic_detail_id + "in details ------------------------"
        );
        studentId = tokenuser.dataValues.student_basic_detail_id;
        email = tokenuser.dataValues.emailId;
        name= tokenuser.dataValues.name;

      })
      .catch(err =>{
        console.log(`error posting student journey ${err}`)
      });
    
      const result = await studentevents.findAll({

        where:{
            student_basic_detail_id:studentId
        }      
    
      }
      )

        let eventIdArr=[]
      result.map(i=>{
          eventIdArr.push(i.event_detail_id)
      })
      console.log(eventIdArr);

      const finalresult= await event.findAll({
          where:{
              event_detail_id:eventIdArr
          },
          include:[{
              model:student_basic_details
          }]

      })    
      
     
      console.log("sending jobs-----------------"+result)
      res.status(201).send(
        {
          result:result 
        }
      )
}
catch(err)
{
  console.log(`error getting events ${err}`)
  res.status(500).send({
    errors: {
      body: err
    }

})
}
})






module.exports=route;