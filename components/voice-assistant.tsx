"use client"

import { AudioVisualizer } from "@/components/audio-visualizer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"
import { AnimatePresence, motion } from "framer-motion"
import { AlertCircle, Loader2, Mic, StopCircle } from "lucide-react"
import Image from "next/image"
import { useRef, useState } from "react"

export function VoiceAssistant() {
    const [isConnected, setIsConnected] = useState(false)
    const [isProcessing, setIsProcessing] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const peerConnectionRef = useRef<RTCPeerConnection | null>(null)
    const dataChannelRef = useRef<RTCDataChannel | null>(null)
    const audioElementRef = useRef<HTMLAudioElement | null>(null)
    const mediaStreamRef = useRef<MediaStream | null>(null)
    const { toast } = useToast()

    const cleanupWebRTC = () => {
        if (mediaStreamRef.current) {
            mediaStreamRef.current.getTracks().forEach(track => track.stop())
            mediaStreamRef.current = null
        }

        if (dataChannelRef.current) {
            dataChannelRef.current.close()
            dataChannelRef.current = null
        }

        if (peerConnectionRef.current) {
            peerConnectionRef.current.close()
            peerConnectionRef.current = null
        }

        if (audioElementRef.current) {
            audioElementRef.current.pause()
            audioElementRef.current.srcObject = null
        }

        setIsConnected(false)
    }

    const handleServerEvent = (e: MessageEvent) => {
        try {
            const event = JSON.parse(e.data)
            console.log("WebRTC event:", event)
        } catch (error) {
            console.error("Error processing WebRTC event:", error)
            setError("Error processing response")
        }
    }

    const initializeConnection = async () => {
        try {
            setError(null)
            setIsProcessing(true)

            const tokenResponse = await fetch("/api/get-webrtc-token")
            if (!tokenResponse.ok) {
                throw new Error("Failed to get WebRTC token")
            }
            const data = await tokenResponse.json()
            const EPHEMERAL_KEY = data.client_secret.value

            const pc = new RTCPeerConnection()
            peerConnectionRef.current = pc

            const audioEl = document.createElement("audio")
            audioEl.autoplay = true
            audioElementRef.current = audioEl

            pc.ontrack = e => {
                if (audioElementRef.current) {
                    audioElementRef.current.srcObject = e.streams[0]
                }
            }

            const ms = await navigator.mediaDevices.getUserMedia({ audio: true })
            mediaStreamRef.current = ms
            ms.getTracks().forEach(track => pc.addTrack(track, ms))

            const dc = pc.createDataChannel("oai-events")
            dataChannelRef.current = dc

            dc.addEventListener("message", handleServerEvent)

            dc.addEventListener("open", () => {
                setIsConnected(true)
                setIsProcessing(false)
                console.log("WebRTC data channel opened")

                dc.send(JSON.stringify({
                    type: "session.update",
                    session: {
                        instructions: "You are Simsim, an AI voice assistant. Provide helpful, concise answers. Be friendly and professional."
                    }
                }))
            })

            const offer = await pc.createOffer()
            await pc.setLocalDescription(offer)

            const baseUrl = "https://api.openai.com/v1/realtime"
            const model = "gpt-4o-realtime-preview-2024-12-17"
            const sdpResponse = await fetch(`${baseUrl}?model=${model}`, {
                method: "POST",
                body: offer.sdp,
                headers: {
                    Authorization: `Bearer ${EPHEMERAL_KEY}`,
                    "Content-Type": "application/sdp"
                },
            })

            if (!sdpResponse.ok) {
                throw new Error("Failed to establish WebRTC connection")
            }

            const answer = {
                type: "answer" as RTCSdpType,
                sdp: await sdpResponse.text(),
            }
            await pc.setRemoteDescription(answer)

        } catch (error) {
            console.error("Error setting up WebRTC:", error)
            setError((error as Error).message || "Failed to start recording")
            setIsProcessing(false)
            toast({
                variant: "destructive",
                title: "Connection Error",
                description: (error as Error).message || "Failed to connect"
            })
            cleanupWebRTC()
        }
    }

    const disconnectSession = () => {
        cleanupWebRTC()
    }

    return (
        <Card className="w-full max-w-2xl mx-auto shadow-xl border-0 bg-card">
            <CardContent className="p-6">
                <div className="flex flex-col items-center justify-center min-h-[400px] gap-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-center"
                    >
                        <Image
                            src="/images/simsim-logo.png"
                            alt="Simsim Logo"
                            width={120}
                            height={120}
                            className="mx-auto mb-4"
                        />
                        <h2 className="text-2xl font-bold text-[#1e2761] mb-2">
                            {isConnected ? "Listening..." : "Ready to help"}
                        </h2>
                        <p className="text-muted-foreground">
                            {isConnected
                                ? "Speak clearly and I'll respond"
                                : "Click the microphone to start speaking"}
                        </p>
                    </motion.div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-destructive text-destructive-foreground px-4 py-2 rounded-full text-sm flex items-center gap-2 shadow-lg"
                        >
                            <AlertCircle className="h-4 w-4" />
                            {error}
                        </motion.div>
                    )}

                    {isConnected && mediaStreamRef.current && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="w-full max-w-[300px]"
                        >
                            <AudioVisualizer stream={mediaStreamRef.current} />
                        </motion.div>
                    )}

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={isConnected ? "connected" : isProcessing ? "processing" : "idle"}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <Button
                                variant={isConnected ? "destructive" : "default"}
                                size="lg"
                                className={cn(
                                    "h-20 w-20 rounded-full shadow-lg transition-all duration-300",
                                    isConnected && "animate-pulse"
                                )}
                                onClick={isConnected ? disconnectSession : initializeConnection}
                                disabled={isProcessing}
                            >
                                {isProcessing ? (
                                    <Loader2 className="h-8 w-8 animate-spin" />
                                ) : isConnected ? (
                                    <StopCircle className="h-8 w-8" />
                                ) : (
                                    <Mic className="h-8 w-8" />
                                )}
                            </Button>
                        </motion.div>
                    </AnimatePresence>

                    <AnimatePresence>
                        {isProcessing && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                className="text-sm font-medium text-muted-foreground"
                            >
                                Connecting...
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </CardContent>
        </Card>
    )
}