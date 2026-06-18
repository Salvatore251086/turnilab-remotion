import { registerRoot, Composition } from 'remotion';
import React from 'react';

// Se hai già un componente video, lo importiamo in modo sicuro. 
// Altrimenti, definiamo qui un fallback rapido per non far fallire la build.
const VideoPlaceholder = () => {
  return (
    <div style={{
      flex: 1,
      backgroundColor: '#0f172a',
      justifyContent: 'center',
      alignItems: 'center',
      display: 'flex',
      color: 'white',
      fontSize: 60,
      fontFamily: 'Helvetica, Arial, sans-serif',
      fontWeight: 'bold'
    }}>
      TurniLab - Generazione Video
    </div>
  );
};

// La radice del progetto Remotion deve esportare le composizioni disponibili
export const TurniLabVideo = () => {
  return (
    <>
      <Composition
        id="TurniLabVideo"
        component={VideoPlaceholder}
        durationInFrames={150} // 5 secondi a 30fps per test iniziale rapido
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};

registerRoot(TurniLabVideo);
