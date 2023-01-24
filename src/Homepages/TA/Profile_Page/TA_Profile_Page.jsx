import React from 'react'
import './profile.css'
import Header from '../../../Header/header.jsx'
import { useState } from 'react'
import axios from 'axios'


function TA_Profile(props) 
{
    const [TA_name,set_TA_name]=useState("")
    const [TA_dept,set_dept]=useState("")
    const [dummy,set_dummy]=useState("")
    const [TA_image_url,set_image_url] = useState("")
    const [TA_phone_num,set_phone_num]=useState("")

    const [Message,setmessage] = useState("")
    const [show,setshow] = useState(false)
    const [update,set_update]=useState(false)
    const pattern = new RegExp("[6,7,8,9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]") 

    const [TA,SetTA] = useState(
    {
        email:"",
        TA_name_new:"",
        TA_phone_num_new:"",
        TA_image_url_new:""
    })
    const [axios_call_count,set_call_count]=useState(0)

    if(axios_call_count==0||update==false)
    {
      axios.post("http://localhost:9000/TA_Profile",props).then(
        res => {
                  console.log(res)
                  set_call_count(1)
                  set_update(true)
                  res.data.found ? Set_details(res) : set_dummy()
               })

       function Set_details(res)
       {
        
         set_TA_name(res.data.name)
         set_phone_num(res.data.phone_num)
         set_image_url(res.data.image_url)
         set_dept(res.data.dept)
       }
 
    }

    

    const HandleChange  = e =>  /*When someone types, its an 'event', denoted and saved in 'e' here. e.target will return where and what the change was*/
    {    
        setshow(false)
        setmessage("")
        const {name,value} = e.target
        SetTA({
            ...TA, /* Stores the value entered by the TA in the respective state variable while the rest remain as their default values ("" in this case)*/
            [name]:value /* Depending on the name of the inputbar, its value is stored in the respective state variable*/
        })
    }

    const Save_Changes = () =>
    {
        set_update(false)
        setshow(true)
        const {email,TA_name_new,TA_phone_num_new,TA_image_url_new} = TA
        TA.email=props.email
        if(!TA_name_new&&!TA_phone_num_new&&!TA_image_url_new)
        {
            setmessage("Please enter new data")
        }
        else if(TA_name_new==TA_name&&TA_name_new)
        {
            setmessage("Entered name matches the existing one.")
        }
        else if(TA_phone_num_new==TA_phone_num&&TA_phone_num_new)
        {
            setmessage("Entered phone number matches the existing one.")
        }
        else if(TA_image_url==TA_image_url_new&&TA_image_url_new)
        {
            setmessage("Entered image URL matches the existing one.")
        }
        else if(!pattern.test(TA_phone_num_new)&&TA_phone_num_new)
        {
            setmessage("Please enter a valid phone number")
        }
        else
        {
            axios.put("http://localhost:9000/Update_TA_Profile", TA)
            .then( res=> {setmessage(res.data.message)} )
        }

    }



    return(
        <div>
            
            <Header login_state={props} type={"TA"}/>
              <div className='profile_box'>
                <center><h1>My Profile</h1>
                <br/>
                <img src={TA_image_url} height="200" max-width="650"/>
                <div className='details'>                
                  <br/>
                  <h3>Name &emsp;: &emsp;{TA_name}<br/><input type="text" name="TA_name_new" placeholder="Enter New Name" className='details_input' onChange={HandleChange} value={TA.TA_name_new}/></h3>
                  <br/>
                  <h3>Email &emsp;: &emsp;{props.email}</h3>
                  <br/>
                  <h3>Image URL &emsp;: <br/><input name="TA_image_url_new" type="text" placeholder="Enter Profile Image URL" className='details_input' onChange={HandleChange} value={TA.TA_image_url_new}/></h3>
                  <br/>
                  <h3>Phone Number &emsp;: &emsp;{TA_phone_num}<br/><input name="TA_phone_num_new" type="text" placeholder="Enter New Phone Number" className='details_input' onChange={HandleChange} value={TA.TA_phone_num_new}/></h3>
                  <br/>
                  <h3>Department &emsp;: &emsp;{TA_dept}</h3>
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

export default TA_Profile