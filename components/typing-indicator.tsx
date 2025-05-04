"use client"

import {motion} from "framer-motion"

export function TypingIndicator() {
    return (
            <div className="flex items-center space-x-1">
                {[0, 1, 2].map((dot) => (
                        <motion.div
                                key={dot}
                                className="h-2 w-2 rounded-full bg-violet-500"
                                initial={{opacity: 0.4}}
                                animate={{opacity: [0.4, 1, 0.4]}}
                                transition={{
                                    duration: 1.5,
                                    repeat: Number.POSITIVE_INFINITY,
                                    delay: dot * 0.2,
                                    ease: "easeInOut",
                                }}
                        />
                ))}
            </div>
    )
}
