"use client";

import { useState } from "react";
import { useDropzone } from "react-dropzone";
import {
  Upload,
  ImageIcon,
  Download,
  RefreshCw,
  ArrowUpFromLine,
  File,
  TrendingUp,
  Sparkles,
  Zap,
  Clock,
  Cpu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import ImageComparison from "@/components/image-comparison";
import StatsDashboard from "@/components/stats-dashboard";
import LoadingOverlay from "@/components/loading-overlay";
import { motion } from "framer-motion";

export default function Home() {
  const [originalImage, setOriginalImage] = useState(null);
  const [enhancedImage, setEnhancedImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [originalFileSize, setOriginalFileSize] = useState(null);
  const [enhancedFileSize, setEnhancedFileSize] = useState(null);
  const [processingTime, setProcessingTime] = useState(null);
  const [imageMetadata, setImageMetadata] = useState(null);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingStage, setLoadingStage] = useState("preprocessing");

  const onDrop = async (acceptedFiles) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      setError(null);
      const file = acceptedFiles[0];

      // Check if the file is an image
      if (!file.type.startsWith("image/")) {
        setError("Please upload an image file");
        return;
      }

      // Store file size and metadata
      setOriginalFileSize(file.size);
      setImageMetadata({
        name: file.name,
        type: file.type,
        lastModified: new Date(file.lastModified).toLocaleDateString(),
      });

      // Convert the file to a data URL
      const reader = new FileReader();
      reader.onload = () => {
        setOriginalImage(reader.result);
        setEnhancedImage(null);
        setEnhancedFileSize(null);
        setProcessingTime(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp", "HEIC"],
    },
    maxFiles: 1,
  });

  const enhanceImage = async () => {
    if (!originalImage) return;

    setIsProcessing(true);
    setError(null);
    setLoadingProgress(0);
    setLoadingStage("preprocessing");
    const startTime = Date.now();

    try {
      // Convert data URL to blob
      setLoadingProgress(10);
      const response = await fetch(originalImage);
      const blob = await response.blob();

      // Validate file size (limit to 10MB)
      setLoadingProgress(20);
      if (blob.size > 10 * 1024 * 1024) {
        throw new Error(
          "Image is too large. Please use an image smaller than 10MB.",
        );
      }

      // Create form data
      setLoadingProgress(30);
      setLoadingStage("processing");
      const formData = new FormData();
      formData.append("image", blob, "image.jpg");

      // Call the enhancement API with timeout
      setLoadingProgress(40);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 300000); // 5 min timeout

      setLoadingProgress(60);
      const apiResponse = await fetch(
        process.env.NEXT_PUBLIC_BACKEND_URL ||
          "http://localhost:3001/api/enhance",
        {
          method: "POST",
          body: formData,
          signal: controller.signal,
        },
      );

      clearTimeout(timeoutId);
      setLoadingProgress(80);
      setLoadingStage("postprocessing");

      if (!apiResponse.ok) {
        const errorData = await apiResponse
          .json()
          .catch(() => ({ error: "Unknown error occurred" }));
        throw new Error(
          errorData.error || `Server error: ${apiResponse.status}`,
        );
      }

      const result = await apiResponse.json();
      setLoadingProgress(95);

      if (result.success && result.enhancedImage) {
        setLoadingProgress(100);
        setLoadingStage("complete");
        setEnhancedImage(result.enhancedImage);
        setEnhancedFileSize(result.enhancedSize || null);
        setProcessingTime(Date.now() - startTime);

        // Small delay to show completion
        await new Promise((resolve) => setTimeout(resolve, 500));
      } else {
        throw new Error("Invalid response from enhancement API");
      }
    } catch (err) {
      if (err.name === "AbortError") {
        setError("Enhancement timed out. Please try with a smaller image.");
      } else if (err.message.includes("Failed to fetch")) {
        setError("Network error. Please check your connection and try again.");
      } else {
        setError(`Failed to enhance image: ${err.message}`);
      }
      console.error("Enhancement error:", err);
    } finally {
      setIsProcessing(false);
      setLoadingProgress(0);
    }
  };

  const resetImages = () => {
    setOriginalImage(null);
    setEnhancedImage(null);
    setError(null);
    setOriginalFileSize(null);
    setEnhancedFileSize(null);
    setProcessingTime(null);
    setImageMetadata(null);
  };

  const downloadEnhancedImage = () => {
    if (!enhancedImage) return;

    const link = document.createElement("a");
    link.href = enhancedImage;
    link.download = `enhanced-${imageMetadata?.name || "image"}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  };

  const calculateSizeIncrease = () => {
    if (!originalFileSize || !enhancedFileSize) return null;
    const increase =
      ((enhancedFileSize - originalFileSize) / originalFileSize) * 100;
    return increase;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-8 lg:p-12 bg-gradient-to-b from-background to-background/90">
      <motion.div
        className="z-10 max-w-4xl w-full mx-auto"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <Card className="p-8 bg-card/50 backdrop-blur-sm border-muted/30 shadow-xl rounded-xl">
          <motion.div variants={itemVariants} className="text-center mb-16">
            <div className="text-center mb-8">
              <div className="mb-4">
                <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2">
                  SRGAN Image Super-Resolution
                </h1>
              </div>
              {/* <div className="bg-muted/30 rounded-lg p-4 mb-6 border border-muted/50">
                <p className="text-sm text-muted-foreground mb-2">
                  <strong>Student:</strong> [Your Name] | <strong>ID:</strong> [Student ID] | <strong>Supervisor:</strong> [Supervisor Name]
                </p>
                <p className="text-sm text-muted-foreground">
                  <strong>Department:</strong> Computer Science | <strong>University:</strong> [University Name] | <strong>Year:</strong> 2024
                </p>
              </div> */}
            </div>
            <div className="bg-gradient-to-r from-muted/20 to-muted/10 rounded-lg p-6 border border-muted/30 mb-6">
              <h3 className="text-lg font-semibold mb-3">Project Abstract</h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                This project implements a Super-Resolution Generative
                Adversarial Network (SRGAN) for single image super-resolution.
                The system utilizes ONNX Runtime for cross-platform deployment
                and demonstrates real-time image enhancement from 128×128 to
                512×512 resolution (4× upscaling factor).
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div>
                  {/* <strong className="text-foreground">Model Architecture:</strong> */}
                  {/* <br />SRGAN with ResNet backbone */}
                </div>
                <div>
                  <strong className="text-foreground">Framework:</strong>
                  <br />
                  ONNX Runtime, Next.js, Tensorflow
                </div>
                <div>
                  {/* <strong className="text-foreground">Performance:</strong> */}
                  {/* <br />~750ms inference time */}
                </div>
              </div>
            </div>
          </motion.div>

          {!originalImage ? (
            <motion.div variants={itemVariants}>
              <div
                {...getRootProps()}
                className={`bg-gradient-to-b from-muted/30 to-muted/10 border border-muted/20 rounded-xl cursor-pointer transition-all duration-300 ${
                  isDragActive ? "scale-[1.02] shadow-lg border-primary/50" : ""
                }`}
              >
                <div className="flex flex-col items-center justify-center gap-6 py-12 px-4">
                  <input {...getInputProps()} />
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{
                      repeat: Number.POSITIVE_INFINITY,
                      duration: 2,
                    }}
                    className="text-primary"
                  >
                    <ArrowUpFromLine size={48} />
                  </motion.div>
                  <div className="text-center">
                    <h2 className="text-2xl font-semibold mb-6 text-foreground">
                      {isDragActive
                        ? "Drop image here"
                        : "Drag and drop image to enhance"}
                    </h2>
                    <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                      Select File
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div variants={itemVariants} className="space-y-6">
              {enhancedImage ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-8"
                >
                  <div className="text-center">
                    <h2 className="text-2xl font-bold text-foreground mb-2">
                      SRGAN Enhancement Results
                    </h2>
                    <p className="text-muted-foreground text-sm">
                      Comparative Analysis: Original vs Super-Resolved Output
                    </p>
                  </div>

                  <ImageComparison
                    originalImage={originalImage}
                    enhancedImage={enhancedImage}
                  />

                  {/* Enhanced Statistics Dashboard */}
                  <StatsDashboard
                    originalFileSize={originalFileSize}
                    enhancedFileSize={enhancedFileSize}
                    processingTime={processingTime}
                    imageMetadata={imageMetadata}
                  />

                  <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
                    <Button
                      onClick={resetImages}
                      variant="outline"
                      className="border-primary text-primary hover:bg-primary/10"
                    >
                      <Upload className="mr-2 h-4 w-4" /> Upload New Image
                    </Button>
                    <Button
                      onClick={downloadEnhancedImage}
                      className="bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      <Download className="mr-2 h-4 w-4" /> Download Enhanced
                      Image
                    </Button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="aspect-video relative rounded-lg overflow-hidden border border-muted/30 bg-muted/10">
                    <img
                      src={originalImage || "/placeholder.svg"}
                      alt="Original"
                      className="w-full h-full object-contain"
                    />
                  </div>

                  {/* Image Info Card */}
                  {imageMetadata && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-gradient-to-r from-muted/30 to-muted/10 rounded-lg p-4 border border-muted/30"
                    >
                      <h3 className="font-semibold mb-2 flex items-center gap-2">
                        <File className="h-4 w-4 text-primary" />
                        Image Details
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Name</p>
                          <p className="font-medium truncate">
                            {imageMetadata.name}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Size</p>
                          <p className="font-medium">
                            {formatFileSize(originalFileSize)}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Type</p>
                          <p className="font-medium uppercase">
                            {imageMetadata.type.split("/")[1]}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <Button
                      onClick={resetImages}
                      variant="outline"
                      className="border-primary text-primary hover:bg-primary/10"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={enhanceImage}
                      disabled={isProcessing}
                      className="bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 relative overflow-hidden"
                    >
                      {isProcessing ? (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                          Processing SRGAN Model...
                        </>
                      ) : (
                        <>
                          <Cpu className="mr-2 h-4 w-4" />
                          Run SRGAN Enhancement
                        </>
                      )}
                    </Button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-4 bg-destructive/10 text-destructive rounded-md border border-destructive/20"
            >
              <div className="flex items-start gap-2">
                <span className="text-destructive">⚠️</span>
                <div>
                  <p className="font-medium">Enhancement Failed</p>
                  <p className="text-sm mt-1">{error}</p>
                </div>
              </div>
            </motion.div>
          )}
        </Card>

        {/* Technical Specifications Section */}
        {/* <motion.div
          variants={itemVariants}
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <Card className="p-6 bg-muted/20 border-muted/40 hover:border-muted/60 transition-all duration-300">
            <div className="flex flex-col">
              <div className="flex items-center gap-3 mb-3">
                <Cpu className="h-6 w-6 text-primary" />
                <h3 className="text-lg font-semibold">Model Architecture</h3>
              </div>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p><strong>Type:</strong> Super-Resolution GAN</p>
                <p><strong>Generator:</strong> ResNet-based</p>
                <p><strong>Input:</strong> 128×128×3 (RGB)</p>
                <p><strong>Output:</strong> 512×512×3 (RGB)</p>
                <p><strong>Parameters:</strong> ~6.2M</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-muted/20 border-muted/40 hover:border-muted/60 transition-all duration-300">
            <div className="flex flex-col">
              <div className="flex items-center gap-3 mb-3">
                <Clock className="h-6 w-6 text-primary" />
                <h3 className="text-lg font-semibold">Performance Metrics</h3>
              </div>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p><strong>Inference Time:</strong> ~750ms</p>
                <p><strong>Upscaling Factor:</strong> 4×</p>
                <p><strong>Memory Usage:</strong> ~500MB</p>
                <p><strong>Framework:</strong> ONNX Runtime</p>
                <p><strong>Execution:</strong> CPU-based</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-muted/20 border-muted/40 hover:border-muted/60 transition-all duration-300">
            <div className="flex flex-col">
              <div className="flex items-center gap-3 mb-3">
                <File className="h-6 w-6 text-primary" />
                <h3 className="text-lg font-semibold">Implementation</h3>
              </div>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p><strong>Backend:</strong> Next.js API Routes</p>
                <p><strong>Image Processing:</strong> Sharp.js</p>
                <p><strong>ML Runtime:</strong> ONNX Runtime Node</p>
                <p><strong>Frontend:</strong> React + TypeScript</p>
                <p><strong>Deployment:</strong> Cross-platform</p>
              </div>
            </div>
          </Card>
        </motion.div> */}
      </motion.div>

      {/* Loading Overlay */}
      <LoadingOverlay
        isVisible={isProcessing}
        progress={loadingProgress}
        stage={loadingStage}
      />
    </main>
  );
}
