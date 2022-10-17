import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Instructions(){

    const navigate = useNavigate()

    const formHandler = (event) =>{
        event.preventDefault()
        const username = event.currentTarget.elements.fname.value
        const password = event.currentTarget.elements.fpass.value
        const url = String(process.env.REACT_APP_TEST_VIDEO_URL)+"/user_verification"

        const apiCall = async()=>{

            let formData = new FormData();
            formData.append("Username" , username);
            formData.append("password",password);

            let response  = await fetch(
                url,{
                    method : 'POST',
                    body: formData
                }
            );
            let json = await response.json();

            //Check for response data
            if(response.status === 401){
                //Change the Input state and add css to display Error
            }

            let userDetail = await json[0]
            
            if(typeof userDetail !== 'undefined' || userDetail['userID'] !== undefined){
                navigate('/select_word',{ state : {'userID' :userDetail['userID']}})
            }

            return json;    
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

        const url = String(process.env.REACT_APP_TEST_VIDEO_URL) + "/create_user"

        const createApiCall = async() =>{

            const formData = new FormData();
            formData.append("Username",userName);
            formData.append("Email",emailAdd);
            formData.append("Password",passWrd);

            let response = await fetch(
                url,{
                    method : 'POST',
                    body : formData
                }
            )

            let json = await response.json();

            if(response.status != 200){
                // Error Flagging :: Check Reason on the response and Implement Responsind Error Display 
            }

            else{
                navigate('/select_word',{ state : {'userID' :json['Username']}})
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
                    <form onSubmit={formHandler} className='formDiv'>
                        <label className='formLabel'>Username</label>
                        <input type='text' id='fname' className='FormInput' />
                        <label className='formLabel'>Password</label>
                        <input type='password' id='fpass' className='FormInput' />
                        <button type="submit" className='btn'>Sign IN</button> 
                    </form>
                </div>

                <div className='formContainer'>
                    <form onSubmit={signUpHandler} className='formDiv'>
                        <label className='formLabel'>Username</label>
                        <input type='text' id='fname' className='FormInput' />
                        <label className='formLabel'>Email</label>
                        <input type='email' id='fmail' className='FormInput' />
                        <label className='formLabel'>Password</label>
                        <input type='password' id='fpass' className='FormInput' />
                        <button type="submit" className='btn'>Sign Up</button> 
                    </form>
                </div>

            </div>
        </>
    )

}