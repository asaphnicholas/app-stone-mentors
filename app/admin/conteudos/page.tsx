"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { 
  faPlus, 
  faFilePdf, 
  faVideo, 
  faLink, 
  faFilePowerpoint,
  faUpload,
  faEdit,
  faTrash,
  faEye,
  faCheckCircle,
  faExclamationTriangle,
  faFileText,
  faClock,
  faGraduationCap,
  faFolderOpen
} from "@fortawesome/free-solid-svg-icons"
import { materialsService, type Material } from "@/lib/services/materials"
import { useToast } from "@/components/ui/toast"
import { FileViewer } from "@/components/ui/file-viewer"

// Hook para detectar hidratação
function useHydration() {
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  return isHydrated
}

const MATERIAL_TYPES = [
  { value: "PDF", label: "PDF", icon: faFilePdf },
  { value: "VIDEO", label: "Vídeo", icon: faVideo },
  { value: "LINK", label: "Link", icon: faLink },
  { value: "APRESENTACAO", label: "Apresentação", icon: faFilePowerpoint },
] as const

// Validar tipos de material
const VALID_MATERIAL_TYPES = ['PDF', 'VIDEO', 'LINK', 'APRESENTACAO'] as const
type MaterialType = typeof VALID_MATERIAL_TYPES[number]

// Componente de Loading
const LoadingState = () => (
  <div className="space-y-8">
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Conteúdos</h1>
        <p className="text-gray-600">Gerencie os materiais de treinamento dos mentores</p>
      </div>
      <div className="w-40 h-12 bg-gradient-to-r from-stone-green-dark to-stone-green-light rounded-lg animate-pulse"></div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <Card key={i} className="animate-pulse border-0 shadow-lg">
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-32"></div>
                  <div className="h-3 bg-gray-200 rounded w-24"></div>
                </div>
              </div>
              <div className="flex gap-2">
                <div className="h-5 w-16 bg-gray-200 rounded-full"></div>
                <div className="h-5 w-12 bg-gray-200 rounded-full"></div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="h-3 bg-gray-200 rounded w-full"></div>
              <div className="h-3 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              <div className="flex justify-between items-center pt-4">
                <div className="flex gap-2">
                  <div className="h-8 w-16 bg-gray-200 rounded"></div>
                  <div className="h-8 w-16 bg-gray-200 rounded"></div>
                </div>
                <div className="h-8 w-20 bg-gray-200 rounded"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
)

export default function AdminConteudosPage() {
  const [materials, setMaterials] = useState<Material[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null)
  const [deletingMaterial, setDeletingMaterial] = useState<Material | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [viewerOpen, setViewerOpen] = useState(false)
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null)
  const { addToast } = useToast()
  const isHydrated = useHydration()

  const [formData, setFormData] = useState({
    titulo: "",
    descricao: "",
    tipo: "PDF" as const,
    url_arquivo: "",
    nome_arquivo: "",
    tamanho_arquivo: 0,
    obrigatorio: true,
    ordem: 1,
    duracao_minutos: 0,
  })

  useEffect(() => {
    if (isHydrated) {
      loadMaterials()
    }
  }, [isHydrated])

  const loadMaterials = async () => {
    try {
      setIsLoading(true)
      const data = await materialsService.getMaterials()
      setMaterials(data.sort((a, b) => a.ordem - b.ordem))
    } catch (error) {
      addToast({
        type: "error",
        title: "Erro ao carregar materiais",
        message: error instanceof Error ? error.message : "Erro interno do servidor",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileUpload = async (file: File) => {
    try {
      setIsUploading(true)
      const uploadResult = await materialsService.uploadFile(file)
      
      setFormData(prev => ({
        ...prev,
        url_arquivo: uploadResult.url_arquivo,
        nome_arquivo: uploadResult.nome_arquivo,
        tamanho_arquivo: uploadResult.tamanho_arquivo,
        tipo: uploadResult.tipo as any,
      }))

      addToast({
        type: "success",
        title: "Arquivo enviado com sucesso!",
        message: `Arquivo ${uploadResult.nome_arquivo} foi enviado.`,
      })
    } catch (error) {
      addToast({
        type: "error",
        title: "Erro no upload",
        message: error instanceof Error ? error.message : "Erro interno do servidor",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      // Validar dados obrigatórios
      if (!formData.titulo.trim()) {
        addToast({
          type: "error",
          title: "Erro de validação",
          message: "Título é obrigatório",
        })
        return
      }

      if (!formData.descricao.trim()) {
        addToast({
          type: "error",
          title: "Erro de validação",
          message: "Descrição é obrigatória",
        })
        return
      }

      if (!VALID_MATERIAL_TYPES.includes(formData.tipo as MaterialType)) {
        addToast({
          type: "error",
          title: "Erro de validação",
          message: `Tipo inválido: ${formData.tipo}. Tipos válidos: ${VALID_MATERIAL_TYPES.join(', ')}`,
        })
        return
      }

      // Preparar dados para envio
      const materialData = {
        titulo: formData.titulo.trim(),
        descricao: formData.descricao.trim(),
        tipo: formData.tipo,
        url_arquivo: formData.url_arquivo || null,
        nome_arquivo: formData.nome_arquivo || null,
        tamanho_arquivo: formData.tamanho_arquivo || null,
        obrigatorio: formData.obrigatorio,
        ordem: formData.ordem,
        duracao_minutos: formData.duracao_minutos || null,
      }
      
      await materialsService.createMaterial(materialData)
      
      addToast({
        type: "success",
        title: "Material criado com sucesso!",
        message: `Material "${formData.titulo}" foi adicionado à trilha.`,
      })

      setIsCreateDialogOpen(false)
      setFormData({
        titulo: "",
        descricao: "",
        tipo: "PDF",
        url_arquivo: "",
        nome_arquivo: "",
        tamanho_arquivo: 0,
        obrigatorio: true,
        ordem: materials.length + 1,
        duracao_minutos: 0,
      })
      
      loadMaterials()
    } catch (error) {
      addToast({
        type: "error",
        title: "Erro ao criar material",
        message: error instanceof Error ? error.message : "Erro interno do servidor",
      })
    }
  }

  const getMaterialIcon = (tipo: string) => {
    const materialType = MATERIAL_TYPES.find(t => t.value === tipo)
    return materialType?.icon || faFilePdf
  }

  const getMaterialTypeLabel = (tipo: string) => {
    const materialType = MATERIAL_TYPES.find(t => t.value === tipo)
    return materialType?.label || "Arquivo"
  }

  const handleViewMaterial = (material: Material) => {
    setSelectedMaterial(material)
    setViewerOpen(true)
  }

  const handleCloseViewer = () => {
    setViewerOpen(false)
    setSelectedMaterial(null)
  }

  const handleEditMaterial = (material: Material) => {
    setEditingMaterial(material)
    setFormData({
      titulo: material.titulo,
      descricao: material.descricao,
      tipo: material.tipo,
      url_arquivo: material.url_arquivo || "",
      nome_arquivo: material.nome_arquivo || "",
      tamanho_arquivo: material.tamanho_arquivo || 0,
      obrigatorio: material.obrigatorio,
      ordem: material.ordem,
      duracao_minutos: material.duracao_minutos || 0,
    })
    setIsEditDialogOpen(true)
  }

  const handleDeleteMaterial = (material: Material) => {
    setDeletingMaterial(material)
    setIsDeleteDialogOpen(true)
  }

  const handleUpdateMaterial = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!editingMaterial) return

    try {
      // Validar dados obrigatórios
      if (!formData.titulo.trim()) {
        addToast({
          type: "error",
          title: "Erro de validação",
          message: "Título é obrigatório",
        })
        return
      }

      if (!formData.descricao.trim()) {
        addToast({
          type: "error",
          title: "Erro de validação",
          message: "Descrição é obrigatória",
        })
        return
      }

      // Preparar dados para envio (sem tipo, pois não pode ser alterado)
      const materialData = {
        titulo: formData.titulo.trim(),
        descricao: formData.descricao.trim(),
        url_arquivo: formData.url_arquivo || null,
        nome_arquivo: formData.nome_arquivo || null,
        tamanho_arquivo: formData.tamanho_arquivo || null,
        obrigatorio: formData.obrigatorio,
        ordem: formData.ordem,
        duracao_minutos: formData.duracao_minutos || null,
      }
      
      await materialsService.updateMaterial(editingMaterial.id, materialData)
      
      addToast({
        type: "success",
        title: "Material atualizado com sucesso!",
        message: `Material "${formData.titulo}" foi atualizado.`,
      })

      setIsEditDialogOpen(false)
      setEditingMaterial(null)
      setFormData({
        titulo: "",
        descricao: "",
        tipo: "PDF",
        url_arquivo: "",
        nome_arquivo: "",
        tamanho_arquivo: 0,
        obrigatorio: true,
        ordem: materials.length + 1,
        duracao_minutos: 0,
      })
      
      loadMaterials()
    } catch (error) {
      addToast({
        type: "error",
        title: "Erro ao atualizar material",
        message: error instanceof Error ? error.message : "Erro interno do servidor",
      })
    }
  }

  const handleConfirmDelete = async () => {
    if (!deletingMaterial) return

    try {
      await materialsService.deleteMaterial(deletingMaterial.id)
      
      addToast({
        type: "success",
        title: "Material removido com sucesso!",
        message: `Material "${deletingMaterial.titulo}" foi removido da trilha.`,
      })

      setIsDeleteDialogOpen(false)
      setDeletingMaterial(null)
      loadMaterials()
    } catch (error) {
      addToast({
        type: "error",
        title: "Erro ao remover material",
        message: error instanceof Error ? error.message : "Erro interno do servidor",
      })
    }
  }

  // Renderizar loading state até hidratação completa ou enquanto carrega dados
  if (!isHydrated || isLoading) {
    return <LoadingState />
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-stone-green-dark via-stone-green-light to-stone-green-bright rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-white/10 -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-white/5 -translate-y-16 -translate-x-8"></div>
        
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
              <FontAwesomeIcon icon={faGraduationCap} className="h-10 w-10 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-2">Conteúdos</h1>
              <p className="text-white/90 text-xl">Gerencie os materiais de treinamento dos mentores</p>
              <p className="text-white/80 text-base">Crie, edite e organize os materiais da trilha de conhecimento</p>
            </div>
          </div>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 h-12 px-6">
                <FontAwesomeIcon icon={faPlus} className="h-5 w-5 mr-3" />
                Novo Material
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto z-[100] bg-white [&>div]:z-[100]">
              <DialogHeader className="space-y-3">
                <DialogTitle className="text-2xl font-bold text-gray-900">Criar Novo Material</DialogTitle>
                <DialogDescription className="text-gray-600">
                  Adicione um novo material à trilha de conhecimento dos mentores
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Upload de Arquivo */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-gray-700">Arquivo</Label>
                  <div className="rounded-xl p-8 text-center transition-colors duration-200 bg-gradient-to-br from-stone-green-light/10 to-stone-green-dark/10 hover:from-stone-green-light/20 hover:to-stone-green-dark/20 border-2 border-dashed border-stone-green-light/30">
                    <FontAwesomeIcon icon={faUpload} className="h-12 w-12 text-stone-green-dark mx-auto mb-4" />
                    <p className="text-sm text-gray-600 mb-3 font-medium">
                      {formData.nome_arquivo ? (
                        <span className="text-stone-green-dark">
                          <FontAwesomeIcon icon={faCheckCircle} className="h-4 w-4 mr-2" />
                          {formData.nome_arquivo}
                        </span>
                      ) : (
                        "Clique para fazer upload ou arraste um arquivo"
                      )}
                    </p>
                    <input
                      type="file"
                      accept=".pdf,.mp4,.ppt,.pptx,.doc,.docx"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) handleFileUpload(file)
                      }}
                      className="hidden"
                      id="file-upload"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById('file-upload')?.click()}
                      disabled={isUploading}
                      className="border-stone-green-light text-stone-green-dark hover:bg-stone-green-light hover:text-white"
                    >
                      {isUploading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-stone-green-dark mr-2"></div>
                          Enviando...
                        </>
                      ) : (
                        <>
                          <FontAwesomeIcon icon={faUpload} className="h-4 w-4 mr-2" />
                          Escolher Arquivo
                        </>
                      )}
                    </Button>
                  </div>
                  
                  {/* Aviso sobre caracteres especiais */}
                  <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-start gap-2">
                      <FontAwesomeIcon icon={faExclamationTriangle} className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-yellow-800">
                        <strong>Importante:</strong> Evite usar caracteres especiais (acentos, espaços, símbolos) no nome do arquivo para garantir compatibilidade.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Título */}
                <div className="space-y-2">
                  <Label htmlFor="titulo" className="text-sm font-medium text-gray-700">Título *</Label>
                  <Input
                    id="titulo"
                    value={formData.titulo}
                    onChange={(e) => setFormData(prev => ({ ...prev, titulo: e.target.value }))}
                    placeholder="Ex: Protocolo de Mentoria Stone"
                    className="h-12 border-2 border-gray-200 focus:border-stone-green-dark focus:ring-stone-green-dark/20 transition-all duration-200"
                    required
                  />
                </div>

                {/* Descrição */}
                <div className="space-y-2">
                  <Label htmlFor="descricao" className="text-sm font-medium text-gray-700">Descrição *</Label>
                  <Textarea
                    id="descricao"
                    value={formData.descricao}
                    onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
                    placeholder="Descreva o conteúdo do material..."
                    rows={4}
                    className="border-2 border-gray-200 focus:border-stone-green-dark focus:ring-stone-green-dark/20 transition-all duration-200 resize-none"
                    required
                  />
                </div>

                {/* Tipo */}
                <div className="space-y-2">
                  <Label htmlFor="tipo" className="text-sm font-medium text-gray-700">Tipo *</Label>
                  <Select value={formData.tipo} onValueChange={(value: any) => setFormData(prev => ({ ...prev, tipo: value }))}>
                    <SelectTrigger className="h-12 border-2 border-gray-200 focus:border-stone-green-dark focus:ring-stone-green-dark/20 transition-all duration-200">
                      <SelectValue placeholder="Selecione o tipo de material">
                        {formData.tipo && (
                          <div className="flex items-center gap-2">
                            <FontAwesomeIcon 
                              icon={MATERIAL_TYPES.find(t => t.value === formData.tipo)?.icon || faFilePdf} 
                              className="h-4 w-4" 
                            />
                            <span>{MATERIAL_TYPES.find(t => t.value === formData.tipo)?.label || formData.tipo}</span>
                          </div>
                        )}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="z-[9999] max-h-[200px] bg-white border-gray-200">
                      {MATERIAL_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value} className="cursor-pointer">
                          <div className="flex items-center gap-2">
                            <FontAwesomeIcon icon={type.icon} className="h-4 w-4" />
                            {type.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Ordem */}
                  <div className="space-y-2">
                    <Label htmlFor="ordem" className="text-sm font-medium text-gray-700">Ordem na Trilha *</Label>
                    <Input
                      id="ordem"
                      type="number"
                      min="1"
                      value={formData.ordem}
                      onChange={(e) => setFormData(prev => ({ ...prev, ordem: parseInt(e.target.value) || 1 }))}
                      className="h-12 border-2 border-gray-200 focus:border-stone-green-dark focus:ring-stone-green-dark/20 transition-all duration-200"
                      required
                    />
                  </div>

                  {/* Duração (para vídeos) */}
                  {formData.tipo === 'VIDEO' && (
                    <div className="space-y-2">
                      <Label htmlFor="duracao" className="text-sm font-medium text-gray-700">Duração (minutos)</Label>
                      <Input
                        id="duracao"
                        type="number"
                        min="0"
                        value={formData.duracao_minutos}
                        onChange={(e) => setFormData(prev => ({ ...prev, duracao_minutos: parseInt(e.target.value) || 0 }))}
                        className="h-12 border-2 border-gray-200 focus:border-stone-green-dark focus:ring-stone-green-dark/20 transition-all duration-200"
                      />
                    </div>
                  )}
                </div>

                {/* Obrigatório */}
                <div className="flex items-center space-x-4 p-6 rounded-xl bg-gradient-to-r from-stone-green-light/10 to-stone-green-dark/10 border border-stone-green-light/20">
                  <Switch
                    id="obrigatorio"
                    checked={formData.obrigatorio}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, obrigatorio: checked }))}
                    className="data-[state=checked]:bg-stone-green-dark data-[state=unchecked]:bg-gray-300"
                  />
                  <div>
                    <Label htmlFor="obrigatorio" className="text-sm font-medium text-gray-700 cursor-pointer">
                      Material obrigatório
                    </Label>
                    <p className="text-xs text-gray-500">Materiais obrigatórios devem ser concluídos para qualificação</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsCreateDialogOpen(false)}
                    className="px-8 py-3 border-2 border-gray-300 text-gray-700 hover:bg-gray-50 transition-all duration-200"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    className="px-8 py-3 bg-gradient-to-r from-stone-green-dark via-stone-green-light to-stone-green-bright hover:from-stone-green-bright hover:via-stone-green-light hover:to-stone-green-dark text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200"
                  >
                    <FontAwesomeIcon icon={faPlus} className="h-4 w-4 mr-2" />
                    Criar Material
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-stone-green-light/10 to-stone-green-dark/10">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-stone-green-light to-stone-green-dark rounded-xl flex items-center justify-center shadow-lg">
                <FontAwesomeIcon icon={faFileText} className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Materiais</p>
                <p className="text-2xl font-bold text-gray-900">{materials.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-stone-green-light/10 to-stone-green-dark/10">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-stone-green-light to-stone-green-dark rounded-xl flex items-center justify-center shadow-lg">
                <FontAwesomeIcon icon={faExclamationTriangle} className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Obrigatórios</p>
                <p className="text-2xl font-bold text-gray-900">{materials.filter(m => m.obrigatorio).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-stone-green-light/10 to-stone-green-dark/10">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-stone-green-light to-stone-green-dark rounded-xl flex items-center justify-center shadow-lg">
                <FontAwesomeIcon icon={faVideo} className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Vídeos</p>
                <p className="text-2xl font-bold text-gray-900">{materials.filter(m => m.tipo === 'VIDEO').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Materials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {materials.map((material, index) => (
          <Card key={material.id} className="group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-0 shadow-lg overflow-hidden">
            <CardContent className="p-0">
              {/* Header com gradiente */}
              <div className="bg-gradient-to-br from-stone-green-light to-stone-green-dark p-6 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 rounded-full bg-white/10 -translate-y-8 translate-x-8"></div>
                <div className="absolute bottom-0 left-0 w-16 h-16 rounded-full bg-white/5 -translate-y-8 -translate-x-4"></div>
                
                <div className="relative z-10 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg">
                      <FontAwesomeIcon 
                        icon={getMaterialIcon(material.tipo)} 
                        className="h-6 w-6 text-white" 
                      />
                    </div>
                    <div>
                      <div className="text-xs text-white/80 font-medium">#{material.ordem}</div>
                      <div className="text-sm text-white/90">{getMaterialTypeLabel(material.tipo)}</div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    {material.obrigatorio && (
                      <Badge className="bg-white/20 text-white text-xs border-0">
                        Obrigatório
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Conteúdo principal */}
              <div className="p-6 bg-white">
                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-stone-green-dark transition-colors">
                  {material.titulo}
                </h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-3 leading-relaxed">
                  {material.descricao}
                </p>
                
                {/* Informações do arquivo */}
                <div className="space-y-2 mb-4">
                  {material.nome_arquivo && (
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <FontAwesomeIcon icon={faFilePdf} className="h-3 w-3" />
                      <span className="truncate">{material.nome_arquivo}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    {material.tamanho_arquivo && (
                      <div className="flex items-center gap-1">
                        <FontAwesomeIcon icon={faEye} className="h-3 w-3" />
                        {materialsService.formatFileSize(material.tamanho_arquivo)}
                      </div>
                    )}
                    {material.duracao_minutos && (
                      <div className="flex items-center gap-1">
                        <FontAwesomeIcon icon={faClock} className="h-3 w-3" />
                        {materialsService.formatDuration(material.duracao_minutos)}
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleEditMaterial(material)}
                      className="text-stone-green-dark hover:text-stone-green-dark hover:bg-stone-green-light/10 h-8 px-3"
                    >
                      <FontAwesomeIcon icon={faEdit} className="h-3 w-3 mr-1" />
                      Editar
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleDeleteMaterial(material)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 px-3"
                    >
                      <FontAwesomeIcon icon={faTrash} className="h-3 w-3 mr-1" />
                      Excluir
                    </Button>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleViewMaterial(material)}
                    className="border-stone-green-light text-stone-green-dark hover:bg-stone-green-light hover:text-white h-8 px-3"
                  >
                    <FontAwesomeIcon icon={faEye} className="h-3 w-3 mr-1" />
                    Ver
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Estado vazio */}
      {materials.length === 0 && (
        <Card className="text-center py-16 border-0 shadow-lg">
          <CardContent>
            <div className="w-20 h-20 bg-gradient-to-br from-stone-green-light to-stone-green-dark rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <FontAwesomeIcon icon={faFolderOpen} className="h-10 w-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Nenhum material encontrado</h3>
            <p className="text-gray-600 mb-6 text-lg">
              Comece criando o primeiro material da trilha de conhecimento
            </p>
            <Button 
              onClick={() => setIsCreateDialogOpen(true)}
              className="bg-gradient-to-r from-stone-green-dark via-stone-green-light to-stone-green-bright hover:from-stone-green-bright hover:via-stone-green-light hover:to-stone-green-dark text-white h-12 px-8 text-base"
            >
              <FontAwesomeIcon icon={faPlus} className="h-5 w-5 mr-3" />
              Criar Primeiro Material
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Modais de edição e exclusão mantidos iguais... */}
      {/* Modal de Edição */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto z-[100] bg-white [&>div]:z-[100]">
          <DialogHeader className="space-y-3">
            <DialogTitle className="text-2xl font-bold text-gray-900">Editar Material</DialogTitle>
            <DialogDescription className="text-gray-600">
              Edite as informações do material de treinamento
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleUpdateMaterial} className="space-y-4">
            {/* Título */}
            <div className="space-y-2">
              <Label htmlFor="edit-titulo" className="text-sm font-medium text-gray-700">Título *</Label>
              <Input
                id="edit-titulo"
                value={formData.titulo}
                onChange={(e) => setFormData(prev => ({ ...prev, titulo: e.target.value }))}
                placeholder="Digite o título do material"
                className="h-11 border-2 border-gray-200 focus:border-stone-green-dark focus:ring-stone-green-dark/20 transition-all duration-200"
                required
              />
            </div>

            {/* Descrição */}
            <div className="space-y-2">
              <Label htmlFor="edit-descricao" className="text-sm font-medium text-gray-700">Descrição *</Label>
              <Textarea
                id="edit-descricao"
                value={formData.descricao}
                onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
                placeholder="Descreva o conteúdo do material"
                rows={3}
                className="border-2 border-gray-200 focus:border-stone-green-dark focus:ring-stone-green-dark/20 transition-all duration-200 resize-none"
                required
              />
            </div>

            {/* Tipo (readonly) */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Tipo</Label>
              <div className="h-11 border-2 border-gray-200 rounded-md px-3 flex items-center bg-gray-50">
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon 
                    icon={MATERIAL_TYPES.find(t => t.value === formData.tipo)?.icon || faFilePdf} 
                    className="h-4 w-4" 
                  />
                  <span className="text-gray-700">{MATERIAL_TYPES.find(t => t.value === formData.tipo)?.label || formData.tipo}</span>
                </div>
              </div>
              <p className="text-xs text-gray-500">O tipo não pode ser alterado após a criação</p>
            </div>

            {/* URL do Arquivo */}
            <div className="space-y-2">
              <Label htmlFor="edit-url" className="text-sm font-medium text-gray-700">URL do Arquivo</Label>
              <Input
                id="edit-url"
                value={formData.url_arquivo}
                onChange={(e) => setFormData(prev => ({ ...prev, url_arquivo: e.target.value }))}
                placeholder="https://exemplo.com/arquivo.pdf"
                className="h-11 border-2 border-gray-200 focus:border-stone-green-dark focus:ring-stone-green-dark/20 transition-all duration-200"
              />
            </div>

            {/* Nome do Arquivo */}
            <div className="space-y-2">
              <Label htmlFor="edit-nome" className="text-sm font-medium text-gray-700">Nome do Arquivo</Label>
              <Input
                id="edit-nome"
                value={formData.nome_arquivo}
                onChange={(e) => setFormData(prev => ({ ...prev, nome_arquivo: e.target.value }))}
                placeholder="arquivo.pdf"
                className="h-11 border-2 border-gray-200 focus:border-stone-green-dark focus:ring-stone-green-dark/20 transition-all duration-200"
              />
            </div>

            {/* Tamanho do Arquivo */}
            <div className="space-y-2">
              <Label htmlFor="edit-tamanho" className="text-sm font-medium text-gray-700">Tamanho do Arquivo (bytes)</Label>
              <Input
                id="edit-tamanho"
                type="number"
                value={formData.tamanho_arquivo}
                onChange={(e) => setFormData(prev => ({ ...prev, tamanho_arquivo: parseInt(e.target.value) || 0 }))}
                placeholder="2048000"
                className="h-11 border-2 border-gray-200 focus:border-stone-green-dark focus:ring-stone-green-dark/20 transition-all duration-200"
              />
            </div>

            {/* Ordem */}
            <div className="space-y-2">
              <Label htmlFor="edit-ordem" className="text-sm font-medium text-gray-700">Ordem na Trilha *</Label>
              <Input
                id="edit-ordem"
                type="number"
                value={formData.ordem}
                onChange={(e) => setFormData(prev => ({ ...prev, ordem: parseInt(e.target.value) || 1 }))}
                placeholder="1"
                min="1"
                className="h-11 border-2 border-gray-200 focus:border-stone-green-dark focus:ring-stone-green-dark/20 transition-all duration-200"
                required
              />
            </div>

            {/* Duração (apenas para vídeos) */}
            {formData.tipo === 'VIDEO' && (
              <div className="space-y-2">
                <Label htmlFor="edit-duracao" className="text-sm font-medium text-gray-700">Duração (minutos)</Label>
                <Input
                  id="edit-duracao"
                  type="number"
                  value={formData.duracao_minutos}
                  onChange={(e) => setFormData(prev => ({ ...prev, duracao_minutos: parseInt(e.target.value) || 0 }))}
                  placeholder="5"
                  min="0"
                  className="h-11 border-2 border-gray-200 focus:border-stone-green-dark focus:ring-stone-green-dark/20 transition-all duration-200"
                />
              </div>
            )}

            {/* Material Obrigatório */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <Label htmlFor="edit-obrigatorio" className="text-sm font-medium text-gray-700">Material obrigatório</Label>
                <p className="text-xs text-gray-500">Materiais obrigatórios devem ser concluídos para qualificação</p>
              </div>
              <Switch
                id="edit-obrigatorio"
                checked={formData.obrigatorio}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, obrigatorio: checked }))}
                className="data-[state=checked]:bg-stone-green-dark data-[state=unchecked]:bg-gray-300"
              />
            </div>

            {/* Botões */}
            <div className="flex items-center justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
                className="px-6"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="px-6 bg-gradient-to-r from-stone-green-dark via-stone-green-light to-stone-green-bright hover:from-stone-green-bright hover:via-stone-green-light hover:to-stone-green-dark text-white"
              >
                Atualizar Material
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal de Confirmação de Exclusão */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="max-w-md z-[100] bg-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-900">Confirmar Exclusão</DialogTitle>
            <DialogDescription className="text-gray-600">
              Tem certeza que deseja remover este material? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          
          {deletingMaterial && (
            <div className="p-4 bg-red-50 rounded-lg border border-red-200">
              <div className="flex items-center gap-3">
                <FontAwesomeIcon 
                  icon={MATERIAL_TYPES.find(t => t.value === deletingMaterial.tipo)?.icon || faFilePdf} 
                  className="h-5 w-5 text-red-600" 
                />
                <div>
                  <p className="font-medium text-red-900">{deletingMaterial.titulo}</p>
                  <p className="text-sm text-red-700">{MATERIAL_TYPES.find(t => t.value === deletingMaterial.tipo)?.label}</p>
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              className="px-6"
            >
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={handleConfirmDelete}
              className="px-6 bg-red-600 hover:bg-red-700 text-white"
            >
              Confirmar Exclusão
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* File Viewer */}
      {selectedMaterial && (
        <FileViewer
          materialId={selectedMaterial.id}
          materialTitle={selectedMaterial.titulo}
          materialType={selectedMaterial.tipo}
          isOpen={viewerOpen}
          onClose={handleCloseViewer}
        />
      )}
    </div>
  )
}