import React, {useEffect,useState} from 'react'
import Header from '../../../../Header/header.jsx'
import './Edit_Task_Details.css'
import { Link, useLocation } from 'react-router-dom'
import axios from 'axios'
import {Faculty} from '../../../../Classes/Users.tsx'
import { format, parseISO } from 'date-fns'
import { useContext } from 'react';
import {userContext} from '../../../../App.jsx'

const Edit_Task_Details = (props) => 
{

    const [userEmail,setUserEmail,userType,setUserType,userAccessToken,setUserAccessToken,userRefreshToken,setUserRefreshToken,axiosJWT] = useContext(userContext);
   
    const location=useLocation()
    const [task,set_task] = useState(location.state.Task)
    const [course,set_course] = useState(location.state.course)
    const [TAs,set_TAs] = useState([""])
    const [Course_TAs,set_Course_TAs] = useState([""])
    const [RT, set_RT] = useState(0)
    const days = [ "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" ];
    const [update,set_update]=useState(true)
    const [show,set_show]=useState("")
    const [Message,set_message]=useState("")
    const [show2,set_show2]=useState("")
    const [Message2,set_message2]=useState("")
    const [comments,set_comments] = useState([])
    var arr=[];
    var arr2=[];
    var arr3 = [];
    var TA_Names=[]
    const TA_pattern = new RegExp("TA[0-9]")
    const Rating_pattern = new RegExp("R[0-9]")
    const Comments_pattern = new RegExp("C[0-9]")

    const [inputs,set_inputs] = useState({

        Rating:task.Rating,
        Comments:task.Comments
    })
    const [Task_Temp,set_Task_Temp] = useState({
        name : task.Name,
        description : task.description,
        deadline : task.deadline,
        TAs_num : 1,
        TA_Emails:[""]

    })

    useEffect(() => 
    {
        const fetch_TAs = async () =>
        {
            const result = await axiosJWT.get(`http://localhost:9000/fetch_TAs_email_array?emails=${task.TA_Emails}`, {headers:{'authorization':"Bearer "+userAccessToken}})
            set_TAs(result.data)
        }
        fetch_TAs()

        const fetch_course_TAs = async () =>
        {
            const result2 = await axiosJWT.get(`http://localhost:9000/fetch_TAs_by_course_faculty?Faculty_Email=${props.email}&Course_Code=${location.state.course.code}`, {headers:{'authorization':"Bearer "+userAccessToken}})
            set_Course_TAs(result2.data)
        }
        fetch_course_TAs()

    },[]) 


    const HandleChange = e =>
    {
        set_show(false)
        set_show2(false)
        set_message("")
        const {name,value} = e.target
        if(Rating_pattern.test(name))
        {
            inputs.Rating[Number(name[1])]=Number(value)
        }
        else if(Comments_pattern.test(name))
        {
            inputs.Comments[Number(name[1])]=String(value);
        }
        else if(TA_pattern.test(name))
        {
            Task_Temp.TA_Emails[name[2]-1]=value
        }
        else if(name=="RT")
        {
            set_RT(value)
        }
        else
        {
            set_Task_Temp({
                ...Task_Temp,
                [name]:value
            })
        }

        if(name=="TAs_num")
        {
            Arr2Setter()
        }

        
    }

    for(var i=0;i<task.TA_Emails.filter(email=>email!="").length;i++)
    {

        arr[i]=i;
        try
        {
            const index = task.TA_Emails.indexOf(TAs[i].email)
            try
            {
                TA_Names.push(TAs[index].name);
            }
            catch
            {
                continue;
            }
            
        }
        catch
        {
            continue;
        }
        
    }
    
    function Arr2Setter()
    {
        for(var i=0;i<=Course_TAs.length;i++)
        {
            arr2[i]=i
        }
    }

    function Arr3Setter()
    {
        arr3=[]
        for(var i=1;i<=Task_Temp.TAs_num;i++)
        {
            arr3[i-1]=i
        }
    }

    function TA_Remover()
    {
        for(var i=Task_Temp.TAs_num;i<5;i++)
        {
            Task_Temp.TA_Emails[i]=""
        }
    }
    

    if(update==false)
    {
        const fetch_task = async () =>
        {
            const result= await axiosJWT.get(`http://localhost:9000/fetch_task_id?id=${task._id}`, {headers:{'authorization':"Bearer "+userAccessToken}})
            set_task(result.data)
            set_update(true)
        }
        fetch_task();
        
    }

    const Save_Changes = async() =>
    {      
        set_show(true)
        const details = {
            ratings:inputs.Rating,
            comments:inputs.Comments,
            id:task._id,
            name:Task_Temp.name,
            description:Task_Temp.description,
            deadline:Task_Temp.deadline
        }
        const response = await axiosJWT.post("http://localhost:9000/Edit_Task_Faculty", details, {headers:{'authorization':"Bearer "+userAccessToken}})
        set_update(false)
        set_message(response.data.message)  

    }

    const Remove_TA = async(email) =>
    {
        set_show(true)
        const details = {
            task_id:task._id,
            ta_email:email
        }
        const response = await axiosJWT.post("http://localhost:9000/Remove_ta_from_task",details, {headers:{'authorization':"Bearer "+userAccessToken}})
        set_update(false)
        set_message(response.data) 

    }

 
    const re_assign_tas = async() =>
    {
        set_show2(true)
        const details = {
            task_id:task._id,
            TA_Emails:Task_Temp.TA_Emails
        }
        const response = await axiosJWT.post("http://localhost:9000/Reassign_TAs",details, {headers:{'authorization':"Bearer "+userAccessToken}})
        set_update(false)
        set_message2(response.data) 

    }
    
    return(

        <div>
        <Header login_state={props} type={"FACULTY"}/>
        <div className='faculty_box'>
            <center>
            <h1>{location.state.cname}</h1>
            <h1>({task.Course_Code})</h1>
            <br/>
            <br/>
            <h2>TASK DETAILS</h2>
            <br/>
            <div className='task_details'>
             <div className='request_container'>
                <span>
                  <h2 className='h2'>&emsp;General Details : </h2>
                  <p>&emsp;&emsp;Name :-{task.Name} <br/>&emsp;&emsp;<input type="text" name="name" placeholder="Enter New Task Name" className='task_details_input' onChange={HandleChange} value={Task_Temp.name}/></p>
                  <br/>
                  <p>&emsp;&emsp;Description :- <br/> &emsp;&emsp;{task.Description}<br/>&emsp;&emsp;<textarea name="description" rows="4" type="text" placeholder="Please Enter New Description" className='details_input_card_large' onChange={HandleChange} value={Task_Temp.description}/></p>
                  <br/>
                  <p>&emsp;&emsp;Deadline :- <br/> &emsp;&emsp;{format(parseISO(task.Deadline),'dd-MM-yyyy')} ({days[parseISO(task.Deadline).getDay()]})<br/> &emsp;&emsp;<input type="date" name="deadline" placeholder="Enter New Task Deadline" className='task_details_input' onChange={HandleChange} value={Task_Temp.deadline}/></p>
                  <br/>
                  <br/>
                  <h2 className='h2'>&emsp;TAs Assigned : </h2>
                  {
                    arr.map((i) =>
                    (
                        <div>
                            <h3 className='h3'>&emsp;&emsp;TA {[i+1]} : </h3>
                            <p>&emsp;&emsp; Name : {TA_Names[i]}</p>
                            <p>&emsp;&emsp; Email : {task.TA_Emails[i]}</p>
                            <p>&emsp;&emsp; Task Status : {task.Status[i]}</p>
                            <p>&emsp;&emsp; Rating : {task.Rating[i]} &emsp;&emsp;
                                <select name={"R"+i} className='details_input_card' onChange={HandleChange} >
                                    <option value={task.Rating[i]?task.Rating[i]:"0"}></option>
                                    <option value="0">0</option>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>
                                </select>
                            </p>
                            <p>&emsp;&emsp; Comments : <br/>&emsp;&emsp; {task.Comments[i]}<br/>&emsp;&emsp;<textarea name={"C"+i} rows="4" type="text" placeholder="Please Enter Comments (if any)" className='details_input_card_large' onChange={HandleChange} value={comments[i]}/></p>
                            &emsp;&emsp;<div className='btn' onClick={() => Remove_TA(task.TA_Emails[i])}>Remove TA from Task</div>
                            <br/>
                            <br/>
                            <br/>
                        </div>
                    ))
                  }
                  <center>
                    <div className="ErrorMsg">{show && (Message!="Task Updated Successfully"&&Message!="TA Removed Successfully!") ? Message : ""}</div>
                    <div className="SuccessMsg">{show && (Message=="Task Updated Successfully"||Message=="TA Removed Successfully!") ? Message : ""}</div>
                    <div className='btn' onClick={Save_Changes}>SAVE</div>
                  </center>
                  <br/>
                  <br/>
                  <br/>
                  <h2 className='h2'>&emsp;Re-Assign TAs ? :</h2>
                  &emsp;&emsp;<select name="RT" className='task_details_input' onChange={HandleChange}>
                    <option value={0}></option>
                    <option value={1}>Yes</option>
                    <option value={0}>No</option>
                  </select>
                  <br/>
                  <br/>
                  {Arr2Setter()}
                  {Arr3Setter()}
                  {TA_Remover()}
                  { RT==1 ?
                    (
                        <div>
                        <h3 className='h3'>&emsp;&emsp;Number of TAs &emsp;:</h3>  
                        &emsp;&emsp;<select name="TAs_num" className='task_details_input' onChange={HandleChange} value={Task_Temp.TAs_num}>
                        {
                              arr2.map((el) => 
                              (
                                  <option value={el}>{el}</option>
                              ))

                        }
                        </select>
                        <br/>
                        <br/>
                        {
                        
                          arr3.map( (el,i) => 
                          (
                              <div>
                                   <p key={i}>&emsp;&emsp;TA {el} &emsp;: <br/>
                                   &emsp;&emsp;<select name={"TA"+el} className='task_details_input' onChange={HandleChange}>
                                          <option value=""></option>
                                          {
                                              Course_TAs && Course_TAs.map((el) => 
                                              (
                                                  <option value={el.email}>{el.name}</option>     
                                              ))

                                          }
                                      </select>
                                  </p>
                                  <br/>
                              </div>
                          ))
                        }
                        <br/>
                        <br/>
                        <center>
                         <div className="ErrorMsg">{show2 && Message2!="TA Re-Assignment Successfull!" ? Message2 : ""}</div>
                         <div className="SuccessMsg">{show2 && Message2=="TA Re-Assignment Successfull!" ? Message2 : ""}</div>
                         <div className='btn' onClick={re_assign_tas}>Re-Assign TAs</div>
                        </center>
                        </div>
                    )
                    :
                    <div></div>
                }                    
                </span>
             </div>
            </div>
            <br/>
            </center>
        </div>
        </div>
    )
    

}

export default Edit_Task_Details
