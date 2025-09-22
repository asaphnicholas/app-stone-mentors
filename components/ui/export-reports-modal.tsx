"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
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
  const [selectedReport, setSelectedReport] = useState<'mentores' | 'mentorias' | null>(null)
  const [isExporting, setIsExporting] = useState(false)
  const [filters, setFilters] = useState<ReportFilters>({
    mentores: {
      periodo_inicio: '',
      periodo_fim: '',
      incluir_inativos: false
    },
    mentorias: {
      periodo_inicio: '',
      periodo_fim: '',
      status: '',
      tipo: ''
    }
  })

  const handleClose = () => {
    setSelectedReport(null)
    setFilters({
      mentores: {
        periodo_inicio: '',
        periodo_fim: '',
        incluir_inativos: false
      },
      mentorias: {
        periodo_inicio: '',
        periodo_fim: '',
        status: '',
        tipo: ''
      }
    })
    onClose()
  }

  const handleExportMentores = async () => {
    try {
      setIsExporting(true)
      
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
      
      // Create download link
      const link = document.createElement('a')
      link.href = url
      link.download = `relatorio-mentores-${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      handleClose()
    } catch (error) {
      console.error('Erro ao exportar relatório de mentores:', error)
    } finally {
      setIsExporting(false)
    }
  }

  const handleExportMentorias = async () => {
    try {
      setIsExporting(true)
      
      const params = new URLSearchParams()
      if (filters.mentorias.periodo_inicio) {
        params.append('periodo_inicio', filters.mentorias.periodo_inicio)
      }
      if (filters.mentorias.periodo_fim) {
        params.append('periodo_fim', filters.mentorias.periodo_fim)
      }
      if (filters.mentorias.status) {
        params.append('status', filters.mentorias.status)
      }
      if (filters.mentorias.tipo) {
        params.append('tipo', filters.mentorias.tipo)
      }

      const url = `/api/admin/relatorios/mentorias/exportar${params.toString() ? `?${params.toString()}` : ''}`
      
      // Create download link
      const link = document.createElement('a')
      link.href = url
      link.download = `relatorio-mentorias-${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      handleClose()
    } catch (error) {
      console.error('Erro ao exportar relatório de mentorias:', error)
    } finally {
      setIsExporting(false)
    }
  }

  const handleExport = () => {
    if (selectedReport === 'mentores') {
      handleExportMentores()
    } else if (selectedReport === 'mentorias') {
      handleExportMentorias()
    }
  }

  const renderReportSelection = () => (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Selecione o tipo de relatório:</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Relatório de Mentores */}
        <div 
          className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
            selectedReport === 'mentores' 
              ? 'border-stone-600 bg-stone-50' 
              : 'border-gray-200 hover:border-gray-300'
          }`}
          onClick={() => setSelectedReport('mentores')}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-stone-600 rounded-lg flex items-center justify-center">
              <FontAwesomeIcon icon={faUsers} className="h-5 w-5 text-white" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Relatório de Mentores</h4>
              <p className="text-sm text-gray-600">Dados completos dos mentores</p>
            </div>
          </div>
          <div className="text-xs text-gray-500">
            Inclui: informações pessoais, estatísticas, performance e status
          </div>
        </div>

        {/* Relatório de Mentorias */}
        <div 
          className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
            selectedReport === 'mentorias' 
              ? 'border-stone-600 bg-stone-50' 
              : 'border-gray-200 hover:border-gray-300'
          }`}
          onClick={() => setSelectedReport('mentorias')}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-stone-600 rounded-lg flex items-center justify-center">
              <FontAwesomeIcon icon={faHandshake} className="h-5 w-5 text-white" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Relatório de Mentorias</h4>
              <p className="text-sm text-gray-600">Histórico de sessões realizadas</p>
            </div>
          </div>
          <div className="text-xs text-gray-500">
            Inclui: datas, status, avaliações, diagnósticos e resultados
          </div>
        </div>
      </div>
    </div>
  )

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
              <SelectItem value="">Todos os status</SelectItem>
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
              <SelectItem value="">Todos os tipos</SelectItem>
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
          {!selectedReport && renderReportSelection()}
          
          {selectedReport === 'mentores' && (
            <>
              {renderMentoresFilters()}
              <Separator className="my-6" />
            </>
          )}
          
          {selectedReport === 'mentorias' && (
            <>
              {renderMentoriasFilters()}
              <Separator className="my-6" />
            </>
          )}

          {selectedReport && (
            <div className="flex items-center justify-between pt-4">
              <Button
                variant="outline"
                onClick={() => setSelectedReport(null)}
                disabled={isExporting}
              >
                <FontAwesomeIcon icon={faTimes} className="h-4 w-4 mr-2" />
                Voltar
              </Button>
              
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  onClick={handleClose}
                  disabled={isExporting}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleExport}
                  disabled={isExporting}
                  className="bg-stone-600 hover:bg-stone-700"
                >
                  {isExporting ? (
                    <FontAwesomeIcon icon={faSpinner} className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <FontAwesomeIcon icon={faDownload} className="h-4 w-4 mr-2" />
                  )}
                  {isExporting ? 'Exportando...' : 'Exportar CSV'}
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
