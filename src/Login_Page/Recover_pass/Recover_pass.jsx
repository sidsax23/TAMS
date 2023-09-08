import React, {useState} from 'react'
import '../../index.css'
import '../Login_page.css'
import './Recover_pass.css'
import Logo from '../Assets/Transparent_Logo.png'
import {Link} from 'react-router-dom' /*Routes = Switch-case from C++*/
import axios from 'axios'
import emailjs from 'emailjs-com'

function Reset_pass() 
{
    
     /* Storing Message */
     const [Message,setmessage] = useState("")
     const [b1,set_b1] = useState(1)
     const [b2,set_b2] = useState(0)
     const [b3,set_b3] = useState(0)   

     /* Tracking states */
     const [user,Setuser] = useState({
         email:"",
         type:"TA"
     })
 
     //Value of Message variable and the corresponding action depending on input 
     const [show,setshow] = useState(false)
 
     /* Saving entered values */
     const HandleChange  = e =>  /*When someone types, its an 'event', denoted and saved in 'e' here. e.target will return where and what the change was*/
     {    
         setshow(false)
         setmessage("")
         const {name,value} = e.target
         Setuser({
            ...user, /* Stores the value entered by the user in the respective state variable while the rest remain as their default values ("" in this case)*/
            [name]:value /* Depending on the name of the inputbar, its value is stored in the respective state variable*/
        })
        if(value=="TA")
        {
            set_b1(1)
            set_b2(0)
            set_b3(0)
        }
        else if(value=="Faculty")
        {
            set_b1(0)
            set_b2(1)
            set_b3(0)  
        }
        else if(value=="Admin")
        {
            set_b1(0)
            set_b2(0)
            set_b3(1)
        }
     }

     function mailer(res)
     {
        var params = 
        {
            to_email:user.email.trim(),
            to_name: res.data.rname,
            pass:res.data.rpass
        }
        emailjs.send("service_zgbqs7u","template_2d7cm0q",params).then(
        (res2) =>
        {
            if(res2.status===200) // If email was sent successfully
            {
                setmessage("Password Recovery Successfull. Please check your mail.")  
            }
            else
            {
                setmessage("Error Occurred.")
                console.log(res2)
            }
        })
     }

     const Recover_Pass = () =>
     {
         setshow(true)
         setmessage("")
         emailjs.init("s3m2Eogf1C1ZipzUW")
         const {email} = user
         if(!email || !email.endsWith("@pilani.bits-pilani.ac.in"))
         {
             setmessage("Please enter a valid BITS ID")
         }
         else
         {
            /*
            We do not need to refresh any token here so we use axiosRecover (a new instance of axios) instead of "axios" 
            as that would be intercepted and checked for the token but it doesn't exist yet as the user has 
            not logged in
            */
            const axiosRecover = axios.create();
            axiosRecover.post("http://localhost:9000/Recover_pass", user)
            .catch(err => console.log(err))
            .then(res =>  
            {
                res.data.found ? mailer(res): setmessage("There is no account assocciated with this email ID.")     
            })
         }
   
        }
     



    return (
        /*Parent div (REACT returns only 1 parent div) */
        <div className='bg_image'>

        <center>
            <img src={Logo} alt="Logo" width="200rem" className="logo"/>
            <span className='central_title'>Teaching Assistantship Management System</span>
        <div className='login_box'>
        <h1>Please Enter BITS Email ID</h1>
        <form>
            <span>
                <input type="button" className={b1 ? 'selected_btn'  : 'select_btn'} name="type" value="TA" onClick={HandleChange} /> &emsp;
                <input type="button" className={b2 ? 'selected_btn'  : 'select_btn'} name="type" value="Faculty" onClick={HandleChange}/> &emsp;
                <input type="button" className={b3 ? 'selected_btn'  : 'select_btn'} name="type" value="Admin" onClick={HandleChange}/>
            </span>
            <label>
                Email ID : <input 
                                    type="email" 
                                    name="email"
                                    value={user.email}
                                    onChange={HandleChange}
                                    pattern=".+@pilani.bits-pilani.ac.in"
                                    className="inputbar" 
                                    placeholder='Please enter your BITS Email ID'
                            />
            </label>
            <div className="ErrorMsg">{show && Message!=="Password Recovery Successfull. Please check your mail." ? Message : ""}</div> 
            <div className="SuccessMsg">{show && Message==="Password Recovery Successfull. Please check your mail." ? Message : ""}</div>
            <center><div className='btn' onClick={Recover_Pass}>Recover Password</div></center>
            <center><div>Recalled the password ? <Link to='/Login'>Login</Link></div></center>
        </form>
        </div>
        </center>
        </div>
    
    )
}

export default Reset_pass