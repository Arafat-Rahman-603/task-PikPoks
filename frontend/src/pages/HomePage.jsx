import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import api from '../services/api.js';
import toast from 'react-hot-toast';

const HomePage = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loadingRequest, setLoadingRequest] = useState(false);
  const [fetchingRequests, setFetchingRequests] = useState(false);

  // Fetch user's role requests
  useEffect(() => {
    if (user?.role === 'user') {
      fetchMyRequests();
    }
  }, [user]);

  const fetchMyRequests = async () => {
    setFetchingRequests(true);
    try {
      const res = await api.get('/role-requests/me');
      setRequests(res.data.requests);
    } catch {
      // silently fail
    } finally {
      setFetchingRequests(false);
    }
  };

  const handleRequestManager = async () => {
    setLoadingRequest(true);
    try {
      await api.post('/role-requests');
      toast.success('Manager access request submitted!');
      fetchMyRequests();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to submit request';
      toast.error(msg);
    } finally {
      setLoadingRequest(false);
    }
  };

  const hasPendingRequest = requests.some((r) => r.status === 'pending');
  const latestRequest = requests.length > 0 ? requests[0] : null;

  return (
    <div className="page-container">
      <div className="welcome-card">
        <h1>Welcome, {user?.name}!</h1>
        <p className="user-info">
          Email: <strong>{user?.email}</strong>
        </p>
        <p className="user-info">
          Role: <span className="role-badge role-badge-lg">{user?.role}</span>
        </p>
      </div>

      {user?.role === 'user' && (
        <div className="card">
          <h3>Manager Access</h3>

          {fetchingRequests ? (
            <p>Loading request status...</p>
          ) : (
            <>
              {!latestRequest && (
                <button
                  onClick={handleRequestManager}
                  className="btn btn-primary"
                  disabled={loadingRequest}
                >
                  {loadingRequest ? 'Submitting...' : 'Request Manager Access'}
                </button>
              )}

              {latestRequest && (
                <div className="request-status">
                  <p>
                    <strong>Request Status: </strong>
                    <span className={`status-badge status-${latestRequest.status}`}>
                      {latestRequest.status.charAt(0).toUpperCase() +
                        latestRequest.status.slice(1)}
                    </span>
                  </p>
                  <p className="text-muted">
                    Submitted:{' '}
                    {new Date(latestRequest.createdAt).toLocaleDateString()}
                  </p>

                  {latestRequest.status === 'rejected' && (
                    <button
                      onClick={handleRequestManager}
                      className="btn btn-primary"
                      disabled={loadingRequest || hasPendingRequest}
                      style={{ marginTop: '0.5rem' }}
                    >
                      {loadingRequest ? 'Submitting...' : 'Request Again'}
                    </button>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default HomePage;
