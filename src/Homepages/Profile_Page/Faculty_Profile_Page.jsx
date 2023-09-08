import React from 'react'
import './profile.css'
import Header from '../../Header/header.jsx'
import { useState } from 'react'
import axios from 'axios'
import { useContext } from 'react';
import {userContext} from '../../App.jsx'


function Faculty_Profile(props) 
{
    const [userEmail,setUserEmail,userType,setUserType,userAccessToken,setUserAccessToken,userRefreshToken,setUserRefreshToken,axiosJWT] = useContext(userContext);
   
    const [faculty_name,set_faculty_name]=useState("")
    const [dummy,setdummy]=useState("")
    const [faculty_dept,set_dept]=useState("")
    const [faculty_phone_num,set_phone_num]=useState("")
    const [faculty_TAs_Req,set_TAs_Req]=useState("")
    const [courses,set_courses] = useState([])
    const [TA_Emails,set_TA_Emails] = useState([])
    const [image_url,set_image_url] = useState("")
    const [TAs,set_TAs] = useState()
    const [TA_Names,set_TA_Names]=useState(["","","","",""])
    var arr=[]
    const [pass_copy,set_pass_copy] =useState("")


    const [Message,setmessage] = useState("")
    const [show,setshow] = useState(false)
    const [update,set_update]=useState(false)
    const pattern = new RegExp("[6,7,8,9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]") 

    const [faculty,Setfaculty] = useState(
    {
        email:"",
        faculty_name_new:"",
        faculty_phone_num_new:"",
        faculty_TAs_Req_new:"",
        faculty_image_url_new:"",
        faculty_pass_new:""
    })
    const [axios_call_count,set_call_count]=useState(0)

    if(axios_call_count==0||update==false)
    {
      axiosJWT.post("http://localhost:9000/Faculty_Profile",props, {headers:{'authorization':"Bearer "+userAccessToken}}).then(
        res => {
                  set_call_count(1)
                  set_update(true)
                  res.data.found ? Set_details(res) : setdummy()
                  axiosJWT.post("http://localhost:9000/fetch_TAs_email_array",res.data.TA_Emails, {headers:{'authorization':"Bearer "+userAccessToken}}).then(response=>{set_details_2(response,res.data.TA_Emails)})
               })

       
      function Set_details(res)
      {
        set_faculty_name(res.data.name)
        set_TAs_Req(res.data.TAs_Req)
        set_image_url(res.data.image_url)
        set_phone_num(res.data.phone_num)
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

    

    const HandleChange  = e =>  /*When someone types, its an 'event', denoted and saved in 'e' here. e.target will return where and what the change was*/
    {    
        setshow(false)
        setmessage("")
        const {name,value} = e.target
        if(name=="pass_copy")
        {
          set_pass_copy(value);
        }
        else
        {
            Setfaculty({
                ...faculty, /* Stores the value entered by the faculty in the respective state variable while the rest remain as their default values ("" in this case)*/
                [name]:value /* Depending on the name of the inputbar, its value is stored in the respective state variable*/
            })
        }
    }

    const Save_Changes = () =>
    {
        set_update(false)
        setshow(true)
        const {email,faculty_name_new,faculty_phone_num_new,faculty_TAs_Req_new,faculty_image_url_new,faculty_pass_new} = faculty
        faculty.email=props.email
        if(!faculty_name_new&&!faculty_phone_num_new&&!faculty_TAs_Req_new&&!faculty_image_url_new&&!faculty_pass_new)
        {
            setmessage("Please enter new data")
        }
        else if(faculty_TAs_Req_new==faculty_TAs_Req&&faculty_TAs_Req_new)
        {
          setmessage("Entered TA requirement matches the existing one.")
        }
        else if(faculty_name_new==faculty_name&&faculty_name_new)
        {
            setmessage("Entered name matches the existing one.")
        }
        else if(faculty_phone_num_new==faculty_phone_num&&faculty_phone_num_new)
        {
            setmessage("Entered phone number matches the existing one.")
        }
        else if(faculty_image_url_new==faculty_image_url_new&&faculty_image_url_new)
        {
            setmessage("Entered image URL matches the existing one.")
        }
        else if(!pattern.test(faculty_phone_num_new)&&faculty_phone_num_new)
        {
            setmessage("Please enter a valid phone number")
        }
        else if(faculty.faculty_pass_new != pass_copy)
        {
          setmessage("Please repeat the password correctly.")
        }
        else
        {
            axiosJWT.put("http://localhost:9000/Update_Faculty_Profile", faculty, {headers:{'authorization':"Bearer "+userAccessToken}})
            .then( res=> {setmessage(res.data.message)} )
        }

    }



    return(
        <div>
            
            <Header login_state={props} type={"FACULTY"}/>
              <div className='profile_box'>
                <center><h1>My Profile</h1>
                <br/>
                <img src={image_url} height="200" max-width="650"/>
                <div className='details'>                
                  <br/>
                  <h3>Name &emsp;: &emsp;{faculty_name}<br/><input type="text" name="faculty_name_new" placeholder="Enter New Name" className='details_input' onChange={HandleChange} value={faculty.faculty_name_new}/></h3>
                  <br/>
                  <h3>Email &emsp;: &emsp;{props.email}</h3>
                  <br/>
                  <h3>Image URL &emsp;: <br/><input name="faculty_image_url_new" type="text" placeholder="Enter Profile Image URL" className='details_input' onChange={HandleChange} value={faculty.faculty_image_url_new}/></h3>
                  <br/>
                  <h3>Phone Number &emsp;: &emsp;{faculty_phone_num}<br/><input name="faculty_phone_num_new" type="text" placeholder="Enter New Phone Number" className='details_input' onChange={HandleChange} value={faculty.faculty_phone_num_new}/></h3>
                  <br/>
                  <h3>Department &emsp;: &emsp;{faculty_dept}</h3>
                  <br/>
                  <br/>
                  <h3>New Password &emsp;: &emsp;<br/><input name="faculty_pass_new" placeholder="Enter New Password" className='details_input' onChange={HandleChange} value={faculty.faculty_pass_new}/></h3>
                  <br/>
                  <input name="pass_copy" placeholder="Repeat Password" className='details_input' onChange={HandleChange} value={pass_copy}/>
                  <br/>
                  <br/>
                  <h3>TAs Required &emsp;: &emsp;{faculty_TAs_Req==-1?"NA":faculty_TAs_Req}<br/><input name="faculty_TAs_Req_new" type="Number" placeholder="Enter TAs Required" className='details_input' onChange={HandleChange} value={faculty.faculty_TAs_Req_new}/></h3>
                  <br/>
                  <h2>Course(s) Offered &emsp;:- &emsp;</h2>{courses.filter(course => course!="").map((course)=>(<h3>{course}</h3>))}<br/>
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

export default Faculty_Profile