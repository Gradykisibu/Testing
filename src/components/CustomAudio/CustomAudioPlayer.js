import React, { useState, useRef } from "react";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import Box from "@mui/material/Box";

function CustomAudioPlayer({ src, songname }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume] = useState(100); // Only use this state if you plan to implement volume control later
  const [isMuted, setIsMuted] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isDragging] = useState(false); // Only use this state if you plan to implement dragging functionality later

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleMuteToggle = () => {
    if (audioRef.current) {
      const newIsMuted = !isMuted;
      setIsMuted(newIsMuted);
      audioRef.current.volume = newIsMuted ? 0 : volume / 100;
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current && !isDragging) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <Box
      sx={{
        background: "#1e1e1e",
        padding: "10px",
        borderRadius: "8px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "400px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        {isPlaying ? (
          <PauseIcon
            sx={{ color: "white", cursor: "pointer" }}
            onClick={handlePlayPause}
          />
        ) : (
          <PlayArrowIcon
            sx={{ color: "white", cursor: "pointer" }}
            onClick={handlePlayPause}
          />
        )}

        {isMuted ? (
          <VolumeOffIcon
            sx={{ color: "white", cursor: "pointer" }}
            onClick={handleMuteToggle}
          />
        ) : (
          <VolumeUpIcon
            sx={{ color: "white", cursor: "pointer" }}
            onClick={handleMuteToggle}
          />
        )}
      </Box>

      <Box
        sx={{
          color: "white",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Box sx={{ width: "250px", ml: "-20px", color: "#777777", fontSize: "13px", textTransform: "uppercase" }}>
          {songname}
        </Box>
        <span style={{ fontSize: "9px", marginLeft: "10px" }}>
          {formatTime(currentTime)}
        </span>
        <span style={{ fontSize: "9px", marginLeft: "2px", marginRight: "2px" }}>
          /
        </span>
        <span style={{ fontSize: "9px" }}>{formatTime(duration)}</span>
      </Box>

      <audio
        ref={audioRef}
        src={src}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
      />
    </Box>
  );
}

export default CustomAudioPlayer;
