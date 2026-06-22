import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AutomationService {
  constructor(private prisma: PrismaService) {}

  // Helper to map employees to their respective branch
  getEmployeeBranch(name: string): string {
    const branchMap: Record<string, string> = {
      'Gautam Singhania': 'Mumbai',
      'Rohan Kapoor': 'Mumbai',
      'Priya Mehta': 'Mumbai',
      'Rahul Sharma': 'Mumbai',
      'Amit Verma': 'Delhi',
      'Sneha Kapoor': 'Mumbai',
      'Anita Desai': 'Mumbai',
      'Rohan Gupta': 'Delhi',
      'Nisha Patel': 'Gurugram',
      'Kavya Joshi': 'Dubai',
    };
    return branchMap[name] || 'Head Office';
  }

  // Helper to log automation runs
  async logRuleRun(key: string, status: string, count: number, error?: string) {
    const rule = await this.prisma.automationRule.findUnique({ where: { key } });
    if (!rule) return;

    await this.prisma.automationRule.update({
      where: { id: rule.id },
      data: {
        lastRunAt: new Date(),
        lastStatus: status,
      },
    });

    await this.prisma.automationLog.create({
      data: {
        ruleId: rule.id,
        status,
        recipientCount: count,
        errorMessage: error || null,
      },
    });
  }

  // 1. Daily reminders for agents
  async getDailyReminders() {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    end.setHours(23, 59, 59, 999);

    const followups = await this.prisma.followUp.findMany({
      where: {
        status: 'PENDING',
        date: { gte: start, lte: end },
      },
      include: {
        lead: {
          include: {
            assignedEmployee: true,
          },
        },
      },
    });

    // Group by agent
    const agentsMap = new Map<number, { agentId: number; agentName: string; waNumber: string; leads: any[] }>();

    for (const f of followups) {
      const agent = f.lead.assignedEmployee;
      if (!agent) continue;

      if (!agentsMap.has(agent.id)) {
        agentsMap.set(agent.id, {
          agentId: agent.id,
          agentName: agent.name,
          waNumber: agent.phone || '',
          leads: [],
        });
      }

      agentsMap.get(agent.id)!.leads.push({
        leadName: f.lead.name,
        followUpTime: f.date.toISOString(),
      });
    }

    const result = Array.from(agentsMap.values());
    await this.logRuleRun('daily_reminder', 'success', result.length);
    return result;
  }

  // 2. Daily Summary report
  async getDailySummary(dateStr?: string) {
    const targetDate = dateStr ? new Date(dateStr) : new Date();
    const start = new Date(targetDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(targetDate);
    end.setHours(23, 59, 59, 999);

    // Fetch leads, followups completed, visits and bookings
    const [leads, followups, visits, bookings] = await Promise.all([
      this.prisma.lead.findMany({
        where: { createdAt: { gte: start, lte: end } },
        include: { assignedEmployee: true },
      }),
      this.prisma.followUp.findMany({
        where: { status: 'COMPLETED', updatedAt: { gte: start, lte: end } },
        include: { lead: { include: { assignedEmployee: true } } },
      }),
      this.prisma.siteVisit.findMany({
        where: { visitDate: { gte: start, lte: end } },
        include: { lead: { include: { assignedEmployee: true } } },
      }),
      this.prisma.booking.findMany({
        where: { bookingDate: { gte: start, lte: end } },
        include: { lead: { include: { assignedEmployee: true } } },
      }),
    ]);

    // Group by branch of assigned agent/employee
    const branchesMap = new Map<string, { name: string; newLeads: number; followupsDone: number; siteVisits: number; bookings: number; revenue: number }>();

    const getBranchStats = (branchName: string) => {
      if (!branchesMap.has(branchName)) {
        branchesMap.set(branchName, {
          name: branchName,
          newLeads: 0,
          followupsDone: 0,
          siteVisits: 0,
          bookings: 0,
          revenue: 0,
        });
      }
      return branchesMap.get(branchName)!;
    };

    leads.forEach((l) => {
      const b = l.assignedEmployee ? this.getEmployeeBranch(l.assignedEmployee.name) : 'Head Office';
      getBranchStats(b).newLeads++;
    });

    followups.forEach((f) => {
      const b = f.lead.assignedEmployee ? this.getEmployeeBranch(f.lead.assignedEmployee.name) : 'Head Office';
      getBranchStats(b).followupsDone++;
    });

    visits.forEach((v) => {
      const b = v.lead.assignedEmployee ? this.getEmployeeBranch(v.lead.assignedEmployee.name) : 'Head Office';
      getBranchStats(b).siteVisits++;
    });

    bookings.forEach((bk) => {
      const b = bk.lead?.assignedEmployee ? this.getEmployeeBranch(bk.lead.assignedEmployee.name) : 'Head Office';
      const stats = getBranchStats(b);
      stats.bookings++;
      stats.revenue += Number(bk.bookingAmount);
    });

    const branchesList = Array.from(branchesMap.values());
    const result = {
      date: start.toISOString().split('T')[0],
      branches: branchesList,
    };

    await this.logRuleRun('daily_report', 'success', branchesList.length);
    return result;
  }

  // 3. Monthly Performance report
  async getMonthlyReport(month: string, branchId?: string) {
    const start = new Date(`${month}-01T00:00:00.000Z`);
    const end = new Date(start.getFullYear(), start.getMonth() + 1, 0, 23, 59, 59, 999);

    const [leads, bookings] = await Promise.all([
      this.prisma.lead.findMany({
        where: { createdAt: { gte: start, lte: end } },
        include: { assignedEmployee: true },
      }),
      this.prisma.booking.findMany({
        where: { bookingDate: { gte: start, lte: end } },
        include: { lead: { include: { assignedEmployee: true } } },
      }),
    ]);

    // Filter by branch in-memory if branchId is specified
    const filteredLeads = branchId 
      ? leads.filter(l => l.assignedEmployee && this.getEmployeeBranch(l.assignedEmployee.name) === branchId)
      : leads;

    const filteredBookings = branchId
      ? bookings.filter(b => b.lead?.assignedEmployee && this.getEmployeeBranch(b.lead.assignedEmployee.name) === branchId)
      : bookings;

    const revenue = filteredBookings.reduce((sum, b) => sum + Number(b.bookingAmount), 0);
    const pdfUrl = `https://thunder-erp.s3.amazonaws.com/reports/monthly-${month}-${branchId || 'all'}.pdf`;

    const result = {
      month,
      branchId: branchId || 'ALL',
      newLeads: filteredLeads.length,
      bookings: filteredBookings.length,
      revenue,
      pdfUrl,
    };

    await this.logRuleRun('monthly_report', 'success', 1);
    return result;
  }

  // 4. Overdue followups
  async getOverdueFollowUps() {
    const now = new Date();
    const overdueFollowUps = await this.prisma.followUp.findMany({
      where: {
        status: 'PENDING',
        date: { lt: now },
      },
      include: {
        lead: {
          include: {
            assignedEmployee: true,
          },
        },
      },
    });

    const result = [];
    const allEmployees = await this.prisma.employee.findMany();

    for (const f of overdueFollowUps) {
      const agent = f.lead.assignedEmployee;
      if (!agent) continue;

      const diffMs = now.getTime() - f.date.getTime();
      const minutesOverdue = Math.floor(diffMs / 60000);

      const agentBranch = this.getEmployeeBranch(agent.name);

      // Find branch manager
      const manager = allEmployees.find(
        (e) => this.getEmployeeBranch(e.name) === agentBranch && (e.department === 'MANAGEMENT' || e.department === 'EXECUTIVE'),
      );

      result.push({
        followUpId: f.id,
        agentName: agent.name,
        waNumber: agent.phone || '',
        leadName: f.lead.name,
        scheduledAt: f.date.toISOString(),
        minutesOverdue,
        managerId: manager?.id || null,
        managerWaNumber: manager?.phone || '',
      });
    }

    await this.logRuleRun('missed_followup', 'success', result.length);
    return result;
  }

  // 5. Birthdays today
  async getBirthdaysToday() {
    const today = new Date();
    const tMonth = today.getMonth() + 1;
    const tDay = today.getDate();

    const contacts = await this.prisma.contact.findMany({
      where: { waOptIn: true },
    });

    const result = contacts
      .filter((c) => {
        if (!c.dateOfBirth) return false;
        const dob = new Date(c.dateOfBirth);
        return dob.getMonth() + 1 === tMonth && dob.getDate() === tDay;
      })
      .map((c) => ({
        contactId: c.id,
        name: c.name,
        waNumber: c.waNumber || '',
        dob: c.dateOfBirth!.toISOString().split('T')[0],
      }));

    await this.logRuleRun('birthday', 'success', result.length);
    return result;
  }

  // 6. Anniversaries today
  async getAnniversariesToday() {
    const today = new Date();
    const tMonth = today.getMonth() + 1;
    const tDay = today.getDate();

    const contacts = await this.prisma.contact.findMany({
      where: { waOptIn: true },
    });

    const result = contacts
      .filter((c) => {
        if (!c.anniversary) return false;
        const ann = new Date(c.anniversary);
        return ann.getMonth() + 1 === tMonth && ann.getDate() === tDay;
      })
      .map((c) => ({
        contactId: c.id,
        name: c.name,
        waNumber: c.waNumber || '',
        anniversaryDate: c.anniversary!.toISOString().split('T')[0],
      }));

    await this.logRuleRun('anniversary', 'success', result.length);
    return result;
  }
}
