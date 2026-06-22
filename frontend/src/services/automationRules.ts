import { automationRulesDb, AutomationRule, delay } from './db'

export async function getAutomationRules(): Promise<AutomationRule[]> {
  await delay(150);
  return [...automationRulesDb];
}

export async function toggleAutomationRule(id: number): Promise<AutomationRule | undefined> {
  await delay(100);
  const ruleIndex = automationRulesDb.findIndex(r => r.id === id);
  if (ruleIndex === -1) return undefined;

  const rule = automationRulesDb[ruleIndex];
  rule.isActive = !rule.isActive;
  automationRulesDb[ruleIndex] = { ...rule };
  return automationRulesDb[ruleIndex];
}
