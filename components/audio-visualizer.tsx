"use client"

import {useEffect, useRef} from "react"

interface AudioVisualizerProps {
    stream: MediaStream | null
}

export function AudioVisualizer({stream}: AudioVisualizerProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        if (!stream || !canvasRef.current) return

        const canvas = canvasRef.current
        const ctx = canvas.getContext("2d")
        if (!ctx) return

        const audioContext = new AudioContext()
        const analyser = audioContext.createAnalyser()
        const source = audioContext.createMediaStreamSource(stream)

        source.connect(analyser)
        analyser.fftSize = 256
        const bufferLength = analyser.frequencyBinCount
        const dataArray = new Uint8Array(bufferLength)

        const width = canvas.width
        const height = canvas.height

        const draw = () => {
            requestAnimationFrame(draw)

            analyser.getByteFrequencyData(dataArray)

            // Set background color
            ctx.fillStyle = "rgba(241, 245, 249, 0.3)"
            ctx.fillRect(0, 0, width, height)

            const barWidth = (width / bufferLength) * 2.5
            let x = 0

            for (let i = 0; i < bufferLength; i++) {
                const barHeight = dataArray[i] / 2

                // Create a gradient for each bar
                const gradient = ctx.createLinearGradient(0, height - barHeight / 2, 0, height)
                gradient.addColorStop(0, "rgb(124, 58, 237)") // violet-600
                gradient.addColorStop(1, "rgb(79, 70, 229)") // indigo-600

                ctx.fillStyle = gradient

                // Draw rounded bars
                const barX = x
                const barY = height - barHeight / 2
                const barW = barWidth
                const barH = barHeight
                const radius = Math.min(barW, barH) / 2

                ctx.beginPath()
                ctx.moveTo(barX + radius, barY)
                ctx.arcTo(barX + barW, barY, barX + barW, barY + barH, radius)
                ctx.arcTo(barX + barW, barY + barH, barX, barY + barH, radius)
                ctx.arcTo(barX, barY + barH, barX, barY, radius)
                ctx.arcTo(barX, barY, barX + barW, barY, radius)
                ctx.closePath()
                ctx.fill()

                x += barWidth + 1
            }
        }

        draw()

        return () => {
            source.disconnect()
            audioContext.close()
        }
    }, [stream])

    return <canvas ref={canvasRef} width={200} height={60} className="rounded-xl w-full"/>
}
