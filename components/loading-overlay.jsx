"use client"

import { motion } from "framer-motion"
import { Sparkles, Zap, Clock, Cpu } from "lucide-react"

export default function LoadingOverlay({ isVisible, progress = 0, stage = "processing" }) {
  const stages = {
    preprocessing: { text: "Preprocessing input tensor...", icon: Clock },
    processing: { text: "Running SRGAN inference...", icon: Cpu },
    postprocessing: { text: "Converting output tensor...", icon: Sparkles },
    complete: { text: "Super-resolution complete!", icon: Zap }
  }

  const currentStage = stages[stage] || stages.processing
  const IconComponent = currentStage.icon

  if (!isVisible) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="bg-card/95 backdrop-blur-md rounded-2xl border border-primary/20 p-8 max-w-sm w-full mx-4 shadow-2xl"
      >
        {/* Animated Icon */}
        <div className="flex justify-center mb-6">
          <motion.div
            animate={{ 
              rotate: [0, 360],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              rotate: { duration: 2, repeat: Infinity, ease: "linear" },
              scale: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
            }}
            className="p-4 bg-primary/10 rounded-full"
          >
            <IconComponent className="h-8 w-8 text-primary" />
          </motion.div>
        </div>

        {/* Status Text */}
        <h3 className="text-xl font-semibold text-center mb-2">
          SRGAN Model Processing
        </h3>
        <p className="text-muted-foreground text-center mb-6">
          {currentStage.text}
        </p>

        {/* Progress Bar */}
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-primary to-primary/80 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Animated Particles */}
        <div className="relative mt-6 h-16 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-primary/40 rounded-full"
              animate={{
                x: [0, 280, 0],
                y: [Math.random() * 60, Math.random() * 60, Math.random() * 60],
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.5,
                ease: "easeInOut"
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`
              }}
            />
          ))}
        </div>

        {/* Processing Steps */}
        <div className="mt-4 space-y-2">
          <div className="flex items-center gap-3 text-sm">
            <div className={`w-2 h-2 rounded-full ${progress > 20 ? 'bg-primary' : 'bg-muted'}`} />
            <span className={progress > 20 ? 'text-foreground' : 'text-muted-foreground'}>
              Tensor normalization & reshaping
            </span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <div className={`w-2 h-2 rounded-full ${progress > 60 ? 'bg-primary' : 'bg-muted'}`} />
            <span className={progress > 60 ? 'text-foreground' : 'text-muted-foreground'}>
              SRGAN forward pass execution
            </span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <div className={`w-2 h-2 rounded-full ${progress > 90 ? 'bg-primary' : 'bg-muted'}`} />
            <span className={progress > 90 ? 'text-foreground' : 'text-muted-foreground'}>
              Output tensor post-processing
            </span>
          </div>
        </div>

        {/* Fun Facts */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="mt-6 p-3 bg-primary/5 rounded-lg border border-primary/10"
        >
          <p className="text-xs text-muted-foreground text-center">
            📊 SRGAN uses adversarial training to generate perceptually realistic high-frequency details
          </p>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}