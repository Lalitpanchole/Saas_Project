/**
 * Sample Business Module: Client Accounts (`clients`)
 * 
 * Demonstrates standard CRUD authorization gating using `usePermissions()` hook.
 */

import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { usePermissions } from '../../hooks/usePermissions';
import {
  FaBriefcase,
  FaPlus,
  FaEdit,
  FaTrashAlt,
  FaBuilding,
  FaCheckCircle,
} from 'react-icons/fa';

export const ClientsPage = () => {
  const { canCreate, canUpdate, canDelete } = usePermissions();
  const [clients, setClients] = useState([
    { id: 101, name: 'Apex Global Technologies', contact: 'Sarah Jenkins', email: 's.jenkins@apex.io', status: 'Active', contractValue: '$120,000 / yr' },
    { id: 102, name: 'Nexus Financial Solutions', contact: 'Marcus Vance', email: 'mvance@nexusfin.com', status: 'Active', contractValue: '$85,500 / yr' },
    { id: 103, name: 'Vanguard Healthcare Corp', contact: 'Dr. Elena Rostova', email: 'elena@vanguardhealth.org', status: 'Onboarding', contractValue: '$240,000 / yr' },
    { id: 104, name: 'Summit Retail Partners', contact: 'David Kim', email: 'dkim@summitretail.com', status: 'Active', contractValue: '$64,000 / yr' },
  ]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingClientId, setEditingClientId] = useState(null);
  const [newClientData, setNewClientData] = useState({
    name: '',
    contact: '',
    email: '',
    status: 'Onboarding',
    contractValue: ''
  });

  const openAddModal = () => {
    setEditingClientId(null);
    setNewClientData({ name: '', contact: '', email: '', status: 'Onboarding', contractValue: '' });
    setIsAddModalOpen(true);
  };

  const openEditModal = (client) => {
    setEditingClientId(client.id);
    setNewClientData({ ...client });
    setIsAddModalOpen(true);
  };

  const handleAddSubmit = () => {
    if (!newClientData.name) {
      toast.error('Client name is required');
      return;
    }
    
    if (editingClientId) {
      setClients(clients.map(c => c.id === editingClientId ? { ...c, ...newClientData } : c));
      toast.success(`Client "${newClientData.name}" updated successfully.`);
    } else {
      const newClient = {
        id: Date.now(),
        name: newClientData.name,
        contact: newClientData.contact || 'Assigned Account Mgr',
        email: newClientData.email || `contact@${newClientData.name.toLowerCase().replace(/[^a-z]+/g, '')}.com`,
        status: newClientData.status || 'Onboarding',
        contractValue: newClientData.contractValue || '$50,000 / yr',
      };
      setClients([newClient, ...clients]);
      toast.success(`Client "${newClientData.name}" added to pipeline.`);
    }
    setIsAddModalOpen(false);
  };

  const handleDelete = (id, name) => {
    if (!window.confirm(`Are you sure you want to remove account "${name}"?`)) return;
    setClients(clients.filter((c) => c.id !== id));
    toast.success(`Client "${name}" removed.`);
  };

  return (
    <div>
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4">
        <div>
          <div className="d-flex align-items-center gap-2 mb-1">
            <span className="badge bg-success-subtle text-success border border-success border-opacity-25">Sample Business Module</span>
          </div>
          <h4 className="fw-bold text-dark mb-1">Client Account Directory (`clients`)</h4>
          <p className="text-muted small mb-0">Demonstrates granular CRUD gating when accessing commercial customer records.</p>
        </div>

        {canCreate('clients') ? (
          <button onClick={openAddModal} className="btn btn-success d-flex align-items-center justify-content-center gap-2 align-self-md-start shadow-sm text-white btn-mobile-full mt-2 mt-sm-0">
            <FaPlus />
            <span>Add Client</span>
          </button>
        ) : (
          <button className="btn btn-secondary opacity-50 d-flex align-items-center justify-content-center gap-2 align-self-md-start btn-mobile-full mt-2 mt-sm-0" disabled title="Requires canCreate('clients') permission">
            <FaPlus />
            <span>Onboard Client (Locked)</span>
          </button>
        )}
      </div>

      <div className="premium-card p-0 overflow-hidden border-success border-opacity-25">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="bg-light">
              <tr>
                <th className="px-4 py-3">Client Organization</th>
                <th className="py-3">Primary Contact</th>
                <th className="py-3">Status</th>
                <th className="py-3">Annual Contract</th>
                <th className="text-end px-4 py-3">Module Actions</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((client) => (
                <tr key={client.id}>
                  <td className="px-4 py-3">
                    <div className="d-flex align-items-center gap-3">
                      <div className="p-2 bg-success bg-opacity-10 rounded text-success fs-5">
                        <FaBuilding />
                      </div>
                      <div>
                        <div className="fw-bold text-dark">{client.name}</div>
                        <small className="text-muted">{client.email}</small>
                      </div>
                    </div>
                  </td>
                  <td className="fw-medium text-dark">{client.contact}</td>
                  <td>
                    <span className={`badge px-2 py-1 ${client.status === 'Active' ? 'bg-success-subtle text-success border border-success border-opacity-25' : 'bg-warning-subtle text-warning border border-warning border-opacity-25'}`}>
                      <FaCheckCircle className="me-1" /> {client.status}
                    </span>
                  </td>
                  <td className="fw-semibold text-dark">{client.contractValue}</td>
                  <td className="text-end px-4">
                    <div className="d-flex align-items-center justify-content-end gap-2">
                      {canUpdate('clients') ? (
                        <button onClick={() => openEditModal(client)} className="btn btn-sm btn-outline-success">
                          <FaEdit />
                        </button>
                      ) : (
                        <button className="btn btn-sm btn-outline-secondary opacity-50" disabled title="No Update Permission">
                          <FaEdit />
                        </button>
                      )}

                      {canDelete('clients') ? (
                        <button onClick={() => handleDelete(client.id, client.name)} className="btn btn-sm btn-outline-danger">
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
                <h5 className="modal-title fw-bold">{editingClientId ? 'Edit Client' : 'Add New Client'}</h5>
                <button type="button" className="btn-close" onClick={() => setIsAddModalOpen(false)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label fw-semibold">Organization Name</label>
                  <input type="text" className="form-control" value={newClientData.name} onChange={(e) => setNewClientData({...newClientData, name: e.target.value})} placeholder="e.g. Acme Corp" />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Primary Contact</label>
                  <input type="text" className="form-control" value={newClientData.contact} onChange={(e) => setNewClientData({...newClientData, contact: e.target.value})} placeholder="e.g. Jane Doe" />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Email Address</label>
                  <input type="email" className="form-control" value={newClientData.email} onChange={(e) => setNewClientData({...newClientData, email: e.target.value})} placeholder="e.g. contact@acme.com" />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Status</label>
                  <select className="form-select" value={newClientData.status} onChange={(e) => setNewClientData({...newClientData, status: e.target.value})}>
                    <option value="Onboarding">Onboarding</option>
                    <option value="Active">Active</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Annual Contract Value</label>
                  <input type="text" className="form-control" value={newClientData.contractValue} onChange={(e) => setNewClientData({...newClientData, contractValue: e.target.value})} placeholder="e.g. $50,000 / yr" />
                </div>
              </div>
              <div className="modal-footer border-top-0 pt-0">
                <button type="button" className="btn btn-light" onClick={() => setIsAddModalOpen(false)}>Cancel</button>
                <button type="button" className="btn btn-success text-white" onClick={handleAddSubmit}>{editingClientId ? 'Update' : 'Save'}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientsPage;
