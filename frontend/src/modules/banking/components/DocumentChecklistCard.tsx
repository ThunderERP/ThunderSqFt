import { DocumentChecklist } from '../types/loanFile'
import { getPulseColor } from '../../shared/utils/statusColor'

interface DocumentChecklistCardProps {
  documents: DocumentChecklist
  onToggle?: (key: keyof DocumentChecklist) => void
}

const docLabels: Record<keyof DocumentChecklist, string> = {
  panCard: 'PAN Card Copy',
  aadhaarCard: 'Aadhaar Card Copy',
  incomeProof: 'Income Proof / Form 16',
  bankStatement: '6 Months Bank Statement',
  salarySlip: '3 Months Salary Slips',
  itr: 'Last 2 Years ITR',
  propertyDocuments: 'Property Chain Documents'
}

export default function DocumentChecklistCard({ documents, onToggle }: DocumentChecklistCardProps) {
  const goodColors = getPulseColor('good')
  const waitingColors = getPulseColor('waiting')

  return (
    <div className="neu-card p-6 bg-white h-full">
      <h3 className="text-sm font-bold uppercase text-[var(--ink-soft)] tracking-wider mb-4">
        Document Checklist
      </h3>

      <div className="hairline-divide flex flex-col">
        {(Object.keys(docLabels) as Array<keyof DocumentChecklist>).map((key) => {
          const status = documents[key]
          const isReceived = status === 'Received'

          return (
            <div
              key={key}
              onClick={() => onToggle?.(key)}
              className="flex items-center justify-between py-3 cursor-pointer hover:bg-[var(--canvas)] px-2 -mx-2 rounded-lg transition-colors"
            >
              <span className="text-sm font-semibold text-[var(--ink)]">{docLabels[key]}</span>
              
              <span 
                className="text-[11px] font-bold px-2.5 py-0.5 rounded-lg select-none"
                style={{
                  color: isReceived ? goodColors.color : waitingColors.color,
                  backgroundColor: isReceived ? goodColors.bg : waitingColors.bg,
                }}
              >
                {status}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
