import React,{useState,useEffect, useTransition} from 'react'
import './Incomplete_Task_Card_TA.css'
import axios from 'axios'
import { format, parseISO } from 'date-fns'
import {TA} from '../../../Classes/Users.tsx'
import { useContext } from 'react';
import {userContext} from '../../../App.jsx'

const Incomplete_Tasks_Card_TA = (props) => {

    const [userEmail,setUserEmail,userType,setUserType,userAccessToken,setUserAccessToken,userRefreshToken,setUserRefreshToken,axiosJWT] = useContext(userContext);
   
    const days = [ "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" ];
    const [show,set_show]=useState("")
    const [Message,set_message]=useState("")
    const [incomplete_task,set_incomplete_task]=useState(props.param)
    const [index,set_index] = useState()
    const [status,set_status]=useState("") 
    const [status_old,set_status_old] = useState("")
    const [update,set_update]=useState(true)
    var today = new Date()
    var deadline = new Date(incomplete_task.Deadline)

    
    function Setter(incomplete_task)
    {

        for(var i=0;i<incomplete_task.Status.filter(status=>status!="").length;i++)
        {
            if(props.email==incomplete_task.TA_Emails[i]&&incomplete_task.Status[i]!="Completed")
            {
                set_status_old(incomplete_task.Status[i])
                set_index(i)
            }
        }
    }

    useEffect(() =>
    {   
        Setter(incomplete_task)
        
    },[])

    const HandleChange = e =>
    {
        set_show(false)
        set_message("")
        set_status(e.target.value)

    }
 
    const Save_Changes = async() =>
    {
        set_show(true)
        if(status==status_old)
        {
            set_message("No Change in Task Status")
        }
        else if(status=="")
        {
            set_message("Please select a valid task status")
        }
        else
        {  
            
            set_update(false)
            const details = {
                Status:status,
                id:incomplete_task._id,
                index:index
            }
            const response = await axiosJWT.put("http://localhost:9000/Update_Task_Status", details, {headers:{'authorization':"Bearer "+userAccessToken}})
            set_message(response.data.message)   
        }

    }

    if(update==false)
    {
        const fetch_incomplete_tasks = async () =>
        {
            const result= await axiosJWT.get(`http://localhost:9000/fetch_incomplete_task_id?id=${incomplete_task._id}`, {headers:{'authorization':"Bearer "+userAccessToken}})
            set_incomplete_task(result.data)
            Setter(result.data)
            set_status_old(status)
            set_update(true)
        }
        fetch_incomplete_tasks();
        
    }
    
    return (
        

        <div className='request_container'>
            <span>
                  <p>&emsp;&emsp;Name :- {incomplete_task.Name}</p>
                  <br/>
                  <p>&emsp;&emsp;Description :- <br/> &emsp;&emsp;{incomplete_task.Description}</p>
                  <br/>
                  <p>&emsp;&emsp;Deadline :- <br/> <div className={today>deadline ? 'ErrorMsg' : 'SuccessMsg'}>&emsp;&emsp;{format(parseISO(incomplete_task.Deadline),'dd-MM-yyyy')} ({days[parseISO(incomplete_task.Deadline).getDay()]})</div></p>
                  <br/>
                  <p>&emsp;&emsp;Status : &emsp;{status_old}&emsp;
                    <select name="Status" className='details_input_card' onChange={HandleChange} >
                        <option value=""></option>
                        <option value="Not Started">Not Started</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                    </select>
                  </p>
                  <br/>
                  <p>&emsp;&emsp;Note : You cannot edit task status once the task has been completed.</p>
                  <br/>
                  <center>
                  <div className="ErrorMsg">{show && Message!=="Task Status Updated Successfully" ? Message : ""}</div>
                  <div className="SuccessMsg">{show && Message=="Task Status Updated Successfully" ? Message : ""}</div>
                  <div className={status_old=="Completed"? 'ncbtn' : 'btn'} onClick={status_old=="Completed"? null : Save_Changes}>UPDATE</div>
                  </center>
            </span>
        </div>
        
    )


}

export default Incomplete_Tasks_Card_TA