import React,{useState,useEffect} from 'react';
import { json, useLocation,useNavigate } from 'react-router-dom';


function SingleItem(props){

    const [isHovering,setHover] = useState(false);

    return (
        <>
            <div className='wordItem' onClick={()=>{props.Clicked(props.Word)}}>
                <div className='word' onMouseOver={()=>{setHover(!isHovering)}} onMouseOut={()=>{setHover(!isHovering)}} >{props.Word}</div>
                <div className={isHovering? "videoNo Visible" : "videoNo Invisible"} >{props.videos_submitted}/20</div>
            </div>
        </>
    )
}

export default function Words(props){

    const location = useLocation()
    const navigate = useNavigate()

    const [dispWords,setDisplayWords] = useState();
    const [sortedWords,setSortedWords] = useState();
    const [loading,setLoading] = useState(false);


    let dateObj = new Date();

    const wordsApiCall = async() =>{

        let url = String(process.env.REACT_APP_TEST_VIDEO_URL) + '/words_list'

        let response = await fetch(
            url,{
                method : 'POST',
                body : JSON.stringify({
                    "AuthKey" : process.env.REACT_APP_TEST_AUTH_KEY_FLASK
                }),
                headers : {"Content-Type" : 'application/json'}
            }
        );
        let json = await response.json();
        
        let lastApiCall = JSON.stringify({"day" : dateObj.getDate(),"time" : dateObj.getHours()})
        
        window.localStorage.setItem("LastApiCall",lastApiCall);
        window.localStorage.setItem("DataStored",JSON.stringify(json))
    }

    const preexistsingParams = () =>{

        let lastCallTime = window.localStorage.getItem("LastApiCall")
        let pastData = window.localStorage.getItem("DataStored")

        let currData = JSON.stringify({"day" : dateObj.getDate(),"time" : dateObj.getHours()})

        if(lastCallTime === null){
            wordsApiCall()
        }
        else if(currData.day === lastCallTime.day){
            if((currData.time - lastCallTime.time)>2){
                wordsApiCall()
            }else{
                setDisplayWords(JSON.parse(pastData))
            }
        }else{
            wordsApiCall()
        }
    }

    const serachingOptions = (event) =>{
        const temp = dispWords.filter((e)=>{return (e.Word.includes(event.target.value))})
        setSortedWords(temp)
    }

    useEffect(()=>{
        const caller = () =>{
            preexistsingParams()
        }
        caller()
    },[])

    useEffect(()=>{
        const assignemnet = async() =>{
            if(typeof dispWords != "undefined"){
                await setSortedWords(dispWords)
                setLoading(true)
            }
        }
        assignemnet();
    },[dispWords])

    const WordClick = (Word)=>{
        navigate("/record",{state : { "word" : Word , "userID" : String(location.state.userID)}})
    }

    return(
        <>
            <h2>Please Select A Word From The List Below</h2>

            <div className='serachContainer'>
                <div className='searchOptions'>
                    <div className='searchText'>Search Words :</div>
                    <input type="text" id="serachBar" className="searchBar" onChange={serachingOptions}/>
                </div>
            </div>

            {loading? 
            <>
                <div className='Container'>
                    <div className='wordContainer'>
                        {sortedWords.map((a,index)=>{
                            return(
                                <SingleItem key={index} Word={a.Word} videos_submitted={a.videos_uploded} Clicked={WordClick} />
                            )
                        })}
                    </div>
                </div>
            </>
            :
            <>
                <div>Loading</div>
            </>}
            
        </>
    )

}