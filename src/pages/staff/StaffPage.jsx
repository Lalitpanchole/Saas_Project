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

  const handleAdd = () => {
    const name = window.prompt('Enter new staff member name:');
    if (!name) return;
    const newMember = {
      id: Date.now(),
      name,
      roleTitle: 'Associate Consultant',
      department: 'Operations',
      type: 'Contractor',
      location: 'Remote',
    };
    setStaff([newMember, ...staff]);
    toast.success(`Staff member "${name}" registered.`);
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
          <button onClick={handleAdd} className="btn btn-secondary d-flex align-items-center justify-content-center gap-2 align-self-md-start shadow-sm text-white btn-mobile-full mt-2 mt-sm-0">
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
                        <button onClick={() => toast.info(`Editing ${s.name}...`)} className="btn btn-sm btn-outline-secondary">
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
    </div>
  );
};

export default StaffPage;
