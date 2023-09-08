import React,{useEffect, useState} from 'react'
import Header from '../../../Header/header.jsx'
import './Apply.css'
import axios from 'axios'
import {TA} from '../../../Classes/Users.tsx'
import { useContext } from 'react';
import {userContext} from '../../../App.jsx'

const Apply = (props) => 
{
    const [userEmail,setUserEmail,userType,setUserType,userAccessToken,setUserAccessToken,userRefreshToken,setUserRefreshToken,axiosJWT] = useContext(userContext);
   
        const [Status,set_status] = useState()
        const [Message,setmessage] = useState("")
        const [user,set_user] = useState({
            course1:"",
            course2:"",
            course3:""
        })
        const [show,setshow] = useState(false)
        const [courses,set_courses] = useState()
        const [flag,set_flag]=useState(0);
        const email = {email: props.user_email}
        
        const [fac,set_fac] = useState({name:""})


        const [choices_temp,Set_choices_temp] = useState({
            course1:"",
            course2:"",
            course3:""
        })

        useEffect(() => 
        {
            const fetch_courses = async () =>
            {
                const result= await axiosJWT.get("http://localhost:9000/fetch_courses", {headers:{'authorization':"Bearer "+userAccessToken}})
                set_courses(result)
            }
            fetch_courses();
            const fetch_user = async () =>
            {
                const result2 = await axiosJWT.post("http://localhost:9000/fetch_TA",email, {headers:{'authorization':"Bearer "+userAccessToken}})
                set_user(result2.data)
                set_status(result2.data.Application_Status)
                set_flag(1)
            }
            fetch_user();
               
            
            
        
        },[])

        if(flag==1)
        {
            const fetch_faculty = async () =>
            {
                const fac_email = {email : user.Faculty_Email}
                const result3 = await axiosJWT.post("http://localhost:9000/fetch_faculty_by_email",fac_email, {headers:{'authorization':"Bearer "+userAccessToken}})
                set_fac(result3.data)
                set_flag(0);
            }
            fetch_faculty()
        }

        

        const HandleChange  = e =>  /*When someone types, its an 'event', denoted and saved in 'e' here. e.target will return where and what the change was*/
        {    
            setshow(false)
            setmessage("")
            const {name,value} = e.target
            Set_choices_temp({
                ...choices_temp, /* Stores the value entered by the user in the respective state variable while the rest remain as their default values ("" in this case)*/
                [name]:value /* Depending on the name of the inputbar, its value is stored in the respective state variable*/   
            })
  
        }


        const Save_Changes = async() =>
        {
            setshow(true)
            if(!choices_temp.course1)
            {
                setmessage("Please choose course 1")
            } 
            else if(!choices_temp.course2)
            {
                setmessage("Please choose course 2")
            } 
            else if(!choices_temp.course3)
            {
                setmessage("Please choose course 3")
            } 
            else if(choices_temp.course1==choices_temp.course2||choices_temp.course1==choices_temp.course3||choices_temp.course2==choices_temp.course3)
            {
                setmessage("Courses must be different")
            }
            else
            {
                set_status("Applied")
                const details = {
                    Email:props.user_email,
                    course1:choices_temp.course1,
                    course2:choices_temp.course2,
                    course3:choices_temp.course3,
                    Application_Status:"Applied"
                }
                const response = await axiosJWT.post("http://localhost:9000/Set_choices", details, {headers:{'authorization':"Bearer "+userAccessToken}})
                setmessage(response.data.message)  

                const result2 = await axiosJWT.post("http://localhost:9000/fetch_TA",email, {headers:{'authorization':"Bearer "+userAccessToken}})
                set_user(result2.data)

            }
        } 



        return(
            <div>
                <Header login_state={props} type={"TA"}/>
                <div className='item_box'>
                    <center>
                    <h1>APPLY FOR TEACHING ASSISTANTSHIP</h1>
                    <br/>
                    <h2 className={Status=="Yet to Apply" ? "ErrorMsg" : "SuccessMsg"}>Status : {Status}</h2>     
                    {Status=="Yet to Apply" ? <h2>Please choose 3 courses of your liking</h2> : Status=="Applied" ? <h2>Please wait for the admin to assign you to a course.</h2> : <h2>You have been assigned to {user.Final_Course_Code} under {fac.name}</h2>}
                    <br/>
                    { 
                        Status=="Yet to Apply"
                        
                        ?

                        <div className='details'>
                            <h3>Course 1&emsp;: <br/>
                                <select name="course1" className='details_input' onChange={HandleChange} value={choices_temp.course1}>
                                    <option value=""></option>
                                        {
                                            courses && courses.data.map((el) => 
                                            (
                                                <option value={el.code}>{el.name}</option>
                                            ))
                                            
                                        }
                                </select>
                            </h3>
                            <br/>
                            <h3>Course 2&emsp;: <br/>
                                <select name="course2" className='details_input' onChange={HandleChange} value={choices_temp.course2}>
                                    <option value=""></option>
                                        {
                                            courses && courses.data.map((el) => 
                                            (
                                                <option value={el.code}>{el.name}</option>
                                            ))
                                            
                                        }
                                </select>
                            </h3>
                            <br/>
                            <h3>Course 3&emsp;: <br/>
                                <select name="course3" className='details_input' onChange={HandleChange} value={choices_temp.course3}>
                                    <option value=""></option>
                                        {
                                            courses && courses.data.map((el) => 
                                            (
                                                <option value={el.code}>{el.name}</option>
                                            ))
                                            
                                        }
                                </select>
                            </h3>
                            <br/>
                        </div>


                        :

                        
                        <div className='details'>
                            <h3>Course 1&emsp;:&emsp;{user.course1}</h3>
                            <br/>
                            <h3>Course 2&emsp;:&emsp;{user.course2}</h3>
                            <br/>
                            <h3>Course 3&emsp;:&emsp;{user.course3}</h3>
                            <br/>
                        </div>

                    }
                    <div className="ErrorMsg">{show && Message!=="Application Successful" ? Message : ""}</div>
                    <div className="SuccessMsg">{show && Message=="Application Successful" ? Message : ""}</div>
                    <div className={Status=="Yet to Apply" ? 'btn' : 'ncbtn'} onClick={Status=="Yet to Apply" ? Save_Changes : null}>APPLY</div>
                    <br/>
                    <br/>
                    </center>
              </div>
            </div>
        )
        
}

export default Apply