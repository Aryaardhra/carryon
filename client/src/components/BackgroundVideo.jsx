import React, { useEffect, useRef } from 'react'

const BackgroundVideo = ({ videoUrl }) => {
      const videoRef = useRef(null);
    
      useEffect(() => {
        if (videoRef.current) {
          videoRef.current.play().catch(error => {
            console.error("Video autoplay failed:", error);
          });
        }
      }, []);
  return (
    <>
    <div className="absolute inset-0 -z-10  w-full h-full overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-background/95 via-background/90 to-background/95 z-10" />
      <video
        ref={videoRef}
        className="absolute inset-0 min-w-full min-h-full object-cover w-auto h-auto"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src={videoUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
    </>
  )
}

export default BackgroundVideo