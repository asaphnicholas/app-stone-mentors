"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import ClientOnly from "@/components/ClientOnly"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { 
  faFileExport,
  faUsers,
  faHandshake,
  faDownload,
  faCalendarAlt,
  faFilter,
  faSpinner,
  faTimes
} from "@fortawesome/free-solid-svg-icons"

interface ExportReportsModalProps {
  isOpen: boolean
  onClose: () => void
}

interface ReportFilters {
  mentores: {
    periodo_inicio: string
    periodo_fim: string
    incluir_inativos: boolean
  }
  mentorias: {
    periodo_inicio: string
    periodo_fim: string
    status: string
    tipo: string
  }
}

export function ExportReportsModal({ isOpen, onClose }: ExportReportsModalProps) {
  const [isExporting, setIsExporting] = useState(false)
  const [exportingType, setExportingType] = useState<'mentores' | 'mentorias' | null>(null)
  const [filters, setFilters] = useState<ReportFilters>({
    mentores: {
      periodo_inicio: '',
      periodo_fim: '',
      incluir_inativos: false
    },
    mentorias: {
      periodo_inicio: '',
      periodo_fim: '',
      status: 'TODOS',
      tipo: 'TODOS'
    }
  })

  const handleClose = () => {
    setExportingType(null)
    setFilters({
      mentores: {
        periodo_inicio: '',
        periodo_fim: '',
        incluir_inativos: false
      },
      mentorias: {
        periodo_inicio: '',
        periodo_fim: '',
        status: 'TODOS',
        tipo: 'TODOS'
      }
    })
    onClose()
  }

  const handleExportMentores = async () => {
    try {
      setIsExporting(true)
      setExportingType('mentores')
      
      const params = new URLSearchParams()
      if (filters.mentores.periodo_inicio) {
        params.append('periodo_inicio', filters.mentores.periodo_inicio)
      }
      if (filters.mentores.periodo_fim) {
        params.append('periodo_fim', filters.mentores.periodo_fim)
      }
      if (filters.mentores.incluir_inativos) {
        params.append('incluir_inativos', 'true')
      }

      const url = `/api/admin/relatorios/mentores/exportar${params.toString() ? `?${params.toString()}` : ''}`
      
      // Get auth token
      const token = localStorage.getItem('access_token')
      
      // Use fetch to handle the download properly
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'text/csv,application/csv',
          'Authorization': token ? `Bearer ${token}` : '',
        },
      })

      if (!response.ok) {
        throw new Error(`Erro ao exportar relatório: ${response.status} ${response.statusText}`)
      }

      // Get the CSV content
      const csvContent = await response.text()
      
      // Create blob and download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      const url_blob = URL.createObjectURL(blob)
      link.href = url_blob
      link.download = `relatorio-mentores-${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url_blob)
      
      handleClose()
    } catch (error) {
      console.error('Erro ao exportar relatório de mentores:', error)
      alert('Erro ao exportar relatório de mentores. Verifique sua conexão e tente novamente.')
    } finally {
      setIsExporting(false)
    }
  }

  const handleExportMentorias = async () => {
    try {
      setIsExporting(true)
      setExportingType('mentorias')
      
      const params = new URLSearchParams()
      if (filters.mentorias.periodo_inicio) {
        params.append('periodo_inicio', filters.mentorias.periodo_inicio)
      }
      if (filters.mentorias.periodo_fim) {
        params.append('periodo_fim', filters.mentorias.periodo_fim)
      }
      if (filters.mentorias.status && filters.mentorias.status !== 'TODOS') {
        params.append('status', filters.mentorias.status)
      }
      if (filters.mentorias.tipo && filters.mentorias.tipo !== 'TODOS') {
        params.append('tipo', filters.mentorias.tipo)
      }

      const url = `/api/admin/relatorios/mentorias/exportar${params.toString() ? `?${params.toString()}` : ''}`
      
      // Get auth token
      const token = localStorage.getItem('access_token')
      
      // Use fetch to handle the download properly
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'text/csv,application/csv',
          'Authorization': token ? `Bearer ${token}` : '',
        },
      })

      if (!response.ok) {
        throw new Error(`Erro ao exportar relatório: ${response.status} ${response.statusText}`)
      }

      // Get the CSV content
      const csvContent = await response.text()
      
      // Create blob and download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      const url_blob = URL.createObjectURL(blob)
      link.href = url_blob
      link.download = `relatorio-mentorias-${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url_blob)
      
      handleClose()
    } catch (error) {
      console.error('Erro ao exportar relatório de mentorias:', error)
      alert('Erro ao exportar relatório de mentorias. Verifique sua conexão e tente novamente.')
    } finally {
      setIsExporting(false)
    }
  }



  const renderMentoresFilters = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 bg-stone-600 rounded-lg flex items-center justify-center">
          <FontAwesomeIcon icon={faUsers} className="h-4 w-4 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Filtros - Relatório de Mentores</h3>
          <p className="text-sm text-gray-600">Configure os parâmetros de exportação</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="mentores-inicio">Data de Início</Label>
          <Input
            id="mentores-inicio"
            type="date"
            value={filters.mentores.periodo_inicio}
            onChange={(e) => setFilters(prev => ({
              ...prev,
              mentores: { ...prev.mentores, periodo_inicio: e.target.value }
            }))}
          />
          <p className="text-xs text-gray-500 mt-1">Opcional - filtrar por período de cadastro</p>
        </div>
        
        <div>
          <Label htmlFor="mentores-fim">Data de Fim</Label>
          <Input
            id="mentores-fim"
            type="date"
            value={filters.mentores.periodo_fim}
            onChange={(e) => setFilters(prev => ({
              ...prev,
              mentores: { ...prev.mentores, periodo_fim: e.target.value }
            }))}
          />
          <p className="text-xs text-gray-500 mt-1">Opcional - período final</p>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="incluir-inativos"
          checked={filters.mentores.incluir_inativos}
          onCheckedChange={(checked) => setFilters(prev => ({
            ...prev,
            mentores: { ...prev.mentores, incluir_inativos: checked as boolean }
          }))}
        />
        <Label htmlFor="incluir-inativos" className="text-sm">
          Incluir mentores inativos
        </Label>
      </div>
    </div>
  )

  const renderMentoriasFilters = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 bg-stone-600 rounded-lg flex items-center justify-center">
          <FontAwesomeIcon icon={faHandshake} className="h-4 w-4 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Filtros - Relatório de Mentorias</h3>
          <p className="text-sm text-gray-600">Configure os parâmetros de exportação</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="mentorias-inicio">Data de Início</Label>
          <Input
            id="mentorias-inicio"
            type="date"
            value={filters.mentorias.periodo_inicio}
            onChange={(e) => setFilters(prev => ({
              ...prev,
              mentorias: { ...prev.mentorias, periodo_inicio: e.target.value }
            }))}
          />
          <p className="text-xs text-gray-500 mt-1">Opcional - filtrar por período de realização</p>
        </div>
        
        <div>
          <Label htmlFor="mentorias-fim">Data de Fim</Label>
          <Input
            id="mentorias-fim"
            type="date"
            value={filters.mentorias.periodo_fim}
            onChange={(e) => setFilters(prev => ({
              ...prev,
              mentorias: { ...prev.mentorias, periodo_fim: e.target.value }
            }))}
          />
          <p className="text-xs text-gray-500 mt-1">Opcional - período final</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="mentorias-status">Status</Label>
          <Select 
            value={filters.mentorias.status} 
            onValueChange={(value) => setFilters(prev => ({
              ...prev,
              mentorias: { ...prev.mentorias, status: value }
            }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Todos os status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="TODOS">Todos os status</SelectItem>
              <SelectItem value="FINALIZADA">Finalizadas</SelectItem>
              <SelectItem value="CONFIRMADA">Confirmadas</SelectItem>
              <SelectItem value="EM_ANDAMENTO">Em Andamento</SelectItem>
              <SelectItem value="DISPONIVEL">Disponíveis</SelectItem>
              <SelectItem value="CANCELADA">Canceladas</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="mentorias-tipo">Tipo</Label>
          <Select 
            value={filters.mentorias.tipo} 
            onValueChange={(value) => setFilters(prev => ({
              ...prev,
              mentorias: { ...prev.mentorias, tipo: value }
            }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Todos os tipos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="TODOS">Todos os tipos</SelectItem>
              <SelectItem value="PRIMEIRA">Primeira Mentoria</SelectItem>
              <SelectItem value="FOLLOWUP">Follow-up</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )

  if (!isOpen) return null

  return (
    <ClientOnly>
      <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-[90vw] w-[90vw] max-h-[90vh] lg:max-w-4xl p-0 bg-white">
        <DialogHeader className="p-6 pb-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-stone-600/20 rounded-lg flex items-center justify-center">
                <FontAwesomeIcon icon={faFileExport} className="h-4 w-4 text-stone-700" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold text-gray-900">
                  Exportar Relatórios
                </DialogTitle>
                <p className="text-sm text-gray-600 mt-1">
                  Gere relatórios em formato CSV para análise externa
                </p>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-160px)]">
          <div className="space-y-8">
            {/* Relatório de Mentores */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-stone-600 rounded-lg flex items-center justify-center">
                  <FontAwesomeIcon icon={faUsers} className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Relatório de Mentores</h3>
                  <p className="text-sm text-gray-600">Dados completos dos mentores</p>
                </div>
              </div>
              
              {renderMentoresFilters()}
              
              <div className="flex justify-end">
                <Button
                  onClick={handleExportMentores}
                  disabled={isExporting}
                  className="bg-stone-600 hover:bg-stone-700 text-white"
                >
                  {isExporting && exportingType === 'mentores' ? (
                    <FontAwesomeIcon icon={faSpinner} className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <FontAwesomeIcon icon={faDownload} className="h-4 w-4 mr-2" />
                  )}
                  {isExporting && exportingType === 'mentores' ? 'Exportando...' : 'Exportar CSV'}
                </Button>
              </div>
            </div>

            <Separator />

            {/* Relatório de Mentorias */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-stone-600 rounded-lg flex items-center justify-center">
                  <FontAwesomeIcon icon={faHandshake} className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Relatório de Mentorias</h3>
                  <p className="text-sm text-gray-600">Histórico de sessões realizadas</p>
                </div>
              </div>
              
              {renderMentoriasFilters()}
              
              <div className="flex justify-end">
                <Button
                  onClick={handleExportMentorias}
                  disabled={isExporting}
                  className="bg-stone-600 hover:bg-stone-700 text-white"
                >
                  {isExporting && exportingType === 'mentorias' ? (
                    <FontAwesomeIcon icon={faSpinner} className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <FontAwesomeIcon icon={faDownload} className="h-4 w-4 mr-2" />
                  )}
                  {isExporting && exportingType === 'mentorias' ? 'Exportando...' : 'Exportar CSV'}
                </Button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end pt-6 ">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isExporting}
            >
              Fechar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
    </ClientOnly>
  )
}
