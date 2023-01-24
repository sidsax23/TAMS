import React, {useEffect,useState} from 'react'
import Header from '../../../Header/header.jsx'
import './Task_Assignment.css'
import { Link, useLocation } from 'react-router-dom'
import axios from 'axios'
import {Faculty} from '../../../Classes/Users.tsx'

const Task_Assignment = (props) => 
{
    const location=useLocation()
    const course = location.state.course
    const [details,set_details]=useState(
        {
            Faculty_Email : props.email,
            Course_Code : course.code
        }

    )
    const [TAs,set_TAs] = useState([""])

    var arr=[]
    var arr2=[]
    const TA_pattern = new RegExp("TA[0-9]")
    

    const [Message,setmessage] = useState("")
    const [show,setshow] = useState(false)
    const [Task_Temp,set_Task_Temp] = useState(
      {
        name:"",
        description :"",
        deadline : "",
        TAs_num : 1,
        TA_Emails:[""],
        Email : ""
        
      })

    
    useEffect(() => 
    {
        const fetch_TAs = async () =>
        {
            const result2 = await axios.post("http://localhost:9000/fetch_TAs_by_course_faculty",details)
            set_TAs(result2.data)
        }
        fetch_TAs()

    },[]) 

    


    //Saving user input
    const HandleChange  = e =>  /*When someone types, its an 'event', denoted and saved in 'e' here. e.target will return where and what the change was*/
    {    
        setshow(false)
        setmessage("")
        const {name,value} = e.target

        if(TA_pattern.test(name))
        {
            Task_Temp.TA_Emails[name[2]-1]=value
        }
        else
        {
            set_Task_Temp({
                ...Task_Temp, /* Stores the value entered by the user in the respective state variable while the rest remain as their default values ("" in this case)*/
                [name]:value /* Depending on the name of the inputbar, its value is stored in the respective state variable*/
            })
        }
        if(name=="TAs_num")
        {
            Arr2Setter()
        }

    }

    function ArrSetter()
    {
        for(var i=0;i<=TAs.length;i++)
        {
            arr[i]=i
        }
    }

    function Arr2Setter()
    {
        arr2=[]
        for(var i=1;i<=Task_Temp.TAs_num;i++)
        {
            arr2[i-1]=i
        }
    }

    function TA_Remover()
    {
        for(var i=Task_Temp.TAs_num;i<5;i++)
        {
            Task_Temp.TA_Emails[i]=""
        }
    }

    const Save_Changes = async() =>
    {
        setshow(true)
        var all_TAs_flag=0;
        var duplicate_TAs_flag=0;
        if(!Task_Temp.name)
        {
            setmessage("Please enter task name")
        }
        else if(!Task_Temp.deadline)
        {
            setmessage("Please enter task deadline")
        }
        else
        {
            for(var i=0;i<Task_Temp.TAs_num;i++)
            { 
                if(!Task_Temp.TA_Emails[i])
                    all_TAs_flag=1
                for(var j=0;j<Task_Temp.TAs_num;j++)
                {
                    if(i!=j&&Task_Temp.TA_Emails[i]!=""&&Task_Temp.TA_Emails[j]!=""&&Task_Temp.TA_Emails[i]==Task_Temp.TA_Emails[j])
                        duplicate_TAs_flag=1;
                }
            }
            if(all_TAs_flag==1)
            {
                setmessage("Please enter all TAs")
            }
            else if(duplicate_TAs_flag==1)
            {  
                setmessage("TAs must be different")
            }
            else
            {
                Task_Temp.Email=props.email
                let F1 = new Faculty()
                const response = await F1.Assign_Task(Task_Temp.name,Task_Temp.description,Task_Temp.deadline,Task_Temp.TA_Emails,Task_Temp.Email,course.code)
                setmessage(response)
            }
        }
        
    } 




    return (
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
            <h2>ASSIGN TASK</h2>
            <br/>
            <div className='details'>
            {ArrSetter()}
            {Arr2Setter()}
            {TA_Remover()}
            <h3>Task Name &emsp;: <br/><input type="text" name="name" placeholder="Enter Task Name" className='task_details_input' onChange={HandleChange} value={Task_Temp.name}/></h3>
            <br/>
            <h3>Task Description &emsp;: <br/><textarea name="description" cols="20" rows="6" type="text" placeholder="Enter Task Description" className='task_details_input_large' onChange={HandleChange} value={Task_Temp.description}/></h3>
            <br/>
            <h3>Deadline &emsp;: <br/><input type="date" name="deadline" placeholder="Enter Task Deadline" className='task_details_input' onChange={HandleChange} value={Task_Temp.deadline}/></h3>
            <br/>
            <h3>Number of TAs &emsp;: <br/>
                <select name="TAs_num" className='task_details_input' onChange={HandleChange} value={Task_Temp.TAs_num}>
                    {
                        arr.map((el) => 
                        (
                            <option value={el}>{el}</option>
                        ))
                                                
                    }
                </select>
                </h3>
                <br/>
                {

                    arr2.map( (el,i) => (
                    <div>
                        <h3 key={i}>TA {el} &emsp;: <br/>
                            <select name={"TA"+el} className='task_details_input' onChange={HandleChange}>
                                <option value=""></option>
                                {
                                    TAs && TAs.map((el) => 
                                    (
                                        <option value={el.email}>{el.name}</option>     
                                    ))
                                    
                                }
                            </select>
                        </h3>
                        <br/>
                    </div>
                    ))
                    
                            
               }
            <br/>
            </div>
      
            <div className="ErrorMsg">{show && Message!=="Task Assigned Successfully" ? Message : ""}</div>
            <div className="SuccessMsg">{show && Message=="Task Assigned Successfully" ? Message : ""}</div>
            <div className={Task_Temp.TAs_num==0 ? 'ncbtn' : 'btn'} onClick={Task_Temp.TAs_num==0 ? null : Save_Changes}>ASSIGN TASK</div>
            <br/>
            <br/>
            </center>
      </div>
    </div>

    )
}

export default Task_Assignment