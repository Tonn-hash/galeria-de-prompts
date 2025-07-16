"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/utils/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [username, setUsername] = useState("") // Novo estado para nome de usuário
  const [dateOfBirth, setDateOfBirth] = useState("") // Novo estado para data de nascimento
  const [gender, setGender] = useState("") // Novo estado para gênero
  const [loading, setLoading] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)
  const router = useRouter()
  const supabase = createClient()
  const { toast } = useToast()

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    if (!email || !password) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha e-mail e senha.",
        variant: "destructive",
      })
      setLoading(false)
      return
    }

    if (isSignUp) {
      // === SIGN-UP ===
      // Validação básica para campos adicionais no cadastro
      if (!username) {
        toast({
          title: "Nome de usuário obrigatório",
          description: "Por favor, escolha um nome de usuário.",
          variant: "destructive",
        })
        setLoading(false)
        return
      }

      const { error, data } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${location.origin}/profile` },
      })

      if (error) {
        toast({ title: "Erro ao criar conta", description: error.message, variant: "destructive" })
      } else {
        // Cria ou atualiza o registro de perfil com informações adicionais
        if (data.user) {
          const { error: profileError } = await supabase.from("profiles").upsert({
            id: data.user.id,
            username: username, // Usar o nome de usuário do estado
            date_of_birth: dateOfBirth || null, // Pode ser nulo se não preenchido
            gender: gender || null, // Pode ser nulo se não preenchido
          })

          if (profileError) {
            console.error("Erro ao salvar perfil:", profileError)
            toast({
              title: "Erro ao salvar perfil",
              description: profileError.message,
              variant: "destructive",
            })
          }
        }
        toast({
          title: "Verifique seu e-mail",
          description: "Enviamos um link de confirmação para sua conta.",
        })
        setIsSignUp(false) // Volta para a tela de login após o cadastro
      }
    } else {
      // === SIGN-IN ===
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        toast({ title: "Erro ao entrar", description: error.message, variant: "destructive" })
      } else {
        router.push("/profile")
      }
    }
    setLoading(false)
  }

  const handlePasswordReset = async () => {
    if (!email) {
      toast({
        title: "E-mail necessário",
        description: "Por favor, insira seu e-mail para redefinir a senha.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${location.origin}/auth/update-password`,
    })

    if (error) {
      toast({
        title: "Erro ao redefinir senha",
        description: error.message,
        variant: "destructive",
      })
    } else {
      toast({
        title: "E-mail de redefinição enviado",
        description: "Verifique sua caixa de entrada para o link de redefinição de senha.",
        variant: "default",
      })
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 text-gray-50 p-4">
      <Card className="w-full max-w-md bg-gray-800 border border-gray-700 shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">{isSignUp ? "Criar Conta" : "Entrar"}</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="voce@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 bg-gray-700 border-gray-600 text-gray-200"
              />
            </div>

            {isSignUp && (
              <>
                <div>
                  <Label htmlFor="username">Nome de Usuário</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="Seu nome de usuário"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required // Tornando o nome de usuário obrigatório no cadastro
                    className="mt-1 bg-gray-700 border-gray-600 text-gray-200"
                  />
                </div>
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
              </>
            )}

            <div>
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 bg-gray-700 border-gray-600 text-gray-200"
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Enviando..." : isSignUp ? "Criar Conta" : "Entrar"}
            </Button>
          </form>

          {!isSignUp && (
            <div className="mt-2 text-right text-sm">
              <button
                type="button"
                onClick={handlePasswordReset}
                className="text-purple-400 hover:underline"
                disabled={loading}
              >
                Esqueceu a senha?
              </button>
            </div>
          )}

          <div className="mt-6 text-center text-sm">
            {isSignUp ? (
              <>
                Já possui conta?{" "}
                <button type="button" onClick={() => setIsSignUp(false)} className="text-purple-400 hover:underline">
                  Entrar
                </button>
              </>
            ) : (
              <>
                Não tem conta?{" "}
                <button type="button" onClick={() => setIsSignUp(true)} className="text-purple-400 hover:underline">
                  Criar Conta
                </button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
