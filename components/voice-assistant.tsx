"use client"

import {useEffect, useRef, useState} from "react"
import {AnimatePresence, motion} from "framer-motion"
import {AlertCircle, Loader2, Mic, MicOff} from "lucide-react"
import {Button} from "@/components/ui/button"
import {Card, CardContent} from "@/components/ui/card"
import {ScrollArea} from "@/components/ui/scroll-area"
import {cn} from "@/lib/utils"
import {AudioVisualizer} from "@/components/audio-visualizer"
import {TypingIndicator} from "@/components/typing-indicator"
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar"
import {useToast} from "@/components/ui/use-toast"
import Image from "next/image"

type Message = {
    id: string
    role: "user" | "assistant"
    content: string
    timestamp: Date
    topic?: string
}

export function VoiceAssistant() {
    const [isRecording, setIsRecording] = useState(false)
    const [isProcessing, setIsProcessing] = useState(false)
    const [isTyping, setIsTyping] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [messages, setMessages] = useState<Message[]>([])

    const mediaRecorderRef = useRef<MediaRecorder | null>(null)
    const audioChunksRef = useRef<Blob[]>([])
    const audioRef = useRef<HTMLAudioElement | null>(null)
    const scrollAreaRef = useRef<HTMLDivElement>(null)
    const [audioStream, setAudioStream] = useState<MediaStream | null>(null)
    const {toast} = useToast()

    useEffect(() => {
        // Initialize audio element for playback
        audioRef.current = new Audio()
        audioRef.current.onended = () => {
            // Audio ended event handler
        }

        return () => {
            if (audioRef.current) {
                audioRef.current.pause()
            }
            if (audioStream) {
                audioStream.getTracks().forEach((track) => track.stop())
            }
        }
    }, [audioStream])

    // Scroll to bottom when messages change
    useEffect(() => {
        if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
        }
    }, [messages])

    const startRecording = async () => {
        try {
            setError(null)
            const stream = await navigator.mediaDevices.getUserMedia({audio: true})
            setAudioStream(stream)
            const mediaRecorder = new MediaRecorder(stream)
            mediaRecorderRef.current = mediaRecorder
            audioChunksRef.current = []

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data)
                }
            }

            mediaRecorder.onstop = async () => {
                const audioBlob = new Blob(audioChunksRef.current, {type: "audio/wav"})
                await processAudio(audioBlob)
            }

            mediaRecorder.start()
            setIsRecording(true)
        } catch (error) {
            console.error("Error accessing microphone:", error)
            setError("Could not access microphone. Please check your permissions.")
            toast({
                variant: "destructive",
                title: "Microphone Error",
                description: "Could not access microphone. Please check your permissions.",
            })
        }
    }

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop()
            setIsRecording(false)
            setIsProcessing(true)

            // Stop all audio tracks
            if (mediaRecorderRef.current.stream) {
                mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop())
            }
            setAudioStream(null)
        }
    }

    const processAudio = async (audioBlob: Blob) => {
        try {
            setError(null)
            // 1. Convert audio to text using Deepgram
            const formData = new FormData()
            formData.append("audio", audioBlob)

            const transcriptionResponse = await fetch("/api/transcribe", {
                method: "POST",
                body: formData,
            })

            if (!transcriptionResponse.ok) {
                throw new Error("Failed to transcribe audio")
            }

            const {text} = await transcriptionResponse.json()

            if (!text || text.trim() === "") {
                throw new Error("No speech detected")
            }

            // Add user message to chat
            const userMessage: Message = {
                id: Date.now().toString(),
                role: "user",
                content: text,
                timestamp: new Date(),
            }

            setMessages((prev) => [...prev, userMessage])

            // Show typing indicator
            setIsTyping(true)

            // 2. Generate AI response using OpenAI
            const aiResponse = await fetch("/api/generate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({message: text, history: messages}),
            })

            if (!aiResponse.ok) {
                throw new Error("Failed to generate AI response")
            }

            const {response} = await aiResponse.json()

            // Simulate typing delay for a more human-like experience
            await new Promise((resolve) => setTimeout(resolve, 800))
            setIsTyping(false)

            // Add assistant message to chat
            const assistantMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: response,
                timestamp: new Date(),
            }

            setMessages((prev) => [...prev, assistantMessage])

            // 3. Convert response to speech using ElevenLabs
            const speechResponse = await fetch("/api/text-to-speech", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({text: response}),
            })

            if (!speechResponse.ok) {
                throw new Error("Failed to convert text to speech")
            }

            const audioBlobTTS = await speechResponse.blob()
            const audioUrl = URL.createObjectURL(audioBlobTTS)

            // Play the audio
            if (audioRef.current) {
                audioRef.current.src = audioUrl
                audioRef.current.play()
            }

            // 4. Log the interaction
            await fetch("/api/log", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userMessage: text,
                    assistantResponse: response,
                    timestamp: new Date().toISOString(),
                }),
            })
        } catch (error) {
            console.error("Error processing audio:", error)
            setError((error as Error).message || "An error occurred while processing your request")
            toast({
                variant: "destructive",
                title: "Processing Error",
                description: (error as Error).message || "An error occurred while processing your request",
            })
        } finally {
            setIsProcessing(false)
            setIsTyping(false)
        }
    }

    return (
            <Card className="w-full shadow-lg border-0 bg-card">
                <CardContent className="p-0">
                    <div className="relative">
                        <ScrollArea className="h-[400px] md:h-[500px] p-4" ref={scrollAreaRef}>
                            {messages.length === 0 ? (
                                    <div className="flex h-full flex-col items-center justify-center text-center p-4">
                                        <motion.div
                                                initial={{opacity: 0, y: 20}}
                                                animate={{opacity: 1, y: 0}}
                                                transition={{duration: 0.5}}
                                        >
                                            <Image src="/images/simsim-logo.png" alt="Simsim Logo" width={120}
                                                   height={120}/>
                                        </motion.div>
                                        <motion.h3
                                                className="text-xl font-semibold mt-4 text-[#1e2761]"
                                                initial={{opacity: 0, y: 20}}
                                                animate={{opacity: 1, y: 0}}
                                                transition={{duration: 0.5, delay: 0.1}}
                                        >
                                            Hi, I'm Simsim
                                        </motion.h3>
                                        <motion.p
                                                className="text-muted-foreground mt-2 max-w-sm"
                                                initial={{opacity: 0, y: 20}}
                                                animate={{opacity: 1, y: 0}}
                                                transition={{duration: 0.5, delay: 0.2}}
                                        >
                                            Your AI assistant for small businesses. Ask me anything about your accounts,
                                            invoices, or schedule.
                                        </motion.p>
                                    </div>
                            ) : (
                                    <div className="flex flex-col gap-4 pb-2">
                                        <AnimatePresence initial={false}>
                                            {messages.map((message) => (
                                                    <motion.div
                                                            key={message.id}
                                                            initial={{opacity: 0, y: 20, scale: 0.95}}
                                                            animate={{opacity: 1, y: 0, scale: 1}}
                                                            transition={{duration: 0.4, type: "spring"}}
                                                            className={cn("flex gap-3", message.role === "user" ? "justify-end" : "justify-start")}
                                                    >
                                                        {message.role === "assistant" && (
                                                                <Avatar className="h-9 w-9 border">
                                                                    <AvatarImage src="/images/simsim-logo.png"
                                                                                 alt="Simsim"/>
                                                                    <AvatarFallback>AI</AvatarFallback>
                                                                </Avatar>
                                                        )}
                                                        <div
                                                                className={cn(
                                                                        "max-w-[80%] rounded-2xl px-4 py-2 text-sm shadow-sm",
                                                                        message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground",
                                                                )}
                                                        >
                                                            <div className="mb-1">{message.content}</div>
                                                            <div
                                                                    className={cn(
                                                                            "text-xs opacity-70",
                                                                            message.role === "user" ? "text-primary-foreground" : "text-muted-foreground",
                                                                    )}
                                                            >
                                                                {message.timestamp.toLocaleTimeString([], {
                                                                    hour: "2-digit",
                                                                    minute: "2-digit"
                                                                })}
                                                            </div>
                                                        </div>
                                                        {message.role === "user" &&
                                                                <Avatar className="h-9 w-9 border">
                                                                    <AvatarImage src="/placeholder.svg"
                                                                                 alt="User"/>
                                                                    <AvatarFallback
                                                                            className="text-[12px]">You</AvatarFallback>
                                                                </Avatar>
                                                        }
                                                    </motion.div>
                                            ))}
                                            {isTyping && (
                                                    <motion.div
                                                            initial={{opacity: 0, y: 20, scale: 0.95}}
                                                            animate={{opacity: 1, y: 0, scale: 1}}
                                                            exit={{opacity: 0, scale: 0.95}}
                                                            transition={{duration: 0.2}}
                                                            className="flex gap-3"
                                                    >
                                                        <div className="flex-shrink-0">
                                                            <Avatar className="h-9 w-9 border">
                                                                <AvatarImage src="/images/simsim-logo.png"
                                                                             alt="Simsim"/>
                                                                <AvatarFallback>AI</AvatarFallback>
                                                            </Avatar>
                                                        </div>
                                                        <div className="bg-muted rounded-2xl px-4 py-3 text-sm shadow-sm">
                                                            <TypingIndicator/>
                                                        </div>
                                                    </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                            )}
                        </ScrollArea>

                        {error && (
                                <motion.div
                                        initial={{opacity: 0, y: 10}}
                                        animate={{opacity: 1, y: 0}}
                                        className="absolute bottom-20 left-0 right-0 mx-auto w-max bg-destructive text-destructive-foreground px-4 py-2 rounded-full text-sm flex items-center gap-2 shadow-lg"
                                >
                                    <AlertCircle className="h-4 w-4"/>
                                    {error}
                                </motion.div>
                        )}
                    </div>

                    <div className="p-4 border-t">
                        <div className="flex flex-col items-center justify-center gap-4">
                            {isRecording && (
                                    <motion.div
                                            initial={{opacity: 0, scale: 0.9}}
                                            animate={{opacity: 1, scale: 1}}
                                            exit={{opacity: 0, scale: 0.9}}
                                            className="mb-2 w-full max-w-[200px]"
                                    >
                                        <AudioVisualizer stream={audioStream}/>
                                    </motion.div>
                            )}

                            <div className="flex items-center gap-6">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                            key={isRecording ? "recording" : isProcessing ? "processing" : "idle"}
                                            initial={{scale: 0.8, opacity: 0}}
                                            animate={{scale: 1, opacity: 1}}
                                            exit={{scale: 0.8, opacity: 0}}
                                            transition={{duration: 0.2}}
                                    >
                                        <Button
                                                variant={isRecording ? "destructive" : "default"}
                                                size="lg"
                                                className={cn(
                                                        "h-16 w-16 rounded-full shadow-lg transition-all duration-300",
                                                        isRecording && "animate-pulse",
                                                )}
                                                onClick={isRecording ? stopRecording : startRecording}
                                                disabled={isProcessing}
                                        >
                                            {isProcessing ? (
                                                    <Loader2 className="h-6 w-6 animate-spin"/>
                                            ) : isRecording ? (
                                                    <MicOff className="h-6 w-6"/>
                                            ) : (
                                                    <Mic className="h-6 w-6"/>
                                            )}
                                        </Button>
                                    </motion.div>
                                </AnimatePresence>
                            </div>

                            <AnimatePresence>
                                {isRecording && (
                                        <motion.div
                                                initial={{opacity: 0, y: 10}}
                                                animate={{opacity: 1, y: 0}}
                                                exit={{opacity: 0, y: 10}}
                                                className="mt-2 text-sm font-medium text-primary"
                                        >
                                            Listening... Click the microphone to stop.
                                        </motion.div>
                                )}
                                {isProcessing && (
                                        <motion.div
                                                initial={{opacity: 0, y: 10}}
                                                animate={{opacity: 1, y: 0}}
                                                exit={{opacity: 0, y: 10}}
                                                className="mt-2 text-sm font-medium text-muted-foreground"
                                        >
                                            Processing your request...
                                        </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </CardContent>
            </Card>
    )
}
