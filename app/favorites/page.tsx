"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PromptModal } from "@/components/PromptModal"
import { SkeletonLoader } from "@/components/SkeletonLoader"
import { useToast } from "@/hooks/use-toast"
import { useSession } from "@/components/SessionProvider"
import { createClient } from "@/utils/supabase/client"
import { Lock } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface Prompt {
  id: number
  name: string
  description: string
  image: string
  category: string
  isPremium: boolean
}

export default function FavoritesPage() {
  const [favoritePrompts, setFavoritePrompts] = useState<Prompt[]>([])
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const { session, isLoading: isSessionLoading } = useSession()
  const { toast } = useToast()
  const supabase = createClient()

  useEffect(() => {
    async function fetchFavorites() {
      setIsLoading(true)
      if (!session) {
        setFavoritePrompts([])
        setIsLoading(false)
        return
      }

      try {
        // Fetch all prompts
        const response = await fetch("/data/prompts.json")
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const allPrompts: Prompt[] = await response.json()

        // Fetch user's favorite prompt IDs from Supabase
        const { data, error } = await supabase.from("favorites").select("prompt_id").eq("user_id", session.user.id)

        if (error) {
          throw error
        }

        const favoriteIds = new Set(data.map((fav) => fav.prompt_id))
        const userFavorites = allPrompts.filter((prompt) => favoriteIds.has(prompt.id))
        setFavoritePrompts(userFavorites)
      } catch (error: any) {
        console.error("Failed to fetch favorite prompts:", error)
        toast({
          title: "Erro ao carregar favoritos",
          description: error.message || "Não foi possível carregar seus prompts favoritos.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchFavorites()
  }, [session, supabase, toast])

  const handleOpenModal = (prompt: Prompt) => {
    setSelectedPrompt(prompt)
    setIsModalOpen(true)
  }

  if (isLoading || isSessionLoading) {
    return <SkeletonLoader />
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-950 text-gray-50">
      <header className="sticky top-0 z-40 w-full bg-gray-950/90 backdrop-blur-sm border-b border-gray-800 py-4 px-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-purple-400">Meus Favoritos</h1>
      </header>

      <main className="flex-1 p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {favoritePrompts.length === 0 ? (
          <div className="col-span-full text-center text-gray-400 text-lg py-10">
            Você ainda não tem prompts favoritos.
          </div>
        ) : (
          favoritePrompts.map((prompt) => (
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
                    <Badge className="bg-purple-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                      Premium
                    </Badge>
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
          ))
        )}
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
