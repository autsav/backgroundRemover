'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Upload, Image as ImageIcon, Download, Maximize2, Minimize2, X } from 'lucide-react'
import { removeBackground } from '@/app/actions'

export function ImageUploadApp() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [processedImage, setProcessedImage] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isFullScreen, setIsFullScreen] = useState(false)

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => setSelectedImage(e.target?.result as string)
      reader.readAsDataURL(file)
    }
  }

  const processImage = async () => {
    if (selectedImage) {
      setIsProcessing(true)
      try {
        const result = await removeBackground(selectedImage) as { image: { url: string } }
        setProcessedImage(result.image.url)
      } catch (error) {
        console.error('Error processing image:', error)
      } finally {
        setIsProcessing(false)
      }
    }
  }

  const downloadImage = async () => {
    if (processedImage) {
      const response = await fetch(processedImage)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = 'processed-image.png'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    }
  }

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen)
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-primary text-primary-foreground py-4">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold">Image Processor</h1>
        </div>
      </header>

      <main className="flex-grow container mx-auto my-8 flex gap-8">
        <Card className="p-6 w-1/2">
          <h2 className="text-xl font-semibold mb-4">Upload Image</h2>
          <div className="space-y-4">
            <Input type="file" accept="image/*" onChange={handleImageUpload} />
            {selectedImage && (
              <div className="mt-4">
                <img src={selectedImage} alt="Selected" className="max-w-full h-auto" />
              </div>
            )}
            <Button onClick={processImage} disabled={!selectedImage || isProcessing}>
              {isProcessing ? 'Processing...' : 'Process Image'}
            </Button>
          </div>
        </Card>

        <Card className={`p-6 ${isFullScreen ? 'fixed inset-0 z-50 w-full h-full' : 'w-1/2'}`}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Processed Result</h2>
            {processedImage && (
              <div className="space-x-2">
                <Button onClick={downloadImage} size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
                <Button onClick={toggleFullScreen} size="sm">
                  {isFullScreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                </Button>
                {isFullScreen && (
                  <Button onClick={() => setIsFullScreen(false)} size="sm" variant="destructive">
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            )}
          </div>
          {processedImage ? (
            <img src={processedImage} alt="Processed" className="max-w-full h-auto" />
          ) : (
            <div className="flex flex-col items-center justify-center h-64 bg-muted text-muted-foreground">
              <ImageIcon size={48} />
              <p className="mt-2">Processed image will appear here</p>
            </div>
          )}
        </Card>
      </main>

      <footer className="bg-muted py-4 mt-8">
        <div className="container mx-auto text-center text-muted-foreground">
          © 2023 Image Processor. All rights reserved.
        </div>
      </footer>
    </div>
  )
}