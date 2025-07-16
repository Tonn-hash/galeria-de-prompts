"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Lock } from "lucide-react"

interface AccountStatusProps {
  isPremium: boolean
}

export function AccountStatus({ isPremium }: AccountStatusProps) {
  return (
    <Card className="bg-gray-900 border border-gray-700">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-gray-50">Status da Conta</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center gap-4">
        {isPremium ? (
          <Badge className="bg-gradient-to-r from-purple-600 to-blue-500 text-white px-4 py-2 rounded-full text-base font-semibold flex items-center gap-2">
            <Star className="w-5 h-5 fill-current" />
            Acesso Premium
          </Badge>
        ) : (
          <Badge
            variant="outline"
            className="border-gray-500 text-gray-400 px-4 py-2 rounded-full text-base font-semibold flex items-center gap-2"
          >
            <Lock className="w-5 h-5" />
            Plano Gratuito
          </Badge>
        )}
        <p className="text-gray-300 text-sm">
          {isPremium ? "Todos os prompts desbloqueados." : "Você tem acesso aos prompts gratuitos."}
        </p>
      </CardContent>
    </Card>
  )
}
