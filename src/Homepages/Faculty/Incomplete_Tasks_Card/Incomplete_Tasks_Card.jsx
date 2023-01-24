import React,{useState,useEffect} from 'react'
import './Incomplete_Tasks_Card.css'
import axios from 'axios'
import { format, parseISO } from 'date-fns';

const Incomplete_Tasks_Card = (props) => {

    const incomplete_task=props.param
    const TAs = props.TAs
    const days = [ "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" ];
    var arr=[]
    var TA_Names=[]


    for(var i=0;i<incomplete_task.Status.filter(status=>status!="").length;i++)
    {
        arr[i]=i;
        for(let index in incomplete_task.TA_Emails)
        {
            if(incomplete_task.TA_Emails[index]==TAs[i].email)
                TA_Names.push(TAs[i].name)
        }

    }

 
    
    return (

        <div className='request_container'>
            <span>
                  <p>&emsp;&emsp;Name :- {incomplete_task.Name}</p>
                  <br/>
                  <p>&emsp;&emsp;Description :- <br/> &emsp;&emsp;{incomplete_task.Description}</p>
                  <br/>
                  <p>&emsp;&emsp;Deadline :- <br/> &emsp;&emsp;{format(parseISO(incomplete_task.Deadline),'dd-MM-yyyy')} ({days[parseISO(incomplete_task.Deadline).getDay()]})</p>
                  <br/>
                  {
                    arr.map((i) =>
                    (
                        <div>
                            <div className={incomplete_task.Status[i]=="Not Started"? "not_started" : incomplete_task.Status[i]=="In Progress" ? "in_progress" : "complete"}>&emsp;&emsp; TA Name : {TA_Names[i]}</div>
                            <div className={incomplete_task.Status[i]=="Not Started"? "not_started" : incomplete_task.Status[i]=="In Progress" ? "in_progress" : "complete"}>&emsp;&emsp; TA Email : {incomplete_task.TA_Emails[i]}</div>
                            <div className={incomplete_task.Status[i]=="Not Started"? "not_started" : incomplete_task.Status[i]=="In Progress" ? "in_progress" : "complete"}>&emsp;&emsp; Task Status : {incomplete_task.Status[i]}</div>
                            <br/>
                        </div>
                    ))
                  }
            </span>
        </div>
        
    )


}

export default Incomplete_Tasks_Card