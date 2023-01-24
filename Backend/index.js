import express from 'express' /* Same as 'const express = require('express')', but to import we need to add ' type: "module" ' to package.json*/
import mongoose from 'mongoose'
import cors from 'cors'

// Needed for configuring any App with Node.js
const app = express()
app.use(express.json())
app.use(express.urlencoded())
app.use(cors())
app.listen(9000,() => {console.log("Back-end Started at port 9000")})

// Creating DB. Name of DB = Login_pagesDB
mongoose.connect("mongodb://127.0.0.1:27017/TAMS_DB", 
                    {
                        useNewUrlParser: true,
                        useUnifiedTopology : true
                    },
                    function(error) {if(error){console.log(error)}else{console.log("DB Connected")}}, /* Just to see if the DB got connected successfully or not*/
                )

    
//SCHEMAS
//TA Schema for DB
const TASchema = new mongoose.Schema(
                                    {
                                        name :  {type: String, required:true},
                                        email: {type: String, required:true, index:{unique:true}},
                                        pass: {type: String, required:true},
                                        type : {type : String, required:true, default : "TA"},
                                        dept : {type : String, required:true, default : "CSIS"},
                                        phone_num : {type: Number, required:true, unique:true},
                                        course1 : {type:String,requried:true,default:""},
                                        course2 : {type:String,requried:true,default:""},
                                        course3 : {type:String,requried:true,default:""},
                                        Application_Status :{type:String,requried:true},
                                        Faculty_Email : {type:String,requried:true,default:""},
                                        Final_Course_Code : {type:String,requried:true,default:""},
                                        image_url: {type:String}
                                    }
                                )
const TAModel = new mongoose.model("TA",TASchema) 

//Faculty Schema for DB
const FacultySchema = new mongoose.Schema(
    {
        name :  {type: String, required:true},
        email: {type: String, required:true, index:{unique:true}},
        pass: {type: String, required:true},
        type : {type : String, required:true, default: "Faculty"},
        phone_num : {type: Number, required:true, unique:true},
        dept : {type : String, required:true, default : "CSIS"},
        TAs_Req : {type: Number},
        courses : {type:Array,requried:true},
        image_url: {type:String},
        TA_Emails : {type:Array, default : []}

    }
)
const FacultyModel = new mongoose.model("Faculty",FacultySchema) 

//Admin Schema for DB
const AdminSchema = new mongoose.Schema(
    {
        name :  {type: String, required:true},
        email: {type: String, required:true, index:{unique:true}},
        pass: {type: String, required:true},
        type : {type : String, required:true, default: "Admin"},
        phone_num : {type: Number, required:true, unique:true},
        dept : {type : String, required:true, default : "CSIS"},
        image_url : {type : String}
    }
)
const AdminModel = new mongoose.model("Admin",AdminSchema) 


//Course Schema for DB
const CourseSchema = new mongoose.Schema(
    {
        name :  {type: String, required:true},
        code : {type: String, required:true, index:{unique:true}},
    }
)
const CourseModel = new mongoose.model("Course",CourseSchema) 


//Task Schema for DB
const Task_Schema = new mongoose.Schema(
    {
        Name :  {type: String, required:true},
        Description: {type: String, required:true, default:""},
        Deadline: {type: Date, required:true, default:""},
        Status : {type : Array, required:true},
        Rating : {type : Array, required:true},
        Comments : {type: Array, required:true},
        TA_Emails : {type:Array, default : []},
        Faculty_Email : {type:String,requried:true,default:""},
        Course_Code : {type:String,requried:true,default:""}
    }
)
const TaskModel = new mongoose.model("Task",Task_Schema) 


//ROUTES :-

//LOGIN PAGES BACKEND :-
//Login Page:-
app.post("/Login", (req,res) => 
    {
        const {email,pass,type} = req.body
        // Searches the DB for a user with entered email ID. If it finds one, it returns the user otherwise it returns an error
        if(type=="TA")
        {
            TAModel.findOne({email:email}, (err,user) => 
            {
                if(user)
                {
                    if(pass===user.pass)
                    {
                        res.send({message:"Login Successful",user:user})
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
            FacultyModel.findOne({email:email}, (err,user) => 
            {
                if(user)
                {
                    if(pass===user.pass)
                    {
                        res.send({message:"Login Successful",user:user})
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
            AdminModel.findOne({email:email}, (err,user) => 
            {
                if(user)
                {
                    if(pass===user.pass)
                    {
                        res.send({message:"Login Successful",user:user})
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

//Recover Password
app.post("/Recover_pass", (req,res) => 
{
    const {email,type}=req.body
    
    // Searches the DB for a user with entered email ID. If it finds one, it returns the user otherwise it returns an error
    if(type=="TA")
    {
        TAModel.findOne({email:email}, (err,user) => 
        {
            if(user)
            {
                
                res.send({found:true,rpass:user.pass,rname:user.name})
            }
            else
            {
                res.send({found:false})
            }
        })
    }
    if(type=="Faculty")
    {
        FacultyModel.findOne({email:email}, (err,user) => 
        {
            if(user)
            {
                
                res.send({found:true,rpass:user.pass,rname:user.name})
            }
            else
            {
                res.send({found:false})
            }
        })
    }
    if(type=="Admin")
    {
        AdminModel.findOne({email:email}, (err,user) => 
        {
            if(user)
            {
                
                res.send({found:true,rpass:user.pass,rname:user.name})
            }
            else
            {
                res.send({found:false})
            }
        })
    }
})


app.post("/Add_TA", (req,res) => 
{
    
    //const {name,type,email,pass,phone_num,dept,Application_Status} = req.body
    const name=req.body.Name
    const type=req.body.Type
    const email=req.body.Email
    const pass=req.body.Pass
    const phone_num=req.body.Contact_Num
    const dept=req.body.Dept
    const Application_Status=req.body.Application_Status

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
                                        res.send({message:"Student Successfully Added"})
                                    }
                                })

                    }

                })
                

            }

    })

})



app.post("/Add_Course", (req,res) => 
{
    
    //const {name,type,email,pass,phone_num,dept,Application_Status} = req.body
    const name=req.body.course_name
    const code=req.body.course_code

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
                

})


//RETREIVING COURSES BACKEND
app.post("/fetch_courses", (req,res) => 
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

})

//RETREIVING COURSE BACKEND
app.post("/fetch_course", (req,res) => 
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

})


//RETREIVING FACULTIES
app.post("/fetch_faculties", (req,res) => 
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

})


//RETREIVING FACULTY
app.post("/fetch_faculty", (req,res) => 
{
    const id = req.body.id
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

})
 
//RETREIVING FACULTY BY EMAIL
app.post("/fetch_faculty_by_email", (req,res) => 
{
    const email = req.body.email
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

})


//ADDING FACULTY
app.post("/Add_Faculty", (req,res) => 
{
    
    const name=req.body.Name
    const type=req.body.Type
    const email=req.body.Email
    const pass=req.body.Pass
    const phone_num=req.body.Contact_Num
    const dept=req.body.Dept
    const courses=req.body.Courses
    const TAs_Req = req.body.TAs_Required
    const image_url = req.body.Image_URL

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

})


//TA-SHIP APPLICATION BACKEND:-
app.post("/Set_choices", (req,res) =>
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

})


//RETREIVING TA BACKEND
app.post("/fetch_TA", (req,res) => 
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

})


//RETREIVING TAs
app.post("/fetch_TAs", (req,res) => 
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

})


//RETREIVING ALL STUDENTS
app.get("/fetch_students", (req,res) => 
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

})



//RETREIVING TA REQUESTS BACKEND
app.post("/fetch_TA_requests", (req,res) => 
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

})


//RETREIVING TAs BY EMAIL ARRAY BACKEND
app.post("/fetch_TAs_email_array", (req,res) => 
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

})


//RETREIVING TAs BY COURSE AND FACULTY
app.post("/fetch_TAs_by_course_faculty", (req,res) => 
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

})



//TA-SHIP MAPPING BACKEND:-
app.post("/Map_TA_Faculty", (req,res) =>
{
    const email=req.body.F1.Email
    const TA_Emails=req.body.F1.TA_Emails
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
    

})



//PROFILE PAGE BACKEND:-
app.post("/Faculty_Profile", (req,res) =>
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

})

//PROFILE PAGE UPDATION BACKEND:-
app.put("/Update_Faculty_Profile", (req,res) => 
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

                FacultyModel.findOne(query, (err,faculty) => 
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

                        const query2 = new_email ? { $set : {email:new_email, name:name,phone_num:phone_num,TAs_Req:TAs_Req,image_url:image_url, courses: courses}} : { $set : {name:name,phone_num:phone_num,TAs_Req:TAs_Req,image_url:image_url, courses:courses}}  
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
    })



//PROFILE PAGE BACKEND:-
app.post("/Admin_Profile", (req,res) =>
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

})

//PROFILE PAGE UPDATION BACKEND:-
app.put("/Update_Admin_Profile", (req,res) => 
    {
        const email = req.body.email
        const admin = AdminModel.findOne({email:email})
        const name = req.body.admin_name_new == "" ? admin.name : req.body.admin_name_new
        const phone_num = req.body.admin_phone_num_new == "" ? admin.phone_num : req.body.admin_phone_num_new
        const image_url = req.body.admin_image_url_new == "" ? admin.image_url : req.body.admin_image_url_new
    
        AdminModel.findOne({phone_num:phone_num}, (err,admin) => 
        {
            if(admin)
            {
                res.send({message:"This phone number is already taken"})
            }
            else
            {
                const query = { $set : {name:name,phone_num:phone_num,image_url:image_url}}
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
    })


//ASSIGN TASK
app.post("/Assign_Task", (req,res) => 
{
    
    const Name=req.body.Task_Name
    const Description=req.body.Description ? req.body.Description : "None"
    const Deadliine =req.body.Deadliine
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
            Deadline : Deadliine,
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
                            
})                   


//FETCH INCOMPLETE TASKS
app.post("/fetch_incomplete_tasks", (req,res) => 
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


})



//FETCH INCOMPLETE TASKS (TA)
app.post("/fetch_incomplete_tasks_TA", (req,res) => 
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

})

//FETCH INCOMPLETE TASK BY ID
app.post("/fetch_incomplete_task_id", (req,res) => 
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

})

//UPDATE TASK STATUS
app.post("/Update_Task_Status", (req,res) =>
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

})


//FETCH INCOMPLETE TASKS
app.post("/fetch_completed_tasks", (req,res) => 
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

})


//ADD FACULTY INPUTS TO COMPLETED TASKS
app.post("/Add_Task_Inputs_Faculty", (req,res) => 
{
    const Ratings=req.body.ratings
    const id = req.body.id
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
            TaskModel.updateOne({_id:id}, {$set : {Rating : task.Rating, Comments : task.Comments}} ,(err, success) => 
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

})


//FETCH COMPLETE TASK BY ID
app.post("/fetch_completed_task_id", (req,res) => 
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

})

//FETCH COMPLETED TASKS (TA)
app.post("/fetch_completed_tasks_TA", (req,res) => 
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

})


//DELETION (STUDENTS)
app.post("/Delete_TAs", (req,res) => 
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
  

})


//TA PROFILE PAGE BACKEND:-
app.post("/TA_Profile", (req,res) =>
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

})


//TA PROFILE PAGE UPDATION BACKEND:-
app.put("/Update_TA_Profile", (req,res) => 
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


                TAModel.findOne({$or : [{phone_num:req.body.TA_phone_num_new},{email:req.body.TA_email_new}]}, (err,TA) => 
                {
                    if(TA)
                    {
                        res.send({message:"This phone number/email ID is already taken"})
                    }
                    else
                    {
                        const query = { $set : {name:name,phone_num:phone_num,image_url:image_url,email:new_email}}
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
    })


//RESET TA-SHIP (For TAs)
app.post("/Reset_TA-Ship_TAs", (req,res) => 
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
  

})



//DELETION (FACULTIES)
app.post("/Delete_Faculties", (req,res) => 
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
  
})



//RESET TA-SHIP (For Faculties)
app.post("/Reset_TA-Ship_Faculties", (req,res) => 
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
  

})



//DELETION (COURSES)
app.post("/Delete_Courses", (req,res) => 
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
  
})




//RESET TA-SHIP (For Courses)
app.post("/Reset_TA-Ship_Courses", (req,res) => 
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
  

})

//COURSE DETAILS UPDATION BACKEND:-
app.put("/Update_Course_Details", (req,res) => 
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
    })