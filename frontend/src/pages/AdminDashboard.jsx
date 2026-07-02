import { useState, useEffect } from 'react';
import api from '../services/api.js';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(null); // Track which request is being processed

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/role-requests');
      setRequests(res.data.requests);
    } catch (err) {
      toast.error('Failed to load role requests');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    setProcessing(id);
    try {
      await api.patch(`/admin/role-requests/${id}/approve`);
      toast.success('Request approved! User promoted to manager.');
      fetchRequests();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to approve request';
      toast.error(msg);
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async (id) => {
    setProcessing(id);
    try {
      await api.patch(`/admin/role-requests/${id}/reject`);
      toast.success('Request rejected.');
      fetchRequests();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to reject request';
      toast.error(msg);
    } finally {
      setProcessing(null);
    }
  };

  return (
    <div className="page-container">
      <h1>Admin Dashboard</h1>
      <div className="card">
        <h3>Role Requests</h3>
        {loading ? (
          <p>Loading requests...</p>
        ) : requests.length === 0 ? (
          <p className="text-muted">No role requests found.</p>
        ) : (
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((req) => (
                  <tr key={req._id}>
                    <td>{req.user?.name || 'Unknown'}</td>
                    <td>{req.user?.email || 'Unknown'}</td>
                    <td>
                      <span className={`status-badge status-${req.status}`}>
                        {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                      </span>
                    </td>
                    <td>{new Date(req.createdAt).toLocaleDateString()}</td>
                    <td>
                      {req.status === 'pending' ? (
                        <div className="action-buttons">
                          <button
                            onClick={() => handleApprove(req._id)}
                            className="btn btn-success btn-sm"
                            disabled={processing === req._id}
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(req._id)}
                            className="btn btn-danger btn-sm"
                            disabled={processing === req._id}
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-muted">
                          {req.status === 'approved' ? 'Approved' : 'Rejected'}
                          {req.reviewedBy && ` by ${req.reviewedBy.name}`}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
