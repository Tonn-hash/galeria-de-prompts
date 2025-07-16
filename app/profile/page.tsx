"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { createClient } from "@/utils/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { AccountStatus } from "@/components/AccountStatus"

interface Profile {
  id: string
  username: string | null
  date_of_birth: string | null
  gender: string | null
  created_at: string
}

export default function ProfilePage() {
  const [loading, setLoading] = useState(true)
  const [username, setUsername] = useState("")
  const [dateOfBirth, setDateOfBirth] = useState("")
  const [gender, setGender] = useState("")
  const [email, setEmail] = useState("")
  const [createdAt, setCreatedAt] = useState("")
  const [isPremiumUser] = useState(false) // permanece falso até que você implemente o backend real
  const router = useRouter()
  const supabase = createClient()
  const { toast } = useToast()

  useEffect(() => {
    async function getProfile() {
      setLoading(true)
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession()

      if (sessionError || !sessionData?.session) {
        router.push("/login")
        return
      }

      const user = sessionData.session.user
      setEmail(user.email || "")
      setCreatedAt(user.created_at)

      const { data, error } = await supabase
        .from("profiles")
        .select("username, date_of_birth, gender") // Incluir is_premium na seleção
        .eq("id", user.id)
        .maybeSingle()

      if (error && error.code !== "PGRST116") {
        // PGRST116 é "No rows found", que é esperado se o perfil não existe
        console.error("Error fetching profile:", error)
        toast({
          title: "Erro ao carregar perfil",
          description: error.message,
          variant: "destructive",
        })
      } else if (data) {
        setUsername(data.username || user.email?.split("@")[0] || "")
        setDateOfBirth(data.date_of_birth || "")
        setGender(data.gender || "")
      } else {
        // Se não houver dados de perfil, inicializa com o nome de usuário do e-mail
        setUsername(user.email?.split("@")[0] || "")
      }
      setLoading(false)
    }

    getProfile()
  }, [router, supabase, toast])

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const user = (await supabase.auth.getSession()).data.session?.user

    if (!user) {
      toast({
        title: "Erro",
        description: "Usuário não autenticado.",
        variant: "destructive",
      })
      setLoading(false)
      return
    }

    const updates = {
      id: user.id,
      username,
      date_of_birth: dateOfBirth || null,
      gender: gender || null,
      updated_at: new Date().toISOString(),
    }

    const { error } = await supabase.from("profiles").upsert(updates)

    if (error) {
      toast({
        title: "Erro ao atualizar perfil",
        description: error.message,
        variant: "destructive",
      })
    } else {
      toast({
        title: "Sucesso!",
        description: "Perfil atualizado com sucesso.",
        variant: "default",
      })
    }
    setLoading(false)
  }

  const handleSignOut = async () => {
    setLoading(true)
    const { error } = await supabase.auth.signOut()
    if (error) {
      toast({
        title: "Erro ao sair",
        description: error.message,
        variant: "destructive",
      })
    } else {
      router.push("/login")
    }
    setLoading(false)
  }

  const getAvatarUrl = (userEmail: string) => {
    const hash = btoa(userEmail).slice(0, 10) // Simple hash for consistent avatar
    return `https://api.dicebear.com/7.x/initials/svg?seed=${hash}&backgroundColor=6d28d9,8b5cf6,a78bfa,c084fc,d8b4fe&backgroundType=gradientLinear&fontFamily=Arial,sans-serif&fontWeight=600`
  }

  const formatDate = (isoString: string) => {
    if (!isoString) return "N/A"
    const date = new Date(isoString)
    return date.toLocaleDateString("pt-BR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950 text-gray-50">
        <p>Carregando perfil...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-950 text-gray-50 p-4">
      <Card className="w-full max-w-2xl bg-gray-800 border border-gray-700 shadow-lg">
        <CardHeader className="flex flex-col items-center gap-4">
          <Avatar className="w-24 h-24">
            <Image
              src={getAvatarUrl(email) || "/placeholder.svg"}
              alt="Avatar do Usuário"
              width={96}
              height={96}
              className="rounded-full"
            />
            <AvatarFallback>{username ? username[0].toUpperCase() : "U"}</AvatarFallback>
          </Avatar>
          <CardTitle className="text-3xl font-bold">{username || "Usuário"}</CardTitle>
          <p className="text-gray-400 text-sm">Membro desde: {formatDate(createdAt)}</p>
        </CardHeader>

        <CardContent className="space-y-6">
          <AccountStatus isPremium={isPremiumUser} /> {/* Usa o estado isPremiumUser */}
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  disabled
                  className="mt-1 bg-gray-700 border-gray-600 text-gray-400 cursor-not-allowed"
                />
              </div>
              <div>
                <Label htmlFor="username">Nome de Usuário</Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="mt-1 bg-gray-700 border-gray-600 text-gray-200"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="dateOfBirth">Data de Nascimento (Opcional)</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  className="mt-1 bg-gray-700 border-gray-600 text-gray-200"
                />
              </div>
              <div>
                <Label htmlFor="gender">Gênero (Opcional)</Label>
                <Select value={gender} onValueChange={setGender}>
                  <SelectTrigger className="mt-1 bg-gray-700 border-gray-600 text-gray-200">
                    <SelectValue placeholder="Selecione seu gênero" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 text-gray-200 border-gray-700">
                    <SelectItem value="masculino">Masculino</SelectItem>
                    <SelectItem value="feminino">Feminino</SelectItem>
                    <SelectItem value="outro">Outro</SelectItem>
                    <SelectItem value="nao_informar">Prefiro não dizer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </form>
          <div className="flex justify-center">
            <Button
              variant="ghost"
              onClick={handleSignOut}
              disabled={loading}
              className="text-red-400 hover:text-red-300"
            >
              Sair
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
