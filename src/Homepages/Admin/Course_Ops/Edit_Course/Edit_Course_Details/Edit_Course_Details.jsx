import React from 'react'
import './Edit_Course_Details.css'
import Header from '../../../../../Header/header.jsx'
import { useLocation } from 'react-router-dom'
import { useState } from 'react'
import axios from 'axios'


function Edit_Course_Details(props) 
{
    const location=useLocation()
    const Course_details = location.state.Course
    const Course_id = {id:Course_details._id}

    const [Course_code,set_Course_code] = useState(Course_details.code)
    const [Course_name,set_Course_name]=useState(Course_details.name)

    const [dummy,set_dummy]=useState("")


    const [Message,setmessage] = useState("")
    const [show,setshow] = useState(false)
    const [update,set_update]=useState(false)
    const pattern = new RegExp("[6,7,8,9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]") 

    const [Course,SetCourse] = useState(
    {
        Course_code_new:"",
        Course_name_new:""
    })
    const [axios_call_count,set_call_count]=useState(0)

    if(axios_call_count==0||update==false)
    {
      axios.post("http://localhost:9000/fetch_course",Course_id).then(
        res => {
                  set_call_count(1)
                  set_update(true)
                  res.data.found ? Set_details(res) : set_dummy()
               })

       function Set_details(res)
       {
         set_Course_code(res.data.code)
         set_Course_name(res.data.name)
       }
 
    }

    

    const HandleChange  = e =>  /*When someone types, its an 'event', denoted and saved in 'e' here. e.target will return where and what the change was*/
    {    
        setshow(false)
        setmessage("")
        const {name,value} = e.target
        SetCourse({
            ...Course, /* Stores the value entered by the TA in the respective state variable while the rest remain as their default values ("" in this case)*/
            [name]:value /* Depending on the name of the inputbar, its value is stored in the respective state variable*/
        })
    }

    const Save_Changes = () =>
    {
        set_update(false)
        setshow(true)
        const {Course_code,Course_code_new,Course_name_new} = Course
        Course.Course_code=Course_details.code
        if(!Course_code_new&&!Course_name_new)
        {
            setmessage("Please enter new data")
        }
        else if(Course_name_new==Course_name&&Course_name_new)
        {
            setmessage("Entered course name matches the existing one.")
        }
        else if(Course_code_new==Course_code&&Course_code_new)
        {
            setmessage("Entered course code matches the existing one.")
        }
        else
        {
            axios.put("http://localhost:9000/Update_Course_Details", Course)
            .then( res=> {setmessage(res.data.message)} )
        }

    }



    return(
        <div>
            
            <Header login_state={props} type={"ADMIN"}/>
              <div className='profile_box'>
                <center><h1>{Course_name}</h1>
                <br/>
                <div className='details'>                
                  <br/>
                  <h3>Course Name &emsp;: &emsp;{Course_name} <br/><input name="Course_name_new" type="text" placeholder="Enter New Coruse Name" className='details_input' onChange={HandleChange} value={Course.Course_name_new}/></h3>
                  <br/>
                  <h3>Course Code &emsp;: &emsp;{Course_code} <br/><input name="Course_code_new" type="text" placeholder="Enter New Course Code" className='details_input' onChange={HandleChange} value={Course.Course_code_new}/></h3>
                  <br/>
                </div>
                <div className="ErrorMsg">{show && Message!=="Course Updated Successfully." ? Message : ""}</div>
                <div className="SuccessMsg">{show && Message=="Course Updated Successfully." ? Message : ""}</div>
                <div className='btn' onClick={Save_Changes}>Save</div>
                </center>
              </div>
        </div>
  
  )
}

export default Edit_Course_Details