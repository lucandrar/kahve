import React, { useState, useEffect, useRef } from 'react'
import { Play, Pause, Volume2, VolumeX, Disc3, ExternalLink } from 'lucide-react'
import { useStore } from '../../store/useStore'

/**
 * YouTube IFrame API Luxury Music Player Widget
 * Track: Sabrina Carpenter — Espresso
 * Video ID: eVli-tstM5E
 */
export default function MusicPlayer() {
  const { isMuted, toggleMute, setCursor } = useStore()
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0) // 0 to 100
  const [currentTime, setCurrentTime] = useState('0:00')
  const [duration, setDuration] = useState('2:55')
  const [volume, setVolume] = useState(80)
  const [isPlayerReady, setIsPlayerReady] = useState(false)
  const [isExpanded, setIsExpanded] = useState(true)

  const playerRef = useRef(null)
  const intervalRef = useRef(null)
  const containerId = 'youtube-music-player-container'

  // Format seconds to mm:ss
  const formatTime = (seconds) => {
    if (isNaN(seconds) || seconds < 0) return '0:00'
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`
  }

  // Load YouTube IFrame API script
  useEffect(() => {
    // If API already available
    if (window.YT && window.YT.Player) {
      initPlayer()
      return
    }

    // Load the IFrame Player API code asynchronously
    const tag = document.createElement('script')
    tag.src = 'https://www.youtube.com/iframe_api'
    const firstScriptTag = document.getElementsByTagName('script')[0]
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag)

    window.onYouTubeIframeAPIReady = () => {
      initPlayer()
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  const initPlayer = () => {
    if (playerRef.current) return

    try {
      playerRef.current = new window.YT.Player(containerId, {
        height: '0',
        width: '0',
        videoId: 'eVli-tstM5E',
        playerVars: {
          playsinline: 1,
          controls: 0,
          disablekb: 1,
          fs: 0,
          modestbranding: 1,
          rel: 0,
          origin: window.location.origin
        },
        events: {
          onReady: (event) => {
            setIsPlayerReady(true)
            event.target.setVolume(volume)
          },
          onStateChange: (event) => {
            // YT.PlayerState.PLAYING === 1
            if (event.data === 1) {
              setIsPlaying(true)
              startProgressTracker()
            } else {
              setIsPlaying(false)
              if (intervalRef.current) clearInterval(intervalRef.current)
            }
          }
        }
      })
    } catch (e) {
      console.warn('YouTube Player initialization error:', e)
    }
  }

  const startProgressTracker = () => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    intervalRef.current = setInterval(() => {
      if (playerRef.current && playerRef.current.getCurrentTime && playerRef.current.getDuration) {
        const cur = playerRef.current.getCurrentTime()
        const dur = playerRef.current.getDuration()
        if (dur > 0) {
          setProgress((cur / dur) * 100)
          setCurrentTime(formatTime(cur))
          setDuration(formatTime(dur))
        }
      }
    }, 500)
  }

  const handlePlayToggle = () => {
    if (!playerRef.current) return
    try {
      if (isPlaying) {
        playerRef.current.pauseVideo()
        setIsPlaying(false)
      } else {
        playerRef.current.playVideo()
        setIsPlaying(true)
      }
    } catch (err) {
      console.warn('Play error:', err)
    }
  }

  const handleSeek = (e) => {
    if (!playerRef.current || !playerRef.current.getDuration) return
    const newPercent = parseFloat(e.target.value)
    setProgress(newPercent)
    const dur = playerRef.current.getDuration()
    if (dur > 0) {
      const targetSec = (newPercent / 100) * dur
      playerRef.current.seekTo(targetSec, true)
      setCurrentTime(formatTime(targetSec))
    }
  }

  const handleVolumeChange = (e) => {
    const newVol = parseInt(e.target.value, 10)
    setVolume(newVol)
    if (playerRef.current && playerRef.current.setVolume) {
      playerRef.current.setVolume(newVol)
      if (newVol === 0 && !isMuted) toggleMute()
      if (newVol > 0 && isMuted) toggleMute()
    }
  }

  const handleMuteToggle = () => {
    toggleMute()
    if (playerRef.current && playerRef.current.isMuted) {
      if (isMuted) {
        playerRef.current.unMute()
        playerRef.current.setVolume(volume || 80)
      } else {
        playerRef.current.mute()
      }
    }
  }

  return (
    <>
      {/* Hidden container for YouTube IFrame */}
      <div id={containerId} className="hidden" aria-hidden="true" />

      {/* Floating Luxury Architectural Music Bar (Bottom Right) */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end pointer-events-auto">
        <div
          className={`bg-[#F4F0EB]/95 backdrop-blur-md border border-[#2C1D18]/15 rounded-2xl shadow-xl transition-all duration-300 overflow-hidden ${
            isExpanded ? 'p-4 w-[340px] sm:w-[380px]' : 'p-2 w-auto'
          }`}
        >
          {isExpanded ? (
            <div className="flex flex-col gap-3">
              {/* Header: Track metadata + Minimize Toggle */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {/* Album Cover Artwork Thumbnail with Vinyl Spin Effect */}
                  <div className="relative w-11 h-11 rounded-lg overflow-hidden border border-[#2C1D18]/15 flex-shrink-0 bg-[#2C1D18]">
                    <img
                      src="https://img.youtube.com/vi/eVli-tstM5E/hqdefault.jpg"
                      alt="Sabrina Carpenter - Espresso"
                      className={`w-full h-full object-cover transition-transform duration-700 ${
                        isPlaying ? 'scale-105' : 'scale-100 opacity-80'
                      }`}
                    />
                    {/* Spinning Disc Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/25">
                      <Disc3
                        size={18}
                        className={`text-[#F4F0EB] ${isPlaying ? 'animate-spin' : ''}`}
                        style={{ animationDuration: '3s' }}
                      />
                    </div>
                  </div>

                  {/* Title & Artist */}
                  <div className="flex flex-col overflow-hidden">
                    <span className="font-display text-sm font-bold text-[#2C1D18] truncate leading-tight flex items-center gap-1.5">
                      Espresso
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#C89D7C]" />
                    </span>
                    <span className="text-xs font-mono text-[#2C1D18]/70 truncate tracking-wider uppercase">
                      Sabrina Carpenter
                    </span>
                  </div>
                </div>

                {/* Right Header Controls: YouTube External Link + Minimize */}
                <div className="flex items-center gap-1">
                  <a
                    href="https://youtu.be/eVli-tstM5E?si=z4P7o4TQ-aXNhL3G"
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 text-[#2C1D18]/50 hover:text-[#2C1D18] transition-colors"
                    title="YouTube'da Aç"
                  >
                    <ExternalLink size={13} />
                  </a>
                  <button
                    onClick={() => setIsExpanded(false)}
                    className="p-1.5 text-[#2C1D18]/50 hover:text-[#2C1D18] transition-colors text-xs font-mono"
                    title="Küçült"
                  >
                    —
                  </button>
                </div>
              </div>

              {/* Progress Slider Bar */}
              <div className="flex flex-col gap-1">
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="0.1"
                  value={progress}
                  onChange={handleSeek}
                  className="w-full h-1 bg-[#2C1D18]/15 rounded-lg appearance-none cursor-pointer accent-[#2C1D18]"
                />
                <div className="flex justify-between text-[10px] font-mono text-[#2C1D18]/60">
                  <span>{currentTime}</span>
                  <span>{duration}</span>
                </div>
              </div>

              {/* Bottom Playback & Volume Strip */}
              <div className="flex items-center justify-between pt-1 border-t border-[#2C1D18]/10">
                {/* Play / Pause Primary CTA */}
                <button
                  onClick={handlePlayToggle}
                  className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#2C1D18] text-[#F4F0EB] hover:bg-[#1A120E] text-xs font-mono uppercase tracking-wider transition-all"
                  onMouseEnter={() => setCursor('hover', isPlaying ? 'DURDUR' : 'ÇAL')}
                  onMouseLeave={() => setCursor('default')}
                >
                  {isPlaying ? (
                    <>
                      <Pause size={12} fill="#F4F0EB" />
                      <span>Durdur</span>
                    </>
                  ) : (
                    <>
                      <Play size={12} fill="#F4F0EB" />
                      <span>Çal</span>
                    </>
                  )}
                </button>

                {/* Animated Audio Waveform Visualizer */}
                <div className="flex items-end gap-0.5 h-3">
                  {[40, 90, 60, 100, 75, 45].map((h, i) => (
                    <div
                      key={i}
                      className="w-0.5 bg-[#C89D7C] rounded-full transition-all duration-300"
                      style={{
                        height: isPlaying ? `${h}%` : '20%',
                        animation: isPlaying ? `bounce 0.8s ease-in-out infinite alternate ${i * 0.12}s` : 'none'
                      }}
                    />
                  ))}
                </div>

                {/* Volume Slider & Mute Toggle */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handleMuteToggle}
                    className="p-1 text-[#2C1D18]/70 hover:text-[#2C1D18] transition-colors"
                    title={isMuted ? 'Sesi Aç' : 'Sesi Kapat'}
                  >
                    {isMuted || volume === 0 ? <VolumeX size={14} /> : <Volume2 size={14} />}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="w-16 h-1 bg-[#2C1D18]/15 rounded-lg appearance-none cursor-pointer accent-[#2C1D18]"
                    title="Ses Seviyesi"
                  />
                </div>
              </div>
            </div>
          ) : (
            /* Minimized Capsule State */
            <button
              onClick={() => setIsExpanded(true)}
              className="flex items-center gap-3 px-3 py-1.5 rounded-xl hover:bg-[#EFECE6] transition-colors"
              title="Müzik Çaları Aç"
            >
              <div className="relative w-7 h-7 rounded-md overflow-hidden bg-[#2C1D18]">
                <img
                  src="https://img.youtube.com/vi/eVli-tstM5E/hqdefault.jpg"
                  alt="Espresso"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col text-left">
                <span className="font-display text-xs font-bold text-[#2C1D18] leading-tight">
                  Espresso
                </span>
                <span className="text-[10px] font-mono text-[#2C1D18]/60">
                  Sabrina Carpenter
                </span>
              </div>
              <div className="w-6 h-6 rounded-full bg-[#2C1D18] text-[#F4F0EB] flex items-center justify-center ml-1">
                {isPlaying ? <Pause size={10} fill="#F4F0EB" /> : <Play size={10} fill="#F4F0EB" />}
              </div>
            </button>
          )}
        </div>
      </div>
    </>
  )
}
