import React, { useState, useEffect } from 'react';
import AudioAnalyser from './AudioAnalyser';
import { useCallback } from "react";
import Recorder from './component/Recorder'
import Effects from './component/Effects';






const App = () => {
  
  
  const [audio, setAudio] = useState(null);
  const [loudness, setLoudness] = useState(0);
  const [loudnessCategory, setLoudnessCategory] = useState('');
 
  const [recordedBlob, setRecordedBlob] = useState(null);

  const handleStop = (blobUrl) => {
    setRecordedBlob(blobUrl);
  };
  useEffect(() => {
    if (loudness < 0.03) {
      setLoudnessCategory('Low');
    } else if (0.03<loudness < 0.3) {
      setLoudnessCategory('Medium');
    } else {
      setLoudnessCategory('High');
    }
  }, [loudness]);

  const handleLoudnessChange = (newLoudness) => {
    setLoudness(newLoudness);
  };

  const getMicrophone = async () => {
    const audio = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: false
    });
    setAudio(audio);
  };

  const stopMicrophone = () => {
    audio.getTracks().forEach((track) => track.stop());
    setAudio(null);
  };

  const toggleMicrophone = () => {
    if (audio) {
      stopMicrophone();
    } else {
      getMicrophone();
    }
  };

  return (
   
    <div className="App">
      
        <button onClick={toggleMicrophone}>
          {audio ? 'Stop microphone' : 'Get microphone input'}
        </button>
        
        <div className="controls">
        
        <p>Average loudness: {loudness.toFixed(2)}</p>
        <p>Loudness category: <span style={{color: loudnessCategory === 'Low' ? 'green' : loudnessCategory === 'Medium' ? 'orange' : 'red'}}>{loudnessCategory}</span></p>
      </div>
      <div>
      <Recorder onStop={handleStop} />
      </div>
      
   
      {audio ? <AudioAnalyser audio={audio} onLoudnessChange={handleLoudnessChange} /> : ''}
     
      <div>
      {recordedBlob && <Effects audioFile={recordedBlob} />}
      </div>
    </div>
  );
};

export default App;
