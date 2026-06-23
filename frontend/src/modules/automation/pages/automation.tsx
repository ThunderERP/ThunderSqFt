import { useState } from 'react'
import { useAutomation } from '../../../hooks/useAutomation'
import { 
  Clock, RefreshCw, Send, Radio, Link as LinkIcon, AlertCircle, CheckCircle2, ShieldAlert
} from 'lucide-react'
import { PageTransition, StaggerList, StaggerItem } from '../../shared/components/MotionComponents'
import PageHeader from '../../shared/components/PageHeader'
import StatusBadge from '../../shared/components/StatusBadge'

export default function AutomationCenter() {
  const { rules, loading, error, toggleRule, refetch } = useAutomation()
  const [togglingId, setTogglingId] = useState<number | null>(null)

  const handleToggle = async (id: number) => {
    setTogglingId(id)
    try {
      await toggleRule(id)
    } catch (err) {
      console.error(err)
    } finally {
      setTogglingId(null)
    }
  }

  return (
    <PageTransition>
      <div className="p-6 max-w-[1600px] mx-auto space-y-6 text-[var(--ink)]">
        <PageHeader
          title="Automation Center"
          subtitle="Configure real-time integrations and scheduled reminders via Zapier & WhatsApp Business API"
          actions={
            <button 
              onClick={refetch}
              className="flex items-center gap-2 px-4 py-2 border border-[var(--border-color)] bg-transparent text-[var(--ink)] hover:bg-[var(--bg-surface)] rounded-xl font-semibold text-sm transition-all shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
              Sync Status
            </button>
          }
        />

        {loading && rules.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-56 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] p-6 space-y-4 animate-pulse">
                <div className="flex justify-between items-center">
                  <div className="w-12 h-12 bg-[var(--bg-surface)] rounded-xl"></div>
                  <div className="w-12 h-6 bg-[var(--bg-surface)] rounded-full"></div>
                </div>
                <div className="h-4 bg-[var(--bg-surface)] rounded w-2/3"></div>
                <div className="h-3 bg-[var(--bg-surface)] rounded w-full"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-12 text-center text-[var(--danger)] font-semibold rounded-lg mt-6">
            Error: {error}
          </div>
        ) : (
          <StaggerList className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-6">
            {rules.map((rule) => {
              return (
                <StaggerItem key={rule.id}>
                  <div 
                    className={`bg-[var(--bg-card)] border border-[var(--border-color)] p-6 flex flex-col justify-between min-h-[240px] rounded-lg shadow-card hover:shadow-hover hover:border-[var(--border-hover)] relative transition-all duration-300 ${
                      rule.isActive 
                        ? 'opacity-100' 
                        : 'opacity-50'
                    }`}
                  >
                    {/* Gradient active bar */}
                    {rule.isActive && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[var(--accent)] to-[var(--gold)] rounded-l-lg" />
                    )}

                    <div>
                      <div className="flex items-start justify-between mb-4">
                        {/* Icon container */}
                        <div className="flex items-center gap-3">
                          <span className="text-2xl p-2 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] shrink-0">
                            {rule.icon}
                          </span>
                          <div>
                            <h3 className="text-base font-bold text-[var(--ink)] font-display">
                              {rule.name}
                            </h3>
                            <div className="flex flex-wrap items-center gap-1.5 mt-1">
                              <StatusBadge status={rule.channel} />
                              <StatusBadge status={rule.via} />
                            </div>
                          </div>
                        </div>

                        {/* Toggle Switch */}
                        <button
                          onClick={() => handleToggle(rule.id)}
                          disabled={togglingId === rule.id}
                          className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] ${
                            rule.isActive ? 'bg-[var(--success)]' : 'bg-[var(--border-color)]'
                          }`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                              rule.isActive ? 'translate-x-5' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </div>

                      {/* Description */}
                      <p className="text-sm text-[var(--ink-soft)] leading-relaxed font-medium mb-4">
                        {rule.description}
                      </p>

                      {/* Trigger → Action Readable Row */}
                      <div className="flex flex-col gap-2 text-xs mb-4">
                        <div className="flex items-center gap-2 text-[var(--ink-soft)] bg-[var(--bg-surface)] px-3 py-1.5 rounded-lg border border-[var(--border-color)]/60">
                          <span className="font-bold text-[9px] text-[var(--ink-muted)] uppercase tracking-wider">WHEN</span> 
                          <span className="font-mono">{rule.schedule}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[var(--accent)] bg-[var(--accent-soft)] px-3 py-1.5 rounded-lg border border-[var(--accent)]/10">
                          <span className="font-bold text-[9px] uppercase tracking-wider">THEN</span> 
                          <span>Execute webhook trigger</span>
                        </div>
                      </div>

                      {/* Endpoint info */}
                      <div className="bg-[var(--bg-surface)]/50 border border-[var(--border-color)]/60 rounded-lg p-2 mb-4 flex items-center gap-2">
                        <LinkIcon size={12} className="text-[var(--ink-muted)]" />
                        <code className="text-[10px] text-[var(--ink-soft)] select-all font-mono truncate block max-w-full">
                          {rule.endpoint}
                        </code>
                      </div>
                    </div>

                    {/* Footer Details */}
                    <div className="flex items-center justify-between text-xs font-semibold text-[var(--ink-muted)] border-t border-[var(--border-color)] pt-3">
                      <div className="flex items-center gap-1.5 font-mono">
                        <Clock size={13} />
                        <span>Run: {rule.schedule}</span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {rule.lastStatus === 'success' ? (
                          <CheckCircle2 size={13} className="text-[var(--success)]" />
                        ) : rule.lastStatus === 'skipped' ? (
                          <Radio size={13} className="text-[var(--ink-soft)]" />
                        ) : (
                          <AlertCircle size={13} className="text-[var(--danger)]" />
                        )}
                        <span className="capitalize font-mono">{rule.lastStatus || 'inactive'}</span>
                      </div>
                    </div>
                  </div>
                </StaggerItem>
              )
            })}
          </StaggerList>
        )}

        {/* Zapier Connection Guide Box */}
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-6 rounded-lg shadow-card">
          <h3 className="text-base font-bold text-[var(--ink)] mb-3 flex items-center gap-2 font-display uppercase tracking-wider">
            <span>🔁</span> Zapier Webhook Setup Instructions
          </h3>
          <p className="text-sm text-[var(--ink-soft)] leading-relaxed mb-4">
            To activate these workflows on Zapier, create multi-step Zaps utilizing <strong>Schedule by Zapier</strong> or <strong>Webhooks by Zapier</strong> as triggers. Point actions to the corresponding API endpoint using your dedicated <code>ZAPIER_API_KEY</code> header for Bearer authentication.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
            <div className="p-3 bg-[var(--bg-surface)]/60 rounded-lg border border-[var(--border-color)]/50">
              <span className="font-bold text-[var(--accent)]">1. TRIGGER</span>
              <p className="text-[var(--ink-muted)] mt-1">Set scheduler cron (e.g. Daily 9 AM) or Catch Webhook URL.</p>
            </div>
            <div className="p-3 bg-[var(--bg-surface)]/60 rounded-lg border border-[var(--border-color)]/50">
              <span className="font-bold text-[var(--gold)]">2. AUTH HEADER</span>
              <p className="text-[var(--ink-muted)] mt-1">Pass <code>Authorization: Bearer dev-zapier-key</code></p>
            </div>
            <div className="p-3 bg-[var(--bg-surface)]/60 rounded-lg border border-[var(--border-color)]/50">
              <span className="font-bold text-[var(--success)]">3. WHATSAPP API</span>
              <p className="text-[var(--ink-muted)] mt-1">Loop and dispatch message payloads to the WhatsApp Business API.</p>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  )
}
