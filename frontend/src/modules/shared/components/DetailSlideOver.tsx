import { ReactNode, useEffect, useState } from 'react'
import { X, Pencil, Save, Check } from 'lucide-react'

/* ------------------------------------------------------------------ */
/*  Types                                                             */
/* ------------------------------------------------------------------ */
interface DetailField {
  label: string
  value: ReactNode
  fullWidth?: boolean
  /** If provided, this field becomes editable via the given config */
  editable?: {
    key: string
    type: 'text' | 'select' | 'date' | 'number' | 'textarea'
    options?: string[]            // for 'select' type
    placeholder?: string
    min?: number
    max?: number
  }
}

interface DetailSlideOverProps {
  isOpen: boolean
  onClose: () => void
  title: string
  subtitle?: string
  avatar?: ReactNode
  fields: DetailField[]
  actions?: ReactNode
  statusBadge?: ReactNode
  /** If provided, enables the Edit button. Called with changed values on save. */
  onSave?: (values: Record<string, any>) => void
  /** Current raw values of editable fields (keyed by editable.key) */
  editValues?: Record<string, any>
}

/* ------------------------------------------------------------------ */
/*  Input class helpers                                               */
/* ------------------------------------------------------------------ */
const inputCls =
  'w-full bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--ink)] placeholder-[var(--ink-muted)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 focus:border-[var(--accent)] transition-all'

const selectCls =
  'w-full bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--ink)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 focus:border-[var(--accent)] cursor-pointer transition-all'

/* ------------------------------------------------------------------ */
/*  Toast (inline)                                                    */
/* ------------------------------------------------------------------ */
function SaveToast({ onDismiss }: { onDismiss: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 2500)
    return () => clearTimeout(t)
  }, [onDismiss])

  return (
    <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-[60] flex items-center gap-2 px-4 py-2.5 rounded-lg border border-emerald-500/40 bg-emerald-500/10 text-emerald-400 shadow-lg backdrop-blur-sm animate-slide-in-right">
      <Check size={14} />
      <span className="text-sm font-medium">Changes saved successfully</span>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Component                                                         */
/* ------------------------------------------------------------------ */
export default function DetailSlideOver({
  isOpen,
  onClose,
  title,
  subtitle,
  avatar,
  fields,
  actions,
  statusBadge,
  onSave,
  editValues,
}: DetailSlideOverProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [formValues, setFormValues] = useState<Record<string, any>>({})
  const [showSaveToast, setShowSaveToast] = useState(false)

  // Sync form values when panel opens or editValues change
  useEffect(() => {
    if (isOpen && editValues) {
      setFormValues({ ...editValues })
      setIsEditing(false)
    }
  }, [isOpen, editValues])

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isEditing) {
          setIsEditing(false)
          if (editValues) setFormValues({ ...editValues })
        } else {
          onClose()
        }
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isOpen, isEditing, onClose, editValues])

  if (!isOpen) return null

  const hasEditable = fields.some(f => f.editable) && onSave

  const handleFieldChange = (key: string, value: any) => {
    setFormValues(prev => ({ ...prev, [key]: value }))
  }

  const handleSave = () => {
    onSave?.(formValues)
    setIsEditing(false)
    setShowSaveToast(true)
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    if (editValues) setFormValues({ ...editValues })
  }

  const handleClose = () => {
    setIsEditing(false)
    if (editValues) setFormValues({ ...editValues })
    onClose()
  }

  /* -- Render editable input for a field -- */
  const renderEditInput = (field: DetailField) => {
    const cfg = field.editable!
    const val = formValues[cfg.key] ?? ''

    switch (cfg.type) {
      case 'select':
        return (
          <select
            value={val}
            onChange={e => handleFieldChange(cfg.key, e.target.value)}
            className={selectCls}
          >
            {cfg.options?.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        )
      case 'date':
        return (
          <input
            type="date"
            value={val}
            onChange={e => handleFieldChange(cfg.key, e.target.value)}
            className={inputCls}
          />
        )
      case 'number':
        return (
          <input
            type="number"
            value={val}
            min={cfg.min}
            max={cfg.max}
            placeholder={cfg.placeholder}
            onChange={e => handleFieldChange(cfg.key, Number(e.target.value))}
            className={inputCls}
          />
        )
      case 'textarea':
        return (
          <textarea
            value={val}
            placeholder={cfg.placeholder}
            onChange={e => handleFieldChange(cfg.key, e.target.value)}
            className={`${inputCls} min-h-[80px] resize-y`}
          />
        )
      default: // 'text'
        return (
          <input
            type="text"
            value={val}
            placeholder={cfg.placeholder}
            onChange={e => handleFieldChange(cfg.key, e.target.value)}
            className={inputCls}
          />
        )
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
        onClick={handleClose}
      />

      {/* Panel */}
      <div className="fixed inset-y-0 right-0 w-full md:w-[480px] bg-[var(--bg-card)] border-l border-[var(--border-color)] shadow-2xl z-50 flex flex-col animate-slide-in-right">
        {/* Header */}
        <div className="p-6 border-b border-[var(--border-color)]">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4 min-w-0">
              {avatar && (
                <div className="flex-shrink-0">{avatar}</div>
              )}
              <div className="min-w-0">
                <h2 className="text-xl font-bold text-[var(--ink)] font-display truncate">
                  {title}
                </h2>
                {subtitle && (
                  <p className="text-sm text-[var(--ink-muted)] font-mono mt-0.5 truncate">
                    {subtitle}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {hasEditable && !isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-1.5 border border-[var(--border-color)] hover:bg-[var(--accent)]/10 hover:border-[var(--accent)]/30 hover:text-[var(--accent)] rounded-full transition-colors text-[var(--ink-soft)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                  title="Edit details"
                >
                  <Pencil size={16} />
                </button>
              )}
              <button
                onClick={handleClose}
                className="p-1.5 border border-[var(--border-color)] hover:bg-[var(--bg-surface)] rounded-full transition-colors text-[var(--ink-soft)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
              >
                <X size={18} />
              </button>
            </div>
          </div>
          {/* Status badge + editing indicator */}
          <div className="mt-3 flex items-center gap-2">
            {statusBadge}
            {isEditing && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[var(--accent)]/10 border border-[var(--accent)]/20 text-[var(--accent)] text-[10px] font-bold uppercase tracking-wider">
                <Pencil size={10} /> Editing
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-2 gap-x-6 gap-y-5">
            {fields.map((field, idx) => (
              <div
                key={idx}
                className={field.fullWidth ? 'col-span-2' : ''}
              >
                <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--ink-muted)] mb-1.5">
                  {field.label}
                </div>
                {isEditing && field.editable ? (
                  renderEditInput(field)
                ) : (
                  <div className="text-sm font-medium text-[var(--ink)]">
                    {field.value}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        {isEditing ? (
          <div className="p-4 border-t border-[var(--border-color)] flex gap-3 mt-auto bg-[var(--bg-surface)]/50">
            <button
              onClick={handleSave}
              className="flex-[2] flex items-center justify-center gap-2 py-2.5 text-sm font-semibold bg-[var(--accent)] text-white rounded-lg hover:opacity-90 transition-all active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
            >
              <Save size={14} /> Save Changes
            </button>
            <button
              onClick={handleCancelEdit}
              className="flex-1 py-2.5 text-sm font-semibold text-[var(--ink-soft)] bg-transparent border border-[var(--border-color)] rounded-lg hover:bg-[var(--bg-surface)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
            >
              Cancel
            </button>
          </div>
        ) : actions ? (
          <div className="p-4 border-t border-[var(--border-color)] bg-[var(--bg-surface)]/50">
            {actions}
          </div>
        ) : null}

        {/* Save toast */}
        {showSaveToast && (
          <SaveToast onDismiss={() => setShowSaveToast(false)} />
        )}
      </div>
    </>
  )
}
