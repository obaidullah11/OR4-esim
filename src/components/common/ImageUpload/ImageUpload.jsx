import { useState, useRef } from 'react'
import { Camera, Image, X, Upload } from 'lucide-react'
import { cn } from '../../../lib/utils'

function ImageUpload({ 
  onImageSelect, 
  currentImage = null, 
  className = '',
  label = 'Profile Image',
  required = false,
  maxSize = 5 * 1024 * 1024, // 5MB
  acceptedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif']
}) {
  const [preview, setPreview] = useState(currentImage)
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef(null)
  const cameraInputRef = useRef(null)

  const handleFileSelect = (file) => {
    if (!file) return

    // Validate file type
    if (!acceptedTypes.includes(file.type)) {
      alert('Please select a valid image file (JPEG, PNG, or GIF)')
      return
    }

    // Validate file size
    if (file.size > maxSize) {
      alert(`File size must be less than ${Math.round(maxSize / (1024 * 1024))}MB`)
      return
    }

    // Create preview URL
    const previewUrl = URL.createObjectURL(file)
    setPreview(previewUrl)
    
    // Call parent callback
    onImageSelect(file)
  }

  const handleFileInputChange = (e) => {
    const file = e.target.files[0]
    handleFileSelect(file)
  }

  const handleCameraInputChange = (e) => {
    const file = e.target.files[0]
    handleFileSelect(file)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragOver(false)
    
    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const removeImage = () => {
    setPreview(null)
    onImageSelect(null)
    
    // Reset file inputs
    if (fileInputRef.current) fileInputRef.current.value = ''
    if (cameraInputRef.current) cameraInputRef.current.value = ''
  }

  const openFileDialog = () => {
    fileInputRef.current?.click()
  }

  const openCamera = () => {
    cameraInputRef.current?.click()
  }

  return (
    <div className={cn('space-y-3', className)}>
      <label className={cn(
        'block text-sm font-medium transition-colors duration-300',
        'text-gray-700 dark:text-gray-300'
      )}>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {/* Hidden file inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedTypes.join(',')}
        onChange={handleFileInputChange}
        className="hidden"
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleCameraInputChange}
        className="hidden"
      />

      {/* Image Preview */}
      {preview && (
        <div className="relative inline-block">
          <img
            src={preview}
            alt="Profile preview"
            className="w-24 h-24 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600"
          />
          <button
            type="button"
            onClick={removeImage}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors duration-200"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Upload Area */}
      {!preview && (
        <div
          className={cn(
            'border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200 cursor-pointer',
            isDragOver
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
              : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500',
            'bg-gray-50 dark:bg-gray-800'
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={openFileDialog}
        >
          <Upload className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" />
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            Drag and drop an image here, or click to select
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500">
            JPEG, PNG, GIF up to 5MB
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={openFileDialog}
          className={cn(
            'flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg border transition-colors duration-200',
            'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300',
            'hover:border-gray-400 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700'
          )}
        >
          <Image size={16} />
          Choose from Gallery
        </button>
        
        <button
          type="button"
          onClick={openCamera}
          className={cn(
            'flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg border transition-colors duration-200',
            'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300',
            'hover:border-gray-400 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700'
          )}
        >
          <Camera size={16} />
          Take Photo
        </button>
      </div>

      {/* Help Text */}
      <p className="text-xs text-gray-500 dark:text-gray-400">
        Supported formats: JPEG, PNG, GIF • Max size: 5MB
      </p>
    </div>
  )
}

export default ImageUpload
