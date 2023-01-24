import React,{useState} from 'react'
import Header from '../../../../Header/header.jsx'
import './Add_TA.css'
import {Admin} from '../../../../Classes/Users.tsx'
import Papa from 'papaparse'
import {Link} from 'react-router-dom'

const Add_TA = (props) => 
{
        const [Message,setmessage] = useState("")
        const [Message2,setmessage2] = useState("")
        const [bulk_email_flag,set_bulk_email_flag] = useState(false)
        const [bulk_phone_num_flag,set_bulk_phone_num_flag] = useState(false)
        const [duplicate_email_flag,set_duplicate_email_flag] = useState(false)
        const [missing_password_flag,set_missing_password_flag] = useState(false)
        const [no_file_flag,set_no_file_flag] = useState(false)
        const [show,setshow] = useState(false)
        const [student_count,set_student_count] = useState(0)
        //Regex for checking phone number validity
        const pattern= new RegExp("[6-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]")
        const [bulk_data,set_bulk_data] = useState("")
        const [TA_temp,Set_TA_temp] = useState({
            name:"",
            email:"",
            pass:"",
            contact_num:"",
        })

        const HandleChange  = e =>  /*When someone types, its an 'event', denoted and saved in 'e' here. e.target will return where and what the change was*/
        {    
            setshow(false)
            setmessage("")
            const {name,value} = e.target
            Set_TA_temp({
                ...TA_temp, /* Stores the value entered by the user in the respective state variable while the rest remain as their default values ("" in this case)*/
                [name]:value /* Depending on the name of the inputbar, its value is stored in the respective state variable*/
            })
            
        }

        const Save_Changes = async() =>
        {
            setshow(true)
            if(!TA_temp.name)
            {
                setmessage("Please enter the student's name")
            } 
            else if(!TA_temp.email)
            {
                setmessage("Please enter the student's Email ID")
            }
            else if(!TA_temp.email.endsWith("@pilani.bits-pilani.ac.in"))
            {
                setmessage("Please enter a valid BITS Email ID")
            }
            else if(!TA_temp.pass)
            {
                setmessage("Please enter the student's password")
            } 
            else if(!TA_temp.contact_num)
            {
                setmessage("Please enter the student's contact number")
            }
            else if(!pattern.test(TA_temp.contact_num))
            {
                setmessage("Please enter a valid contact number")
            }
            else
            {
                let A1 = new Admin()
                const response = await A1.Create_TA(TA_temp.name,TA_temp.email,TA_temp.pass,Number(TA_temp.contact_num))
                setmessage(response)                 
            }
        }

        const ChangeHandler = (e) =>
        {
            setshow(true)
            // Passing file data (e.target.files[0]) to parse using Papa.parse
            set_bulk_email_flag(false)
            set_bulk_phone_num_flag(false)
            set_duplicate_email_flag(false)
            set_missing_password_flag(false)
            set_no_file_flag(false)
            try 
            {
                Papa.parse(e.target.files[0], 
                {
                    
                    header: true,
                    skipEmptyLines: true,
                    complete: function (results) 
                    {
                        const col_titles = []
                        const row_values = []
                        const emails = []
                        results.data.map((d) => 
                        {
                            col_titles.push(Object.keys(d));
                            row_values.push(Object.values(d))

                        });
                        set_student_count(row_values.length)
                        if(col_titles[0][0]=="Name"&&col_titles[0][1]=="Email"&&col_titles[0][2]=="Password"&&col_titles[0][3]=="Contact Number")
                        {
                            
                            for(var i=0;i<row_values.length;i++)
                            {
                                if(!row_values[i][1].endsWith("@pilani.bits-pilani.ac.in"))
                                {
                                    set_bulk_email_flag(true)
                                    setmessage2("Invalid BITS email found. Please try again!")
                                    
                                    break;
                                }
                                if(!pattern.test(row_values[i][3]))
                                {
                                    set_bulk_phone_num_flag(true)
                                    setmessage2("Invalid contact number found. Please try again!")
                                    break;
                                }
                                if(!row_values[i][2])
                                {
                                    set_missing_password_flag(true)
                                    setmessage2("One/more student(s) is/are missing their password.")
                                    break;
                                }
                                emails.push(row_values[i][1])
    
                            }
                            var unique_emails = new Set(emails)
                            if(unique_emails.size!=emails.length)
                            {
                                set_duplicate_email_flag(true)
                                setmessage2("Duplicate emails found. Please try again.")
                            }
                            set_bulk_data(row_values)
                        }
                        else
                        {
                            setmessage2("Incorrect format found in the uploaded file. Please try again!")
                        }     
                    },
                });
                
            } 
            catch (error) 
            {
                set_no_file_flag(true)
            }
            
        }

        const Bulk_Upload = async() => 
        {
            setshow(true)
            if(bulk_phone_num_flag==false&&bulk_email_flag==false&&no_file_flag==false&&duplicate_email_flag==false&&missing_password_flag==false)
            {
                let A1 = new Admin()
                for(var i=0;i<student_count;i++)
                {
                    const response = await A1.Create_TA(bulk_data[i][0],bulk_data[i][1],bulk_data[i][2],Number(bulk_data[i][3]))
                    if(response!="Student Successfully Added")
                    {
                        console.log("Student (with Email ID ",bulk_data[i][1],") could not be uploaded. Error : ",response)
                    }
                    setmessage2("Student(s) Successfully Added")
                }      
            }
            else
            {
                setmessage2("Please upload an appropriate file")
            }
        }

        return(

            <div>
                <Header login_state={props} type={"Admin"}/>
                <div className='item_box'>
                    <center>
                    <h1>BULK</h1>
                    <h3><Link to="/Templates/Bulk_Upload_Format_(Students).csv" target="_blank" download="Bulk Upload Format (Students)">DOWNLOAD FORMAT</Link></h3>
                    <br/>
		            Upload File (CSV only) : &emsp;<input type="file" accept="*.csv" onChange={ChangeHandler} />
                    <br/>
                    <br/>
                    <div className="ErrorMsg">{show && Message2!=="Student(s) Successfully Added" ? Message2 : ""}</div>
                    <div className="SuccessMsg">{show && Message2=="Student(s) Successfully Added" ? Message2 : ""}</div>
                    <div className='btn' onClick={Bulk_Upload}>Upload</div>
                    <br/>
                    <br/>
                    <br/>
                    <h1>INDIVIDUAL</h1>
                    <br/>
                    <div className='details'>
                        <h3>Name &emsp;: <br/><input type="text" name="name" placeholder="Enter Student Name" className='details_input' onChange={HandleChange} value={TA_temp.name}/></h3>
                        <br/>
                        <h3>Email &emsp;: <br/><input type="text" name="email" placeholder="Enter Student Email" className='details_input' onChange={HandleChange} value={TA_temp.email}/></h3>
                        <br/>
                        <h3>Password &emsp;: <br/><input type="text" name="pass" placeholder="Enter Student Password" className='details_input' onChange={HandleChange} value={TA_temp.pass}/></h3>
                        <br/>
                        <h3>Contact Number &emsp;: <br/><input type="Number" name="contact_num" placeholder="Enter Student Contact Number" className='details_input' onChange={HandleChange} value={TA_temp.contact_num}/></h3>
                        <br/>
                    </div>
                    <div className="ErrorMsg">{show && Message!=="Student Successfully Added" ? Message : ""}</div>
                    <div className="SuccessMsg">{show && Message=="Student Successfully Added" ? Message : ""}</div>
                    <div className='btn' onClick={Save_Changes}>ADD</div>
                    <br/>
                    <br/>
                    </center>
              </div>
            </div>
        )
        
}

export default Add_TA