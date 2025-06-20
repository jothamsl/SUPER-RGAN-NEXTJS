'use client'

import { useState, useEffect } from 'react'
import { processImageForInference, runSRGANInference, loadSRGANModel } from '@/lib/onnx/model'

export default function ClientEnhancer({ originalImage, onEnhanced, onProgress, onError }) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  // Load the model when the component mounts
  useEffect(() => {
    const loadModel = async () => {
      try {
        if (typeof window !== 'undefined') {
          onProgress?.({ status: 'loading-model', progress: 0 })
          await loadSRGANModel()
          setIsLoaded(true)
          onProgress?.({ status: 'model-loaded', progress: 20 })
        }
      } catch (error) {
        console.error('Failed to load SRGAN model:', error)
        onError?.('Failed to load SRGAN model: ' + error.message)
      }
    }

    loadModel()
  }, [onError, onProgress])

  // Process the image when originalImage changes and model is loaded
  useEffect(() => {
    if (!originalImage || !isLoaded || isProcessing) return

    const enhanceImage = async () => {
      try {
        setIsProcessing(true)
        onProgress?.({ status: 'processing', progress: 30 })

        // Load image into an HTML Image element
        const img = new Image()
        await new Promise((resolve, reject) => {
          img.onload = resolve
          img.onerror = () => reject(new Error('Failed to load image'))
          img.src = originalImage
        })

        onProgress?.({ status: 'preprocessing', progress: 50 })

        // Process the image for inference
        const { tensor, originalWidth, originalHeight } = await processImageForInference(
          img, 
          img.width, 
          img.height
        )

        onProgress?.({ status: 'enhancing', progress: 70 })

        // Run inference
        const result = await runSRGANInference(tensor, originalWidth, originalHeight)

        onProgress?.({ status: 'complete', progress: 100 })
        
        // Return the enhanced image data
        if (onEnhanced) {
          onEnhanced({
            enhancedImage: result.dataURL,
            dimensions: {
              original: { width: img.width, height: img.height },
              enhanced: { width: result.width, height: result.height }
            },
            inferenceTime: result.inferenceTime
          })
        }
      } catch (error) {
        console.error('Error enhancing image:', error)
        onError?.('Error enhancing image: ' + error.message)
      } finally {
        setIsProcessing(false)
      }
    }

    if (originalImage) {
      enhanceImage()
    }
  }, [originalImage, isLoaded, isProcessing, onEnhanced, onProgress, onError])

  return null // This is a non-visual component
}