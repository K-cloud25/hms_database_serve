
import React,{useState,useEffect} from 'react'
import { ReactMediaRecorder} from "react-media-recorder";
import { useLocation, useNavigate } from 'react-router-dom';


export default function Record(){

    const [video,setVideo]  = useState();

    const location = useLocation();
    const navigate = useNavigate();

    const [seconds,setSeconds] = useState(6);

    const [videoLoaded,setPostLoad] = useState(false);

    const timer = ()=>{
      
      setTimeout(()=>{setSeconds(seconds -1)},1000)

    }

    useEffect(()=>{
      setVideo(undefined);
    },[])

    useEffect(()=>{
      console.log(video)
    },[video])

    useEffect(()=>{
      if(seconds !== 0 && seconds !== 6){
        timer()
      }
    },[seconds])

    const postVideo = () => {
      const converter = async() =>{
        const mediaBlob = await fetch(video).then((r) => r.blob());
        const mediaFile = new File([mediaBlob], String(location.state.userID)+'_'+String(location.state.word)+'.mp4',{type : 'video/mp4'});

        const url = String(process.env.REACT_APP_TEST_VIDEO_URL)+"/video_upload"

        const formData = new FormData
        formData.append("WrittenFile",mediaFile)
        formData.append("Word",String(location.state.word))
        formData.append("Username",String(location.state.userID))

        let response = await fetch(url,
        {
          method : 'POST',
          body:formData
        });

        let json = await response.json()

        //Check for error Codes on response and then run this statemenet
        navigate('/select_word',{ state : {'userID' : location.state.userID}})
      }

      if(typeof video !== 'undefined'){
        converter()
      }
    }


    return (
        <>
        <h4>{seconds}</h4>
        <ReactMediaRecorder
            video
            render={({ status, startRecording, stopRecording, mediaBlobUrl,clearBlobUrl}) => (
              <div className='RecordingStudio'>
                <p className='RecordingStatus'>{status}</p>
                <video src={mediaBlobUrl} controls autoPlay className='VideoScren'/>
                <div className='btnHolder'>
                  <button className="btn btn-primary" onClick={async() =>{
                    await startRecording();

                    const secondaryTimer = ()=>{
                      setTimeout(async()=>{
                        await stopRecording();
                        console.log("Media Blob".mediaBlobUrl)
                        await setVideo(mediaBlobUrl)
                        console.log(video)
                      },6000)
                    }
                    
                    timer()
                    secondaryTimer();

                  }}>
                    Start Recording
                  </button>

                  <button className='btn btn-primary' onClick={()=>{
                    clearBlobUrl();
                    setSeconds(6);
                    setPostLoad(false)
                  }}>Restart/Reset</button>

                  <button className='btn btn-primary' onClick={async()=>{
                    await setVideo(mediaBlobUrl)
                    if(typeof mediaBlobUrl !== 'undefined')
                    {setPostLoad(true)}
                  }}>Save Video</button>

                  <button className='btn btn-primary' onClick={async()=>{
                    await postVideo();}}
                    disabled={videoLoaded? false : true}> Post Video </button>
                </div>
              </div>
            )}
          />
        </>
    )

}