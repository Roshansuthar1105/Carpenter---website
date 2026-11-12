import { useState, useRef, useEffect } from 'react'

interface VoiceInputProps {
  onResult: (text: string) => void
  currentValue?: string
  append?: boolean
  defaultLanguage?: 'hi-IN' | 'en-IN'
  buttonTitle?: string
  className?: string
  size?: 'sm' | 'md'
}

declare global {
  interface Window {
    SpeechRecognition?: any
    webkitSpeechRecognition?: any
  }
}

export default function VoiceInput({
  onResult,
  currentValue = '',
  append = true,
  defaultLanguage = 'hi-IN',
  buttonTitle = 'बोलकर लिखें (Voice Input)',
  className = '',
  size = 'md',
}: VoiceInputProps) {
  const [isListening, setIsListening] = useState(false)
  const [language, setLanguage] = useState<'hi-IN' | 'en-IN'>(defaultLanguage)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const recognitionRef = useRef<any>(null)

  const isSupported = typeof window !== 'undefined' && Boolean(window.SpeechRecognition || window.webkitSpeechRecognition)

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort()
        } catch {
          // ignore cleanup abort
        }
      }
    }
  }, [])

  const startListening = () => {
    setErrorMsg(null)

    if (!isSupported) {
      setErrorMsg('इस ब्राउज़र में वॉयस इनपुट समर्थित नहीं है। कृपया Google Chrome या Edge का उपयोग करें।')
      setTimeout(() => setErrorMsg(null), 4000)
      return
    }

    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      const recognition = new SpeechRecognition()
      recognitionRef.current = recognition

      recognition.continuous = false
      recognition.interimResults = false
      recognition.lang = language
      recognition.maxAlternatives = 1

      recognition.onstart = () => {
        setIsListening(true)
      }

      recognition.onresult = (event: any) => {
        const transcript = event.results?.[0]?.[0]?.transcript?.trim()
        if (transcript) {
          if (append && currentValue) {
            onResult(`${currentValue} ${transcript}`)
          } else {
            onResult(transcript)
          }
        }
        setIsListening(false)
      }

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error)
        if (event.error === 'not-allowed') {
          setErrorMsg('माइक्रोफोन अनुमति अस्वीकृत है। कृपया ब्राउज़र में माइक चालू करें।')
        } else if (event.error === 'no-speech') {
          setErrorMsg('कोई आवाज़ नहीं सुनी गई। पुनः प्रयास करें।')
        } else {
          setErrorMsg(`त्रुटि: ${event.error}`)
        }
        setIsListening(false)
        setTimeout(() => setErrorMsg(null), 3500)
      }

      recognition.onend = () => {
        setIsListening(false)
      }

      recognition.start()
    } catch (err: any) {
      console.error('Failed to start speech recognition:', err)
      setErrorMsg('वॉयस इनपुट प्रारंभ नहीं हो सका।')
      setIsListening(false)
      setTimeout(() => setErrorMsg(null), 3500)
    }
  }

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop()
      } catch {
        // ignore
      }
    }
    setIsListening(false)
  }

  const toggleLanguage = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const newLang = language === 'hi-IN' ? 'en-IN' : 'hi-IN'
    setLanguage(newLang)
    if (isListening) {
      stopListening()
    }
  }

  return (
    <div className={`relative inline-flex items-center gap-1 ${className}`}>
      {/* Language Toggle Pill */}
      <button
        type="button"
        onClick={toggleLanguage}
        title={`भाषा बदलें (वर्तमान: ${language === 'hi-IN' ? 'हिंदी' : 'English'})`}
        className={`px-1.5 py-0.5 rounded text-[10px] font-bold border transition-colors ${
          language === 'hi-IN'
            ? 'bg-secondary-container text-on-secondary-container border-secondary/40'
            : 'bg-primary-container text-on-primary-container border-primary/40'
        }`}
      >
        {language === 'hi-IN' ? 'HI' : 'EN'}
      </button>

      {/* Mic Button */}
      <button
        type="button"
        onClick={isListening ? stopListening : startListening}
        title={isListening ? 'रोकने के लिए क्लिक करें' : buttonTitle}
        className={`relative flex items-center justify-center rounded-lg transition-all ${
          size === 'sm' ? 'w-7 h-7 text-xs' : 'w-8 h-8 text-sm'
        } ${
          isListening
            ? 'bg-error text-on-error shadow-md animate-pulse ring-2 ring-error/50'
            : 'bg-surface-container hover:bg-surface-container-high text-primary border border-outline-variant/60 active:scale-95'
        }`}
      >
        <span
          className="material-symbols-outlined"
          style={{ fontSize: size === 'sm' ? '15px' : '18px' }}
        >
          {isListening ? 'mic_off' : 'mic'}
        </span>
      </button>

      {/* Listening Wave / Prompt */}
      {isListening && (
        <span className="text-[11px] font-bold text-error animate-pulse flex items-center gap-1 whitespace-nowrap bg-error-container/80 text-on-error-container px-2 py-0.5 rounded-full shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-error animate-ping" />
          <span>{language === 'hi-IN' ? 'हिंदी में बोलें...' : 'Listening...'}</span>
        </span>
      )}

      {/* Error Message Toast */}
      {errorMsg && (
        <div className="absolute top-full mt-1 left-0 z-30 bg-surface-container-highest text-error text-[11px] font-semibold px-2 py-1 rounded-md shadow-lg border border-error/30 whitespace-nowrap">
          {errorMsg}
        </div>
      )}
    </div>
  )
}

