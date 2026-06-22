import { leadsDb, Lead, delay } from './db'

export async function getLeads(): Promise<Lead[]> {
  await delay(150);
  return [...leadsDb];
}

export async function getLeadById(id: number): Promise<Lead | undefined> {
  await delay(100);
  return leadsDb.find(l => l.id === id);
}

export async function createLead(input: Omit<Lead, 'id' | 'loadScore' | 'LastFollowUpAt' | 'callNotes' | 'createdAt'>): Promise<Lead> {
  await delay(200);
  const newLead: Lead = {
    ...input,
    id: leadsDb.length > 0 ? Math.max(...leadsDb.map(l => l.id)) + 1 : 1,
    loadScore: Math.floor(Math.random() * 40) + 60, // Random score between 60-100
    LastFollowUpAt: null,
    callNotes: [],
    createdAt: new Date().toISOString().split('T')[0]
  };
  leadsDb.unshift(newLead);
  return newLead;
}

export async function updateLeadFollowUp(id: number, nextFollowUpAt: string | null, note?: string): Promise<Lead | undefined> {
  await delay(150);
  const leadIndex = leadsDb.findIndex(l => l.id === id);
  if (leadIndex === -1) return undefined;

  const lead = leadsDb[leadIndex];
  lead.nextFollowUpAt = nextFollowUpAt;
  lead.LastFollowUpAt = new Date().toISOString().split('T')[0];

  if (note) {
    lead.callNotes.unshift({
      id: `n-${Date.now()}`,
      note,
      timestamp: new Date().toISOString(),
      author: 'Rahul Sharma' // Default coordinator/exec
    });
  }

  leadsDb[leadIndex] = { ...lead };
  return leadsDb[leadIndex];
}
