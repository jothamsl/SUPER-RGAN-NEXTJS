"use client"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { Eye, Sparkles, Image as ImageIcon } from "lucide-react"

export default function ImageComparison({ originalImage, enhancedImage }) {
  const [sliderPosition, setSliderPosition] = useState(50)
  const containerRef = useRef(null)
  const isDragging = useRef(false)
  const [isImagesLoaded, setIsImagesLoaded] = useState(false)
  
  // Immediately set slider position on mouse down
  const handleMouseDown = (e) => {
    isDragging.current = true
    updateSliderPosition(e)
    e.preventDefault()
  }

  const handleMouseUp = () => {
    isDragging.current = false
  }

  // Extract the slider position update logic to a separate function
  const updateSliderPosition = (e) => {
    if (!containerRef.current) return
    
    const containerRect = containerRef.current.getBoundingClientRect()
    const containerWidth = containerRect.width
    let positionX;
    
    // Handle both mouse and touch events
    if (e.type.includes('touch')) {
      positionX = e.touches[0].clientX - containerRect.left
    } else {
      positionX = e.clientX - containerRect.left
    }

    // Calculate percentage
    let percentage = (positionX / containerWidth) * 100

    // Clamp between 0 and 100
    percentage = Math.max(0, Math.min(100, percentage))

    setSliderPosition(percentage)
    e.preventDefault() // Prevent text selection while dragging
  }

  const handleMouseMove = (e) => {
    if (!isDragging.current) return
    updateSliderPosition(e)
  }

  const handleTouchMove = (e) => {
    if (!isDragging.current) return
    updateSliderPosition(e)
    e.preventDefault() // Prevent scrolling while dragging
  }
  
  // Touch start should also update position immediately
  const handleTouchStart = (e) => {
    handleMouseDown(e)
    updateSliderPosition(e)
  }

  // Check if both images are loaded
  useEffect(() => {
    setIsImagesLoaded(!!originalImage && !!enhancedImage)
  }, [originalImage, enhancedImage])

  useEffect(() => {
    // Add mousemove and touchmove to document to handle events outside the component
    const handleDocumentMouseMove = (e) => {
      if (isDragging.current) {
        handleMouseMove(e)
      }
    }
    
    const handleDocumentTouchMove = (e) => {
      if (isDragging.current) {
        handleTouchMove(e)
      }
    }
    
    document.addEventListener("mouseup", handleMouseUp)
    document.addEventListener("touchend", handleMouseUp)
    document.addEventListener("mousemove", handleDocumentMouseMove)
    document.addEventListener("touchmove", handleDocumentTouchMove, { passive: false })

    return () => {
      document.removeEventListener("mouseup", handleMouseUp)
      document.removeEventListener("touchend", handleMouseUp)
      document.removeEventListener("mousemove", handleDocumentMouseMove)
      document.removeEventListener("touchmove", handleDocumentTouchMove)
    }
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="relative"
    >
      <div
        ref={containerRef}
        className={`relative aspect-video rounded-xl overflow-hidden border-2 ${isImagesLoaded ? 'border-primary/20 cursor-ew-resize' : 'border-muted/20'} bg-gradient-to-br from-muted/20 to-muted/10 shadow-2xl`}
      >
        {/* Enhanced Image (Background) */}
        <div className="absolute inset-0 flex items-center justify-center select-none bg-black/10">
          {enhancedImage && (
            <img
              src={enhancedImage}
              alt="Enhanced"
              className="w-full h-full object-cover"
              draggable="false"
              style={{ WebkitUserDrag: "none", userSelect: "none" }}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-500/5 to-green-500/10 pointer-events-none" />
        </div>

        {/* Original Image (Foreground with clip) */}
        <div
          className="absolute inset-0 flex items-center justify-center select-none"
          style={{
            clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`,
            WebkitClipPath: `inset(0 ${100 - sliderPosition}% 0 0)`, // For Safari support
            WebkitUserDrag: "none",
            userSelect: "none",
          }}
        >
          {originalImage && (
            <img
              src={originalImage}
              alt="Original"
              className="w-full h-full object-cover"
              draggable="false"
              style={{ WebkitUserDrag: "none", userSelect: "none" }}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-transparent pointer-events-none" />
        </div>

        {/* Slider */}
        <motion.div
          className={`absolute top-0 bottom-0 w-1 bg-gradient-to-b from-primary/80 via-primary to-primary/80 cursor-ew-resize shadow-lg z-10 ${!isImagesLoaded && 'opacity-0'}`}
          style={{
            left: `${sliderPosition}%`,
            transform: "translateX(-50%)",
          }}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          whileHover={{ scale: 1.1, width: "6px" }}
          whileTap={{ scale: 1.2 }}
        >
          <motion.div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-primary rounded-full shadow-xl flex items-center justify-center border-2 border-primary-foreground/20"
            animate={{
              boxShadow: [
                "0 0 10px rgba(190, 242, 100, 0.6)",
                "0 0 20px rgba(190, 242, 100, 0.9)",
                "0 0 10px rgba(190, 242, 100, 0.6)",
              ],
            }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            whileHover={{ scale: 1.1 }}
          >
            <Eye className="w-4 h-4 text-primary-foreground" />
          </motion.div>
          
          {/* Slider guide lines */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-px h-4 bg-primary-foreground/30" />
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-px h-4 bg-primary-foreground/30" />
        </motion.div>

        {/* Labels */}
        <motion.div 
          className="absolute bottom-4 left-4 bg-black/80 text-white text-sm px-3 py-2 rounded backdrop-blur-sm border border-muted/40 flex items-center gap-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <ImageIcon className="w-3 h-3" />
          Original
        </motion.div>
        
        <motion.div 
          className="absolute bottom-4 right-4 bg-black/80 text-white text-sm px-3 py-2 rounded backdrop-blur-sm border border-primary/40 flex items-center gap-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Sparkles className="w-3 h-3" />
          Enhanced
        </motion.div>

        {/* Comparison Guide */}
        {isImagesLoaded && (
          <motion.div
            className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white text-xs px-3 py-1 rounded backdrop-blur-sm border border-muted/30"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            Drag slider to compare results
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}