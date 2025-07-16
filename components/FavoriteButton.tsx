"use client"

import { useState, useEffect } from "react"
import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/utils/supabase/client"
import type { Session } from "@supabase/supabase-js"
import { useToast } from "@/hooks/use-toast"

interface FavoriteButtonProps {
  promptId: number
  session: Session | null
}

export function FavoriteButton({ promptId, session }: FavoriteButtonProps) {
  const [isFavorited, setIsFavorited] = useState(false)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()
  const { toast } = useToast()

  useEffect(() => {
    async function checkFavorite() {
      if (session?.user?.id) {
        const { data, error } = await supabase
          .from("favorites")
          .select("id")
          .eq("user_id", session.user.id)
          .eq("prompt_id", promptId)
          .single()

        if (error && error.code !== "PGRST116") {
          // PGRST116 means no rows found
          console.error("Error checking favorite:", error)
        } else {
          setIsFavorited(!!data)
        }
      } else {
        setIsFavorited(false)
      }
      setLoading(false)
    }

    checkFavorite()
  }, [promptId, session, supabase])

  const handleToggleFavorite = async () => {
    if (!session) {
      toast({
        title: "Login Necessário",
        description: "Você precisa estar logado para adicionar favoritos.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    if (isFavorited) {
      const { error } = await supabase
        .from("favorites")
        .delete()
        .eq("user_id", session.user.id)
        .eq("prompt_id", promptId)

      if (error) {
        console.error("Error removing favorite:", error)
        toast({
          title: "Erro ao remover favorito",
          description: error.message,
          variant: "destructive",
        })
      } else {
        setIsFavorited(false)
        toast({
          title: "Removido dos Favoritos",
          description: "O prompt foi removido dos seus favoritos.",
          variant: "default",
        })
      }
    } else {
      const { error } = await supabase.from("favorites").insert({
        user_id: session.user.id,
        prompt_id: promptId,
      })

      if (error) {
        console.error("Error adding favorite:", error)
        toast({
          title: "Erro ao adicionar favorito",
          description: error.message,
          variant: "destructive",
        })
      } else {
        setIsFavorited(true)
        toast({
          title: "Adicionado aos Favoritos",
          description: "O prompt foi adicionado aos seus favoritos!",
          variant: "default",
        })
      }
    }
    setLoading(false)
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={(e) => {
        e.stopPropagation() // Prevent card click from triggering modal
        handleToggleFavorite()
      }}
      disabled={loading}
      className={`rounded-full ${isFavorited ? "text-red-500 hover:bg-red-500/20" : "text-gray-400 hover:bg-gray-700 hover:text-white"}`}
    >
      <Heart fill={isFavorited ? "currentColor" : "none"} className="h-5 w-5" />
      <span className="sr-only">{isFavorited ? "Remover dos favoritos" : "Adicionar aos favoritos"}</span>
    </Button>
  )
}
