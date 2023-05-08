import React, { useState } from 'react';
import MicRecorder from 'mic-recorder-to-mp3';
import Effects from './Effects';
import './Recorder.css';
import * as Tone from 'tone';


const Mp3Recorder = new MicRecorder({ bitRate: 128 });

const Recorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [blobURL, setBlobURL] = useState('');
  const [isBlocked, setIsBlocked] = useState(false);

  const start = () => {
    if (isBlocked) {
      console.log('Permission Denied');
    } else {
      Mp3Recorder.start()
        .then(() => setIsRecording(true))
        .catch((e) => console.error(e));
    }
  };

  const stop = () => {
    Mp3Recorder.stop()
      .getMp3()
      .then(([buffer, blob]) => {
        const blobURL = URL.createObjectURL(blob);
        setBlobURL(blobURL);
        setIsRecording(false);
      })
      .catch((e) => console.log(e));
  };

  const handlePermission = (stream) => {
    console.log('Permission Granted');
    setIsBlocked(false);
  };

  const handlePermissionDenied = () => {
    console.log('Permission Denied');
    setIsBlocked(true);
  };
  const handlePlay = () => {
    // Play the recorded file
    const player = new Tone.Player({
      url: blobURL,
      autostart: true // or false, depending on your needs
    });
  
    // Connect effects to player output
    const distortion = new Tone.Distortion();
    const reverb = new Tone.Reverb();
    player.connect(distortion);
    player.connect(reverb);
    distortion.connect(Tone.Master);
    reverb.connect(Tone.Master);
  };
  
  
  
  

  return (
    <div className="App">
      <header className="App-header">
        <div>
          <button className="recorder-button" onClick={start} disabled={isRecording}>
            Record
          </button>
        </div>

        <div style={{ paddingTop: '10px' }}>
          <button className="recorder-button" onClick={stop} disabled={!isRecording}>
            Stop
          </button>
        </div>

        <div style={{ paddingTop: '10px' }}>
          <audio src={blobURL} controls="controls" />
        </div>

        <div style={{ paddingTop: '20px' }}>
          <button onClick={handlePlay}>Play with Effects</button>
        </div>

        {blobURL && <Effects recordedBlobURL={blobURL} />}
      </header>
    </div>
  );
};

export default Recorder;
