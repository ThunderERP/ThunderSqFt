import { useState } from 'react'
import { PageTransition, StaggerContainer, StaggerItem } from '../../shared/components/MotionComponents'
import { ChevronDown, Users, Trophy, TrendingUp, ArrowUpDown, ArrowUp, ArrowDown, Search, Building2, UserCheck, UserX, Mail, Briefcase, MapPin, Calendar, Shield } from 'lucide-react'
import PageHeader from '../../shared/components/PageHeader'
import StatCard from '../../shared/components/StatCard'
import StatusBadge from '../../shared/components/StatusBadge'
import DataTable from '../../shared/components/DataTable'
import DetailSlideOver from '../../shared/components/DetailSlideOver'

const initialEmployees = [
  { id: '1', name: 'Rohit Verma', email: 'exec1@propflow.com', department: 'Sales', designation: 'Senior Sales Executive', branch: 'Mumbai Central', role: 'sales executive', joined: '2022-01-15', status: 'Active' },
  { id: '5', name: 'Alok Singh', email: 'alok.s@propflow.com', department: 'Operations', designation: 'Operations Head', branch: 'Mumbai Central', role: 'operations manager', joined: '2020-05-12', status: 'Active' },
  { id: '6', name: 'Neha Sharma', email: 'neha.s@propflow.com', department: 'Customer Success', designation: 'CRM Executive', branch: 'Pune HQ', role: 'crm', joined: '2023-01-10', status: 'Active' },
  { id: '7', name: 'Priya Patel', email: 'priya.p@propflow.com', department: 'Marketing', designation: 'Marketing Manager', branch: 'Mumbai Central', role: 'marketing', joined: '2021-11-05', status: 'Active' },
  { id: '8', name: 'Karan Malhotra', email: 'karan.m@propflow.com', department: 'Sales', designation: 'Sales Executive', branch: 'Pune HQ', role: 'sales executive', joined: '2024-02-15', status: 'On Leave' },
  { id: '9', name: 'Nisha Desai', email: 'nisha.d@propflow.com', department: 'HR', designation: 'HR Associate', branch: 'Mumbai Central', role: 'hr', joined: '2023-08-20', status: 'Active' },
  { id: '4', name: 'Meera Nair', email: 'banking@propflow.com', department: 'Banking', designation: 'Senior Banking Coordinator', branch: 'Mumbai Central', role: 'banking executive', joined: '2021-06-10', status: 'Active' },
  { id: '5b', name: 'Sanjay Gupta', email: 'banking2@propflow.com', department: 'Banking', designation: 'Banking Coordinator', branch: 'Pune HQ', role: 'banking executive', joined: '2022-11-05', status: 'Active' },
  { id: '6b', name: 'Neha Sharma', email: 'hr1@propflow.com', department: 'HR', designation: 'HR Manager', branch: 'Mumbai Central', role: 'hr manager', joined: '2020-04-12', status: 'Active' },
  { id: '7b', name: 'Vikram Singh', email: 'salesmgr@propflow.com', department: 'Sales', designation: 'Sales Manager', branch: 'Bangalore South', role: 'manager', joined: '2021-09-01', status: 'Active' },
  { id: '8b', name: 'Priya Desai', email: 'marketing@propflow.com', department: 'Marketing', designation: 'Marketing Executive', branch: 'Mumbai Central', role: 'marketing executive', joined: '2023-01-10', status: 'Active' },
  { id: '10', name: 'Smriti Mandhana', email: 'exec4@propflow.com', department: 'Sales', designation: 'Sales Executive', branch: 'Bangalore South', role: 'sales executive', joined: '2024-02-01', status: 'On Leave' },
  { id: '11', name: 'Jasprit Bumrah', email: 'exec5@propflow.com', department: 'Sales', designation: 'Sales Executive', branch: 'Delhi NCR', role: 'sales executive', joined: '2023-11-15', status: 'Active' },
  { id: '12', name: 'Virat Kohli', email: 'director@propflow.com', department: 'Management', designation: 'Director', branch: 'Mumbai Central', role: 'admin', joined: '2019-01-01', status: 'Active' },
  { id: '13', name: 'MS Dhoni', email: 'ms.dhoni@propflow.com', department: 'Operations', designation: 'Operations Manager', branch: 'Hyderabad Tech Park', role: 'operations manager', joined: '2020-03-15', status: 'Active' },
  { id: '14', name: 'Sachin Tendulkar', email: 'sachin.t@propflow.com', department: 'Management', designation: 'VP Sales', branch: 'Mumbai Central', role: 'admin', joined: '2018-05-20', status: 'On Leave' },
  { id: '15', name: 'Rahul Dravid', email: 'rahul.d@propflow.com', department: 'HR', designation: 'HR Head', branch: 'Bangalore South', role: 'hr manager', joined: '2019-11-10', status: 'Active' },
  { id: '16', name: 'Sourav Ganguly', email: 'sourav.g@propflow.com', department: 'Marketing', designation: 'Marketing Head', branch: 'Delhi NCR', role: 'marketing', joined: '2021-02-25', status: 'Active' },
  { id: '17', name: 'Yuvraj Singh', email: 'yuvraj.s@propflow.com', department: 'Sales', designation: 'Sales Manager', branch: 'Pune HQ', role: 'manager', joined: '2022-08-05', status: 'Inactive' },
  { id: '18', name: 'Virender Sehwag', email: 'virender.s@propflow.com', department: 'Customer Success', designation: 'CRM Head', branch: 'Delhi NCR', role: 'crm', joined: '2020-09-12', status: 'Active' },
  { id: '19', name: 'Zaheer Khan', email: 'zaheer.k@propflow.com', department: 'Banking', designation: 'Banking Head', branch: 'Mumbai Central', role: 'banking executive', joined: '2021-04-18', status: 'Active' },
  { id: '20', name: 'Harbhajan Singh', email: 'harbhajan.s@propflow.com', department: 'Operations', designation: 'Operations Executive', branch: 'Pune HQ', role: 'operations manager', joined: '2023-06-30', status: 'Active' },
]

function getInitials(name: string) {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
}

const avatarColors = [
  'bg-blue-600/30 text-blue-400 border-blue-500/20',
  'bg-emerald-600/30 text-emerald-400 border-emerald-500/20',
  'bg-purple-600/30 text-purple-400 border-purple-500/20',
  'bg-orange-600/30 text-orange-400 border-orange-500/20',
  'bg-pink-600/30 text-pink-400 border-pink-500/20',
]
function getAvatarColor(name: string) {
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return avatarColors[Math.abs(hash) % avatarColors.length]
}

export default function EmployeeDirectory() {
  const [employees, setEmployees] = useState(initialEmployees)
  const [activeTab, setActiveTab] = useState('Team List')
  const [branchFilter, setBranchFilter] = useState('All Branches');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState<typeof initialEmployees[0] | null>(null);
  
  type SortField = 'name' | 'email' | 'department' | 'designation' | 'branch' | 'role' | 'joined' | 'status' | null;
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      if (sortDirection === 'asc') setSortDirection('desc');
      else setSortField(null);
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <ArrowUpDown size={14} className="text-[var(--ink-muted)]" />;
    return sortDirection === 'asc' ? <ArrowUp size={14} className="text-[var(--accent)]" /> : <ArrowDown size={14} className="text-[var(--accent)]" />;
  };

  let filteredEmployees = employees.filter(emp => {
    const matchesBranch = branchFilter === 'All Branches' || emp.branch === branchFilter;
    const matchesSearch = !searchQuery || emp.name.toLowerCase().includes(searchQuery.toLowerCase()) || emp.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesBranch && matchesSearch;
  });

  if (sortField) {
    filteredEmployees.sort((a, b) => {
      const aVal = String(a[sortField] || '');
      const bVal = String(b[sortField] || '');
      const comparison = aVal.localeCompare(bVal);
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }

  const activeCount = employees.filter(e => e.status === 'Active').length;
  const onLeaveCount = employees.filter(e => e.status === 'On Leave').length;
  const branches = [...new Set(employees.map(e => e.branch))];

  const DEPARTMENTS = [...new Set(initialEmployees.map(e => e.department))]
  const BRANCHES = [...new Set(initialEmployees.map(e => e.branch))]

  const handleSaveEmployee = (values: Record<string, any>) => {
    if (!selectedEmployee) return
    setEmployees(prev =>
      prev.map(emp =>
        emp.id === selectedEmployee.id
          ? { ...emp, ...values }
          : emp
      )
    )
    // Update selectedEmployee to reflect changes immediately
    setSelectedEmployee(prev => prev ? { ...prev, ...values } : null)
  }

  const columns = [
    {
      key: 'name',
      label: 'Name',
      render: (item: any) => (
        <div className="flex items-center gap-3">
          <span className={`w-8 h-8 rounded-full border flex items-center justify-center text-xs font-bold font-mono ${getAvatarColor(item.name)}`}>
            {getInitials(item.name)}
          </span>
          <div>
            <div className="font-semibold text-[var(--ink)]">{item.name}</div>
            <div className="text-xs text-[var(--ink-muted)] font-mono">{item.email}</div>
          </div>
        </div>
      )
    },
    {
      key: 'department',
      label: 'Department',
      render: (item: any) => <StatusBadge status={item.department} />
    },
    {
      key: 'designation',
      label: 'Designation',
      render: (item: any) => <span className="text-[var(--ink-soft)]">{item.designation}</span>
    },
    {
      key: 'branch',
      label: 'Branch',
      render: (item: any) => (
        <div className="flex items-center gap-1.5 text-[var(--ink-soft)]">
          <Building2 size={13} className="text-[var(--ink-muted)]" />
          {item.branch}
        </div>
      )
    },
    {
      key: 'joined',
      label: 'Joined',
      render: (item: any) => <span className="font-mono text-xs text-[var(--ink-soft)]">{item.joined}</span>
    },
    {
      key: 'status',
      label: 'Status',
      render: (item: any) => <StatusBadge status={item.status} />
    }
  ]

  return (
    <PageTransition>
      <div className="p-6 max-w-[1600px] mx-auto space-y-6 text-[var(--ink)]">
        {/* Header */}
        <PageHeader 
          title="Employees & HR"
          subtitle="Team management and performance tracking"
        />

        {/* Stat Cards */}
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StaggerItem>
            <StatCard label="Total Team" value={String(employees.length)} subtitle="Overall strength" valueColor="text-[var(--accent)]" />
          </StaggerItem>
          <StaggerItem>
            <StatCard label="Active" value={String(activeCount)} subtitle="Present/Working" valueColor="text-[var(--success)]" />
          </StaggerItem>
          <StaggerItem>
            <StatCard label="On Leave" value={String(onLeaveCount)} subtitle="Absent/On Leave" valueColor="text-[var(--warning)]" />
          </StaggerItem>
          <StaggerItem>
            <StatCard label="Branches" value={String(branches.length)} subtitle="Operational cities" valueColor="text-[var(--gold)]" />
          </StaggerItem>
        </StaggerContainer>

        {/* Tabs & Filters Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border-color)] pb-4">
          {/* Tabs */}
          <div className="inline-flex items-center gap-1 bg-[var(--bg-card)] p-1 rounded-xl border border-[var(--border-color)]">
            <button 
              onClick={() => setActiveTab('Team List')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] ${activeTab === 'Team List' ? 'bg-[var(--bg-surface)] text-[var(--ink)] shadow-sm border border-[var(--border-color)]' : 'text-[var(--ink-soft)] hover:text-[var(--ink)]'}`}
            >
              <Users size={16} /> Team List
            </button>
            <button 
              onClick={() => setActiveTab('Leaderboard')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] ${activeTab === 'Leaderboard' ? 'bg-[var(--bg-surface)] text-[var(--ink)] shadow-sm border border-[var(--border-color)]' : 'text-[var(--ink-soft)] hover:text-[var(--ink)]'}`}
            >
              <Trophy size={16} /> Leaderboard
            </button>
            <button 
              onClick={() => setActiveTab('Performance')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] ${activeTab === 'Performance' ? 'bg-[var(--bg-surface)] text-[var(--ink)] shadow-sm border border-[var(--border-color)]' : 'text-[var(--ink-soft)] hover:text-[var(--ink)]'}`}
            >
              <TrendingUp size={16} /> Performance
            </button>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--ink-muted)]" />
              <input 
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search employees..."
                className="pl-9 pr-4 py-2 bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--ink)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 focus:border-[var(--accent)] w-56 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
              />
            </div>
            <div className="relative w-48">
              <select 
                value={branchFilter}
                onChange={(e) => setBranchFilter(e.target.value)}
                className="w-full appearance-none border border-[var(--border-color)] rounded-lg px-3 py-2 text-sm text-[var(--ink-soft)] bg-[var(--bg-surface)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 focus:border-[var(--accent)] cursor-pointer transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
              >
                <option>All Branches</option>
                {branches.map(b => <option key={b}>{b}</option>)}
              </select>
              <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--ink-muted)] pointer-events-none" />
            </div>
            {(branchFilter !== 'All Branches' || searchQuery) && (
              <button 
                onClick={() => { setBranchFilter('All Branches'); setSearchQuery(''); }}
                className="text-xs font-semibold text-[var(--accent)] hover:underline transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
              >
                Clear
              </button>
            )}
            <span className="text-xs font-medium text-[var(--ink-muted)] font-mono">{filteredEmployees.length} results</span>
          </div>
        </div>

        {/* Table */}
        <DataTable 
          columns={columns}
          data={filteredEmployees}
          searchPlaceholder="Search directory..."
          searchKey="name"
          onRowClick={(emp: any) => setSelectedEmployee(emp)}
        />

        {/* Employee Detail Slide-Over */}
        <DetailSlideOver
          isOpen={!!selectedEmployee}
          onClose={() => setSelectedEmployee(null)}
          title={selectedEmployee?.name || ''}
          subtitle={selectedEmployee?.email || ''}
          avatar={
            selectedEmployee ? (
              <span className={`w-12 h-12 rounded-full border-2 flex items-center justify-center text-sm font-bold font-mono ${getAvatarColor(selectedEmployee.name)}`}>
                {getInitials(selectedEmployee.name)}
              </span>
            ) : undefined
          }
          statusBadge={
            selectedEmployee ? <StatusBadge status={selectedEmployee.status} /> : undefined
          }
          onSave={handleSaveEmployee}
          editValues={selectedEmployee ? {
            name: selectedEmployee.name,
            email: selectedEmployee.email,
            department: selectedEmployee.department,
            designation: selectedEmployee.designation,
            branch: selectedEmployee.branch,
            role: selectedEmployee.role,
            joined: selectedEmployee.joined,
            status: selectedEmployee.status,
          } : undefined}
          fields={selectedEmployee ? [
            { label: 'Full Name', value: selectedEmployee.name, editable: { key: 'name', type: 'text', placeholder: 'Full name' } },
            { label: 'Email Address', value: (
              <span className="flex items-center gap-1.5 font-mono text-xs">
                <Mail size={12} className="text-[var(--ink-muted)]" />
                {selectedEmployee.email}
              </span>
            ), editable: { key: 'email', type: 'text', placeholder: 'Email address' } },
            { label: 'Department', value: <StatusBadge status={selectedEmployee.department} />, editable: { key: 'department', type: 'select', options: DEPARTMENTS } },
            { label: 'Designation', value: (
              <span className="flex items-center gap-1.5">
                <Briefcase size={12} className="text-[var(--ink-muted)]" />
                {selectedEmployee.designation}
              </span>
            ), editable: { key: 'designation', type: 'text', placeholder: 'Designation' } },
            { label: 'Branch', value: (
              <span className="flex items-center gap-1.5">
                <MapPin size={12} className="text-[var(--ink-muted)]" />
                {selectedEmployee.branch}
              </span>
            ), editable: { key: 'branch', type: 'select', options: BRANCHES } },
            { label: 'Role', value: (
              <span className="flex items-center gap-1.5">
                <Shield size={12} className="text-[var(--ink-muted)]" />
                <span className="capitalize">{selectedEmployee.role}</span>
              </span>
            ), editable: { key: 'role', type: 'text', placeholder: 'Role' } },
            { label: 'Date Joined', value: (
              <span className="flex items-center gap-1.5 font-mono">
                <Calendar size={12} className="text-[var(--ink-muted)]" />
                {selectedEmployee.joined}
              </span>
            ), editable: { key: 'joined', type: 'date' } },
            { label: 'Status', value: <StatusBadge status={selectedEmployee.status} />, editable: { key: 'status', type: 'select', options: ['Active', 'On Leave', 'Inactive'] } },
          ] : []}
        />
      </div>
    </PageTransition>
  )
}
