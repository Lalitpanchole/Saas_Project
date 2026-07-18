/**
 * Sample Business Module: Staff & Contractors (`staff`)
 * 
 * Demonstrates internal resource gating and fine-grained department operations.
 */

import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { usePermissions } from '../../hooks/usePermissions';
import {
  FaUserTie,
  FaPlus,
  FaEdit,
  FaTrashAlt,
  FaIdBadge,
} from 'react-icons/fa';

export const StaffPage = () => {
  const { canCreate, canUpdate, canDelete } = usePermissions();
  const [staff, setStaff] = useState([
    { id: 201, name: 'Alexander Wright', roleTitle: 'Senior Infrastructure Engineer', department: 'Engineering', type: 'Full-time', location: 'Austin, TX' },
    { id: 202, name: 'Jessica Chen', roleTitle: 'Lead Product Designer', department: 'Design', type: 'Full-time', location: 'San Francisco, CA' },
    { id: 203, name: 'Robert Miller', roleTitle: 'Security Compliance Auditor', department: 'Legal & Sec', type: 'Contractor', location: 'Remote (UK)' },
    { id: 204, name: 'Amara Okafor', roleTitle: 'Customer Success Specialist', department: 'Support', type: 'Full-time', location: 'New York, NY' },
  ]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingStaffId, setEditingStaffId] = useState(null);
  const [newStaffData, setNewStaffData] = useState({
    name: '',
    roleTitle: '',
    department: '',
    type: 'Full-time',
    location: ''
  });

  const openAddModal = () => {
    setEditingStaffId(null);
    setNewStaffData({ name: '', roleTitle: '', department: '', type: 'Full-time', location: '' });
    setIsAddModalOpen(true);
  };

  const openEditModal = (s) => {
    setEditingStaffId(s.id);
    setNewStaffData({ ...s });
    setIsAddModalOpen(true);
  };

  const handleAddSubmit = () => {
    if (!newStaffData.name) {
      toast.error('Name is required');
      return;
    }

    if (editingStaffId) {
      setStaff(staff.map(s => s.id === editingStaffId ? { ...s, ...newStaffData } : s));
      toast.success(`Staff member "${newStaffData.name}" updated successfully.`);
    } else {
      const newMember = {
        id: Date.now(),
        name: newStaffData.name,
        roleTitle: newStaffData.roleTitle || 'Associate Consultant',
        department: newStaffData.department || 'Operations',
        type: newStaffData.type || 'Contractor',
        location: newStaffData.location || 'Remote',
      };
      setStaff([newMember, ...staff]);
      toast.success(`Staff member "${newStaffData.name}" registered.`);
    }
    setIsAddModalOpen(false);
  };

  const handleDelete = (id, name) => {
    if (!window.confirm(`Remove staff record for "${name}"?`)) return;
    setStaff(staff.filter((s) => s.id !== id));
    toast.success(`Staff member "${name}" removed.`);
  };

  return (
    <div>
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4">
        <div>
          <div className="d-flex align-items-center gap-2 mb-1">
            <span className="badge bg-secondary-subtle text-secondary border border-secondary border-opacity-25">Sample Business Module</span>
          </div>
          <h4 className="fw-bold text-dark mb-1">Staff & Contractors Directory (`staff`)</h4>
          <p className="text-muted small mb-0">Internal departmental directory gated by role and user-level override checks.</p>
        </div>

        {canCreate('staff') ? (
          <button onClick={openAddModal} className="btn btn-secondary d-flex align-items-center justify-content-center gap-2 align-self-md-start shadow-sm text-white btn-mobile-full mt-2 mt-sm-0">
            <FaPlus />
            <span>Add Staff Member</span>
          </button>
        ) : (
          <button className="btn btn-secondary opacity-50 d-flex align-items-center justify-content-center gap-2 align-self-md-start btn-mobile-full mt-2 mt-sm-0" disabled title="Requires canCreate('staff') permission">
            <FaPlus />
            <span>Add Staff Record (Locked)</span>
          </button>
        )}
      </div>

      <div className="premium-card p-0 overflow-hidden border-secondary border-opacity-25">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="bg-light">
              <tr>
                <th className="px-4 py-3">Personnel Name</th>
                <th className="py-3">Job Title & Dept</th>
                <th className="py-3">Employment Type</th>
                <th className="py-3">Work Location</th>
                <th className="text-end px-4 py-3">Module Actions</th>
              </tr>
            </thead>
            <tbody>
              {staff.map((s) => (
                <tr key={s.id}>
                  <td className="px-4 py-3">
                    <div className="d-flex align-items-center gap-3">
                      <div className="p-2 bg-secondary bg-opacity-10 rounded text-secondary fs-5">
                        <FaIdBadge />
                      </div>
                      <div className="fw-bold text-dark">{s.name}</div>
                    </div>
                  </td>
                  <td>
                    <div className="fw-semibold text-dark">{s.roleTitle}</div>
                    <small className="text-muted">{s.department}</small>
                  </td>
                  <td>
                    <span className={`badge px-2 py-1 ${s.type === 'Full-time' ? 'bg-primary-subtle text-primary' : 'bg-info-subtle text-info'}`}>
                      {s.type}
                    </span>
                  </td>
                  <td className="text-muted small">{s.location}</td>
                  <td className="text-end px-4">
                    <div className="d-flex align-items-center justify-content-end gap-2">
                      {canUpdate('staff') ? (
                        <button onClick={() => openEditModal(s)} className="btn btn-sm btn-outline-secondary">
                          <FaEdit />
                        </button>
                      ) : (
                        <button className="btn btn-sm btn-outline-secondary opacity-50" disabled title="No Update Permission">
                          <FaEdit />
                        </button>
                      )}

                      {canDelete('staff') ? (
                        <button onClick={() => handleDelete(s.id, s.name)} className="btn btn-sm btn-outline-danger">
                          <FaTrashAlt />
                        </button>
                      ) : (
                        <button className="btn btn-sm btn-outline-secondary opacity-50" disabled title="No Delete Permission">
                          <FaTrashAlt />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isAddModalOpen && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow">
              <div className="modal-header border-bottom-0 pb-0">
                <h5 className="modal-title fw-bold">{editingStaffId ? 'Edit Staff Member' : 'Add New Staff Member'}</h5>
                <button type="button" className="btn-close" onClick={() => setIsAddModalOpen(false)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label fw-semibold">Name</label>
                  <input type="text" className="form-control" value={newStaffData.name} onChange={(e) => setNewStaffData({...newStaffData, name: e.target.value})} placeholder="e.g. John Doe" />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Role Title</label>
                  <input type="text" className="form-control" value={newStaffData.roleTitle} onChange={(e) => setNewStaffData({...newStaffData, roleTitle: e.target.value})} placeholder="e.g. Software Engineer" />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Department</label>
                  <input type="text" className="form-control" value={newStaffData.department} onChange={(e) => setNewStaffData({...newStaffData, department: e.target.value})} placeholder="e.g. Engineering" />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Employment Type</label>
                  <select className="form-select" value={newStaffData.type} onChange={(e) => setNewStaffData({...newStaffData, type: e.target.value})}>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contractor">Contractor</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Location</label>
                  <input type="text" className="form-control" value={newStaffData.location} onChange={(e) => setNewStaffData({...newStaffData, location: e.target.value})} placeholder="e.g. New York, NY" />
                </div>
              </div>
              <div className="modal-footer border-top-0 pt-0">
                <button type="button" className="btn btn-light" onClick={() => setIsAddModalOpen(false)}>Cancel</button>
                <button type="button" className="btn btn-secondary text-white" onClick={handleAddSubmit}>{editingStaffId ? 'Update' : 'Save'}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffPage;
