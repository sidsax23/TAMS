import React,{useState,useContext} from 'react'
import './Login_page.css'
import Logo from './Assets/Transparent_Logo.png'
import {Link} from 'react-router-dom'
import '../index.css'
import axios from 'axios'
import {useNavigate} from 'react-router-dom'
import {userContext} from '../App.jsx'


function Login_page()
{
    let navigate = useNavigate()
    const [userEmail,setUserEmail,userType,setUserType,userAccessToken,setUserAccessToken,userRefreshToken,setUserRefreshToken] = useContext(userContext);
    /* Storing Message */
    const [Message,setmessage] = useState("")
    const [b1,set_b1] = useState(1)
    const [b2,set_b2] = useState(0)
    const [b3,set_b3] = useState(0)    

    /* Tracking states */
    const [user,Setuser] = useState({
        email:"",
        pass:"",
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


    const login = () =>
    {
        setshow(true)
        const {email,pass,type} = user
        if(!email)
        {
            setmessage("Please enter username (BITS email ID)")
        }
        else if(!pass)
        {
            setmessage("Please enter password")
        }
        else if(!email.endsWith("@pilani.bits-pilani.ac.in"))
        {
           setmessage("Please enter a valid BITS ID")
        }
        else
        {  
            /*
            We do not need to refresh any token here so we use axiosLogin (a new instance of axios) instead of "axios" 
            as that would be intercepted and checked for the token but it doesn't exist yet as the user has 
            not logged in
            */
            const axiosLogin = axios.create();
            axiosLogin.post("http://localhost:9000/Login", user)
            .then(res => {
                            localStorage.setItem('userEmail',res.data.userEmail.toLowerCase())
                            localStorage.setItem('userType',res.data.userType)
                            localStorage.setItem('userAccessToken',res.data.accessToken);
                            localStorage.setItem('userRefreshToken',res.data.refreshToken);
                            setUserEmail(res.data.userEmail.toLowerCase())
                            setUserType(res.data.userType)
                            setUserAccessToken(res.data.accessToken);
                            setUserRefreshToken(res.data.refreshToken);
                            setmessage(res.data.message)
                            navigate("/",{replace:true} )
                      })
        }
    }


    return(
        <div className='bg_image'>
            <center>
            <img src={Logo} alt="Logo" width="200rem" className="logo"/>
            <span className='central_title'>Teaching Assistantship Management System</span>
            </center>
            <div className='login_box'>
            <h1 color='black'>LOGIN</h1>
            <form>
                <span>
                    <input type="button" className={b1 ? 'selected_btn'  : 'select_btn'} name="type" value="TA" onClick={HandleChange} /> &emsp;
                    <input type="button" className={b2 ? 'selected_btn'  : 'select_btn'} name="type" value="Faculty" onClick={HandleChange}/> &emsp;
                    <input type="button" className={b3 ? 'selected_btn'  : 'select_btn'} name="type" value="Admin" onClick={HandleChange}/>
                </span>
                <label>
                    Username : <input
                                     className='inputbar'
                                     name="email"
                                     pattern=".+@pilani.bits-pilani.ac.in"
                                     value={user.email}
                                     onChange={HandleChange}
                                     type="email" 
                                     placeholder='Please enter your BITS Email ID'
                                />
                </label>         
                <label>
                    Password : <input 
                                     className='inputbar'
                                     name="pass"
                                     value={user.pass} 
                                     onChange={HandleChange} 
                                     type="password"
                                     placeholder='Please enter password'
                                />
                </label>
                <div className="ErrorMsg">{show && Message!=="Login Successful" ? Message : ""}</div> {/*Only when show is true, Message will be shown. It is false by default and on change (wrt to any input bar it again becomes false). Becomes true on clicking the button*/}
                <div className='btn' onClick={login}>Login</div>
                <br/>
                <Link to='/Recover_pass'>Forgot password ?</Link>
            </form>
            </div>
            <br/>
        </div>
        );
    
}

export default Login_page