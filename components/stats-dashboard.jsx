"use client"

import { motion } from "framer-motion"
import { TrendingUp, Clock, Cpu, Zap, File, Image as ImageIcon, BarChart3, ArrowUp, ArrowDown, Activity } from "lucide-react"
import { Card } from "@/components/ui/card"

export default function StatsDashboard({ 
  originalFileSize, 
  enhancedFileSize, 
  processingTime, 
  imageMetadata,
  className = "" 
}) {
  const formatFileSize = (bytes) => {
    if (!bytes) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
  }

  const calculateSizeChange = () => {
    if (!originalFileSize || !enhancedFileSize) return null
    const change = ((enhancedFileSize - originalFileSize) / originalFileSize) * 100
    return change
  }

  const getProcessingSpeed = () => {
    if (!processingTime) return null
    const speed = processingTime < 1000 ? 'Optimal' : 
                 processingTime < 3000 ? 'Efficient' : 
                 processingTime < 5000 ? 'Acceptable' : 'Suboptimal'
    return speed
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  }

  const sizeChange = calculateSizeChange()

  return (
    <motion.div
      className={`space-y-6 ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div variants={itemVariants}>
          <Card className="p-4 bg-muted/20 border-muted/40 hover:border-muted/60 transition-all duration-300 h-full flex items-center">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-muted/30 rounded-lg">
                  <File className="h-5 w-5 text-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Input Size</p>
                  <p className="text-xl font-bold text-foreground">{formatFileSize(originalFileSize)}</p>
                </div>
              </div>
              {/* <ImageIcon className="h-6 w-6 text-muted-foreground/50" /> */}
            </div>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="p-4 bg-muted/20 border-muted/40 hover:border-muted/60 transition-all duration-300 h-full flex items-center">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <BarChart3 className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Output Size</p>
                  <p className="text-xl font-bold text-primary">{formatFileSize(enhancedFileSize)}</p>
                </div>
              </div>
              {/* <BarChart3 className="h-6 w-6 text-primary/50" /> */}
            </div>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="p-4 bg-muted/20 border-muted/40 hover:border-muted/60 transition-all duration-300 h-full flex items-center">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <Clock className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Inference Time</p>
                  <p className="text-xl font-bold text-blue-600">
                    {processingTime ? `${(processingTime / 1000).toFixed(1)}s` : '—'}
                  </p>
                </div>
              </div>
              {/* <Activity className="h-6 w-6 text-blue-500/50" /> */}
            </div>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="p-4 bg-muted/20 border-muted/40 hover:border-muted/60 transition-all duration-300 h-full flex items-center">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500/10 rounded-lg">
                  {sizeChange !== null && sizeChange > 0 ? (
                    <ArrowUp className="h-5 w-5 text-green-600" />
                  ) : sizeChange !== null && sizeChange < 0 ? (
                    <ArrowDown className="h-5 w-5 text-green-600" />
                  ) : (
                    <TrendingUp className="h-5 w-5 text-green-600" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Compression Ratio</p>
                  <p className="text-xl font-bold text-green-600">
                    {sizeChange !== null ? `${sizeChange > 0 ? '+' : ''}${sizeChange.toFixed(1)}%` : '—'}
                  </p>
                </div>
              </div>
              {/* <TrendingUp className="h-6 w-6 text-green-500/50" /> */}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Technical Analysis Card */}
      {originalFileSize && enhancedFileSize && processingTime && (
        <motion.div variants={itemVariants}>
          <Card className="p-6 bg-muted/10 border-muted/30">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Cpu className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">SRGAN Performance Analysis</h3>
            </div>

            <div className="flex flex-wrap gap-6 justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Computational Efficiency
                </p>
                <p className="text-lg font-bold text-foreground">{getProcessingSpeed()}</p>
                <p className="text-xs text-muted-foreground">
                  {processingTime ? `${(processingTime / 1000).toFixed(1)}s total inference time` : ''}
                </p>
              </div>

              {/* <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Upscaling Factor
                </p>
                <p className="text-lg font-bold text-primary">4× (16× pixels)</p>
                <p className="text-xs text-muted-foreground">
                  128×128 → 512×512 resolution
                </p>
              </div> */}

              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Cpu className="h-4 w-4" />
                  Model Architecture
                </p>
                <p className="text-lg font-bold text-blue-600">SRGAN</p>
                <p className="text-xs text-muted-foreground">
                  ONNX Runtime execution
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <File className="h-4 w-4" />
                  Data Format
                </p>
                <p className="text-lg font-bold text-green-600">
                  {imageMetadata?.type?.split('/')[1]?.toUpperCase() || 'RGB'}
                </p>
                <p className="text-xs text-muted-foreground">
                  3-channel tensor input
                </p>
              </div>
            </div>

            {/* Compression Analysis */}
            {sizeChange !== null && (
              <div className="mt-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-muted-foreground">Storage Efficiency Analysis</span>
                  <span className="text-sm font-bold">
                    {sizeChange > 0 ? '+' : ''}{sizeChange.toFixed(1)}% change
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <motion.div
                    className={`h-2 rounded-full ${
                      sizeChange > 0 
                        ? 'bg-gradient-to-r from-primary to-primary/80' 
                        : 'bg-gradient-to-r from-green-500 to-green-600'
                    }`}
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(Math.abs(sizeChange), 100)}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Quality vs. compression trade-off analysis
                </p>
              </div>
            )}
          </Card>
        </motion.div>
      )}
    </motion.div>
  )
}