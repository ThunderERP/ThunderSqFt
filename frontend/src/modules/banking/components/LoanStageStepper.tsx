import { LoanStage } from '../types/loanFile'
import StatusBadge from '../../shared/components/StatusBadge'

interface LoanStageStepperProps {
  stage: LoanStage
}

const STAGES: LoanStage[] = [
  'PD Pending',
  'Document Pending',
  'Login Pending',
  'Credit Query',
  'Sanction Pending',
  'Sanction Approved',
  'Registration Pending',
  'Disbursement Pending',
  'Disbursed'
]

export default function LoanStageStepper({ stage }: LoanStageStepperProps) {
  const currentIdx = STAGES.indexOf(stage)

  return (
    <div className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] p-6 my-6 rounded-lg shadow-card overflow-x-auto text-[var(--ink)]">
      <div className="min-w-[800px] py-2">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-[var(--ink-soft)] font-display">Loan Processing Pipeline</h4>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-[var(--ink-soft)]">Current Stage:</span>
            <StatusBadge status={stage} />
          </div>
        </div>

        {/* Stepper Steps */}
        <div className="relative flex justify-between items-center w-full px-2">
          {STAGES.map((step, idx) => {
            const isCompleted = idx < currentIdx
            const isCurrent = stage === step

            let circleBg = 'var(--bg-surface)'
            let circleBorder = '1px solid var(--border-color)'
            let circleTextColor = 'var(--ink-soft)'
            let labelWeightClass = 'font-normal text-[var(--ink-soft)]'
            let labelColor = undefined

            if (isCompleted) {
              circleBg = 'var(--success)'
              circleBorder = '1px solid var(--success)'
              circleTextColor = '#FFFFFF'
              labelWeightClass = 'font-semibold text-[var(--ink)]'
            } else if (isCurrent) {
              circleBg = 'var(--accent)'
              circleBorder = '1px solid var(--accent)'
              circleTextColor = '#FFFFFF'
              labelWeightClass = 'font-semibold text-[var(--accent)] animate-none'
              labelColor = 'var(--accent)'
            }

            return (
              <div key={step} className="flex-1 flex flex-col items-center relative">
                {/* Connector Line */}
                {idx < STAGES.length - 1 && (
                  <div 
                    className="absolute left-[50%] top-[14px] right-[-50%] h-0.5 z-0"
                    style={{
                      backgroundColor: isCompleted ? 'var(--success)' : 'var(--border-color)'
                    }}
                  />
                )}

                {/* Circle */}
                <div className="relative z-10 flex items-center justify-center">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 font-mono"
                    style={{
                      background: circleBg,
                      border: circleBorder,
                      color: circleTextColor,
                    }}
                  >
                    {isCompleted ? '✓' : idx + 1}
                  </div>
                </div>

                {/* Label */}
                <span
                  className={`text-[10px] text-center mt-2 max-w-[85px] break-words leading-tight select-none ${labelWeightClass}`}
                  style={{ color: labelColor }}
                >
                  {step}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
