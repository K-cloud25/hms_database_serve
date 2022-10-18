import React,{useState} from 'react';
import { useNavigate } from 'react-router-dom';

export default function Instructions(){

    const navigate = useNavigate()

    const [errorSignIn,setErrorSignIN] = useState(false)
    const [userSignUP,setuserSignup] = useState(false)
    const [emailSignUP,setemailSignup] = useState(false)

    const formHandler = (event) =>{
        event.preventDefault()
        const username = event.currentTarget.elements.fname.value
        const password = event.currentTarget.elements.fpass.value
        const url = String(process.env.REACT_APP_FLASK_BACKEND_URL)+"/user_verification"

        const apiCall = async()=>{

            var myheaders = new Headers();
            myheaders.append("Content-Type","application/json");

            let response  = await fetch(
                url,{
                    method : 'POST',
                    body: JSON.stringify({
                        "Username" : username,
                        "password" : password
                    }),
                    headers : myheaders,
                    redirect : 'follow'
                }
            );
            let json = await response.json();

            if(response.status !== 200){
                setErrorSignIN(true)
            }else{  
                let userDetail = await json[0]
                
                if(typeof userDetail !== 'undefined' || userDetail['userID'] !== undefined){
                    navigate('/select_word',{ state : {'userID' :userDetail['userID'],'userName': userDetail['Name']}})
                }

                return json; 
            }
        }

        if(username==="" || username.length===0 || password==="" || password.length===0){
            //Display Error
            console.log("Enter Password and Username")
        }else{
            apiCall();
        }
    }


    const signUpHandler = (event) =>{
        event.preventDefault();

        const userName = event.currentTarget.elements.fname.value
        const passWrd  = event.currentTarget.elements.fpass.value
        const emailAdd = event.currentTarget.elements.fmail.value

        const url = String(process.env.REACT_APP_FLASK_BACKEND_URL) + "/create_user"

        const createApiCall = async() =>{

            const formData = new FormData();
            formData.append("Username",userName);
            formData.append("Email",emailAdd);
            formData.append("Password",passWrd);

            let response = await fetch(
                url,{
                    method : 'POST',
                    body : formData,
                    redirect : 'follow'
                }
            )

            let json = await response.json();

            if(response.status !== 200){
                if(json['Reason'] === "Username Already Exists"){
                    setuserSignup(true)
                }

                if(json['Reason'] === "Email Already In Use"){
                    setemailSignup(true)
                }
            }
            else{
                navigate('/select_word',{ state : {'userID' :json['UserID'],'userName' : json['Username']}})
            }
        }

        createApiCall();

    }

    return (
        <>
            <div className='instructionsContainer'>
                <div className='listOfInstructions'>
                    <ol className='instructionList'>
                        <li className='instructionItem'>Make sure your hands and upper body are in the frame and are clearly visible. </li>
                        <li className='instructionItem'>Ensure adequate lighting and proper angle to highlight all features. </li>
                        <li className='instructionItem'>Do not worry if you cannot see the video after starting the recording. The recording will begin once you click the record button.</li>
                    </ol>
                </div>
            </div>

            <div className='signInContainer'>
                <div className='formContainer'>
                    <form onSubmit={formHandler} className={errorSignIn?'formDiv ErrorDiv' :'formDiv'}>
                        {errorSignIn? <h4 className='ErrorMark'>Invalid Username or Password</h4> : <></>}
                        <label className='formLabel'>Username</label>
                        <input type='text' id='fname' className={errorSignIn? 'inputError' : 'FormInput'}   onChange={()=>{setErrorSignIN(false)}}/>
                        <label className='formLabel'>Password</label>
                        <input type='password' id='fpass' className={errorSignIn? 'inputError' : 'FormInput'} onChange={()=>{setErrorSignIN(false)}} />
                        <button type="submit" className='btn'>Sign IN</button> 
                    </form>
                </div>

                <div className='formContainer'>
                    <form onSubmit={signUpHandler} className='formDiv'>
                        {userSignUP? <h4 className='ErrorMark'>Username Already in Use</h4> : <></>}
                        {emailSignUP? <h4 className='ErrorMark'>Email Alreadt in Use </h4> : <></>}
                        <label className='formLabel'>Username</label>
                        <input type='text' id='fname' className={userSignUP? 'inputError' :  'FormInput'} onChange={()=>{setuserSignup(false)}} />
                        <label className='formLabel'>Email</label>
                        <input type='email' id='fmail' className={emailSignUP? 'inputError':'FormInput'} onChange={()=>{setemailSignup(false)}}/>
                        <label className='formLabel'>Password</label>
                        <input type='password' id='fpass' className='FormInput'/>
                        <button type="submit" className='btn'>Sign Up</button> 
                    </form>
                </div>
            </div>
        </>
    )

}