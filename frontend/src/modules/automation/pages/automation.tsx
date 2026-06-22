import { useState } from 'react'
import { useAutomation } from '../../../hooks/useAutomation'
import { 
  Clock, RefreshCw, Send, Radio, Link as LinkIcon, AlertCircle, CheckCircle2, ShieldAlert
} from 'lucide-react'
import { PageTransition, StaggerList, StaggerItem } from '../../shared/components/MotionComponents'
import PageHeader from '../../shared/components/PageHeader'

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
      <PageHeader
        title="Automation Center"
        subtitle="Configure real-time integrations and scheduled reminders via Zapier & WhatsApp Business API"
        actions={
          <button 
            onClick={refetch}
            className="btn-secondary flex items-center gap-2"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            Sync Status
          </button>
        }
      />

      {loading && rules.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-48 rounded-2xl bg-bg-card border border-border-color p-6 space-y-4 animate-pulse">
              <div className="flex justify-between items-center">
                <div className="w-12 h-12 bg-bg-surface rounded-xl"></div>
                <div className="w-12 h-6 bg-bg-surface rounded-full"></div>
              </div>
              <div className="h-4 bg-bg-surface rounded w-2/3"></div>
              <div className="h-3 bg-bg-surface rounded w-full"></div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="card p-12 text-center text-danger font-semibold mt-6">
          Error: {error}
        </div>
      ) : (
        <StaggerList className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-6">
          {rules.map((rule) => {
            const statusColor = rule.lastStatus === 'success' ? 'text-success' : 'text-danger'
            
            return (
              <StaggerItem key={rule.id}>
                <div 
                  className={`card p-6 flex flex-col justify-between min-h-[220px] relative transition-all duration-300 ${
                    rule.isActive 
                      ? 'border-l-4 border-l-accent' 
                      : 'opacity-70 bg-bg-surface'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between mb-4">
                      {/* Icon container */}
                      <div className="flex items-center gap-3">
                        <span className="text-3xl p-2 rounded-xl bg-bg-surface border border-border-color shrink-0">
                          {rule.icon}
                        </span>
                        <div>
                          <h3 className="text-base font-bold text-ink flex items-center gap-2">
                            {rule.name}
                          </h3>
                          <div className="flex items-center gap-1.5 mt-1">
                            <span className="badge badge-accent">
                              {rule.channel}
                            </span>
                            <span className="badge badge-gold">
                              {rule.via}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Toggle Switch */}
                      <button
                        onClick={() => handleToggle(rule.id)}
                        disabled={togglingId === rule.id}
                        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          rule.isActive ? 'bg-success' : 'bg-border-color'
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
                    <p className="text-sm text-ink-soft leading-relaxed font-medium mb-4">
                      {rule.description}
                    </p>

                    {/* Endpoint info */}
                    <div className="bg-bg-surface/50 border border-border-color/60 rounded-lg p-2 mb-4 flex items-center gap-2">
                      <LinkIcon size={12} className="text-ink-muted" />
                      <code className="text-xs text-ink-soft select-all font-mono">
                        {rule.endpoint}
                      </code>
                    </div>
                  </div>

                  {/* Footer Details */}
                  <div className="flex items-center gap-4 text-xs font-semibold text-ink-muted border-t border-border-color pt-3">
                    <div className="flex items-center gap-1.5">
                      <Clock size={13} />
                      <span className="font-mono">{rule.schedule}</span>
                    </div>

                    <div className="flex items-center gap-1.5 ml-auto">
                      {rule.lastStatus === 'success' ? (
                        <CheckCircle2 size={13} className="text-success" />
                      ) : rule.lastStatus === 'skipped' ? (
                        <Radio size={13} className="text-ink-muted" />
                      ) : (
                        <AlertCircle size={13} className="text-danger" />
                      )}
                      <span className="capitalize">{rule.lastStatus || 'inactive'}</span>
                    </div>
                  </div>
                </div>
              </StaggerItem>
            )
          })}
        </StaggerList>
      )}

      {/* Zapier Connection Guide Box */}
      <div className="card p-6 mt-8 bg-gradient-to-r from-bg-surface to-bg-card border border-border-color">
        <h3 className="text-base font-extrabold text-ink mb-3 flex items-center gap-2">
          <span>🔁</span> Zapier Webhook Setup Instructions
        </h3>
        <p className="text-sm text-ink-soft leading-relaxed mb-4">
          To activate these workflows on Zapier, create multi-step Zaps utilizing <strong>Schedule by Zapier</strong> or <strong>Webhooks by Zapier</strong> as triggers. Point actions to the corresponding API endpoint using your dedicated <code>ZAPIER_API_KEY</code> header for Bearer authentication.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-3 bg-bg-surface/60 rounded-lg border border-border-color/50">
            <span className="font-bold text-accent">1. Trigger</span>
            <p className="text-ink-muted mt-1">Set scheduler cron (e.g. Daily 9 AM) or Catch Webhook URL.</p>
          </div>
          <div className="p-3 bg-bg-surface/60 rounded-lg border border-border-color/50">
            <span className="font-bold text-gold">2. Auth Header</span>
            <p className="text-ink-muted mt-1">Pass <code>Authorization: Bearer dev-zapier-key</code></p>
          </div>
          <div className="p-3 bg-bg-surface/60 rounded-lg border border-border-color/50">
            <span className="font-bold text-success">3. WhatsApp API</span>
            <p className="text-ink-muted mt-1">Loop and dispatch message payloads to the WhatsApp Business API.</p>
          </div>
        </div>
      </div>
    </PageTransition>
  )
}
