import React from 'react'
import './admin_profile_page.css'
import Header from '../../../Header/header.jsx'
import { useState } from 'react'
import axios from 'axios'
import { useContext } from 'react';
import {userContext} from '../../../App.jsx'


function Admin_Profile(props) 
{
  const [userEmail,setUserEmail,userType,setUserType,userAccessToken,setUserAccessToken,userRefreshToken,setUserRefreshToken,axiosJWT] = useContext(userContext);
   
    const [admin_name,set_admin_name]=useState("")
    const [admin_dept,set_dept]=useState("")
    const [dummy,set_dummy]=useState("")
    const [admin_image_url,set_image_url] = useState("")
    const [admin_phone_num,set_phone_num]=useState("")
    const [pass_copy,set_pass_copy] =useState("")

    const [Message,setmessage] = useState("")
    const [show,setshow] = useState(false)
    const [update,set_update]=useState(false)
    const pattern = new RegExp("[6,7,8,9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]") 

    const [admin,Setadmin] = useState(
    {
        email:"",
        admin_name_new:"",
        admin_phone_num_new:"",
        admin_image_url_new:"",
        admin_pass_new:""
    })
    const [axios_call_count,set_call_count]=useState(0)

    if(axios_call_count==0||update==false)
    {
      axiosJWT.post("http://localhost:9000/Admin_Profile",props, {headers:{'authorization':"Bearer "+userAccessToken}}).then(
        res => {
                  set_call_count(1)
                  set_update(true)
                  res.data.found ? Set_details(res) : set_dummy()
               })

       function Set_details(res)
       {
         set_admin_name(res.data.name)
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
        if(name=="pass_copy")
        {
          set_pass_copy(value);
        }
        else
        {
            Setadmin({
                ...admin, /* Stores the value entered by the admin in the respective state variable while the rest remain as their default values ("" in this case)*/
                [name]:value /* Depending on the name of the inputbar, its value is stored in the respective state variable*/
            })
        }
    }

    const Save_Changes = () =>
    {
        set_update(false)
        setshow(true)
        const {email,admin_name_new,admin_phone_num_new,admin_image_url_new,admin_pass_new} = admin
        admin.email=props.email
        if(!admin_name_new&&!admin_phone_num_new&&!admin_image_url_new&&!admin_pass_new)
        {
            setmessage("Please enter new data")
        }
        else if(admin_name_new==admin_name&&admin_name_new)
        {
            setmessage("Entered name matches the existing one.")
        }
        else if(admin_phone_num_new==admin_phone_num&&admin_phone_num_new)
        {
            setmessage("Entered phone number matches the existing one.")
        }
        else if(admin_image_url==admin_image_url_new&&admin_image_url_new)
        {
            setmessage("Entered image URL matches the existing one.")
        }
        else if(!pattern.test(admin_phone_num_new)&&admin_phone_num_new)
        {
            setmessage("Please enter a valid phone number")
        }
        else if(admin.admin_pass_new != pass_copy)
        {
          setmessage("Please repeat the password correctly.")
        }
        else
        {
            axiosJWT.put("http://localhost:9000/Update_Admin_Profile", admin, {headers:{'authorization':"Bearer "+userAccessToken}})
            .then( res=> {setmessage(res.data.message)} )
        }

    }



    return(
        <div>
            
            <Header login_state={props} type={"Admin"}/>
              <div className='profile_box'>
                <center><h1>My Profile</h1>
                <br/>
                <img src={admin_image_url} height="200" max-width="650"/>
                <div className='details'>                
                  <br/>
                  <h3>Name &emsp;: &emsp;{admin_name}<br/><input type="text" name="admin_name_new" placeholder="Enter New Name" className='details_input' onChange={HandleChange} value={admin.admin_name_new}/></h3>
                  <br/>
                  <h3>Email &emsp;: &emsp;{props.email}</h3>
                  <br/>
                  <h3>Image URL &emsp;: <br/><input name="admin_image_url_new" type="text" placeholder="Enter Profile Image URL" className='details_input' onChange={HandleChange} value={admin.admin_image_url_new}/></h3>
                  <br/>
                  <h3>Phone Number &emsp;: &emsp;{admin_phone_num}<br/><input name="admin_phone_num_new" type="text" placeholder="Enter New Phone Number" className='details_input' onChange={HandleChange} value={admin.admin_phone_num_new}/></h3>
                  <br/>
                  <h3>Department &emsp;: &emsp;{admin_dept}</h3>
                  <br/>
                  <br/>
                  <h3>New Password &emsp;: &emsp;<br/><input name="admin_pass_new" placeholder="Enter New Password" className='details_input' onChange={HandleChange} value={admin.admin_pass_new}/></h3>
                  <br/>
                  <input name="pass_copy" placeholder="Repeat Password" className='details_input' onChange={HandleChange} value={pass_copy}/>
                  <br/>
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

export default Admin_Profile