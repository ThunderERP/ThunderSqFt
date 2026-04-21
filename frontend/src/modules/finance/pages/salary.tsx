import { useState, useMemo, useEffect } from 'react'
import { Eye, Edit, UserPlus, IndianRupee } from 'lucide-react'
import { toast } from 'sonner'
import PageHeader from '../components/PageHeader'
import StatCard from '../components/StatCard'
import DataTable from '../components/DataTable'
import StatusBadge from '../components/StatusBadge'
import Modal from '../components/Modal'
import { StaggerContainer, StaggerItem, PageTransition, ScrollRevealMotion } from '../components/MotionComponents'

interface Employee {
  id: number;
  employeeId: string;
  name: string;
  department: string;
  basicSalary: number;
  allowances: number;
  deductions: number;
}

const mockEmployees: Employee[] = [
  { id: 1, employeeId: 'EMP-001', name: 'Arjun Sharma', department: 'ENGINEERING', basicSalary: 85000, allowances: 12000, deductions: 5000 },
  { id: 2, employeeId: 'EMP-002', name: 'Sneha Rao', department: 'MANAGEMENT', basicSalary: 120000, allowances: 25000, deductions: 8000 },
  { id: 3, employeeId: 'EMP-003', name: 'Vikram Singh', department: 'MARKETING', basicSalary: 65000, allowances: 8000, deductions: 3500 },
  { id: 4, employeeId: 'EMP-004', name: 'Priya Patel', department: 'SALES', basicSalary: 55000, allowances: 15000, deductions: 2500 },
  { id: 5, employeeId: 'EMP-005', name: 'Rahul Verma', department: 'HR', basicSalary: 50000, allowances: 5000, deductions: 2000 },
]

export default function Salary() {
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    name: '',
    department: 'ENGINEERING',
    basic: '',
    allowances: '',
    deductions: '',
  })

  // Fetch employees from backend
  const fetchEmployees = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/v1/employees')
      if (res.ok) {
        const data = await res.json()
        const backendData = data.data || data
        if (backendData && backendData.length > 0) {
          setEmployees(backendData)
        }
      }
    } catch (err) {
      console.warn('Backend not available, using mock data')
      // fallback is already in state
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEmployees()
  }, [])

  const stats = useMemo(() => {
    return employees.reduce(
      (acc, emp) => ({
        basic: acc.basic + Number(emp.basicSalary),
        allowances: acc.allowances + Number(emp.allowances),
        deductions: acc.deductions + Number(emp.deductions),
        net: acc.net + (Number(emp.basicSalary) + Number(emp.allowances) - Number(emp.deductions)),
      }),
      { basic: 0, allowances: 0, deductions: 0, net: 0 }
    )
  }, [employees])

  const handleAddEmployee = async (e: React.FormEvent) => {
    e.preventDefault()
    const basicSalary = parseFloat(formData.basic) || 0
    const allowances = parseFloat(formData.allowances) || 0
    const deductions = parseFloat(formData.deductions) || 0

    const payload = {
      name: formData.name,
      department: formData.department,
      basicSalary,
      allowances,
      deductions,
    }

    try {
      const res = await fetch('http://localhost:3000/api/v1/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (res.ok) {
        toast.success('Employee added successfully')
        setIsModalOpen(false)
        setFormData({ name: '', department: 'ENGINEERING', basic: '', allowances: '', deductions: '' })
        fetchEmployees() // refetch
      } else {
        const errorData = await res.json()
        toast.error(`Error: ${errorData.message || 'Failed to add employee'}`)
      }
    } catch (err) {
      toast.error('Network Error')
    }
  }

  const handleProcessSalary = async () => {
    setLoading(true)
    const loadingToast = toast.loading('Processing payroll...')

    try {
      const res = await fetch('http://localhost:3000/api/v1/finance/salary/process', {
        method: 'POST',
      })

      if (res.ok) {
        const result = await res.json()
        toast.dismiss(loadingToast)
        toast.success(result.data?.message || result.message || 'Salary processed successfully', {
          description: `Total disbursements: ₹${stats.net.toLocaleString()}`,
        })
      } else {
        toast.dismiss(loadingToast)
        toast.error('Failed to process payroll')
      }
    } catch (err) {
      toast.dismiss(loadingToast)
      toast.error('Network Error during processing')
    } finally {
      setLoading(false)
    }
  }

  const handleEditClick = (employee: Employee) => {
    setFormData({
      name: employee.name,
      department: employee.department,
      basic: employee.basicSalary.toString(),
      allowances: employee.allowances.toString(),
      deductions: employee.deductions.toString(),
    })
    setIsEditModalOpen(true)
    setSelectedEmployee(employee)
  }

  const handleUpdateEmployee = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedEmployee) return;
    const basicSalary = parseFloat(formData.basic) || 0
    const allowances = parseFloat(formData.allowances) || 0
    const deductions = parseFloat(formData.deductions) || 0

    const payload = {
      name: formData.name,
      department: formData.department,
      basicSalary,
      allowances,
      deductions,
    }

    try {
      // Typically PATCH or PUT for update
      const res = await fetch(`http://localhost:3000/api/v1/employees/${selectedEmployee.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (res.ok) {
        toast.success('Employee updated successfully')
        setIsEditModalOpen(false)
        fetchEmployees() // refetch
      } else {
        const errorData = await res.json()
        toast.error(`Error: ${errorData.message || 'Failed to update employee'}`)
      }
    } catch (err) {
      toast.error('Network Error')
    }
  }

  const columns = [
    { key: 'employeeId', label: 'Employee ID', render: (item: any) => <span className="font-medium text-gray-900">{item.employeeId}</span> },
    { key: 'name', label: 'Employee Name', render: (item: any) => <span className="font-medium">{item.name}</span> },
    {
      key: 'department',
      label: 'Department',
      render: (item: any) => <StatusBadge status={item.department} />,
    },
    { key: 'basicSalary', label: 'Basic Salary', render: (item: any) => `₹${Number(item.basicSalary).toLocaleString()}` },
    { key: 'allowances', label: 'Allowances', render: (item: any) => <span className="text-emerald-600">+${Number(item.allowances).toLocaleString()}</span> },
    { key: 'deductions', label: 'Deductions', render: (item: any) => <span className="text-red-500">-${Number(item.deductions).toLocaleString()}</span> },
    {
      key: 'net', label: 'Net Salary', render: (item: any) => {
        const net = Number(item.basicSalary) + Number(item.allowances) - Number(item.deductions)
        return <span className="font-semibold text-gray-900">₹{net.toLocaleString()}</span>
      }
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (item: any) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setSelectedEmployee(item)
              setIsViewModalOpen(true)
            }}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-primary-500 transition-colors"
          >
            <Eye size={16} />
          </button>
          <button
            onClick={() => handleEditClick(item)}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-primary-500 transition-colors"
          >
            <Edit size={16} />
          </button>
        </div>
      ),
    },
  ]


  return (
    <PageTransition>
      <PageHeader
        title="Employee Salary"
        subtitle="Manage employee compensation and payroll"
        actions={
          <>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 text-white rounded-xl font-medium text-sm shadow-lg transition-all"
              style={{ background: '#2563EB', boxShadow: '0 8px 24px rgba(37,99,235,0.25)' }}
            >
              <UserPlus size={18} />
              Add Employee
            </button>
            <button
              disabled={loading}
              onClick={handleProcessSalary}
              className={`flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white rounded-xl font-medium text-sm hover:bg-gray-800 transition-all ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <IndianRupee size={18} />
              {loading ? 'Processing...' : 'Process Salary'}
            </button>
          </>
        }
      />

      {/* KPI Cards */}
      <StaggerContainer className="bento-grid mb-8">
        <StaggerItem><StatCard label="Total Basic Salary" value={`₹${stats.basic.toLocaleString()}`} /></StaggerItem>
        <StaggerItem><StatCard label="Total Allowances" value={`+₹${stats.allowances.toLocaleString()}`} valueColor="text-emerald-600" /></StaggerItem>
        <StaggerItem><StatCard label="Total Deductions" value={`-₹${stats.deductions.toLocaleString()}`} valueColor="text-red-500" /></StaggerItem>
        <StaggerItem><StatCard label="Total Net Salary" value={`₹${stats.net.toLocaleString()}`} valueColor="text-primary-500" /></StaggerItem>
      </StaggerContainer>

      {/* Data Table */}
      <ScrollRevealMotion delay={0.1}>
        <DataTable
          columns={columns}
          data={employees}
          searchPlaceholder="Search by name or employee ID..."
          searchKey="name"
          filterOptions={[
            { label: 'department', options: ['All Departments', 'Engineering', 'Management', 'Marketing', 'Sales', 'HR'] },
          ]}
        />
      </ScrollRevealMotion>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Employee"
      >
        <form onSubmit={handleAddEmployee} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              required
              type="text"
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none transition-all"
              placeholder="e.g. John Doe"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
            <select
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none transition-all"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
            >
              <option value="ENGINEERING">Engineering</option>
              <option value="MANAGEMENT">Management</option>
              <option value="MARKETING">Marketing</option>
              <option value="SALES">Sales</option>
              <option value="HR">HR</option>
              <option value="FINANCE">Finance</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Basic Salary</label>
              <input
                required
                type="number"
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                placeholder="0.00"
                value={formData.basic}
                onChange={(e) => setFormData({ ...formData, basic: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Allowances</label>
              <input
                type="number"
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                placeholder="0.00"
                value={formData.allowances}
                onChange={(e) => setFormData({ ...formData, allowances: e.target.value })}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Deductions</label>
            <input
              type="number"
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none transition-all"
              placeholder="0.00"
              value={formData.deductions}
              onChange={(e) => setFormData({ ...formData, deductions: e.target.value })}
            />
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-primary-500 hover:bg-primary-600 rounded-xl transition-all shadow-lg shadow-primary-500/25"
            >
              Add Employee
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Employee"
      >
        <form onSubmit={handleUpdateEmployee} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              required
              type="text"
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none transition-all"
              placeholder="e.g. John Doe"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
            <select
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none transition-all"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
            >
              <option value="ENGINEERING">Engineering</option>
              <option value="MANAGEMENT">Management</option>
              <option value="MARKETING">Marketing</option>
              <option value="SALES">Sales</option>
              <option value="HR">HR</option>
              <option value="FINANCE">Finance</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Basic Salary</label>
              <input
                required
                type="number"
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                placeholder="0.00"
                value={formData.basic}
                onChange={(e) => setFormData({ ...formData, basic: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Allowances</label>
              <input
                type="number"
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                placeholder="0.00"
                value={formData.allowances}
                onChange={(e) => setFormData({ ...formData, allowances: e.target.value })}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Deductions</label>
            <input
              type="number"
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none transition-all"
              placeholder="0.00"
              value={formData.deductions}
              onChange={(e) => setFormData({ ...formData, deductions: e.target.value })}
            />
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={() => setIsEditModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-primary-500 hover:bg-primary-600 rounded-xl transition-all shadow-lg shadow-primary-500/25"
            >
              Update Employee
            </button>
          </div>
        </form>
      </Modal>

      {/* View Modal */}
      <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} title="Employee Details">
        {selectedEmployee && (
          <div className="space-y-4">
            <div className="flex justify-between border-b pb-4">
              <span className="text-gray-500">Employee ID</span>
              <span className="font-medium">{selectedEmployee.employeeId}</span>
            </div>
            <div className="flex justify-between border-b pb-4">
              <span className="text-gray-500">Name</span>
              <span className="font-medium">{selectedEmployee.name}</span>
            </div>
            <div className="flex justify-between border-b pb-4">
              <span className="text-gray-500">Department</span>
              <StatusBadge status={selectedEmployee.department} />
            </div>
            <div className="flex justify-between border-b pb-4">
              <span className="text-gray-500">Basic Salary</span>
              <span className="font-medium">${Number(selectedEmployee.basicSalary).toLocaleString()}</span>
            </div>
            <div className="flex justify-between border-b pb-4">
              <span className="text-gray-500">Allowances</span>
              <span className="font-medium text-emerald-600">+${Number(selectedEmployee.allowances).toLocaleString()}</span>
            </div>
            <div className="flex justify-between border-b pb-4">
              <span className="text-gray-500">Deductions</span>
              <span className="font-medium text-red-500">-${Number(selectedEmployee.deductions).toLocaleString()}</span>
            </div>
            <div className="flex justify-between pt-2">
              <span className="text-gray-500 font-medium">Net Salary</span>
              <span className="font-bold text-lg text-gray-900">
                ${(Number(selectedEmployee.basicSalary) + Number(selectedEmployee.allowances) - Number(selectedEmployee.deductions)).toLocaleString()}
              </span>
            </div>
          </div>
        )}
      </Modal>
    </PageTransition>
  )
}
