import React, { useState, useEffect } from 'react';
import * as Tone from 'tone';

const Effects = ({ audioFile }) => {
  const [distortion, setDistortion] = useState(null);
  const [reverb, setReverb] = useState(new Tone.Reverb());

  const [player, setPlayer] = useState(null);

  // Create effects and player when component mounts
  useEffect(() => {
    Tone.start();
    setDistortion(new Tone.Distortion());
    setReverb(new Tone.Reverb());
    setPlayer(new Tone.Player());
  }, []);
  

  // Load audio file when it changes
  useEffect(() => {
    if (player && audioFile) {
      player.load(audioFile);
    }
  }, [player, audioFile]);

  // Handle effect changes
  const handleDistortionChange = (e) => {
    if (distortion) {
      distortion.distortion = e.target.value;
    }
  };
  
  const handleReverbChange = (e) => {
    if (reverb) {
      reverb.roomSize.value = e.target.value || 0;
    }
  };
  
  
  
  const handlePlay = () => {
    if (player.loaded) {
      // Connect effects to master output
      distortion.connect(Tone.Master);
      reverb.connect(Tone.Master);
  
      // Connect player to effects
      player.connect(distortion);
      player.connect(reverb);
  
      // Start player
      Tone.start();
      player.start();
    }
  };
  

  const handleStop = () => {
    // Stop player and effects
    player.stop();
    distortion.disconnect();
    reverb.disconnect();
  };

  return (
    <div>
      <h2>Effects</h2>
      <div>
        <h3>Distortion</h3>
        <input
          type="range"
          min="0"
          max="100"
          defaultValue="0"
          onChange={handleDistortionChange}
        />
      </div>
      <div>
        <h3>Reverb</h3>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          defaultValue="0"
          onChange={handleReverbChange}
        />
      </div>
      <div style={{ paddingTop: '20px' }}>
      <button onClick={handlePlay}>Play</button>
      </div>
      
      <div style={{ paddingTop: '20px' }}>
      <button onClick={handleStop}>Stop</button>
      </div>
    </div>
  );
};

export default Effects;
