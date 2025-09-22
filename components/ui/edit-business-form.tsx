"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { 
  faSave, 
  faTrashAlt, 
  faUnlink, 
  faExclamationTriangle,
  faUser,
  faBuilding,
  faChartLine
} from "@fortawesome/free-solid-svg-icons"
import { Business } from "@/lib/services/businesses"
import { AREAS_ATUACAO } from "@/lib/constants/areas-atuacao"

interface EditBusinessFormProps {
  business: Business
  onUpdate: (business: Business) => void
  onSave: (business: Business) => void
  onDelete: (businessId: string) => void
  onUnassignMentor: (businessId: string, motivo: string) => void
  onCancel: () => void
}

export function EditBusinessForm({
  business,
  onUpdate,
  onSave,
  onDelete,
  onUnassignMentor,
  onCancel
}: EditBusinessFormProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isUnassignDialogOpen, setIsUnassignDialogOpen] = useState(false)
  const [deleteReason, setDeleteReason] = useState("")
  const [unassignReason, setUnassignReason] = useState("")

  const handleFieldChange = (field: keyof Business, value: any) => {
    onUpdate({
      ...business,
      [field]: value
    })
  }

  const handleSave = () => {
    onSave(business)
  }

  const handleDelete = () => {
    onDelete(business.id)
    setIsDeleteDialogOpen(false)
  }

  const handleUnassign = () => {
    onUnassignMentor(business.id, unassignReason)
    setIsUnassignDialogOpen(false)
  }

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'ativo':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'inativo':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'mentor_pendente':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Badge className={`border ${getStatusColor(business.status)}`}>
            {business.status?.toUpperCase() || 'N/A'}
          </Badge>
          <span className="text-sm text-gray-500">
            ID: {business.id}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={onCancel} variant="outline" className="px-6">
            Cancelar
          </Button>
          <Button onClick={handleSave} className="px-6 bg-stone-600 hover:bg-stone-700 text-white">
            <FontAwesomeIcon icon={faSave} className="h-4 w-4 mr-2" />
            Salvar Alterações
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Informações Básicas */}
        <Card className="border-none">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FontAwesomeIcon icon={faBuilding} className="h-5 w-5" />
              Informações Básicas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="nome" className="mb-2 block">Nome do Negócio *</Label>
              <Input
                id="nome"
                value={business.nome || ""}
                onChange={(e) => handleFieldChange('nome', e.target.value)}
                placeholder="Digite o nome do negócio"
              />
            </div>

            <div>
              <Label htmlFor="area_atuacao" className="mb-2 block">Área de Atuação *</Label>
              <Select
                value={business.area_atuacao || ""}
                onValueChange={(value) => handleFieldChange('area_atuacao', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma área" />
                </SelectTrigger>
                <SelectContent>
                  {AREAS_ATUACAO.map((area) => (
                    <SelectItem key={area.value} value={area.value}>
                      {area.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="status" className="mb-2 block">Status</Label>
              <Select
                value={business.status || ""}
                onValueChange={(value) => handleFieldChange('status', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ATIVO">Ativo</SelectItem>
                  <SelectItem value="INATIVO">Inativo</SelectItem>
                  <SelectItem value="MENTOR_PENDENTE">Mentor Pendente</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="localizacao" className="mb-2 block">Localização</Label>
              <Input
                id="localizacao"
                value={business.localizacao || ""}
                onChange={(e) => handleFieldChange('localizacao', e.target.value)}
                placeholder="Cidade, Estado"
              />
            </div>

            <div>
              <Label htmlFor="descricao" className="mb-2 block">Descrição</Label>
              <Textarea
                id="descricao"
                value={business.descricao || ""}
                onChange={(e) => handleFieldChange('descricao', e.target.value)}
                placeholder="Descreva o negócio..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Mentor e Ações */}
        <Card className="border-none">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FontAwesomeIcon icon={faChartLine} className="h-5 w-5" />
              Mentor e Ações
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {business.mentor_nome && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-green-900">Mentor Atual</p>
                    <p className="text-sm text-green-700">{business.mentor_nome}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsUnassignDialogOpen(true)}
                    className="text-orange-600 border-orange-300 hover:bg-orange-50"
                  >
                    <FontAwesomeIcon icon={faUnlink} className="h-3 w-3 mr-1" />
                    Desvincular
                  </Button>
                </div>
              </div>
            )}

            <Separator />

            <div className="space-y-3">
              <Label className="text-red-600 font-medium mb-2 block">Zona de Perigo</Label>
              <Button
                variant="outline"
                onClick={() => setIsDeleteDialogOpen(true)}
                className="w-full text-red-600 border-red-300 hover:bg-red-50"
              >
                <FontAwesomeIcon icon={faTrashAlt} className="h-4 w-4 mr-2" />
                Deletar Negócio Permanentemente
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="max-w-md bg-white">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <FontAwesomeIcon icon={faExclamationTriangle} className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <DialogTitle className="text-lg font-bold text-red-900">
                  Deletar Negócio
                </DialogTitle>
                <DialogDescription className="text-sm text-red-700">
                  Esta ação é irreversível e permanente.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-4">
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">
                Você está prestes a deletar permanentemente o negócio <strong>"{business.nome}"</strong>.
                Todos os dados associados serão perdidos.
              </p>
            </div>

            <div>
              <Label htmlFor="delete-reason" className="mb-2 block">Motivo da deleção *</Label>
              <Textarea
                id="delete-reason"
                value={deleteReason}
                onChange={(e) => setDeleteReason(e.target.value)}
                placeholder="Explique por que este negócio está sendo deletado..."
                rows={3}
                className="border-red-200 focus:border-red-500"
              />
            </div>

            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setIsDeleteDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={!deleteReason.trim()}
              >
                <FontAwesomeIcon icon={faTrashAlt} className="h-4 w-4 mr-2" />
                Deletar Permanentemente
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Unassign Mentor Dialog */}
      <Dialog open={isUnassignDialogOpen} onOpenChange={setIsUnassignDialogOpen}>
        <DialogContent className="max-w-md bg-white">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <FontAwesomeIcon icon={faUnlink} className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <DialogTitle className="text-lg font-bold text-orange-900">
                  Desvincular Mentor
                </DialogTitle>
                <DialogDescription className="text-sm text-orange-700">
                  O negócio ficará pendente de novo mentor.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-4">
            <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <p className="text-sm text-orange-800">
                Mentor <strong>{business.mentor_nome}</strong> será desvinculado do negócio 
                <strong> "{business.nome}"</strong>.
              </p>
            </div>

            <div>
              <Label htmlFor="unassign-reason" className="mb-2 block">Motivo da desvinculação *</Label>
              <Textarea
                id="unassign-reason"
                value={unassignReason}
                onChange={(e) => setUnassignReason(e.target.value)}
                placeholder="Explique por que o mentor está sendo desvinculado..."
                rows={3}
                className="border-orange-200 focus:border-orange-500"
              />
            </div>

            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setIsUnassignDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleUnassign}
                disabled={!unassignReason.trim()}
                className="bg-orange-600 hover:bg-orange-700 text-white"
              >
                <FontAwesomeIcon icon={faUnlink} className="h-4 w-4 mr-2" />
                Desvincular Mentor
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
