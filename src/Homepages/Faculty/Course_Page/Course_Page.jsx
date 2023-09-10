import React, {useEffect,useState} from 'react'
import Header from '../../../Header/header.jsx'
import './Course_Page.css'
import { Link, useLocation } from 'react-router-dom'
import {BsListTask} from 'react-icons/bs'
import {FaTasks} from 'react-icons/fa'
import { useContext } from 'react';
import {userContext} from '../../../App.jsx'

const Course_Page = (props) => 
{

    const [userEmail,setUserEmail,userType,setUserType,userAccessToken,setUserAccessToken,userRefreshToken,setUserRefreshToken,axiosJWT] = useContext(userContext);
   
    const location=useLocation()
    const course = location.state.course
    const [TAs,set_TAs] = useState([""])

    useEffect(() => 
    {
        const fetch_TAs = async () =>
        {
            const result2 = await axiosJWT.get(`http://localhost:9000/fetch_TAs_by_course_faculty?Faculty_Email=${props.email}&Course_Code=${course.code}`, {headers:{'authorization':"Bearer "+userAccessToken}})
            set_TAs(result2.data)
        }
        fetch_TAs()

    },[]) 
    

    return(

        <div>
        <Header login_state={props} type={"FACULTY"}/>
        <div className='faculty_box'>
            <center>
            <h1>{course.name}</h1>
            <h1>({course.code})</h1>
            <br/>
            <br/>
            <div className='details'>
                <br/>
                <h3>TAs Allotted &emsp;:- &emsp;<p>{TAs.length}</p></h3>
                <br/>
                <h3>TAs &emsp;:- &emsp; {TAs.map((TA)=>(<p>{TA.name}</p>))}</h3>
                <br/>
                <br/>
            </div>
            <Link to="/Assign_Task_Page" className='Task_card' state= {{course:course}}>
                    <BsListTask size={50}/>
                    &emsp;ASSIGN TASK
                </Link>
            <Link to="/View_Edit_Tasks_Page" className='Task_card' state= {{course:course}}>
                <FaTasks size={50}/>
                &emsp;VIEW/EDIT TASKS
            </Link>
            </center>
        </div>
        </div>



    )
    


}

export default Course_Page