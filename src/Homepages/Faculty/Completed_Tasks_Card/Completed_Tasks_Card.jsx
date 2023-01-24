import React,{useState,useEffect, useTransition} from 'react'
import './Completed_Tasks_Card.css'
import axios from 'axios'
import { format, parseISO } from 'date-fns'
import {Faculty} from '../../../Classes/Users.tsx'

const Completed_Tasks_Card_TA = (props) => 
{

    const [completed_task,set_completed_task]=useState(props.param)
    const TAs = props.TAs
    const days = [ "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" ];
    const [update,set_update]=useState(true)
    const [show,set_show]=useState("")
    const [Message,set_message]=useState("")
    const id = {id:completed_task._id}
    var arr=[]
    var TA_Names=[]
    const Rating_pattern = new RegExp("R[0-9]")
    const Comments_pattern = new RegExp("C[0-9]")
    const [inputs,set_inputs] = useState({

        Rating:[],
        Comments:[]
    })


    const HandleChange = e =>
    {
        set_show(false)
        set_message("")
        const {name,value} = e.target
        if(Rating_pattern.test(name))
        {
            inputs.Rating[name[1]]=Number(value)
        }
        else if(Comments_pattern.test(name))
        {
            inputs.Comments[name[1]]=value
        }

        
    }

    for(var i=0;i<completed_task.Status.filter(status=>status!="").length;i++)
    {
        arr[i]=i;
        for(let index in completed_task.TA_Emails)
        {
            if(completed_task.TA_Emails[index]==TAs[i].email)
                TA_Names.push(TAs[i].name)
        }

    }

    if(update==false)
    {
        const fetch_completed_tasks = async () =>
        {
            const result= await axios.post("http://localhost:9000/fetch_completed_task_id",id)
            set_completed_task(result.data)
            set_update(true)
        }
        fetch_completed_tasks();
        
    }

    const Save_Changes = async() =>
    {
        set_show(true)
        if(!inputs.Rating)
        {
            set_message("Please enter a rating")
        }
        else
        {

            set_update(false)
            let F1 = new Faculty()
            const response = await F1.Add_Inputs(inputs.Rating,inputs.Comments,completed_task._id)
            set_message(response)
        }

    }

 
    
    return (

        <div className='request_container'>
            <span>
                  <p>&emsp;&emsp;Name :- {completed_task.Name}</p>
                  <br/>
                  <p>&emsp;&emsp;Description :- <br/> &emsp;&emsp;{completed_task.Description}</p>
                  <br/>
                  <p>&emsp;&emsp;Deadline :- <br/> &emsp;&emsp;{format(parseISO(completed_task.Deadline),'dd-MM-yyyy')} ({days[parseISO(completed_task.Deadline).getDay()]})</p>
                  <br/>
                  {
                    arr.map((i) =>
                    (
                        <div>
                            <p>&emsp;&emsp; TA Name : {TA_Names[i]}</p>
                            <p>&emsp;&emsp; TA Email : {completed_task.TA_Emails[i]}</p>
                            <p>&emsp;&emsp; Task Status : {completed_task.Status[i]}</p>
                            <p>&emsp;&emsp; Rating : {completed_task.Rating[i]} &emsp;&emsp;
                                <select name={"R"+i} className='details_input_card' onChange={HandleChange} >
                                    <option value="0">0</option>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>
                                </select>
                            </p>
                            <p>&emsp;&emsp; Comments : <br/>&emsp;&emsp; {completed_task.Comments[i]}<br/>&emsp;&emsp;<textarea name={"C"+i} rows="4" type="text" placeholder="Please Enter Comments (if any)" className='details_input_card_large' onChange={HandleChange} value={inputs.Comments[i]}/></p>
                            <br/>
                            <br/>
    
                        </div>
                    ))
                  }
                  <center>
                  <div className="ErrorMsg">{show && Message!=="Task Updated Successfully" ? Message : ""}</div>
                  <div className="SuccessMsg">{show && Message=="Task Updated Successfully" ? Message : ""}</div>
                  <div className='btn' onClick={Save_Changes}>SAVE</div>
                  </center>
            </span>
        </div>
        
    )

}

export default Completed_Tasks_Card_TA