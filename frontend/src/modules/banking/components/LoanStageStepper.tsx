import { LoanStage, getLoanHealth } from '../types/loanFile'
import { getPulseColor } from '../../shared/utils/statusColor'

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

  // Get current stage's health color mapping
  const currentHealth = getLoanHealth(stage)
  const currentColors = getPulseColor(currentHealth)

  return (
    <div className="w-full neu-card p-6 bg-white my-6 overflow-x-auto">
      <div className="min-w-[800px] py-2">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-[var(--ink-soft)]">Loan Processing Pipeline</h4>
          </div>
          <div 
            className="text-xs font-bold px-3 py-1 rounded"
            style={{
              color: currentColors.color,
              backgroundColor: currentColors.bg,
            }}
          >
            Current Stage: {stage}
          </div>
        </div>

        {/* Stepper Steps */}
        <div className="relative flex justify-between items-center w-full px-2">
          {STAGES.map((step, idx) => {
            const isCompleted = idx < currentIdx
            const isCurrent = stage === step
            const isFuture = idx > currentIdx

            let circleBg = 'transparent'
            let circleBorder = '1px solid var(--hairline)'
            let circleTextColor = 'var(--ink-soft)'
            let labelWeightClass = 'font-normal text-[var(--ink-soft)]'
            let labelColor = undefined

            if (isCompleted) {
              circleBg = 'var(--status-good)'
              circleBorder = '1px solid var(--status-good)'
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
                      backgroundColor: isCompleted ? 'var(--status-good)' : 'var(--hairline)'
                    }}
                  />
                )}

                {/* Circle */}
                <div className="relative z-10 flex items-center justify-center">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300"
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
