import { useState } from 'react'
import { PageTransition, StaggerContainer, StaggerItem } from '../../shared/components/MotionComponents'
import { ChevronDown, Users, Trophy, TrendingUp, ArrowUpDown, ArrowUp, ArrowDown, Search, Building2, UserCheck, UserX } from 'lucide-react'

const mockEmployees = [
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
  'bg-blue-100 text-blue-700',
  'bg-emerald-100 text-emerald-700',
  'bg-purple-100 text-purple-700',
  'bg-orange-100 text-orange-700',
  'bg-pink-100 text-pink-700',
]
function getAvatarColor(name: string) {
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return avatarColors[Math.abs(hash) % avatarColors.length]
}

function getStatusBadge(status: string) {
  switch (status) {
    case 'Active': return 'bg-emerald-100 text-emerald-700'
    case 'On Leave': return 'bg-yellow-100 text-yellow-700'
    case 'Inactive': return 'bg-gray-100 text-gray-500'
    default: return 'bg-gray-100 text-gray-700'
  }
}

function getDeptBadge(dept: string) {
  switch (dept) {
    case 'Sales': return 'bg-blue-50 text-blue-600'
    case 'Marketing': return 'bg-purple-50 text-purple-600'
    case 'HR': return 'bg-pink-50 text-pink-600'
    case 'Banking': return 'bg-emerald-50 text-emerald-600'
    case 'Operations': return 'bg-orange-50 text-orange-600'
    case 'Management': return 'bg-indigo-50 text-indigo-600'
    case 'Customer Success': return 'bg-cyan-50 text-cyan-600'
    default: return 'bg-gray-50 text-gray-600'
  }
}

export default function EmployeeDirectory() {
  const [activeTab, setActiveTab] = useState('Team List')
  const [branchFilter, setBranchFilter] = useState('All Branches');
  const [searchQuery, setSearchQuery] = useState('');
  
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
    if (sortField !== field) return <ArrowUpDown size={14} className="text-gray-300" />;
    return sortDirection === 'asc' ? <ArrowUp size={14} className="text-[#2563EB]" /> : <ArrowDown size={14} className="text-[#2563EB]" />;
  };

  let filteredEmployees = mockEmployees.filter(emp => {
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

  const activeCount = mockEmployees.filter(e => e.status === 'Active').length;
  const onLeaveCount = mockEmployees.filter(e => e.status === 'On Leave').length;
  const branches = [...new Set(mockEmployees.map(e => e.branch))];

  return (
    <PageTransition>
      <div className="p-6 max-w-[1600px] mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Employees & HR</h1>
            <p className="text-sm text-gray-500 mt-1">Team management and performance tracking</p>
          </div>
        </div>

        {/* Stat Cards */}
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StaggerItem>
            <div className="stat-card bg-white border border-gray-100 rounded-xl p-5 flex items-center gap-4 shadow-sm">
              <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
                <Users size={22} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Total Team</p>
                <h3 className="text-2xl counter-value text-gray-900 mt-0.5">{mockEmployees.length}</h3>
              </div>
            </div>
          </StaggerItem>
          <StaggerItem>
            <div className="stat-card bg-white border border-gray-100 rounded-xl p-5 flex items-center gap-4 shadow-sm">
              <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0">
                <UserCheck size={22} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Active</p>
                <h3 className="text-2xl counter-value text-emerald-600 mt-0.5">{activeCount}</h3>
              </div>
            </div>
          </StaggerItem>
          <StaggerItem>
            <div className="stat-card bg-white border border-gray-100 rounded-xl p-5 flex items-center gap-4 shadow-sm">
              <div className="w-11 h-11 rounded-xl bg-yellow-50 text-yellow-500 flex items-center justify-center shrink-0">
                <UserX size={22} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">On Leave</p>
                <h3 className="text-2xl counter-value text-yellow-600 mt-0.5">{onLeaveCount}</h3>
              </div>
            </div>
          </StaggerItem>
          <StaggerItem>
            <div className="stat-card bg-white border border-gray-100 rounded-xl p-5 flex items-center gap-4 shadow-sm">
              <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-500 flex items-center justify-center shrink-0">
                <Building2 size={22} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Branches</p>
                <h3 className="text-2xl counter-value text-gray-900 mt-0.5">{branches.length}</h3>
              </div>
            </div>
          </StaggerItem>
        </StaggerContainer>

        {/* Tabs */}
        <div className="inline-flex items-center gap-1 bg-gray-50/50 p-1 rounded-xl border border-gray-100">
          <button 
            onClick={() => setActiveTab('Team List')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'Team List' ? 'bg-white text-gray-900 shadow-sm border border-gray-200' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <Users size={16} /> Team List
          </button>
          <button 
            onClick={() => setActiveTab('Leaderboard')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'Leaderboard' ? 'bg-white text-gray-900 shadow-sm border border-gray-200' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <Trophy size={16} /> Leaderboard
          </button>
          <button 
            onClick={() => setActiveTab('Performance')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'Performance' ? 'bg-white text-gray-900 shadow-sm border border-gray-200' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <TrendingUp size={16} /> Performance
          </button>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search employees..."
              className="pl-9 pr-4 py-2 bg-gray-50/50 border border-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 w-56 transition-all"
            />
          </div>
          <div className="relative w-48">
            <select 
              value={branchFilter}
              onChange={(e) => setBranchFilter(e.target.value)}
              className="w-full appearance-none border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 cursor-pointer transition-all"
            >
              <option>All Branches</option>
              {branches.map(b => <option key={b}>{b}</option>)}
            </select>
            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
          <span className="text-xs font-medium text-gray-400">{filteredEmployees.length} results</span>
        </div>

        {/* Table */}
        <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50/50 text-gray-500 font-medium border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 font-medium cursor-pointer hover:bg-gray-100 transition-colors select-none" onClick={() => handleSort('name')}>
                    <div className="flex items-center gap-2">Name {getSortIcon('name')}</div>
                  </th>
                  <th className="px-6 py-4 font-medium cursor-pointer hover:bg-gray-100 transition-colors select-none" onClick={() => handleSort('department')}>
                    <div className="flex items-center gap-2">Department {getSortIcon('department')}</div>
                  </th>
                  <th className="px-6 py-4 font-medium cursor-pointer hover:bg-gray-100 transition-colors select-none" onClick={() => handleSort('designation')}>
                    <div className="flex items-center gap-2">Designation {getSortIcon('designation')}</div>
                  </th>
                  <th className="px-6 py-4 font-medium cursor-pointer hover:bg-gray-100 transition-colors select-none" onClick={() => handleSort('branch')}>
                    <div className="flex items-center gap-2">Branch {getSortIcon('branch')}</div>
                  </th>
                  <th className="px-6 py-4 font-medium cursor-pointer hover:bg-gray-100 transition-colors select-none" onClick={() => handleSort('joined')}>
                    <div className="flex items-center gap-2">Joined {getSortIcon('joined')}</div>
                  </th>
                  <th className="px-6 py-4 font-medium cursor-pointer hover:bg-gray-100 transition-colors select-none" onClick={() => handleSort('status')}>
                    <div className="flex items-center gap-2">Status {getSortIcon('status')}</div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredEmployees.map((emp, idx) => (
                  <tr key={emp.id + '-' + idx} className="anim-row hover:bg-gray-50/50 transition-all group" style={{ '--i': idx } as React.CSSProperties}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <span className={`avatar-circle ${getAvatarColor(emp.name)}`}>
                          {getInitials(emp.name)}
                        </span>
                        <div>
                          <div className="font-semibold text-gray-900">{emp.name}</div>
                          <div className="text-xs text-gray-400">{emp.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 rounded-md text-xs font-medium ${getDeptBadge(emp.department)}`}>
                        {emp.department}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600 whitespace-nowrap">{emp.designation}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-gray-500">
                        <Building2 size={13} className="text-gray-400" />
                        {emp.branch}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500 whitespace-nowrap">{emp.joined}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 rounded-md text-xs font-semibold ${getStatusBadge(emp.status)}`}>
                        {emp.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredEmployees.length === 0 && (
            <div className="py-16 text-center">
              <div className="float-bounce inline-block mb-4">
                <Users size={40} className="text-gray-300" />
              </div>
              <p className="text-gray-500 font-medium">No employees found</p>
              <p className="text-sm text-gray-400 mt-1">Try adjusting your filters</p>
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  )
}
