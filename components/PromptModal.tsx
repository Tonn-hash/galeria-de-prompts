"use client"

import Image from "next/image"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Lock, Copy } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { FavoriteButton } from "./FavoriteButton"
import type { Session } from "@supabase/supabase-js"

interface PromptModalProps {
  prompt: {
    id: number
    name: string
    description: string
    image: string
    category: string
    isPremium: boolean
  }
  isOpen: boolean
  onClose: () => void
  session: Session | null
}

export function PromptModal({ prompt, isOpen, onClose, session }: PromptModalProps) {
  const { toast } = useToast()

  const isPremiumContentLocked = prompt.isPremium && !session

  const handleCopyPrompt = () => {
    if (isPremiumContentLocked) {
      toast({
        title: "Acesso Negado",
        description: "Faça login para copiar prompts premium.",
        variant: "destructive",
      })
      return
    }
    navigator.clipboard.writeText(prompt.description)
    toast({
      title: "Copiado!",
      description: "Prompt copiado para a área de transferência.",
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-gray-800 text-gray-50 border border-gray-700 p-0 overflow-hidden">
        <div className="relative w-full h-64 sm:h-80 bg-gray-700 flex items-center justify-center">
          <Image
            src={prompt.image || "/placeholder.svg"}
            alt={prompt.name}
            layout="fill"
            objectFit="cover"
            className={`transition-opacity duration-300 ${isPremiumContentLocked ? "opacity-30 blur-sm" : "opacity-100"}`}
          />
          {isPremiumContentLocked && (
            <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-black/60">
              <Lock className="w-16 h-16 text-purple-400 mb-4" />
              <p className="text-white text-lg font-semibold text-center">
                Faça login para ver e copiar este prompt premium.
              </p>
              <Button
                onClick={() => {
                  onClose()
                  // Redirecionar para a página de login
                  window.location.href = "/login"
                }}
                className="mt-4 bg-purple-600 hover:bg-purple-700 text-white"
              >
                Entrar / Criar Conta
              </Button>
            </div>
          )}
        </div>
        <DialogHeader className="p-6 pb-4">
          <DialogTitle className="text-2xl font-bold text-gray-50">{prompt.name}</DialogTitle>
          <DialogDescription className="text-gray-400">
            Categoria: {prompt.category} {prompt.isPremium && <span className="text-purple-400">(Premium)</span>}
          </DialogDescription>
        </DialogHeader>
        <div className="p-6 pt-0">
          <p className="text-gray-300 mb-4 whitespace-pre-wrap">
            {isPremiumContentLocked ? "Conteúdo bloqueado. Faça login para visualizar." : prompt.description}
          </p>
          <div className="flex justify-end gap-2">
            <FavoriteButton promptId={prompt.id} session={session} />
            <Button onClick={handleCopyPrompt} className="bg-blue-600 hover:bg-blue-700 text-white">
              <Copy className="w-4 h-4 mr-2" />
              Copiar Prompt
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
