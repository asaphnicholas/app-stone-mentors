"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { 
  faFileAlt, 
  faPlay, 
  faDownload, 
  faCheckCircle, 
  faClock, 
  faGraduationCap,
  faBookOpen,
  faVideo,
  faFilePdf,
  faTrophy,
  faLightbulb,
  faArrowRight,
  faStar,
  faChartLine
} from "@fortawesome/free-solid-svg-icons"

// Mock training materials
const trainingMaterials = [
  {
    id: 1,
    title: "Manual do Mentor",
    type: "PDF",
    estimatedTime: "15 min",
    description: "Guia completo para conduzir mentorias eficazes",
    downloadUrl: "/materials/manual-mentor.pdf",
    completed: false,
    priority: "Alta"
  },
  {
    id: 2,
    title: "Técnicas de Diagnóstico",
    type: "Video",
    estimatedTime: "20 min",
    description: "Como identificar os principais desafios dos negócios",
    videoUrl: "https://youtube.com/watch?v=example",
    completed: false,
    priority: "Alta"
  },
  {
    id: 3,
    title: "Metodologia Stone",
    type: "PDF",
    estimatedTime: "10 min",
    description: "Entenda a metodologia e os processos da Stone",
    downloadUrl: "/materials/metodologia-stone.pdf",
    completed: true,
    priority: "Média"
  },
  {
    id: 4,
    title: "Ferramentas de Follow-up",
    type: "Video",
    estimatedTime: "12 min",
    description: "Como acompanhar o progresso dos empreendedores",
    videoUrl: "https://youtube.com/watch?v=example2",
    completed: false,
    priority: "Média"
  },
]

const checklist = [
  { id: 1, text: "Li e compreendi o Manual do Mentor", completed: true, materialId: 1 },
  { id: 2, text: "Assisti ao vídeo sobre Técnicas de Diagnóstico", completed: false, materialId: 2 },
  { id: 3, text: "Estudei a Metodologia Stone", completed: true, materialId: 3 },
  { id: 4, text: "Aprendi sobre as Ferramentas de Follow-up", completed: false, materialId: 4 },
  { id: 5, text: "Realizei o quiz de conhecimento", completed: false, materialId: null },
]

export default function TreinamentoPage() {
  const [checklistItems, setChecklistItems] = useState(checklist)

  const completedItems = checklistItems.filter((item) => item.completed).length
  const progressPercentage = (completedItems / checklistItems.length) * 100
  const isTrainingComplete = completedItems === checklistItems.length

  const handleChecklistChange = (id: number, checked: boolean) => {
    setChecklistItems((prev) => prev.map((item) => (item.id === id ? { ...item, completed: checked } : item)))
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Alta': return 'bg-red-100 text-red-700 border-red-200'
      case 'Média': return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 'Baixa': return 'bg-green-100 text-green-700 border-green-200'
      default: return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  return (
    <div className="space-y-8">
      {/* Progress Overview */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-stone-green-dark/10 rounded-xl flex items-center justify-center">
            <FontAwesomeIcon icon={faGraduationCap} className="h-6 w-6 text-stone-green-dark" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Progresso do Treinamento</h1>
            <p className="text-gray-600">Complete todos os materiais para começar a mentorar</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
            <div className="flex items-center gap-3">
              <FontAwesomeIcon icon={faBookOpen} className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-2xl font-bold text-blue-900">{trainingMaterials.length}</p>
                <p className="text-sm text-blue-700">Materiais Disponíveis</p>
              </div>
            </div>
          </div>
          <div className="bg-green-50 p-4 rounded-xl border border-green-200">
            <div className="flex items-center gap-3">
              <FontAwesomeIcon icon={faCheckCircle} className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-2xl font-bold text-green-900">{completedItems}</p>
                <p className="text-sm text-green-700">Concluídos</p>
              </div>
            </div>
          </div>
          <div className="bg-purple-50 p-4 rounded-xl border border-purple-200">
            <div className="flex items-center gap-3">
              <FontAwesomeIcon icon={faChartLine} className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-2xl font-bold text-purple-900">{Math.round(progressPercentage)}%</p>
                <p className="text-sm text-purple-700">Progresso</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">
              {completedItems} de {checklistItems.length} itens concluídos
            </span>
            <span className="text-sm text-gray-500">{Math.round(progressPercentage)}%</span>
          </div>
          <Progress value={progressPercentage} className="h-3 bg-gray-200" />
          {isTrainingComplete && (
            <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-xl">
              <FontAwesomeIcon icon={faTrophy} className="h-6 w-6 text-green-600" />
              <div>
                <p className="text-green-800 font-semibold">🎉 Parabéns!</p>
                <p className="text-green-700 text-sm">Você completou o treinamento e está pronto para mentorar.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Training Materials */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <FontAwesomeIcon icon={faBookOpen} className="h-5 w-5 text-stone-green-dark" />
            <h2 className="text-2xl font-bold text-gray-900">Materiais de Treinamento</h2>
          </div>
          
          <div className="space-y-4">
            {trainingMaterials.map((material) => (
              <Card key={material.id} className={`border-0 shadow-sm hover:shadow-lg transition-all duration-200 ${
                material.completed ? "bg-green-50 border-green-200" : "bg-white"
              }`}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        material.type === "PDF" ? "bg-red-100 text-red-600" : "bg-blue-100 text-blue-600"
                      }`}>
                        <FontAwesomeIcon 
                          icon={material.type === "PDF" ? faFilePdf : faVideo} 
                          className="h-6 w-6" 
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-gray-900 text-lg">{material.title}</h3>
                          {material.completed && (
                            <FontAwesomeIcon icon={faCheckCircle} className="h-5 w-5 text-green-600" />
                          )}
                        </div>
                        <p className="text-gray-600 mb-3">{material.description}</p>
                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className="text-xs">
                            {material.type}
                          </Badge>
                          <span className="flex items-center gap-1 text-xs text-gray-500">
                            <FontAwesomeIcon icon={faClock} className="h-3 w-3" />
                            {material.estimatedTime}
                          </span>
                          <Badge className={`text-xs border ${getPriorityColor(material.priority)}`}>
                            {material.priority}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    {material.type === "PDF" ? (
                      <Button size="sm" variant="outline" className="flex-1">
                        <FontAwesomeIcon icon={faDownload} className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    ) : (
                      <Button size="sm" variant="outline" className="flex-1">
                        <FontAwesomeIcon icon={faPlay} className="h-4 w-4 mr-2" />
                        Assistir
                      </Button>
                    )}
                    {material.completed ? (
                      <Button size="sm" variant="outline" className="flex-1 bg-green-50 text-green-700 border-green-200">
                        <FontAwesomeIcon icon={faCheckCircle} className="h-4 w-4 mr-2" />
                        Concluído
                      </Button>
                    ) : (
                      <Button size="sm" className="flex-1 bg-stone-green-dark hover:bg-stone-green-light">
                        <FontAwesomeIcon icon={faArrowRight} className="h-4 w-4 mr-2" />
                        Começar
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Completion Checklist */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <FontAwesomeIcon icon={faLightbulb} className="h-5 w-5 text-stone-green-dark" />
            <h2 className="text-2xl font-bold text-gray-900">Lista de Conclusão</h2>
          </div>
          
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg text-gray-900">Marque conforme completa</CardTitle>
              <CardDescription>Confirme que você leu e compreendeu cada material</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {checklistItems.map((item) => (
                <div key={item.id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <Checkbox
                    id={`checklist-${item.id}`}
                    checked={item.completed}
                    onCheckedChange={(checked) => handleChecklistChange(item.id, checked as boolean)}
                  />
                  <label
                    htmlFor={`checklist-${item.id}`}
                    className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex-1 ${
                      item.completed ? "line-through text-gray-400" : "text-gray-700"
                    }`}
                  >
                    {item.text}
                  </label>
                  {item.completed && (
                    <FontAwesomeIcon icon={faStar} className="h-4 w-4 text-yellow-500" />
                  )}
                </div>
              ))}

              <div className="pt-6 border-t border-gray-200">
                <Button
                  className="w-full h-12 bg-stone-green-dark hover:bg-stone-green-light text-lg font-semibold"
                  disabled={!isTrainingComplete}
                >
                  {isTrainingComplete ? (
                    <>
                      <FontAwesomeIcon icon={faTrophy} className="h-5 w-5 mr-2" />
                      Começar a Mentorar
                    </>
                  ) : (
                    <>
                      <FontAwesomeIcon icon={faGraduationCap} className="h-5 w-5 mr-2" />
                      Complete o treinamento
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
