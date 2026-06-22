import { siteVisitsDb, SiteVisit, delay } from './db'

export async function getSiteVisits(): Promise<SiteVisit[]> {
  await delay(150);
  return [...siteVisitsDb];
}

export async function createSiteVisit(input: Omit<SiteVisit, 'id'>): Promise<SiteVisit> {
  await delay(150);
  const newVisit: SiteVisit = {
    ...input,
    id: siteVisitsDb.length > 0 ? Math.max(...siteVisitsDb.map(v => v.id)) + 1 : 1
  };
  siteVisitsDb.unshift(newVisit);
  return newVisit;
}
