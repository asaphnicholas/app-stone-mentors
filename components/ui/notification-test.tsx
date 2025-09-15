"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/toast"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSpinner, faCheck, faExclamationTriangle, faInfo } from "@fortawesome/free-solid-svg-icons"

export function NotificationTest() {
  const { addToast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const testSuccessNotification = () => {
    addToast({
      type: "success",
      title: "Sucesso!",
      message: "Operação realizada com sucesso.",
    })
  }

  const testErrorNotification = () => {
    addToast({
      type: "error",
      title: "Erro!",
      message: "Já existe um usuário cadastrado com este email",
    })
  }

  const testWarningNotification = () => {
    addToast({
      type: "warning",
      title: "Atenção!",
      message: "Esta ação não pode ser desfeita.",
    })
  }

  const testInfoNotification = () => {
    addToast({
      type: "info",
      title: "Informação",
      message: "Sistema atualizado com sucesso.",
    })
  }

  const testLoadingAction = async () => {
    setIsLoading(true)
    
    // Simular uma operação que demora
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Simular sucesso ou erro aleatório
    const isSuccess = Math.random() > 0.5
    
    if (isSuccess) {
      addToast({
        type: "success",
        title: "Operação concluída!",
        message: "A ação foi executada com sucesso.",
      })
    } else {
      addToast({
        type: "error",
        title: "Erro na operação",
        message: "Não foi possível completar a ação. Tente novamente.",
      })
    }
    
    setIsLoading(false)
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FontAwesomeIcon icon={faInfo} className="h-5 w-5 text-blue-600" />
          Teste de Notificações
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Button
            onClick={testSuccessNotification}
            variant="outline"
            className="border-green-200 text-green-700 hover:bg-green-50"
          >
            <FontAwesomeIcon icon={faCheck} className="h-4 w-4 mr-2" />
            Sucesso
          </Button>
          
          <Button
            onClick={testErrorNotification}
            variant="outline"
            className="border-red-200 text-red-700 hover:bg-red-50"
          >
            <FontAwesomeIcon icon={faExclamationTriangle} className="h-4 w-4 mr-2" />
            Erro
          </Button>
          
          <Button
            onClick={testWarningNotification}
            variant="outline"
            className="border-yellow-200 text-yellow-700 hover:bg-yellow-50"
          >
            <FontAwesomeIcon icon={faExclamationTriangle} className="h-4 w-4 mr-2" />
            Aviso
          </Button>
          
          <Button
            onClick={testInfoNotification}
            variant="outline"
            className="border-blue-200 text-blue-700 hover:bg-blue-50"
          >
            <FontAwesomeIcon icon={faInfo} className="h-4 w-4 mr-2" />
            Info
          </Button>
        </div>
        
        <Button
          onClick={testLoadingAction}
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-stone-green-dark to-stone-green-light hover:from-stone-green-light hover:to-stone-green-dark text-white disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <FontAwesomeIcon icon={faSpinner} className="h-4 w-4 mr-2 animate-spin" />
              Processando...
            </>
          ) : (
            "Testar Ação com Loading"
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
