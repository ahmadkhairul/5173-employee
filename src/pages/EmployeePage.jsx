import { useEffect, useState } from 'react'
import { getEmployees, addEmployee, updateEmployee, deleteEmployee } from '../api/employeeService'
import { logout } from '../api/loginService'
import './EmployeePage.css'

function Modal({ open, onClose, children }) {
  if (!open) return null
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>
  )
}

export default function EmployeePage() {
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [form, setForm] = useState({ name: '', position: '', salary: '', id: null })
  const [isEditing, setIsEditing] = useState(false)
  const [deleteId, setDeleteId] = useState(null)

  const fetchEmployees = async () => {
    setLoading(true)
    try {
      const data = await getEmployees()
      setEmployees(data)
      setError('')
    } catch (err) {
      setError(err.message)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchEmployees()
  }, [])

  const openAddModal = () => {
    setForm({ name: '', position: '', salary: '', id: null })
    setIsEditing(false)
    setModalOpen(true)
  }

  const openEditModal = (emp) => {
    setForm({ name: emp.name, position: emp.position, salary: emp.salary, id: emp.id })
    setIsEditing(true)
    setModalOpen(true)
  }

  const openDeleteModal = (id) => {
    setDeleteId(id)
    setDeleteModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setForm({ name: '', position: '', salary: '', id: null })
    setIsEditing(false)
  }

  const closeDeleteModal = () => {
    setDeleteModalOpen(false)
    setDeleteId(null)
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const employeeData = { name: form.name, position: form.position, salary: form.salary }
      if (isEditing) {
        await updateEmployee(form.id, employeeData)
      } else {
        await addEmployee(employeeData)
      }
      closeModal()
      fetchEmployees()
    } catch (err) {
      setError(err.message)
    }
  }

  const handleDelete = async () => {
    try {
      await deleteEmployee(deleteId)
      closeDeleteModal()
      fetchEmployees()
    } catch (err) {
      setError(err.message)
    }
  }

  const handleLogout = () => {
    logout()
    window.location.href = '/login'
  }

  return (
    <div className="container">
      <h1>Employee Management</h1>
      <button className="btn btn-danger" onClick={handleLogout} style={{ float: 'right' }}>Logout</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button className="btn btn-primary" onClick={openAddModal} style={{ marginBottom: '1rem' }}>Add Employee</button>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="employee-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Position</th>
              <th>Salary</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map(emp => (
              <tr key={emp.id}>
                <td>{emp.name}</td>
                <td>{emp.position}</td>
                <td>{emp.salary}</td>
                <td>
                  <button className="btn btn-warning" onClick={() => openEditModal(emp)}>Edit</button>
                  <button className="btn btn-danger" onClick={() => openDeleteModal(emp.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {/* Add/Edit Modal */}
      <Modal open={modalOpen} onClose={closeModal}>
        <h2>{isEditing ? 'Edit Employee' : 'Add Employee'}</h2>
        <form onSubmit={handleSubmit} className="employee-form">
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Name"
            required
          />
          <input
            name="position"
            value={form.position}
            onChange={handleChange}
            placeholder="Position"
            required
          />
          <input
            name="salary"
            value={form.salary}
            onChange={handleChange}
            placeholder="Salary"
            type="number"
            min="0"
            required
          />
          <button className="btn btn-primary" type="submit">{isEditing ? 'Update' : 'Add'} Employee</button>
          <button className="btn btn-secondary" type="button" onClick={closeModal}>Cancel</button>
        </form>
      </Modal>
      {/* Delete Modal */}
      <Modal open={deleteModalOpen} onClose={closeDeleteModal}>
        <h2>Delete Employee</h2>
        <p>Are you sure you want to delete this employee?</p>
        <button className="btn btn-danger" onClick={handleDelete}>Yes, Delete</button>
        <button className="btn btn-secondary" type="button" onClick={closeDeleteModal}>Cancel</button>
      </Modal>
    </div>
  )
}