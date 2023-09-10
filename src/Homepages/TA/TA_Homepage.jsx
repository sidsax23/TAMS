import React, {useState, useEffect} from 'react'
import './TA_Homepage.css'
import Header from '../../Header/header.jsx'
import { Link } from 'react-router-dom'
import {BsBookHalf} from 'react-icons/bs'
import axios from 'axios'
import Incomplete_Tasks_Card_TA from './Incomplete_Task_Card_TA/Incomplete_Task_Card_TA'
import Completed_Tasks_Card_TA from './Completed_Task_Card_TA/Completed_Tasks_Card_TA.jsx'
import { useContext } from 'react';
import {userContext} from '../../App.jsx'

const TA_homepage = (props) => 
{
    const [userEmail,setUserEmail,userType,setUserType,userAccessToken,setUserAccessToken,userRefreshToken,setUserRefreshToken,axiosJWT] = useContext(userContext);
   

    const [incomplete_tasks,set_incomplete_tasks] = useState("")
    const [completed_tasks,set_completed_tasks] = useState("")

    useEffect(() => 
    {

        const fetch_incomplete_tasks = async () =>
        {
            const data= await axiosJWT.get(`http://localhost:9000/fetch_incomplete_tasks_TA?email=${props.email}`, {headers:{'authorization':"Bearer "+userAccessToken}})
            set_incomplete_tasks(data)
        }
        fetch_incomplete_tasks();

        const fetch_completed_tasks = async () =>
        {
            const data= await axiosJWT.get(`http://localhost:9000/fetch_completed_tasks_TA?email=${props.email}`, {headers:{'authorization':"Bearer "+userAccessToken}})
            set_completed_tasks(data)
        }
        fetch_completed_tasks();

    },[]) 




    return(
        <div>
            <Header login_state={props} type={"TA"}/>
                <div className='faculty_box'>
                    <center>
                    <h1>STUDENT DASHBOARD</h1>
                    </center>
                    <br/>
                     {/*APPLY*/}
                     <Link to="/Apply" className='TA_card'>
                        <BsBookHalf size={50}/>
                        &emsp;APPLY FOR TA-SHIP
                    </Link>
                    <br/>
                    <br/>
                    <br/>
                    <center>
                    <h2>INCOMPLETE TASKS</h2>

                    <div className='task_details'>
                    {
                        incomplete_tasks && incomplete_tasks.data.map((incomplete_task) => 
                        (
                            <Incomplete_Tasks_Card_TA param={incomplete_task} email={props.email}/>                    
                        ))               
                    }
                    </div>
                    <br/>
                    <h2>COMPLETED TASKS</h2>
                    <div className='task_details'>
                    {
                        completed_tasks && completed_tasks.data.map((completed_task) => 
                        (
                            <Completed_Tasks_Card_TA param={completed_task} email={props.email}/>                    
                        ))               
                    }
                    </div>
                    <br/>
                    </center>
                </div>

        </div>
    )
}

export default TA_homepage