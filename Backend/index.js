import express from 'express'; /* Same as 'const express = require('express')', but to import we need to add ' type: "module" ' to package.json*/
import mongoose from 'mongoose';
import cors from 'cors';
import TAModel from './Models/TA_Schema.js'
import FacultyModel from './Models/Faculty_Schema.js'
import AdminModel from './Models/Admin_Schema.js'
import CourseModel from './Models/Course_Schema.js'
import TaskModel from './Models/Task_Schema.js'
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'

// Needed for configuring any App with Node.js
const app = express()
//const jwt = require("jsonwebtoken")
app.use(express.json())
app.use(express.urlencoded())
app.use(cors())
app.listen(9000,() => {console.log("Back-end Started at port 9000")})

// Creating DB. Name of DB = Login_pagesDB
mongoose.connect("mongodb://localhost:27017/TAMS_DB", 
                    {
                        useNewUrlParser: true,
                        useUnifiedTopology : true
                    },
                    function(error) {if(error){console.log(error)}else{console.log("DB Connected")}}, /* Just to see if the DB got connected successfully or not*/
                )

//Checking if the admin db has at least one admin. Adding one, if not.
mongoose.connection.once("open", ()=>
{
  mongoose.connection.db.listCollections().toArray(async function (err, collectionNames) {
    if (err) {
      console.log(err);
      return;
    }
    let obj = collectionNames.find(data => data.name === 'admins');
    if (obj === undefined || obj.length === 0) 
    {
        const name ="Sidharth Saxena"
        const email = "h20220282@pilani.bits-pilani.ac.in"
        const new_pass = "pass"
        const salt = await bcrypt.genSalt(10);
        const pass = await bcrypt.hash(new_pass, salt);
        const type = "Admin"
        const phone_num = 9611988905
        const dept = "CSIS"
        const image_url = ""

        const Admin  = new AdminModel(
                        {
                            name,
                            type,
                            email,
                            pass,
                            phone_num,
                            dept,
                            image_url
                        })
        Admin.save()
    }
  });
})
.on("error", (err)=>{console.warn(err)})
//AdminModel.find(async (err,course) => 
//{
//    if(err)
//    {
//        const name ="Sidharth Saxena"
//        const email = "h20220282@pilani.bits-pilani.ac.in"
//        const new_pass = "pass"
//        const salt = await bcrypt.genSalt(10);
//        const securePassword = await bcrypt.hash(new_pass, salt);
//        const type = "Admin"
//        const phone_num = 9611988905
//        const dept = "CSIS"
//        const image_url = ""
//        const Admin  = new AdminModel(
//            {
//                name,
//                type,
//                email,
//                securePassword,
//                phone_num,
//                dept,
//                image_url
//            })
//            Admin.save()
//    }
//})


//JWT Key and verification
const accessTokenSecretKey = "nitrogenoxygenkryptonargon"
const refreshTokenSecretKey = "spidersilkglycinealanine" //Amino acids in spider's webs (coz why not)
/*
One could store refresh tokens in a DB so it can be accessed even after closing the browser, but for simplicity, 
here it will be available as long as the TAMS backend is running by storing it in this array on server side. 
*/
let refreshTokens=[]
function generateJWTAccessToken(userEmail,userType)
{
    //Access token will expire in 15 minutes. Refresh token may be used to regenerate it post that.
    return jwt.sign({email:userEmail, type:userType}, accessTokenSecretKey, {expiresIn:"5m"})
}
function generateJWTRefreshToken(userEmail,userType)
{
    //Refresh token will never expire.
    return jwt.sign({email:userEmail, type:userType}, refreshTokenSecretKey)
}
function verify(req,res,next)
{
    const authHeader=req.headers.authorization;
    if(authHeader)
    {
        const token=authHeader.split(" ")[1];
        jwt.verify(token, accessTokenSecretKey, (err,user)=>
        {
            if(err)
            {
                return res.status(403).json("Invalid Token!");
            }
            req.user = user;
            next();
        })
    }
    else
    {
        res.status(401).json("You are not authenticated!"); 
    }
}

//ROUTES :-
//LOGIN PAGES BACKEND :-
//Login Page:-
app.post("/Login", (req,res) => 
{
    const {email,pass,type} = req.body
    // Searches the DB for a user with entered email ID. If it finds one, it returns the user otherwise it returns an error
    if(type=="TA")
    {
        TAModel.findOne({email:email}, async (err,user) => 
        {
            if(user)
            {
                const passwordCompare = await bcrypt.compare(pass, user.pass);
                if(passwordCompare)
                {
                    const accessToken = generateJWTAccessToken(user.email,user.type);
                    const refreshToken = generateJWTRefreshToken(user.email,user.type);
                    refreshTokens.push(refreshToken);                        
                    res.send({message:"Login Successful",userEmail:user.email,userType:user.type,accessToken:accessToken,refreshToken:refreshToken})
                }
                else
                {
                    res.send({message:"Incorrect Password Entered."})
                }
            }
            else
            {
                res.send({message:"Looks like you are not a registered user."})
            }
        })
    }
    if(type=="Faculty")
    {
        FacultyModel.findOne({email:email}, async (err,user) => 
        {
            if(user)
            {
                const passwordCompare = await bcrypt.compare(pass, user.pass);
                if(passwordCompare)
                {
                    const accessToken = generateJWTAccessToken(user.email,user.type); 
                    const refreshToken = generateJWTRefreshToken(user.email,user.type);
                    refreshTokens.push(refreshToken);
                    res.send({message:"Login Successful",userEmail:user.email,userType:user.type,accessToken:accessToken,refreshToken:refreshToken})
                }
                else
                {
                    res.send({message:"Incorrect Password Entered."})
                }
            }
            else
            {
                res.send({message:"Looks like you are not a registered user."})
            }
        })
    }
    if(type=="Admin")
    {
        AdminModel.findOne({email:email}, async (err,user) => 
        {
            if(user)
            {
                const passwordCompare = await bcrypt.compare(pass, user.pass);
                if(passwordCompare)
                {
                    const accessToken = generateJWTAccessToken(user.email,user.type);
                    const refreshToken = generateJWTRefreshToken(user.email,user.type);
                    refreshTokens.push(refreshToken);
                    res.send({message:"Login Successful",userEmail:user.email,userType:user.type,accessToken:accessToken,refreshToken:refreshToken})
                }
                else
                {
                    res.send({message:"Incorrect Password Entered."})
                }
            }
            else
            {
                res.send({message:"Looks like you are not a registered user."})
            }
        })
    }
})

//Logout (Removing Refresh Token)
app.post("/Logout", verify, (req, res) => 
{
    const refreshToken = req.body.token;
    refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
    res.status(200).json("You logged out successfully.");
});

//Creating new access and refresh tokens from existing refresh token
app.post("/Refresh", (req,res)=>
{
    //take the refresh token from the user
    const refreshToken = req.body.token;
    //send error if there is no token or it's invalid
    if (!refreshToken) 
    {
        return res.status(401).json("You are not authenticated!");
    }
    if (!refreshTokens.includes(refreshToken)) 
    {
      return res.status(403).json("Refresh token is not valid!");
    }
    
    jwt.verify(refreshToken, refreshTokenSecretKey, (err, user) => {
      err && console.log(err);
      //Remove this refresh token from the array as it has been used
      refreshTokens = refreshTokens.filter((token) => token !== refreshToken);

      //Generate the new tokens
      const newAccessToken = generateJWTAccessToken(user.email,user.type);
      const newRefreshToken = generateJWTRefreshToken(user.email,user.type);
      refreshTokens.push(newRefreshToken);
  
      res.status(200).json({
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      });
    });
})


//Recover Password
app.post("/Recover_pass", async (req,res) => 
{
    const {email,type}=req.body

    // Generating new 5 character random password
    const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var new_pass = '';
    const charactersLength = characters.length;
    for (var i = 0; i < 5; i++) 
    {
        new_pass += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    // Encrypting Password
    const salt = await bcrypt.genSalt(10);
    const securePassword = await bcrypt.hash(new_pass, salt);

    // Query for updating the password to the new one 
    const query = {$set : {pass:securePassword}};


    // Searches the DB for a user with entered email ID. If it finds one, it returns the user otherwise it returns an error
    if(type=="TA")
    {
        TAModel.updateOne({email:email}, query, (err,user) => 
        {
            if(user)
            {
                TAModel.findOne({email:email}, (err,user) =>
                {
                    res.send({found:true,rpass:new_pass,rname:user.name})
                })
            }
            else
            {
                res.send({found:false})
            }
        })
    }
    if(type=="Faculty")
    {
        FacultyModel.updateOne({email:email}, query, (err,user) => 
        {
            if(user)
            {
                FacultyModel.findOne({email:email}, (err,user) =>
                {
                    res.send({found:true,rpass:new_pass,rname:user.name})
                })
            }
            else
            {
                res.send({found:false})
            }
        })
    }
    if(type=="Admin")
    {
        AdminModel.updateOne({email:email}, query, (err,user) => 
        {
            if(user)
            {
                AdminModel.findOne({email:email}, (err,user) =>
                {
                    res.send({found:true,rpass:new_pass,rname:user.name})
                })  
            }
            else
            {
                res.send({found:false})
            }
        })
    }
})



//Before executing the post function, "verify" function (middleware) is executed first
app.post("/Add_TA", verify , async (req,res) => 
{
    //req.user is obtained from the jwt token after "verify" is executed, as we put req.user=user and user in the context of jwt token has userId and userType
    if(req.user.type=="Faculty"||req.user.type=="Admin") 
    {
        //const {name,type,email,pass,phone_num,dept,Application_Status} = req.body
        const name=req.body.Name
        const type=req.body.Type
        const email=req.body.Email
        const password=req.body.Pass
        const phone_num=req.body.Contact_Num
        const dept=req.body.Dept
        const Application_Status=req.body.Application_Status

        const salt = await bcrypt.genSalt(10);
        const securePassword = await bcrypt.hash(password, salt);
        const pass = securePassword;

        TAModel.findOne({email:email}, (err,TA) => 
        {
                if(TA)
                {
                    res.send({message:"A student with this email ID already exists."})
                }
                else
                {
                    TAModel.findOne({phone_num:phone_num}, (err,TA) =>
                    {
                        if(TA)
                        {
                            res.send({message:"This phone number is already taken."})
                        }
                        else
                        {
                            const TA  = new TAModel(
                                {
                                    name,
                                    type,
                                    email,
                                    pass,
                                    phone_num,
                                    dept,
                                    Application_Status
                                })
                                TA.save( err => 
                                    {
                                        if(err)
                                        {
                                            console.log(err)
                                        }
                                        else
                                        {
                                            res.send({message:"Student Successfully Added!"})
                                        }
                                    })

                        }

                    })


                }

        })
    }
    else
    {
        res.status(403).send({message:"You are not allowed to add TAs!"})
    }

})



app.post("/Add_Course", verify, (req,res) => 
{
    
    //const {name,type,email,pass,phone_num,dept,Application_Status} = req.body
    const name=req.body.course_name
    const code=req.body.course_code

    if(req.user.type=="Admin") 
    {
        CourseModel.findOne({code:code}, (err,Course) => 
        {
                if(Course)
                {
                    res.send({message:"A course with this Course Code already exists."})
                }
                else
                {

                    const Course  = new CourseModel(
                    {
                        name,
                        code
                    })
                    Course.save( err => 
                    {
                        if(err)
                        {
                            console.log(err)
                        }
                        else
                        {
                            res.send({message:"Course Successfully Added"})
                        }
                    })

                }

        })
    }
    else
    {
        res.status(403).send({message:"You are not allowed to add Courses!"})
    }
                

})


//RETREIVING COURSES BACKEND
app.get("/fetch_courses", verify, (req,res) => 
{
    if(req.user) 
    {
        CourseModel.find((err,course) => 
        {
            if(err)
            {
                res.send({message:"No courses available"})
            }
            else
            {
                res.send(course)
            }
        })
    }
    else
    {
        res.status(403).send({message:"You are not allowed to view courses!"})
    }


})

//RETREIVING COURSE BACKEND
app.post("/fetch_course",verify, (req,res) => 
{
    if(req.user.type=="Admin"||req.user.type=="Faculty") 
    {
        const query = req.body.course_code ? { code:req.body.course_code} : {_id:req.body._id}
        CourseModel.findOne(query,(err,course) => 
        {
            if(err)
            {
                res.send({message:"No courses available"})
            }
            else
            {
                res.send(course)
            }
        })
    }
    else
    {
        res.status(403).send({message:"You are not allowed to view courses!"})
    }
})


//RETREIVING FACULTIES
app.get("/fetch_faculties",verify, (req,res) => 
{
    if(req.user.type=="Admin") 
    {
        FacultyModel.find((err,Faculties) => 
        {
            if(err)
            {
                res.send({message:"No faculties available"})
            }
            else
            {
                res.send(Faculties)
            }
        })
    }
    else
    {
        res.status(403).send({message:"You are not allowed to view faculties!"})
    }

})

//RETREIVING FACULTY'S COURSES
app.post("/fetch_faculty_courses",verify, (req,res) => 
{
    if(req.user.type=="Faculty") 
    {
        const email = req.body.facultyEmail;
        FacultyModel.findOne({email:email},(err,Faculty) => 
        {
            if(err)
            {
                res.send({message:"No faculties available"})
            }
            else
            {
                res.send({courses:Faculty.courses})
            }
        })
    }
    else
    {
        res.status(403).send({message:"You are not allowed to view this faculty's courses!"})
    }

})


//RETREIVING FACULTY
app.post("/fetch_faculty",verify, (req,res) => 
{
    const id = req.body.id
    if(req.user) 
    {
        FacultyModel.findOne({_id:id},(err,Faculty) => 
        {
            if(err)
            {
                console.log(err)
            }
            else
            {
                res.send(Faculty)
            }
        })
    }
    else
    {
        res.status(403).send({message:"You are not allowed to view faculties!"})
    }

})
 
//RETREIVING FACULTY BY EMAIL
app.post("/fetch_faculty_by_email",verify, (req,res) => 
{
    const email = req.body.email
    if(req.user) 
    {
        FacultyModel.findOne({email:email},(err,Faculty) => 
        {
            if(err)
            {
                console.log(err)
            }
            else
            {
                res.send(Faculty)
            }
        })
    }
    else
    {
        res.status(403).send({message:"You are not allowed to view faculties!"})
    }

})


//ADDING FACULTY
app.post("/Add_Faculty", verify, async (req,res) => 
{
    if(req.user.type=="Admin") 
    {
        const name=req.body.Name
        const type=req.body.Type
        const email=req.body.Email
        const password=req.body.Pass
        const phone_num=req.body.Contact_Num
        const dept=req.body.Dept
        const courses=req.body.Courses
        const TAs_Req = req.body.TAs_Required
        const image_url = req.body.Image_URL

        const salt = await bcrypt.genSalt(10);
        const securePassword = await bcrypt.hash(password, salt);
        const pass = securePassword;

        FacultyModel.findOne({email:email}, (err,Faculty) => 
        {
                if(Faculty)
                {
                    res.send({message:"A faculty with this email ID already exists."})
                }
                else
                {
                    TAModel.findOne({email:email}, (err,TA) =>
                    {
                        if(TA)
                        {
                            res.send({message:"A student with this email ID already exists."})
                        }
                        else
                        {    
                            FacultyModel.findOne({phone_num:phone_num}, (err,Faculty) =>
                            {
                                if(Faculty)
                                {
                                    res.send({message:"This phone number is already taken."})
                                }
                                else
                                {
                                    const Faculty  = new FacultyModel(
                                        {
                                            name,
                                            type,
                                            email,
                                            pass,
                                            phone_num,
                                            dept,
                                            TAs_Req,
                                            courses,
                                            image_url
                                        })

                                        Faculty.save( err => 
                                            {
                                                if(err)
                                                {
                                                    console.log(err)
                                                }
                                                else
                                                {
                                                    res.send({message:"Faculty Successfully Added"})
                                                }
                                            })
                                        
                                }
                            
                            })
                        }
                    })


                }

        })
    }
    else
    {
        res.status(403).send({message:"You are not allowed to add faculties!"})
    }

})


//TA-SHIP APPLICATION BACKEND:-
app.post("/Set_choices",verify, (req,res) =>
{
    if(req.user.type=="TA") 
    {
        const email=req.body.Email
        const course1=req.body.course1
        const course2=req.body.course2
        const course3=req.body.course3
        const status=req.body.Application_Status
        const query = { $set : {Application_Status:status,course1:course1,course2:course2,course3:course3}}
        TAModel.updateOne({email:email}, query, (err,TA) => 
        {
            if(err)
            {
                console.log(err)
            }
            else
            {
                res.send({message:"Application Successful"})
            }
        })
    }
    else
    {
        res.status(403).send({message:"You are not allowed to set TA-Ship choices!"})
    }

})


//RETREIVING TA BACKEND
app.post("/fetch_TA", verify, (req,res) => 
{
    if(req.user) 
    {
        TAModel.findOne({email:req.body.email},(err,TA) => 
        {
            if(err)
            {
                res.send({message:"No TA available"})
            }
            else
            {
                res.send(TA)
            }
        })
    }
    else
    {
        res.status(403).send({message:"You are not allowed to view TAs!"})
    }
})


//RETREIVING TAs
app.post("/fetch_TAs", verify, (req,res) => 
{
    if(req.user.type=="Admin"||req.user.type=="Faculty") 
    {
        TAModel.find({Application_Status:"Applied"},(err,TAs) => 
        {
            if(err)
            {
                res.send({message:"No TAs available"})
            }
            else
            {
                res.send(TAs)
            }
        })
    }
    else
    {
        res.status(403).send({message:"You are not allowed to view TAs!"})
    }

})


//RETREIVING ALL STUDENTS
app.get("/fetch_students", verify, (req,res) => 
{
    if(req.user.type=="Admin") 
    {
        TAModel.find((err,students) => 
        {
            if(err)
            {
                res.send({message:"No students available"})
            }
            else
            {
                res.send(students)
            }
        })
    }
    else
    {
        res.status(403).send({message:"You are not allowed to view TAs!"})
    }


})



//RETREIVING TA REQUESTS BACKEND
app.post("/fetch_TA_requests", verify, (req,res) => 
{
    if(req.user.type=="Admin") 
    {
        const courses = req.body.courses
        TAModel.find({$and : [{Faculty_Email:""},{Application_Status:"Applied"},{$or : [{course1 : {$in : courses}},{course2 : {$in : courses}},{course3 : {$in : courses}}]}]},(err,TA_requests) => 
        {
            if(err)
            {
                console.log(err)
                res.send({message:"No TA requests available"})
            }
            else
            {
                res.send(TA_requests)
            }
        })
    }
    else
    {
        res.status(403).send({message:"You are not allowed to view TA requests!"})
    }

})


//RETREIVING TAs BY EMAIL ARRAY BACKEND
app.post("/fetch_TAs_email_array", verify, (req,res) => 
{
    if(req.user.type=="Admin"||req.user.type=="Faculty") 
    {

        const emails = req.body
        TAModel.find({email : {$in : emails}},(err,TAs) => 
        {
            if(err)
            {
                console.log(err)
                res.send({message:"No TAs available"})
            }
            else
            {
                res.send(TAs)
            }
        })
    }
    else
    {
        res.status(403).send({message:"You are not allowed to view TAs!"})
    }

})


//RETREIVING TAs BY COURSE AND FACULTY
app.post("/fetch_TAs_by_course_faculty", verify, (req,res) => 
{
    if(req.user.type=="Faculty") 
    {
        TAModel.find({$and : [{Application_Status:"Accepted"}, {Faculty_Email : req.body.Faculty_Email}, {Final_Course_Code:req.body.Course_Code}]},(err,TAs) => 
        {
            if(err)
            {
                res.send({message:"No TAs available"})
            }
            else
            {
                res.send(TAs)
            }
        })
    }
    else
    {
        res.status(403).send({message:"You are not allowed to view TAs!"})
    }

})



//TA-SHIP MAPPING BACKEND:-
app.post("/Map_TA_Faculty",verify, (req,res) =>
{
    if(req.user.type=="Admin") 
    {
        const email=req.body.Email
        const TA_Emails=req.body.TA_Emails
        const Course_Codes = req.body.Course_Codes

        FacultyModel.findOne({email:email}, (err,Faculty) => 
        {
            if(Faculty)
            {
                const Existing_TAs=Faculty.TA_Emails;
                var Final_Course_Codes=[].concat(Course_Codes.filter(code=>code!=""))
                async function Mapper()
                {
                    for(var i=0;i<Existing_TAs.filter(email=>email!="").length;i++)
                    {
                       const TA = await TAModel.findOne({email:Existing_TAs[i]})
                       Final_Course_Codes.push(TA.Final_Course_Code)

                    }

                    if(Existing_TAs.filter(email=>email!="").length + TA_Emails.filter(email=>email!="").length > 5)
                    {
                        res.send({message: "A faculty can be assigned a maximum of 5 TAs"})
                    }
                    else
                    {

                        const Final_TA_Emails=[].concat(TA_Emails.filter(email=>email!=""),Existing_TAs.filter(email=>email!=""))
                        const faculty_query = { $set : {TA_Emails:Final_TA_Emails}}
                        FacultyModel.updateOne({email:email}, faculty_query, (err,Faculty) => 
                        {
                            if(err)
                            {
                                console.log(err)
                            }
                            else
                            {
                                const limit = Final_TA_Emails.filter(TA_Email => TA_Email!="").length
                                for(var i=0;i<limit;i++)
                                {
                                
                                    const TA_query = { $set : {Final_Course_Code:Final_Course_Codes[i], Application_Status:"Accepted", Faculty_Email:email}}
                                    TAModel.updateOne({email:Final_TA_Emails[i]}, TA_query, (err,TA) => 
                                    {
                                        if(err)
                                        {
                                            console.log(err)
                                        }
                                    
                                    })     
                                }
                                res.send({message:"Allotment Successfull"})
                            }
                        })
                    }
                }
                Mapper()


            }
        })
    }
    else
    {
        res.status(403).send({message:"You are not allowed to map TAs and faculties!"})
    }
    

})



//PROFILE PAGE BACKEND:-
app.post("/Faculty_Profile", verify, (req,res) =>
{
    if(req.user.type=="Faculty"||req.user.type=="Admin") 
    {
        const param= req.body.email ? req.body.email : req.body.id
        const query = param.endsWith("@pilani.bits-pilani.ac.in") ? { email:param} : {_id:param}
        FacultyModel.findOne(query, (err,faculty) =>
        {
            if(faculty)
            {
                res.send({found:true,id:faculty._id,email:faculty.email,name:faculty.name,phone_num:faculty.phone_num,dept:faculty.dept,TAs_Req:faculty.TAs_Req,courses:faculty.courses,image_url:faculty.image_url,TA_Emails:faculty.TA_Emails})
            }
            else
            {
                res.send({found:false})
            }

        })
    }
    else
    {
        res.status(403).send({message:"You are not allowed to view faculties!"})
    }

})

//PROFILE PAGE UPDATION BACKEND:-
app.put("/Update_Faculty_Profile", verify, (req,res) => 
{
    if(req.user.type=="Faculty"||req.user.type=="Admin") 
    {
        const email = req.body.email
        var name
        var phone_num
        var TAs_Req
        var image_url
        var new_email
        var courses
        var query
        FacultyModel.findOne({email:email}, (err, faculty) =>
        {
            if(faculty)
            {
                name = req.body.faculty_name_new == "" ? faculty.name : req.body.faculty_name_new
                phone_num = req.body.faculty_phone_num_new == "" ? faculty.phone_num : req.body.faculty_phone_num_new
                TAs_Req = req.body.faculty_TAs_Req_new == "" ? faculty.address : req.body.faculty_TAs_Req_new
                image_url = req.body.faculty_image_url_new == "" ? faculty.image_url : req.body.faculty_image_url_new
                new_email = req.body.Faculty_email_new
                courses = req.body.courses ? req.body.courses : faculty.courses
                query = new_email=="" ? {phone_num:phone_num} : {phone_num:phone_num,email:new_email} 
                FacultyModel.findOne(query, async (err,faculty) => 
                {
                    if(faculty)
                    {
                        res.send({message:"This phone number/email ID is already taken"})
                    }
                    else
                    {
                        if(new_email)
                        {
                            const query3 = {$set : {Faculty_Email : new_email}}
                            TAModel.updateMany({Faculty_Email:email}, query3, (err,TA) =>
                            {
                                if(err)
                                {
                                    res.send("Error Occurred! Please try again later.");
                                }
                            }) 
                            TaskModel.updateMany({Faculty_Email:email}, query3, (err,Task) =>
                            {
                                if(err)
                                {
                                    res.send("Error Occurred! Please try again later.");
                                }
                            }) 
                        }

                        var query2;
                        if(req.body.faculty_pass_new!="")
                        {
                            const salt = await bcrypt.genSalt(10);
                            const securePassword = await bcrypt.hash(req.body.faculty_pass_new, salt);
                            query2 = { $set : {email:new_email ? new_email:email,pass:securePassword, name:name,phone_num:phone_num,TAs_Req:TAs_Req,image_url:image_url, courses: courses}}
                        }
                        else
                        {
                            query2 = { $set : {email:new_email ? new_email:email, name:name,phone_num:phone_num,TAs_Req:TAs_Req,image_url:image_url, courses: courses}}
                        }
                        FacultyModel.updateOne({email:email}, query2, (err,faculty) => 
                        {

                            if(err)
                            {
                                console.log(err)
                                res.send({message:err})
                            }
                            else
                            {
                                res.send({message:"Profile Updated Successfully."})
                            }
                        })  
                    

                    }
                })
            }
        })
    }
    else
    {
        res.status(403).send({message:"You are not allowed to edit faculties!"})
    }
})


//PROFILE PAGE BACKEND:-
app.post("/Admin_Profile", verify, (req,res) =>
{
    if(req.user.type=="Admin") 
    {
        const {email}=req.body
        AdminModel.findOne({email:email}, (err,admin) =>
        {
            if(admin)
            {
                res.send({found:true,id:admin._id,name:admin.name,phone_num:admin.phone_num,dept:admin.dept,image_url:admin.image_url})
            }
            else
            {
                res.send({found:false})
            }

        })
    }
    else
    {
        res.status(403).send({message:"You are not allowed to view admins!"})
    }

})

//PROFILE PAGE UPDATION BACKEND:-
app.put("/Update_Admin_Profile", verify, (req,res) => 
{
    if(req.user.type=="Admin") 
    {
        const email = req.body.email
        const admin = AdminModel.findOne({email:email})
        const name = req.body.admin_name_new == "" ? admin.name : req.body.admin_name_new
        const phone_num = req.body.admin_phone_num_new == "" ? admin.phone_num : req.body.admin_phone_num_new
        const image_url = req.body.admin_image_url_new == "" ? admin.image_url : req.body.admin_image_url_new

        AdminModel.findOne({phone_num:phone_num}, async (err,admin) => 
        {
            if(admin)
            {
                res.send({message:"This phone number is already taken"})
            }
            else
            {
                var query;
                if(req.body.admin_pass_new!="")
                {
                    const salt = await bcrypt.genSalt(10);
                    const securePassword = await bcrypt.hash(req.body.admin_pass_new, salt);
                    query = { $set : {name:name,pass:securePassword,phone_num:phone_num,image_url:image_url}}
                }
                else
                {
                    query = { $set : {name:name,phone_num:phone_num,image_url:image_url}}
                }
                AdminModel.updateOne({email:email}, query, (err,admin) => 
                {
                    if(err)
                    {
                        console.log(err)
                        res.send({message:err})
                    }
                    else
                    {
                        res.send({message:"Profile Updated Successfully."})
                    }
                })        
            }
        })
    }
    else
    {
        res.status(403).send({message:"You are not allowed to edit admins!"})
    }
})



//FETCH ALL TASKS
app.post("/fetch_tasks", verify, (req,res) => 
{
    if(req.user.type=="Faculty") 
    {
        const fac_email=req.body.fac_email
        const course_code = req.body.course_code

        TaskModel.find({$and : [{Faculty_Email:fac_email},{Course_Code:course_code}]}, (err,tasks) =>
        {
            if(tasks)
            {
                res.send(tasks)
            }
            else
            {
                console.log(err)
            }    
        })
    }
    else
    {
        res.status(403).send({message:"You are not allowed to view tasks!"})
    }

})

//ASSIGN TASK
app.post("/Assign_Task", verify, (req,res) => 
{
    if(req.user.type=="Faculty") 
    {
        const Name=req.body.Task_Name
        const Description=req.body.Description ? req.body.Description : "None"
        const Deadline =req.body.Deadline
        const TA_Emails=req.body.TA_Emails
        const Faculty_Email=req.body.Faculty_Email
        const Course_Code=req.body.Course_Code
        var Rating=[]
        var Status=[]
        var Comments=[]

        for(var i=0;i<TA_Emails.filter(email=>email!="").length;i++)
        {
            Rating[i]=0;
            Status[i]="Not Started"
            Comments[i]=""
        }

        const Temp_Task =
        {
            Name: Name,
            Description: Description,
            Deadline : Deadline,
            Status : Status,
            Rating : Rating,
            Comments : Comments,
            TA_Emails : TA_Emails,
            Faculty_Email : Faculty_Email,
            Course_Code : Course_Code,
        }
        const Task = new TaskModel(Temp_Task)

        Task.save( err => 
        {
            if(err)
            {
                console.log(err)
            }
            else
            {
                res.send({message:"Task Assigned Successfully"})
            }
        })
    }
    else
    {
        res.status(403).send({message:"You are not allowed to assign tasks!"})
    }


})                       

//Delete Tasks
app.post("/Delete_Tasks", verify, (req,res) => 
{
    if(req.user.type=="Faculty") 
    {
        const Task_IDs = req.body.ids
        
        //Deleting tasks
        TaskModel.deleteMany({_id : {$in : Task_IDs}}, (err) => 
        {
          if(err) 
          {
              res.send("Error Occurred! Please try again later.");
          }
          else
          {
            res.send("Deletion Successfull!")
          }
        });
    }
    else
    {
        res.status(403).send({message:"You are not allowed to delete tasks!"})
    }

})

//Reset Tasks
app.post("/Reset_Tasks", verify, (req,res) => 
{
    if(req.user.type=="Faculty") 
    {
        const Task_IDs = req.body.ids;
        for(var i=0;i<Task_IDs.length;i++)
        {
            TaskModel.findOne({_id:Task_IDs[i]},(err,Task) => 
            {
                if(Task)
                {
                    var Status = [];
                    var Rating = [];
                    var Comments = [];
                    for(var j=0;j<Task.TA_Emails.filter(email=>email!="").length;j++)
                    {
                        Status.push("Not Started");
                        Rating.push(0);
                        Comments.push("");
                    }
                    const query = {$set : {Status:Status,Rating:Rating,Comments:Comments}}
                
                    //Reseting tasks
                    TaskModel.updateOne({_id : Task._id},query, (err) => 
                    {
                      if(err) 
                      {
                        res.send("Error Occurred! Please try again later.");

                      }
                    })
                }

            })
        }
        res.send('Reset Successfull!')
    }
    else
    {
        res.status(403).send({message:"You are not allowed to reset tasks!"})
    }
   

})


//RE-ASSIGN TAs
app.post("/Reassign_TAs", verify, (req,res) => 
{
    if(req.user.type=="Faculty") 
    {
        const Task_ID = req.body.task_id;
        const TA_Emails = req.body.TA_Emails;

        //Removing TA emails from task
        TaskModel.findOne({_id:Task_ID}, (err, task) =>
        {

            if(task)
            {
                var updated_TA_Emails = TA_Emails
                var updated_Comments=[]
                var updated_Rating=[]
                var updated_Status=[]
                for(var k=0;k<task.TA_Emails.length;k++)
                {
                    updated_Comments[k]=""
                    updated_Rating[k]=0
                    updated_Status[k]=""       
                }
                for(var k=0;k<TA_Emails.filter(email=>email!="").length;k++)
                {
                    updated_Status[k]="Not Started"       
                }
                const query = { $set : {TA_Emails:updated_TA_Emails, Comments:updated_Comments, Rating:updated_Rating, Status:updated_Status}}
                TaskModel.updateOne({_id : task._id}, query, (err,task) => 
                {
                    if(err)
                    {
                        res.send("Error Occurred! Please try again later.");
                    }
                    else
                    {
                        res.send("TA Re-Assignment Successfull!")
                    }
                })

            }
        }) 
    }
    else
    {
        res.status(403).send({message:"You are not allowed to re-assign TAs!"})
    }

    

})

//Remove TA from Task
app.post("/Remove_ta_from_task", verify, (req,res) => 
{
    if(req.user.type=="Faculty") 
    {
        const Task_ID = req.body.task_id;
        const TA_Email = req.body.ta_email;

        //Removing TA emails from task
        TaskModel.findOne({_id:Task_ID}, (err, task) =>
        {

            if(task)
            {

                var updated_TA_Emails = task.TA_Emails
                var updated_Comments = task.Comments
                var updated_Rating = task.Rating
                var updated_Status = task.Status
                for(var k=0;k<task.TA_Emails.length;k++)
                {
                    if(TA_Email.includes(updated_TA_Emails[k]))
                    {
                        updated_TA_Emails[k]=""
                        updated_Comments[k]=""
                        updated_Rating[k]=0
                        updated_Status[k]=""
                    }
                }
                const query = { $set : {TA_Emails:updated_TA_Emails, Comments:updated_Comments, Rating:updated_Rating, Status:updated_Status}}
                TaskModel.updateOne({_id : task._id}, query, (err,task) => 
                {
                    if(err)
                    {
                        res.send("Error Occurred! Please try again later.");
                    }
                    else
                    {
                        res.send("TA Removed Successfully!")
                    }
                })

            }
        }) 
    }
    else
    {
        res.status(403).send({message:"You are not allowed to remove TAs from tasks!"})
    }
    
   

})

//FETCH INCOMPLETE TASKS
app.post("/fetch_incomplete_tasks", verify, (req,res) => 
{
    if(req.user.type=="Faculty"||req.user.type=="TA") 
    {
        const fac_email=req.body.fac_email
        const course_code = req.body.course_code

        TaskModel.find({$and : [{Faculty_Email:fac_email},{Course_Code:course_code},{$or : [{Status : {$in : "Not Started"}},{Status : {$in : 'In Progress' }}]}]}, (err,tasks) =>
        {
            if(tasks)
            {
                res.send(tasks)
            }
            else
            {
                console.log(err)
            }
        })
    }
    else
    {
        res.status(403).send({message:"You are not allowed to view incomplete tasks!"})
    }


})



//FETCH INCOMPLETE TASKS (TA)
app.post("/fetch_incomplete_tasks_TA", verify, (req,res) => 
{
    if(req.user) 
    {
        const email=req.body.email
        var final_tasks = []

        TaskModel.find({$and : [{email:email},{$or : [{Status : {$in : "Not Started"}},{Status : {$in : 'In Progress' }}]}]}, (err,tasks) =>
        {
            for( var j=0;j<tasks.length;j++)
            {
                for(var i=0;i<tasks[j].Status.filter(status=>status!="").length;i++)
                {
                    if(email==tasks[j].TA_Emails[i]&&tasks[j].Status[i]!="Completed")
                    {
                        final_tasks.push(tasks[j])

                    }
                }        
            }
            res.send(final_tasks)


        })
    }
    else
    {
        res.status(403).send({message:"You are not allowed to view incomplete tasks!"})
    }

})

//FETCH INCOMPLETE TASK BY ID
app.post("/fetch_incomplete_task_id", verify, (req,res) => 
{
    if(req.user) 
    {
        const id=req.body.id
        TaskModel.findOne({_id:id}, (err,task) =>
        {
            if(task)
            {
                res.send(task)
            }
            else
            {
                console.log(err)
            }


        })
    }
    else
    {
        res.status(403).send({message:"You are not allowed to view incomplete tasks!"})
    }

})

//UPDATE TASK STATUS
app.post("/Update_Task_Status", verify, (req,res) =>
{
    if(req.user.type=="TA") 
    {
        const status=req.body.Status
        const id=req.body.id
        const index=req.body.index

        TaskModel.findOne({_id:id}, (err,task) =>
        {
            if(err)
            {
                console.log(err)
            }
            else
            {
                task.Status[index]=status
                TaskModel.updateOne({_id:id}, {$set : {Status : task.Status}} ,(err, success) => 
                {
                    if(err)
                    {
                        console.log(err)
                    }
                    else
                    {
                        res.send({message:"Task Status Updated Successfully"})
                    }
                })

            }
        
        })
    }
    else
    {
        res.status(403).send({message:"You are not allowed to change task status!"})
    }

})


//FETCH COMPLETE TASKS
app.post("/fetch_completed_tasks", verify, (req,res) => 
{
    if(req.user) 
    {
        const fac_email=req.body.fac_email
        const course_code = req.body.course_code

        TaskModel.find({$and : [{Faculty_Email:fac_email},{Course_Code:course_code},{Status : {$nin : ["Not Started","In Progress"]}}]}, (err,tasks) =>
        {
            if(tasks)
            {
                res.send(tasks)
            }
            else
            {
                console.log(err)
            }    
        })
    }
    else
    {
        res.status(403).send({message:"You are not allowed to view completed tasks!"})
    }

})


//ADD FACULTY INPUTS TO COMPLETED TASKS
app.post("/Edit_Task_Faculty", verify, (req,res) => 
{
    if(req.user.type=="Faculty") 
    {
        const id = req.body.id
        const Ratings=req.body.ratings
        const Comments = req.body.comments

        TaskModel.findOne({_id:id}, (err,task) =>
        {
            if(err)
            {
                console.log(err)
            }
            else
            {
                for(var i=0;i<Ratings.length;i++)
                {
                    task.Rating[i]=Ratings[i]
                    task.Comments[i]=Comments[i]
                }
                var name = req.body.name ? req.body.name  : task.Name
                var description = req.body.description ? req.body.description : task.Description
                var deadline = req.body.deadline ? req.body.deadline : task.Deadline

                TaskModel.updateOne({_id:id}, {$set : {Name : name, Description: description, Deadline : deadline, Rating : task.Rating, Comments : task.Comments}} ,(err, success) => 
                {
                    if(err)
                    {
                        console.log(err)
                    }
                    else
                    {
                        res.send({message:"Task Updated Successfully"})
                    }
                })

            }
        
        })
    }
    else
    {
        res.status(403).send({message:"You are not allowed to edit tasks!"})
    }

})



//FETCH COMPLETE TASK BY ID
app.post("/fetch_task_id", verify, (req,res) => 
{
    if(req.user.type=="Faculty"||req.user.type=="Admin") 
    {
        const id=req.body.id
        TaskModel.findOne({_id:id}, (err,task) =>
        {
            if(task)
            {
                res.send(task)
            }
            else
            {
                console.log(err)
            }
        })
    }
    else
    {
        res.status(403).send({message:"You are not allowed to view tasks!"})
    }

})

//FETCH COMPLETED TASKS (TA)
app.post("/fetch_completed_tasks_TA", verify, (req,res) => 
{
    if(req.user.email==req.body.email&&req.user.type=="TA") 
    {
        const email=req.body.email
        var final_tasks = []

        TaskModel.find( (err,tasks) =>
        {
            for( var j=0;j<tasks.length;j++)
            {
                for(var i=0;i<tasks[j].Status.filter(status=>status!="").length;i++)
                {
                    if(email==tasks[j].TA_Emails[i]&&tasks[j].Status[i]=="Completed")
                    {
                        final_tasks.push(tasks[j])

                    }
                }        
            }
            res.send(final_tasks)
        })
    }
    else
    {
        res.status(403).send({message:"You are not allowed to view completed tasks!"})
    }

})


//DELETION (STUDENTS)
app.post("/Delete_TAs", verify, (req,res) => 
{
    if(req.user.type=="Admin") 
    {
        const TA_Emails = req.body.emails
        const Faculty_Emails = [...new Set(req.body.Faculty_Emails)] 
        
        for(var i=0;i<Faculty_Emails.length;i++)
        {

            const Faculty_Email = Faculty_Emails[i] 

            //Removing TA emails from Faculty
            FacultyModel.findOne({email : Faculty_Email }, (err, faculty) =>
            {
                if(faculty)
                {
                  var updated_TA_Emails = faculty.TA_Emails
                  updated_TA_Emails = updated_TA_Emails.filter(TA_Email => !TA_Emails.includes(TA_Email));
                  const query = { $set : {TA_Emails:updated_TA_Emails}}
                  FacultyModel.updateOne({email : Faculty_Email }, query, (err,faculty) => 
                  {
                      if(err)
                      {
                          res.send("Error Occurred! Please try again later.");
                      }
                  })

                }
            })

            //Removing TA emails from tasks
            TaskModel.find({Faculty_Email:Faculty_Email, TA_Emails : {$in : TA_Emails}}, (err, tasks) =>
            {

                if(tasks)
                {

                    for(var j=0;j<tasks.length;j++)
                    {
                        var updated_TA_Emails = tasks[j].TA_Emails
                        var updated_Comments = tasks[j].Comments
                        var updated_Rating = tasks[j].Rating
                        var updated_Status = tasks[j].Status
                        for(var k=0;k<tasks[j].TA_Emails.length;k++)
                        {
                            if(TA_Emails.includes(updated_TA_Emails[k]))
                            {
                                updated_TA_Emails[k]=""
                                updated_Comments[k]=""
                                updated_Rating[k]=0
                                updated_Status[k]=""
                            }
                        }
                        const query = { $set : {TA_Emails:updated_TA_Emails, Comments:updated_Comments, Rating:updated_Rating, Status:updated_Status}}
                        TaskModel.updateOne({_id : tasks[j]._id}, query, (err,task) => 
                        {
                            if(err)
                            {
                                res.send("Error Occurred! Please try again later.");
                            }
                        })
                    }

                }
            })                
        }

        //Deleting TAs
        TAModel.deleteMany({_id : {$in : req.body.ids}}, (err) => 
        {
          if(err) 
          {
              res.send("Error Occurred! Please try again later.");
          }
          else
          {
            res.send("Deletion Successfull!");
          }
        });
    }
    else
    {
        res.status(403).send({message:"You are not allowed to delete TAs!"})
    }
  

})


//TA PROFILE PAGE BACKEND:-
app.post("/TA_Profile", verify, (req,res) =>
{
    if(req.user.type=="Admin"||req.user.type=="TA") 
    {
        const param= req.body.email ? req.body.email : req.body.id
        const query = param.endsWith("@pilani.bits-pilani.ac.in") ? { email:param} : {_id:param}
        TAModel.findOne(query, (err,TA) =>
        {
            if(TA)
            {
                res.send({found:true,id:TA._id,name:TA.name,email:TA.email,phone_num:TA.phone_num,dept:TA.dept,image_url:TA.image_url})
            }
            else
            {
                res.send({found:false})
            }

        })
    }
    else
    {
        res.status(403).send({message:"You are not allowed to view TAs!"})
    }

})


//PROFILE PAGE UPDATION BACKEND:-
app.put("/Update_TA_Profile", verify, (req,res) => 
{
    if(req.user.type=="Admin"||req.user.type=="TA") 
    {
        const email = req.body.email
        var TA
        var name
        var phone_num
        var image_url
        var new_email
        var Faculty_Email
        TAModel.findOne({email:email}, function(err,result) 
        {

            if(result)
            {

                TA=result;
                name = req.body.TA_name_new == "" ? TA.name : req.body.TA_name_new
                phone_num = req.body.TA_phone_num_new == "" ? TA.phone_num : req.body.TA_phone_num_new
                image_url = req.body.TA_image_url_new == "" ? TA.image_url : req.body.TA_image_url_new
                new_email = req.body.TA_email_new == "" ? TA.email : req.body.TA_email_new
                Faculty_Email = TA.Faculty_Email 

                if(new_email)
                {
                    //Updating TA email from Faculty
                    FacultyModel.findOne({email : Faculty_Email }, (err, faculty) =>
                    {
                        if(faculty)
                        {

                          var updated_TA_Emails=faculty.TA_Emails;
                          for(var i=0;i<faculty.TA_Emails.length;i++)
                          {
                            if(faculty.TA_Emails[i]==email)
                            {
                                updated_TA_Emails[i]=new_email
                            }
                          }
                      
                          const query = { $set : {TA_Emails:updated_TA_Emails}}
                          FacultyModel.updateOne({_id : faculty._id }, query, (err,faculty) => 
                          {
                              if(err)
                              {
                                  res.send("Error Occurred! Please try again later.");
                              }
                          })
                        }
                    })
                
                    //Updating TA emails from tasks
                    TaskModel.find({Faculty_Email:Faculty_Email, TA_Emails : {$in : email}}, (err, tasks) =>
                    {
                        if(tasks)
                        {
                            for(var j=0;j<tasks.length;j++)
                            {
                            
                                var updated_TA_Emails=tasks[j].TA_Emails;
                                for(var i=0;i<tasks[j].TA_Emails.length;i++)
                                {
                                  if(tasks[j].TA_Emails[i]==email)
                                  {
                                      updated_TA_Emails[i]=new_email
                                  }
                                }
                            
                                const query = { $set : {TA_Emails:updated_TA_Emails}}
                                TaskModel.updateOne({_id : tasks[j]._id}, query, (err,task) => 
                                {
                                    if(err)
                                    {
                                        res.send("Error Occurred! Please try again later.");
                                    }
                                })
                            }
                        }
                    })      
                
                }

                TAModel.findOne({$or : [{phone_num:req.body.TA_phone_num_new},{email:req.body.TA_email_new}]}, async (err,TA) => 
                {
                    if(TA)
                    {
                        res.send({message:"This phone number/email ID is already taken"})
                    }
                    else
                    {
                        var query;
                        if(req.body.ta_pass_new!="")
                        {
                            const salt = await bcrypt.genSalt(10);
                            const securePassword = await bcrypt.hash(req.body.ta_pass_new, salt);
                            query = { $set : {name:name,pass:securePassword,phone_num:phone_num,image_url:image_url,email:new_email}}
                        }
                        else
                        {
                            query = { $set : {name:name,phone_num:phone_num,image_url:image_url,email:new_email}}
                        }
                        TAModel.updateOne({email:email}, query, (err,TA) => 
                        {
                            if(err)
                            {
                                console.log(err)
                                res.send({message:err})
                            }
                            else
                            {
                                res.send({message:"Profile Updated Successfully."})
                            }
                        })        
                    }
                })
            }
            else
            {
                console.log(err)
            }
        })  
    }
    else
    {
        res.status(403).send({message:"You are not allowed to edit TAs!"})
    } 
})


//RESET TA-SHIP (For TAs)
app.post("/Reset_TA-Ship_TAs", verify, (req,res) => 
{
    if(req.user.type=="Admin") 
    {
        const TA_Emails = req.body.emails
        const Faculty_Emails = [...new Set(req.body.Faculty_Emails)] 
        
        for(var i=0;i<Faculty_Emails.length;i++)
        {

            const Faculty_Email = Faculty_Emails[i] 

            //Removing TA emails from Faculty
            FacultyModel.findOne({email : Faculty_Email }, (err, faculty) =>
            {
                if(faculty)
                {
                  var updated_TA_Emails = faculty.TA_Emails
                  updated_TA_Emails = updated_TA_Emails.filter(TA_Email => !TA_Emails.includes(TA_Email));
                  const query = { $set : {TA_Emails:updated_TA_Emails}}
                  FacultyModel.updateOne({email : Faculty_Email }, query, (err,faculty) => 
                  {
                      if(err)
                      {
                          res.send("Error Occurred! Please try again later.");
                      }
                  })

                }
            })

            //Removing TA emails from tasks
            TaskModel.find({Faculty_Email:Faculty_Email, TA_Emails : {$in : TA_Emails}}, (err, tasks) =>
            {

                if(tasks)
                {

                    for(var j=0;j<tasks.length;j++)
                    {
                        var updated_TA_Emails = tasks[j].TA_Emails
                        updated_TA_Emails = updated_TA_Emails.filter(TA_Email => !TA_Emails.includes(TA_Email));
                        const query = { $set : {TA_Emails:updated_TA_Emails}}
                        TaskModel.updateOne({_id : tasks[j]._id}, query, (err,task) => 
                        {
                            if(err)
                            {
                                res.send("Error Occurred! Please try again later.");
                            }
                        })
                    }

                }
            })                
        }

        //Editing TA Statuses
        const query = {$set : {Application_Status: "Yet to Apply", Faculty_Email:"",Final_Course_Code:"",course1:"",course2:"",course3:""}}
        TAModel.updateMany({_id : {$in : req.body.ids}},query, (err) => 
        {
          if(err) 
          {
              res.send("Error Occurred! Please try again later.");
          }
          else
          {
            res.send("TA-Ship Reset Successfull!");
          }
        });
    }
    else
    {
        res.status(403).send({message:"You are not allowed to reset TA-Ships!"})
    }
    
})



//DELETION (FACULTIES)
app.post("/Delete_Faculties", verify, (req,res) => 
{

    if(req.user.type=="Admin") 
    {
        const Faculty_Emails = req.body.emails
        const TA_Emails = [...new Set(req.body.TA_Emails)] 

        //Updating TA Statuses
        const query = {$set : {Application_Status: "Yet to Apply", Faculty_Email:"",Final_Course_Code:"",course1:"",course2:"",course3:""}}
        TAModel.updateMany({email : {$in : TA_Emails}},query, (err) => 
        {
          if(err) 
          {
              res.send("Error Occurred! Please try again later.");
          }
        });
    
        //Deleting tasks
        TaskModel.deleteMany({Faculty_Email : {$in : Faculty_Emails}}, (err) => 
        {
          if(err) 
          {
              res.send("Error Occurred! Please try again later.");
          }
        });

        //Deleting Faculties
        FacultyModel.deleteMany({email : {$in : Faculty_Emails}}, (err) => 
        {
          if(err) 
          {
            res.send("Error Occurred! Please try again later.");
          }
          else
          {
            res.send("Deletion Successfull!");
          }
        });
    }
    else
    {
        res.status(403).send({message:"You are not allowed to delete faculties!"})
    }
  
})



//RESET TA-SHIP (For Faculties)
app.post("/Reset_TA-Ship_Faculties", verify, (req,res) => 
{

    if(req.user.type=="Admin") 
    {
        const Faculty_Emails = req.body.emails
        const TA_Emails = [...new Set(req.body.TA_Emails)] 

        //Updating TA Statuses
        const query1 = {$set : {Application_Status: "Yet to Apply", Faculty_Email:"",Final_Course_Code:"",course1:"",course2:"",course3:""}}
        TAModel.updateMany({email : {$in : TA_Emails}},query1, (err) => 
        {
          if(err) 
          {
              res.send("Error Occurred! Please try again later.");
          }
        });
    
        //Deleting tasks
        TaskModel.deleteMany({Faculty_Email : {$in : Faculty_Emails}}, (err) => 
        {
          if(err) 
          {
              res.send("Error Occurred! Please try again later.");
          }
        });

        //Updating Faculties
        const query2 = {$set : {TA_Emails:[]}}
        FacultyModel.updateMany({email : {$in : Faculty_Emails}}, query2, (err) => 
        {
          if(err) 
          {
              res.send("Error Occurred! Please try again later.");
          }
          else
          {
            res.send("TA-Ship Reset Successfull!");
          }
        });
    }
    else
    {
        res.status(403).send({message:"You are not allowed to reset TA-Ships for faculties!"})
    }
    

})



//DELETION (COURSES)
app.post("/Delete_Courses", verify, (req,res) => 
{
    if(req.user.type=="Admin") 
    {
        const Courses_ids = req.body.ids
        const Course_Codes = req.body.codes 
        const TA_list = []
        
        
        //Updating Faculty Statuses (TA_emails and courses)
        TAModel.find({Final_Course_Code : {$in : Course_Codes}}, (err,TAs) =>
        {
            if(TAs)
            {
                for(var i=0;i<TAs.length;i++)
                {
                    TA_list.push(TAs[i].email)
                }
                FacultyModel.find({courses : {$in : Course_Codes } }, (err, faculties) =>
                {
                    if(faculties)
                    {
                        for(var i=0;i<faculties.length;i++)
                        {
                        
                            var updated_TA_Emails = faculties[i].TA_Emails
                            updated_TA_Emails = updated_TA_Emails.filter(TA_Email => !TA_list.includes(TA_Email));
                            var updated_courses = faculties[i].courses
                            updated_courses = updated_courses.filter(course => !Course_Codes.includes(course));
                            const query = { $set : {TA_Emails:updated_TA_Emails, courses: updated_courses}}
                            FacultyModel.updateOne({id : faculties[i]._id }, query, (err,faculty) => 
                            {
                                if(err)
                                {
                                    res.send("Error Occurred! Please try again later.");
                                }
                            })
                        }
                    
                    }
                })
            }
        })


    
        //Updating TA Statuses
        const query1 = {$set : {Application_Status: "Yet to Apply", Faculty_Email:"",Final_Course_Code:"",course1:"",course2:"",course3:""}}
        TAModel.updateMany({Final_Course_Code : {$in : Course_Codes}},query1, (err) => 
        {
          if(err) 
          {
              res.send("Error Occurred! Please try again later.");
          }
        });

    

        //Deleting tasks
        TaskModel.deleteMany({Course_Code : {$in : Course_Codes}}, (err) => 
        {
          if(err) 
          {
              res.send("Error Occurred! Please try again later.");
          }
        });



        //Deleting Courses
        CourseModel.deleteMany({_id : {$in : Courses_ids}}, (err) => 
        {
          if(err) 
          {
            res.send("Error Occurred! Please try again later.");
          }
          else
          {
            res.send("Deletion Successfull!");
          }
        });
    }
    else
    {
        res.status(403).send({message:"You are not allowed to delete courses!"})
    }
  
})




//RESET TA-SHIP (For Courses)
app.post("/Reset_TA-Ship_Courses", verify, (req,res) => 
{
    if(req.user.type=="Admin") 
    {
        const Course_Codes = req.body.codes 
        const TA_list = []

         //Updating Faculty Statuses (TA_emails and courses)
         TAModel.find({Final_Course_Code : {$in : Course_Codes}}, (err,TAs) =>
         {
             if(TAs)
             {
                 for(var i=0;i<TAs.length;i++)
                 {
                     TA_list.push(TAs[i].email)
                 }
                 FacultyModel.find({courses : {$in : Course_Codes } }, (err, faculties) =>
                 {
                     if(faculties)
                     {
                         for(var i=0;i<faculties.length;i++)
                         {

                             var updated_TA_Emails = faculties[i].TA_Emails
                             updated_TA_Emails = updated_TA_Emails.filter(TA_Email => !TA_list.includes(TA_Email));
                             const query = { $set : {TA_Emails:updated_TA_Emails}}
                             FacultyModel.updateOne({id : faculties[i]._id }, query, (err,faculty) => 
                             {
                                 if(err)
                                 {
                                     res.send("Error Occurred! Please try again later.");
                                 }
                             })
                         }
                     
                     }
                 })
             }
         })



        //Updating TA Statuses
        const query1 = {$set : {Application_Status: "Yet to Apply", Faculty_Email:"",Final_Course_Code:"",course1:"",course2:"",course3:""}}
        TAModel.updateMany({Final_Course_Code : {$in : Course_Codes}},query1, (err) => 
        {
          if(err) 
          {
              res.send("Error Occurred! Please try again later.");
          }
        });
    

        //Deleting tasks
        TaskModel.deleteMany({Course_Code : {$in : Course_Codes}}, (err) => 
        {
          if(err) 
          {
              res.send("Error Occurred! Please try again later.");
          }
          else
          {
            res.send("TA-Ship Reset Successfull!")
          }
        });
    }
    else
    {
        res.status(403).send({message:"You are not allowed to reset TA-Ships for courses!"})
    }
    

})  

//COURSE DETAILS UPDATION BACKEND:-
app.put("/Update_Course_Details", verify, (req,res) => 
{
    if(req.user.type=="Admin") 
    {
        const code = req.body.Course_code
        var name
        CourseModel.findOne({code:code}, (err, course) =>
        {
            if(course)
            {
                name = req.body.Course_name_new == "" ? course.name : req.body.Course_name_new
                const new_course_code = req.body.Course_code_new
                CourseModel.findOne({code:new_course_code}, (err,course) => 
                {
                    if(course)
                    {
                        res.send({message:"This course code is already taken"})
                    }
                    else
                    {
                        if(new_course_code)
                        {
                            TAModel.updateMany({Final_Course_Code:code}, {$set:{Final_Course_Code:new_course_code}}, (err,TA) =>
                            {
                                if(err)
                                {
                                    res.send("Error Occurred! Please try again later.");
                                }
                            }) 
                            TAModel.updateMany({course1:code}, {$set:{course1:new_course_code}}, (err,TA) =>
                            {
                                if(err)
                                {
                                    res.send("Error Occurred! Please try again later.");
                                }
                            }) 
                            TAModel.updateMany({course2:code}, {$set:{course2:new_course_code}}, (err,TA) =>
                            {
                                if(err)
                                {
                                    res.send("Error Occurred! Please try again later.");
                                }
                            }) 
                            TAModel.updateMany({course3:code}, {$set:{course3:new_course_code}}, (err,TA) =>
                            {
                                if(err)
                                {
                                    res.send("Error Occurred! Please try again later.");
                                }
                            }) 
                            TaskModel.updateMany({Course_Code:code}, {$set:{Course_Code:new_course_code}}, (err,Task) =>
                            {
                                if(err)
                                {
                                    res.send("Error Occurred! Please try again later.");
                                }
                            }) 
                            FacultyModel.find({courses: {$in : code}}, (err, faculties) =>
                            {
                                if(faculties)
                                {
                                    for(var i=0;i<faculties.length;i++)
                                    {
                                        const updated_courses=faculties[i].courses
                                        for(var j=0;j<faculties[i].courses.length;j++)
                                        {
                                            if(faculties[i].courses[j]==code)
                                            {
                                                updated_courses[j]=new_course_code
                                            }
                                        }
                                        FacultyModel.updateOne({_id:faculties[i]._id}, {$set : {courses:updated_courses}}, (err,faculty)=>
                                        {
                                            if(err)
                                            {
                                                res.send("Error Occurred! Please try again later.");
                                            }
                                        })
                                    }
                                }
                            })
                        }
                        const query2 = new_course_code ? { $set : {code:new_course_code, name:name}} : {$set : {name:name}}  
                        CourseModel.updateOne({code:code}, query2, (err,faculty) => 
                        {

                            if(err)
                            {
                                console.log(err)
                                res.send({message:err})
                            }
                            else
                            {
                                res.send({message:"Course Updated Successfully."})
                            }
                        })  
                    

                    }
                })
            }
        })
    }
    else
    {
        res.status(403).send({message:"You are not allowed to reset TA-Ships for courses!"})
    }
})  