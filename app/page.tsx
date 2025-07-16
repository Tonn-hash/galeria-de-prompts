"use client"

import { Input } from "@/components/ui/input"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FilterDropdown } from "@/components/FilterDropdown"
import { SortDropdown } from "@/components/SortDropdown"
import { PromptModal } from "@/components/PromptModal"
import { SkeletonLoader } from "@/components/SkeletonLoader"
import { useToast } from "@/hooks/use-toast"
import { useSession } from "@/components/SessionProvider"
import { Lock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import promptsData from "@/data/prompts.json"

interface Prompt {
  id: number
  name: string
  description: string
  image: string
  category: string
  isPremium: boolean
}

export default function HomePage() {
  const [filteredPrompts, setFilteredPrompts] = useState<Prompt[]>([])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [sortOrder, setSortOrder] = useState("default")
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { session, isLoading: isSessionLoading } = useSession()
  const { toast } = useToast()
  const searchParams = useSearchParams()

  const prompts: Prompt[] = promptsData as Prompt[]

  useEffect(() => {
    let currentPrompts = [...prompts]

    // Apply search filter
    if (searchTerm) {
      currentPrompts = currentPrompts.filter(
        (prompt) =>
          prompt.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          prompt.description.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Apply category filter
    if (selectedCategories.length > 0) {
      currentPrompts = currentPrompts.filter((prompt) => selectedCategories.includes(prompt.category))
    }

    // Apply sorting
    if (sortOrder === "asc") {
      currentPrompts.sort((a, b) => a.name.localeCompare(b.name))
    } else if (sortOrder === "desc") {
      currentPrompts.sort((a, b) => b.name.localeCompare(a.name))
    }

    setFilteredPrompts(currentPrompts)
  }, [prompts, selectedCategories, searchTerm, sortOrder])

  useEffect(() => {
    const categoryParam = searchParams.get("category")
    if (categoryParam) {
      setSelectedCategories([categoryParam])
    }
  }, [searchParams])

  const allCategories = Array.from(new Set(prompts.map((p) => p.category)))

  const handleOpenModal = (prompt: Prompt) => {
    setSelectedPrompt(prompt)
    setIsModalOpen(true)
  }

  if (isSessionLoading) {
    return <SkeletonLoader />
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-950 text-gray-50">
      <header className="sticky top-0 z-40 w-full bg-gray-950/90 backdrop-blur-sm border-b border-gray-800 py-4 px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-purple-400">Prompt Gallery</h1>
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <Input
            type="text"
            placeholder="Buscar prompts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 bg-gray-800 border-gray-700 text-gray-50 placeholder:text-gray-400"
          />
          <FilterDropdown
            categories={allCategories}
            selectedCategories={selectedCategories}
            onCategoryChange={setSelectedCategories}
          />
          <SortDropdown sortOrder={sortOrder} onSortChange={setSortOrder} />
        </div>
      </header>

      <main className="flex-1 p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredPrompts.map((prompt) => (
          <Card
            key={prompt.id}
            className="relative bg-gray-800 border border-gray-700 rounded-lg overflow-hidden shadow-lg hover:shadow-purple-500/30 transition-all duration-300 group"
          >
            <div className="relative w-full h-48 overflow-hidden">
              <Image
                src={prompt.image || "/placeholder.svg"}
                alt={prompt.name}
                layout="fill"
                objectFit="cover"
                className="transition-transform duration-300 group-hover:scale-105"
              />
              {prompt.isPremium && !session && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10">
                  <Lock className="w-10 h-10 text-purple-400" />
                </div>
              )}
            </div>
            <CardContent className="p-4 flex flex-col gap-2">
              <div className="flex justify-between items-start">
                <h2 className="text-xl font-semibold text-gray-50">{prompt.name}</h2>
                {prompt.isPremium && (
                  <Badge className="bg-purple-600 text-white px-2 py-1 rounded-full text-xs font-medium">Premium</Badge>
                )}
              </div>
              <p className="text-gray-400 text-sm line-clamp-2">{prompt.description}</p>
              <div className="flex justify-end mt-2">
                <Button
                  variant="secondary"
                  onClick={() => handleOpenModal(prompt)}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  Ver Prompt
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </main>

      {selectedPrompt && (
        <PromptModal
          prompt={selectedPrompt}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          session={session}
        />
      )}
    </div>
  )
}
