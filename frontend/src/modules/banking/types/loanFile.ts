export type LoanStage =
  | 'PD Pending' | 'Document Pending' | 'Login Pending' | 'Credit Query'
  | 'Sanction Pending' | 'Sanction Approved' | 'Registration Pending'
  | 'Disbursement Pending' | 'Disbursed'

export type DocStatus = 'Pending' | 'Received'

export interface DocumentChecklist {
  panCard: DocStatus
  aadhaarCard: DocStatus
  incomeProof: DocStatus
  bankStatement: DocStatus
  salarySlip: DocStatus
  itr: DocStatus
  propertyDocuments: DocStatus
}

export interface LoanFile {
  id: number
  customerName: string
  mobile: string
  projectName: string
  loanAmount: number
  bankName: string
  bankerName: string
  salesExecutive: string
  loanCoordinator: string
  stage: LoanStage
  branch: string
  documents: DocumentChecklist
  stageHistory: { stage: LoanStage; date: string }[]
}

export function getLoanHealth(stage: LoanStage): 'good' | 'waiting' | 'stuck' {
  if (stage === 'Disbursed') return 'good'
  if (stage === 'Credit Query') return 'stuck'
  return 'waiting'
}
