import { useEffect, useState } from "react"
import { Link } from "wouter"
import { CheckCircle2, XCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useVerifyEmail } from "@/hooks/useAuth"

export default function VerifyEmailPage() {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [message, setMessage] = useState("")
  const verifyEmailMutation = useVerifyEmail()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const token = params.get("token")

    if (!token) {
      setStatus("error")
      setMessage("Токен верификации не найден")
      return
    }

    const verify = async () => {
      try {
        await verifyEmailMutation.mutateAsync(token)
        setStatus("success")
        setMessage("Email успешно подтвержден!")
      } catch (error: any) {
        setStatus("error")
        setMessage(error.message || "Ссылка недействительна или истекла")
      }
    }

    verify()
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-muted/30">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-serif text-center">
            Подтверждение Email
          </CardTitle>
          <CardDescription className="text-center">
            {status === "loading" && "Проверяем ваш email..."}
            {status === "success" && "Ваш email подтвержден"}
            {status === "error" && "Ошибка подтверждения"}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-6">
          {status === "loading" && (
            <>
              <Loader2 className="h-16 w-16 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">
                Пожалуйста, подождите...
              </p>
            </>
          )}

          {status === "success" && (
            <>
              <div className="rounded-full bg-primary/10 p-4">
                <CheckCircle2 className="h-16 w-16 text-primary" />
              </div>
              <div className="text-center">
                <p className="mb-4 text-lg font-medium">{message}</p>
                <p className="text-sm text-muted-foreground">
                  Теперь вы можете войти в свой аккаунт
                </p>
              </div>
              <Link href="/login">
                <Button className="w-full" data-testid="button-go-to-login">
                  Перейти ко входу
                </Button>
              </Link>
            </>
          )}

          {status === "error" && (
            <>
              <div className="rounded-full bg-destructive/10 p-4">
                <XCircle className="h-16 w-16 text-destructive" />
              </div>
              <div className="text-center">
                <p className="mb-4 text-lg font-medium">{message}</p>
                <p className="text-sm text-muted-foreground">
                  Попробуйте зарегистрироваться снова
                </p>
              </div>
              <Link href="/register">
                <Button className="w-full" data-testid="button-go-to-register">
                  Зарегистрироваться
                </Button>
              </Link>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
