import { loanFilesDb, LoanFile, delay } from './db'

export async function getLoanFiles(): Promise<LoanFile[]> {
  await delay(150);
  return [...loanFilesDb];
}

export async function getLoanFileById(id: number): Promise<LoanFile | undefined> {
  await delay(100);
  return loanFilesDb.find(f => f.id === id);
}

export async function createLoanFile(input: Omit<LoanFile, 'id' | 'documents' | 'disbursedAt'>): Promise<LoanFile> {
  await delay(200);
  const newFile: LoanFile = {
    ...input,
    id: loanFilesDb.length > 0 ? Math.max(...loanFilesDb.map(f => f.id)) + 1 : 1,
    documents: { pan: false, aadhaar: false, incomeTax: false, bankStatement: false, salarySlip: false, ITR: false, propertyDocs: false },
    disbursedAt: null
  };
  loanFilesDb.unshift(newFile);
  return newFile;
}

export async function updateLoanFileStage(id: number, stage: LoanFile['stage']): Promise<LoanFile | undefined> {
  await delay(150);
  const fileIndex = loanFilesDb.findIndex(f => f.id === id);
  if (fileIndex === -1) return undefined;

  const file = loanFilesDb[fileIndex];
  file.stage = stage;
  if (stage === 'Disbursed') {
    file.disbursedAt = new Date().toISOString().split('T')[0];
  } else {
    file.disbursedAt = null;
  }

  loanFilesDb[fileIndex] = { ...file };
  return loanFilesDb[fileIndex];
}

export async function updateLoanFileDocuments(id: number, documents: Record<string, boolean>): Promise<LoanFile | undefined> {
  await delay(150);
  const fileIndex = loanFilesDb.findIndex(f => f.id === id);
  if (fileIndex === -1) return undefined;

  const file = loanFilesDb[fileIndex];
  file.documents = { ...file.documents, ...documents };
  loanFilesDb[fileIndex] = { ...file };
  return loanFilesDb[fileIndex];
}
