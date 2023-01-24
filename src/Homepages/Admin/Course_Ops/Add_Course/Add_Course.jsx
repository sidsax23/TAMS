import React,{useState} from 'react'
import Header from '../../../../Header/header.jsx'
import {Admin} from '../../../../Classes/Users.tsx'
import Papa from 'papaparse'
import {Link} from 'react-router-dom'

const Add_Course = (props) => 
{

        const [Message,setmessage] = useState("")
        const [show,setshow] = useState(false)
        const [Message2,setmessage2] = useState("")
        const [duplicate_course_code_flag,set_duplicate_course_code_flag] = useState(false)
        const [no_file_flag,set_no_file_flag] = useState(false)
        const [course_count,set_course_count] = useState(0)

        //Regex for checking phone number validity
        const pattern= new RegExp("[6-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]")
        const [bulk_data,set_bulk_data] = useState("")
        const [Course_temp,Set_Course_temp] = useState({
            name:"",
            code:"",
        })

        const HandleChange  = e =>  /*When someone types, its an 'event', denoted and saved in 'e' here. e.target will return where and what the change was*/
        {    
            setshow(false)
            setmessage("")
            const {name,value} = e.target
            Set_Course_temp({
                ...Course_temp, /* Stores the value entered by the user in the respective state variable while the rest remain as their default values ("" in this case)*/
                [name]:value /* Depending on the name of the inputbar, its value is stored in the respective state variable*/
            })
            
        }

        const Save_Changes = async() =>
        {
            setshow(true)
            if(!Course_temp.name)
            {
                setmessage("Please enter the course's name")
            } 
            else if(!Course_temp.code)
            {
                setmessage("Please enter the course's code")
            }
            else
            {
                let A1 = new Admin()
                const response = await A1.Create_Course(Course_temp.name,Course_temp.code)
                setmessage(response)                 
            }
        }



        const ChangeHandler = (e) =>
        {
            setshow(true)
            // Passing file data (e.target.files[0]) to parse using Papa.parse
            set_duplicate_course_code_flag(false)
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
                        const course_codes = []
                        results.data.map((d) => 
                        {
                            col_titles.push(Object.keys(d));
                            row_values.push(Object.values(d))

                        });
                        set_course_count(row_values.length)
                        if(col_titles[0][0]=="Course Name"&&col_titles[0][1]=="Course Code")
                        {
                            
                            for(var i=0;i<row_values.length;i++)
                            {
                                course_codes.push(row_values[i][1])
    
                            }
                            var unique_course_codes = new Set(course_codes)
                            if(unique_course_codes.size!=course_codes.length)
                            {
                                set_duplicate_course_code_flag(true)
                                setmessage2("Duplicate course codes found. Please try again.")
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
            if(no_file_flag==false&&duplicate_course_code_flag==false)
            {
                let A1 = new Admin()
                for(var i=0;i<course_count;i++)
                {
                    const response = await A1.Create_Course(bulk_data[i][0],bulk_data[i][1])
                    if(response!="Course Successfully Added")
                    {
                        console.log("Course (with Course Code ",bulk_data[i][1],") could not be uploaded. Error : ",response)
                    }
                    setmessage2("Course(s) Successfully Added")
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
                    <h3><Link to="/Templates/Bulk_Upload_Format_(Courses).csv" target="_blank" download="Bulk Upload Format (Courses)">DOWNLOAD FORMAT</Link></h3>
                    <br/>
		            Upload File (CSV only) : &emsp;<input type="file" accept="*.csv" onChange={ChangeHandler} />
                    <br/>
                    <br/>
                    <div className="ErrorMsg">{show && Message2!=="Course(s) Successfully Added" ? Message2 : ""}</div>
                    <div className="SuccessMsg">{show && Message2=="Course(s) Successfully Added" ? Message2 : ""}</div>
                    <div className='btn' onClick={Bulk_Upload}>Upload</div>
                    <br/>
                    <br/>
                    <br/>
                    <h1>INDIVIDUAL</h1>
                    <br/>
                    <div className='details'>
                        <h3>Course Name &emsp;: <br/><input type="text" name="name" placeholder="Enter Course Name" className='details_input' onChange={HandleChange} value={Course_temp.name}/></h3>
                        <br/>
                        <h3>Course Code &emsp;: <br/><input type="text" name="code" placeholder="Enter Course Code" className='details_input' onChange={HandleChange} value={Course_temp.code}/></h3>
                        <br/>
                    </div>
                    <div className="ErrorMsg">{show && Message!=="Course Successfully Added" ? Message : ""}</div>
                    <div className="SuccessMsg">{show && Message=="Course Successfully Added" ? Message : ""}</div>
                    <div className='btn' onClick={Save_Changes}>ADD</div>
                    <br/>
                    <br/>
                    </center>
              </div>
            </div>
        )
        
}

export default Add_Course