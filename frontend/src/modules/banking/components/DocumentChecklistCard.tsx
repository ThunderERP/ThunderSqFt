import { DocumentChecklist } from '../types/loanFile'
import StatusBadge from '../../shared/components/StatusBadge'

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
  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-6 rounded-lg shadow-card h-full text-[var(--ink)]">
      <h3 className="text-sm font-bold uppercase text-[var(--ink-soft)] tracking-wider mb-4 font-display">
        Document Checklist
      </h3>

      <div className="flex flex-col divide-y divide-[var(--border-color)]">
        {(Object.keys(docLabels) as Array<keyof DocumentChecklist>).map((key) => {
          const status = documents[key]

          return (
            <div
              key={key}
              onClick={() => onToggle?.(key)}
              className="flex items-center justify-between py-3 cursor-pointer hover:bg-[var(--bg-hover)] px-2 -mx-2 rounded-lg transition-colors"
            >
              <span className="text-sm font-semibold text-[var(--ink)]">{docLabels[key]}</span>
              
              <StatusBadge status={status} />
            </div>
          )
        })}
      </div>
    </div>
  )
}
