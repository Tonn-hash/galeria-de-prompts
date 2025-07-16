"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

export default function ActivatePremiumPage() {
  const [activationCode, setActivationCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleActivate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulação de chamada de API
    await new Promise((resolve) => setTimeout(resolve, 2000))

    if (activationCode.toUpperCase() === "PREMIUM-CODE-123") {
      toast({
        title: "Ativação Bem-Sucedida!",
        description: "Seu acesso premium foi ativado. Aproveite todos os prompts!",
        variant: "default",
      })
      // Aqui você integraria a lógica real para atualizar o status do usuário no banco de dados
      // Ex: supabase.from('profiles').update({ is_premium: true }).eq('id', userId);
    } else {
      toast({
        title: "Código Inválido",
        description: "O código de ativação inserido não é válido. Por favor, tente novamente.",
        variant: "destructive",
      })
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 text-gray-50 p-4">
      <Card className="w-full max-w-md bg-gray-800 border border-gray-700 shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-purple-400">Ativar Acesso Premium</CardTitle>
          <CardDescription className="text-gray-400 mt-2">
            Insira o código de ativação que você recebeu no seu ebook para liberar todos os prompts.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleActivate} className="space-y-6">
            <div>
              <Label htmlFor="activation-code" className="sr-only">
                Código de Ativação
              </Label>
              <Input
                id="activation-code"
                type="text"
                placeholder="SEU-CODIGO-AQUI"
                value={activationCode}
                onChange={(e) => setActivationCode(e.target.value.toUpperCase())}
                className="h-14 text-2xl font-bold tracking-widest text-center bg-gray-700 border-gray-600 text-gray-50 placeholder:text-gray-500 focus:border-purple-500"
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full h-12 text-lg font-semibold bg-purple-600 hover:bg-purple-700 text-white"
              disabled={isLoading}
            >
              {isLoading ? "Ativando..." : "Ativar"}
            </Button>
          </form>
          <div className="text-center mt-4">
            <Link href="/contact" className="text-sm text-muted-foreground hover:underline">
              Problemas com seu código? Entre em contato.
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
