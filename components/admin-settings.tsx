"use client"

import {useState} from "react"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {Button} from "@/components/ui/button"
import {Label} from "@/components/ui/label"
import {Switch} from "@/components/ui/switch"
import {Slider} from "@/components/ui/slider"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {Textarea} from "@/components/ui/textarea"
import {useToast} from "@/components/ui/use-toast"
import {Save} from "lucide-react"

export function AdminSettings() {
    const [voiceSettings, setVoiceSettings] = useState({
        voice: "female",
        speed: [1.0],
        pitch: [1.0],
    })

    const [systemPrompt, setSystemPrompt] = useState(
            "You are Simsim, a helpful customer service AI assistant for small businesses. You provide concise, friendly, and helpful responses to customer inquiries. Focus on solving common customer service issues like account access, billing questions, product information, and technical support.",
    )

    const {toast} = useToast()

    const saveSettings = () => {
        toast({
            title: "Settings saved",
            description: "Your changes have been saved successfully.",
        })
    }

    return (
            <div className="space-y-6">
                <h2 className="text-2xl font-bold dark:text-[#f9b23d] text-[#1e2761]">Assistant Settings</h2>

                <Card>
                    <CardHeader>
                        <CardTitle>Voice Settings</CardTitle>
                        <CardDescription>Customize how Simsim sounds when speaking to users</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label>Voice Type</Label>
                            <Select
                                    value={voiceSettings.voice}
                                    onValueChange={(value) => setVoiceSettings({...voiceSettings, voice: value})}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select voice"/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="female">Female</SelectItem>
                                    <SelectItem value="male">Male</SelectItem>
                                    <SelectItem value="neutral">Neutral</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label>Speaking Speed</Label>
                                <span className="text-sm">{voiceSettings.speed[0]}x</span>
                            </div>
                            <Slider
                                    value={voiceSettings.speed}
                                    min={0.5}
                                    max={2}
                                    step={0.1}
                                    onValueChange={(value) => setVoiceSettings({...voiceSettings, speed: value})}
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label>Voice Pitch</Label>
                                <span className="text-sm">{voiceSettings.pitch[0]}x</span>
                            </div>
                            <Slider
                                    value={voiceSettings.pitch}
                                    min={0.5}
                                    max={2}
                                    step={0.1}
                                    onValueChange={(value) => setVoiceSettings({...voiceSettings, pitch: value})}
                            />
                        </div>

                        <div className="flex items-center space-x-2">
                            <Switch id="test-voice"/>
                            <Label htmlFor="test-voice">Enable voice preview</Label>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>System Prompt</CardTitle>
                        <CardDescription>Define how Simsim behaves and responds to users</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label>System Prompt</Label>
                            <Textarea
                                    rows={6}
                                    value={systemPrompt}
                                    onChange={(e) => setSystemPrompt(e.target.value)}
                                    className="font-mono text-sm"
                            />
                            <p className="text-xs text-muted-foreground">
                                This prompt defines Simsim's personality, capabilities, and behavior.
                            </p>
                        </div>

                        <Button onClick={saveSettings} className="bg-[#4e68d7] hover:bg-[#3f56c8]">
                            <Save className="h-4 w-4 mr-2"/>
                            Save Settings
                        </Button>
                    </CardContent>
                </Card>
            </div>
    )
}
