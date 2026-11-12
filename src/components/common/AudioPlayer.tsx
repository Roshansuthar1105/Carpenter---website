import { useState, useRef, useEffect } from 'react'

interface AudioPlayerProps {
  src: string
  title?: string
  author?: string
  autoPlay?: boolean
  className?: string
}

export default function AudioPlayer({
  src,
  title = 'ग्राहक की आवाज (Customer Voice Review)',
  author,
  autoPlay = false,
  className = '',
}: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isMuted, setIsMuted] = useState(false)
  const [autoplayBlocked, setAutoplayBlocked] = useState(false)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    setIsPlaying(false)
    setCurrentTime(0)
    setAutoplayBlocked(false)

    if (autoPlay) {
      const playPromise = audio.play()
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true)
            setAutoplayBlocked(false)
          })
          .catch(() => {
            // Browser autoplay restricted sound
            setAutoplayBlocked(true)
            setIsPlaying(false)
          })
      }
    }
  }, [src, autoPlay])

  const togglePlay = () => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.pause()
      setIsPlaying(false)
    } else {
      audio.play().then(() => {
        setIsPlaying(true)
        setAutoplayBlocked(false)
      }).catch(err => console.warn('Audio play error:', err))
    }
  }

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime)
    }
  }

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration || 0)
    }
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value)
    setCurrentTime(time)
    if (audioRef.current) {
      audioRef.current.currentTime = time
    }
  }

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs === 0) return '0:00'
    const m = Math.floor(secs / 60)
    const s = Math.floor(secs % 60)
    return `${m}:${s < 10 ? '0' : ''}${s}`
  }

  return (
    <div className={`bg-gradient-to-br from-surface-container-high via-surface-container to-surface-container-low p-4 rounded-2xl border border-outline-variant/60 shadow-md ${className}`}>
      <audio
        ref={audioRef}
        src={src}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
        preload="metadata"
      />

      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-secondary/15 text-secondary flex items-center justify-center">
            <span className="material-symbols-outlined text-lg">mic</span>
          </div>
          <div>
            <div className="text-xs font-headline font-bold text-primary">{title}</div>
            {author && <div className="text-[11px] text-on-surface-variant font-medium">— {author}</div>}
          </div>
        </div>
        <span className="text-[10px] bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded-full font-bold font-mono">
          MP3 Voice Review
        </span>
      </div>

      {/* Autoplay prompt if blocked */}
      {autoplayBlocked && (
        <button
          onClick={togglePlay}
          className="w-full mb-3 py-1.5 px-3 bg-secondary text-on-secondary text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 shadow animate-bounce"
          type="button"
        >
          <span className="material-symbols-outlined text-sm">volume_up</span>
          ऑडियो सुनने के लिए यहाँ टैप करें (Tap to Play Voice Review)
        </button>
      )}

      {/* Waveform Visualization Bars */}
      <div className="flex items-center justify-center gap-1 my-3 h-8 px-2 bg-surface-container-lowest/60 rounded-xl">
        {[24, 40, 16, 56, 32, 70, 48, 85, 40, 60, 20, 50, 80, 45, 65, 30, 75, 40, 20].map((h, i) => {
          const isCurrentActive = isPlaying && (currentTime / (duration || 1)) > (i / 19)
          return (
            <div
              key={i}
              className={`w-1 rounded-full transition-all duration-150 ${
                isCurrentActive
                  ? 'bg-secondary'
                  : isPlaying
                  ? 'bg-secondary/40'
                  : 'bg-outline-variant/60'
              }`}
              style={{
                height: isPlaying ? `${Math.max(12, (h * (0.6 + Math.random() * 0.4)))}%` : `${h * 0.5}%`,
              }}
            />
          )
        })}
      </div>

      {/* Progress slider */}
      <div className="space-y-1">
        <input
          type="range"
          min="0"
          max={duration || 100}
          value={currentTime}
          onChange={handleSeek}
          className="w-full h-1.5 bg-surface-container-highest rounded-lg appearance-none cursor-pointer accent-secondary"
        />
        <div className="flex justify-between text-[11px] font-mono text-on-surface-variant font-semibold px-0.5">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Player Controls */}
      <div className="flex items-center justify-between mt-3 pt-2 border-t border-outline-variant/40">
        <button
          type="button"
          onClick={toggleMute}
          className="p-1.5 text-on-surface-variant hover:text-primary transition-colors"
          title={isMuted ? 'Unmute' : 'Mute'}
        >
          <span className="material-symbols-outlined text-lg">
            {isMuted ? 'volume_off' : 'volume_up'}
          </span>
        </button>

        {/* Center Play/Pause button */}
        <button
          type="button"
          onClick={togglePlay}
          className="w-11 h-11 rounded-full bg-secondary text-on-secondary flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-transform"
        >
          <span className="material-symbols-outlined text-2xl">
            {isPlaying ? 'pause' : 'play_arrow'}
          </span>
        </button>

        {/* Rewind 5s */}
        <button
          type="button"
          onClick={() => {
            if (audioRef.current) {
              audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 5)
            }
          }}
          className="p-1.5 text-on-surface-variant hover:text-primary transition-colors"
          title="5 सेकंड पीछे"
        >
          <span className="material-symbols-outlined text-lg">replay_5</span>
        </button>
      </div>
    </div>
  )
}

