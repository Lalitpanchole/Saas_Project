/**
 * Sample Business Module: Analytics & Reports (`reports`)
 * 
 * Demonstrates view/export gating for telemetry and business intelligence charts.
 */

import React from 'react';
import { toast } from 'react-toastify';
import { usePermissions } from '../../hooks/usePermissions';
import {
  FaChartBar,
  FaFileExport,
  FaChartLine,
  FaChartPie,
  FaDollarSign,
  FaLock,
} from 'react-icons/fa';

export const ReportsPage = () => {
  const { canCreate, canDelete } = usePermissions();

  const handleExport = (format) => {
    if (!canCreate('reports')) {
      toast.error('You do not have permission (`canCreate`) to generate report exports.');
      return;
    }
    toast.success(`Generating executive summary report in ${format} format...`);
  };

  return (
    <div>
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4">
        <div>
          <div className="d-flex align-items-center gap-2 mb-1">
            <span className="badge bg-danger-subtle text-danger border border-danger border-opacity-25">Sample Business Module</span>
          </div>
          <h4 className="fw-bold text-dark mb-1">Analytics & Telemetry (`reports`)</h4>
          <p className="text-muted small mb-0">Business intelligence overview. Report exports require creation permissions (`canCreate`).</p>
        </div>

        <div className="d-flex gap-2">
          {canCreate('reports') ? (
            <>
              <button onClick={() => handleExport('CSV')} className="btn btn-outline-danger d-flex align-items-center gap-2 shadow-sm">
                <FaFileExport />
                <span>Export CSV</span>
              </button>
              <button onClick={() => handleExport('PDF')} className="btn btn-danger d-flex align-items-center gap-2 shadow-sm text-white">
                <FaFileExport />
                <span>Export PDF</span>
              </button>
            </>
          ) : (
            <button className="btn btn-secondary opacity-50 d-flex align-items-center gap-2" disabled title="Requires canCreate('reports')">
              <FaLock />
              <span>Export Locked (`canCreate`)</span>
            </button>
          )}
        </div>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-12 col-md-4">
          <div className="premium-card border-danger border-opacity-25 d-flex align-items-center justify-content-between">
            <div>
              <p className="text-secondary small fw-semibold mb-1 text-uppercase">Monthly Revenue</p>
              <h3 className="fw-bold mb-0 text-dark">$412,500.00</h3>
              <span className="text-success small fw-semibold">+14.2% vs last month</span>
            </div>
            <div className="p-3 bg-danger bg-opacity-10 rounded-3 text-danger fs-3">
              <FaDollarSign />
            </div>
          </div>
        </div>

        <div className="col-12 col-md-4">
          <div className="premium-card border-danger border-opacity-25 d-flex align-items-center justify-content-between">
            <div>
              <p className="text-secondary small fw-semibold mb-1 text-uppercase">Active Subscriptions</p>
              <h3 className="fw-bold mb-0 text-dark">1,842</h3>
              <span className="text-success small fw-semibold">+82 new accounts</span>
            </div>
            <div className="p-3 bg-danger bg-opacity-10 rounded-3 text-danger fs-3">
              <FaChartLine />
            </div>
          </div>
        </div>

        <div className="col-12 col-md-4">
          <div className="premium-card border-danger border-opacity-25 d-flex align-items-center justify-content-between">
            <div>
              <p className="text-secondary small fw-semibold mb-1 text-uppercase">API Request Volume</p>
              <h3 className="fw-bold mb-0 text-dark">4.2M req/day</h3>
              <span className="text-muted small">99.98% uptime SLA</span>
            </div>
            <div className="p-3 bg-danger bg-opacity-10 rounded-3 text-danger fs-3">
              <FaChartPie />
            </div>
          </div>
        </div>
      </div>

      <div className="premium-card border-danger border-opacity-25 p-4 text-center py-5">
        <div className="p-3 bg-danger bg-opacity-10 rounded-circle text-danger d-inline-block mb-3 fs-2">
          <FaChartBar />
        </div>
        <h5 className="fw-bold text-dark">Enterprise Telemetry Engine Active</h5>
        <p className="text-muted small max-w-lg mx-auto mb-0">
          Real-time metrics visualization is operational across all system modules. 
          Use the export controls above to generate compliance summaries or quarterly reports.
        </p>
      </div>
    </div>
  );
};

export default ReportsPage;
