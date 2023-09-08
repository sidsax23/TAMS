import React from 'react'
import './Edit_Faculty_Details.css'
import Header from '../../../../../Header/header.jsx'
import { useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { useContext } from 'react';
import {userContext} from '../../../../../App.jsx'


function Edit_Faculty_Details(props) 
{

    const [userEmail,setUserEmail,userType,setUserType,userAccessToken,setUserAccessToken,userRefreshToken,setUserRefreshToken,axiosJWT] = useContext(userContext);

    const location=useLocation()
    const Faculty_details = location.state.Faculty 
    const Faculty_id = {id:Faculty_details._id}

    const [Faculty_email,set_Faculty_email] = useState(Faculty_details.email)
    const [Faculty_name,set_Faculty_name]=useState(Faculty_details.name)
    const [Faculty_TAs_Req,set_TAs_Req]=useState("")
    const [Faculty_dept,set_dept]=useState("")
    const [dummy,set_dummy]=useState("")
    const [all_courses,set_all_courses]=useState([])
    const [Faculty_image_url,set_image_url] = useState("")
    const [Faculty_phone_num,set_phone_num]=useState("")
    const [courses,set_courses] = useState([])
    const [TA_Emails,set_TA_Emails] = useState([])
    const [TAs,set_TAs] = useState()
    const [TA_Names,set_TA_Names]=useState(["","","","",""])
    var arr=[]
    var arr2=[]

    const [Message,setmessage] = useState("")
    const [show,setshow] = useState(false)
    const [update,set_update]=useState(false)
    const pattern = new RegExp("[6,7,8,9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]") 

    const [Faculty,Set_Faculty] = useState(
    {
        Faculty_email_new:"",
        Faculty_name_new:"",
        Faculty_phone_num_new:"",
        Faculty_image_url_new:"",
        Faculty_TAs_Req_new:"",
        Faculty_dept_new:"",
        course_num:1,
        courses:[""]
    })
    const [axios_call_count,set_call_count]=useState(0)



    if(axios_call_count==0||update==false)
    {
      axiosJWT.post("http://localhost:9000/Faculty_Profile",Faculty_id, {headers:{'authorization':"Bearer "+userAccessToken}}).then(
        res => {
                  set_call_count(1)
                  set_update(true)
                  res.data.found ? Set_details(res) : set_dummy()
               })
      axiosJWT.post("http://localhost:9000/fetch_TAs_email_array",Faculty_details.TA_Emails, {headers:{'authorization':"Bearer "+userAccessToken}}).then(response=>{set_details_2(response,Faculty_details.TA_Emails)})
      axiosJWT.get("http://localhost:9000/fetch_courses", {headers:{"authorization":"Bearer "+userAccessToken}}).then(res=>{set_all_courses(res.data)}) 
       function Set_details(res)
       {
         set_Faculty_email(res.data.email)
         set_Faculty_name(res.data.name)
         set_TAs_Req(res.data.TAs_Req)
         set_phone_num(res.data.phone_num)
         set_image_url(res.data.image_url)
         set_dept(res.data.dept)
         set_courses(res.data.courses)
         set_TA_Emails(res.data.TA_Emails)
         
       }
       function set_details_2(res,emails)
       {
           for(var i=0;i<emails.filter(email => email!="").length;i++)
           {
               for(var j=0;j<emails.filter(email => email!="").length;j++)
               {
                   if(res.data[j].email==emails[i])
                   {
                       TA_Names[i]=res.data[j].name
                   }
               }
           }
           arr = TA_Emails.map(function(e,i) 
           {
               return [e, TA_Names[i]];
           })
       }

 
    }


    
    
    function Arrays_Mapper()
    {
        
        arr = TA_Emails.map(function(e,i) 
        {
            return [e, TA_Names[i]];
        })
        
    } 
    

    const ArrMapper = () =>
    {
        arr2=[]
        for(var i=1;i<=Faculty.course_num;i++)
        {
            arr2[i-1]=i
        }
    }
    function Course_Remover()
    {
        for(var i=Faculty.course_num;i<5;i++)
        {
            Faculty.courses[i]=""
        }
    }


    const HandleChange  = e =>  /*When someone types, its an 'event', denoted and saved in 'e' here. e.target will return where and what the change was*/
    {    
        setshow(false)
        setmessage("")
        const {name,value} = e.target
        if(Number(name))
        {
            Faculty.courses[name-1]=value
        }
        else
        {
            Set_Faculty({
                ...Faculty, /* Stores the value entered by the user in the respective state variable while the rest remain as their default values ("" in this case)*/
                [name]:value /* Depending on the name of the inputbar, its value is stored in the respective state variable*/
                
            })
        }

        if(name=="course_num")
        {      
            ArrMapper();
        }
    }


    const Save_Changes = () =>
    {
        set_update(false)
        setshow(true)
        const {email,Faculty_email_new,Faculty_name_new,Faculty_phone_num_new,Faculty_TAs_Req_new,Faculty_image_url_new,courses} = Faculty
        Faculty.email = Faculty_details.email
        if(!Faculty_email_new&&!Faculty_name_new&&!Faculty_phone_num_new&&!Faculty_image_url_new&&!Faculty_TAs_Req_new&&!courses[0])
        {
            setmessage("Please enter new data")
        }
        else if(!Faculty_email_new.endsWith("@pilani.bits-pilani.ac.in")&&Faculty_email_new)
        {
            setmessage("Please enter a valid BITS ID")
        }
        else if(Faculty_name_new==Faculty_name&&Faculty_name_new)
        {
            setmessage("Entered name matches the existing one.")
        }
        else if(Faculty_email_new==Faculty_email&&Faculty_email_new)
        {
            setmessage("Entered email matches the existing one.")
        }
        else if(Faculty_phone_num_new==Faculty_phone_num&&Faculty_phone_num_new)
        {
            setmessage("Entered phone number matches the existing one.")
        }
        else if(Faculty_image_url==Faculty_image_url_new&&Faculty_image_url_new)
        {
            setmessage("Entered image URL matches the existing one.")
        }
        else if(!pattern.test(Faculty_phone_num_new)&&Faculty_phone_num_new)
        {
            setmessage("Please enter a valid phone number")
        }
        else if(Faculty_TAs_Req_new&&(isNaN(Faculty_TAs_Req_new)||Faculty_TAs_Req<-1)) 
        {
            setmessage("Please enter a valid TA Requirement")
        }
        else
        {
            var all_courses_flag=0;
            var duplicate_courses_flag=0;  
            for(var i=0;i<Faculty.course_num;i++)
            {
                
                if(!Faculty.courses[i])
                    all_courses_flag=1
                for(var j=0;j<Faculty.course_num;j++)
                {
                    if(i!=j&&Faculty.courses[i]!=""&&Faculty.courses[j]!=""&&Faculty.courses[i]==Faculty.courses[j])
                    duplicate_courses_flag=1;
                }
            }
            if(courses[0]&&all_courses_flag==1)
            {
                setmessage("Please enter all courses")
            }
            else if(courses[0]&&duplicate_courses_flag==1)
            {  
                setmessage("Courses must be different")
            }
            else
            {
                axiosJWT.put("http://localhost:9000/Update_Faculty_Profile", Faculty, {headers:{'authorization':"Bearer "+userAccessToken}})
                .then( res=> {setmessage(res.data.message)})
            }
        }

    }

    function render_course_options(courses)
    {
       
            return (
                courses && courses.map((el) => (<option value={el.code}>{el.name}</option>))
            )
        
    }



    return(
        <div>
            
            <Header login_state={props} type={"ADMIN"}/>
              <div className='profile_box'>
                <center><h1>{Faculty_name}</h1>
                <br/>
                <img src={Faculty_image_url} height="200" max-width="650"/>
                <div className='details'>                
                  <br/>
                  <h3>Name &emsp;: &emsp;{Faculty_name} <br/><input name="Faculty_name_new" type="text" placeholder="Enter New Name" className='details_input' onChange={HandleChange} value={Faculty.Faculty_name_new}/></h3>
                  <br/>
                  <h3>Email &emsp;: &emsp;{Faculty_email} <br/><input name="Faculty_email_new" type="text" placeholder="Enter New Email" className='details_input' onChange={HandleChange} value={Faculty.Faculty_email_new}/></h3>
                  <br/>
                  <h3>Image URL &emsp;: <br/><input name="Faculty_image_url_new" type="text" placeholder="Enter Profile Image URL" className='details_input' onChange={HandleChange} value={Faculty.Faculty_image_url_new}/></h3>
                  <br/>
                  <h3>Phone Number &emsp;: &emsp;{Faculty_phone_num}<br/><input name="Faculty_phone_num_new" type="text" placeholder="Enter New Phone Number" className='details_input' onChange={HandleChange} value={Faculty.Faculty_phone_num_new}/></h3>
                  <br/>
                  <h3>Department &emsp;: &emsp;{Faculty_dept}</h3>
                  <br/>
                  <h3>TAs Required &emsp;: &emsp;{Faculty_TAs_Req==-1?"NA":Faculty_TAs_Req}<br/><input name="Faculty_TAs_Req_new" type="Number" placeholder="Enter TAs Required" className='details_input' onChange={HandleChange} value={Faculty.Faculty_TAs_Req_new}/></h3>
                  <br/>
                  <h2>Course(s) Offered Currently&emsp;:- &emsp;</h2>{courses.filter(course => course!="").map((course)=>(<h3>{course}</h3>))}<br/>
                  <h3>EDIT :-</h3>
                  <h3>Number of Courses Offered&emsp;: <br/>
                            <select name="course_num" className='details_input' onChange={HandleChange} value={Faculty.course_num}>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5">5</option>
                            </select>
                        </h3>
                        <br/>
                        {ArrMapper()}
                        {Course_Remover()}
                        {
                            arr2.map( (el,i) => (
                                                <h3 key={i}>Course {el} &emsp;: <br/>
                                                    <select name={el} className='details_input' onChange={HandleChange}>
                                                        <option value=""></option>
                                                        {
                                                            render_course_options(all_courses)
                                                        }
                                                    </select>
                                                </h3>
                                                ))
                        }
                  <br/>
                  {Arrays_Mapper()}
                  <h2>Current TA(s) &emsp;:- &emsp;</h2>
                    {arr.filter(el => el[0]!=''&&el[1]!='').map( (Value) => 

                        (
                            <div>     
                            <h3>Name : {Value[1]}</h3>
                            <h3>Email : {Value[0]}</h3>
                            <br/>
                            </div>
                        ))
                    }
                  <br/>
                </div>
                <div className="ErrorMsg">{show && Message!=="Profile Updated Successfully." ? Message : ""}</div>
                <div className="SuccessMsg">{show && Message=="Profile Updated Successfully." ? Message : ""}</div>
                <div className='btn' onClick={Save_Changes}>Save</div>
                </center>
              </div>
        </div>
  
  )
}

export default Edit_Faculty_Details