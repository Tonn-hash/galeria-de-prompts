"use client"

import type React from "react"
import { useState, useRef } from "react"
import { BoxIcon as Button } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Rocket } from "lucide-react"

const categories = [
  "Fantasia",
  "Sci-Fi",
  "Retrato",
  "Cyberpunk",
  "Natureza",
  "Surreal",
  "Apocalíptico",
  "Mágico",
  "3D",
  "Anime",
  "Fotografia",
  "Arte Digital",
]

export default function SubmitPrompt() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [promptText, setPromptText] = useState("")
  const [negativePrompt, setNegativePrompt] = useState("")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [aiModel, setAiModel] = useState("")
  const [isDragOver, setIsDragOver] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = (file: File) => {
    if (file && file.type.startsWith("image/")) {
      setSelectedImage(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    const files = Array.from(e.dataTransfer.files)
    if (files[0]) {
      handleImageUpload(files[0])
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files[0]) {
      handleImageUpload(files[0])
    }
  }

  const removeImage = () => {
    setSelectedImage(null)
    setImagePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsSubmitting(false)
    setSubmitSuccess(true)

    // Reset form after success
    setTimeout(() => {
      setSubmitSuccess(false)
      setSelectedImage(null)
      setImagePreview(null)
      setPromptText("")
      setNegativePrompt("")
      setSelectedCategories([])
      setAiModel("")
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }, 3000)
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-gray-800 border border-gray-700 text-center p-8 shadow-lg">
        <CardHeader>
          <Rocket className="mx-auto h-16 w-16 text-purple-400 mb-4" />
          <CardTitle className="text-3xl font-bold text-gray-100">Enviar Seu Prompt</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-gray-300">
            Esta página está em construção! Em breve, você poderá enviar seus próprios prompts de IA para a galeria.
          </p>
          <p className="text-gray-400 text-sm">Fique ligado para atualizações e novos recursos!</p>
          <Button asChild className="bg-purple-600 hover:bg-purple-700 text-white">
            <Link href="/">Voltar para a Galeria</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
