import React, { useState, useEffect, useContext } from 'react';
import Menubar from '../components/Menubar';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const { backendUrl, isLoggedIn } = useContext(AppContext);

  const [keys, setKeys] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [createdKeyData, setCreatedKeyData] = useState(null);

  // Fetch Keys on Load
  const fetchKeys = async () => {
    try {
      if (!isLoggedIn) {
        setIsLoading(false);
        return;
      }

      axios.defaults.withCredentials = true;
      const response = await axios.get(`${backendUrl}/keys`);
      
      if (response.status === 200) {
        setKeys(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch keys", error);
      if (error.response && error.response.status !== 401) {
        toast.error(error.response?.data?.message || "Failed to fetch keys");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchKeys();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn]);

  // Create a New Key
  const handleCreateKey = async () => {
    if (!newKeyName.trim()) {
      toast.warning("Please enter a key name");
      return;
    }
    
    try {
      axios.defaults.withCredentials = true;
      const response = await axios.post(`${backendUrl}/keys`, { name: newKeyName });

      if (response.status === 200 || response.status === 201) {
        setCreatedKeyData(response.data);
        setShowCreateModal(false);
        setNewKeyName('');
        toast.success("API Key created successfully!");
        fetchKeys();
      }
    } catch (error) {
      console.error("Error creating key:", error);
      toast.error(error.response?.data?.message || "Failed to create key");
    }
  };

  // Revoke (Delete) a Key
  const handleRevokeKey = async (id) => {
    if (!window.confirm("Are you sure? This will immediately stop any software using this key.")) return;

    try {
      axios.defaults.withCredentials = true;
      const response = await axios.delete(`${backendUrl}/keys/${id}`);

      if (response.status === 200) {
        toast.success("Key revoked successfully!");
        fetchKeys();
      }
    } catch (error) {
      console.error("Failed to revoke", error);
      toast.error(error.response?.data?.message || "Failed to revoke key");
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Secret Key Copied! Store it safely.");
  };


  return (
    <>
      <Menubar />
      
      <div className="min-vh-100 bg-light py-5">
        <div className="container" style={{ maxWidth: '1200px' }}>
          
          {/* --- Header Section --- */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="fw-bold text-dark mb-1">API Keys</h2>
              <p className="text-muted mb-0">Manage your authentication keys</p>
            </div>
            <button 
              onClick={() => setShowCreateModal(true)}
              className="btn btn-primary d-flex align-items-center gap-2"
            >
              <span className="fw-bold">+</span> Create Key
            </button>
          </div>

          {/* --- Quick Stats --- */}
          <div className="row g-4 mb-4">
            <div className="col-md-4">
              <div className="card border-0 shadow-sm overflow-hidden" style={{ borderLeft: '4px solid #0d6efd' }}>
                <div className="card-body p-4">
                  <div className="d-flex align-items-center">
                    <div className="flex-shrink-0">
                      <div className="rounded-3 p-3" style={{ backgroundColor: '#e7f1ff' }}>
                        <i className="bi bi-stack fs-4 text-primary"></i>
                      </div>
                    </div>
                    <div className="flex-grow-1 ms-3">
                      <div className="text-muted small text-uppercase fw-semibold mb-1">Total Keys</div>
                      <div className="h3 fw-bold mb-0 text-dark">{keys.length}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card border-0 shadow-sm overflow-hidden" style={{ borderLeft: '4px solid #198754' }}>
                <div className="card-body p-4">
                  <div className="d-flex align-items-center">
                    <div className="flex-shrink-0">
                      <div className="rounded-3 p-3" style={{ backgroundColor: '#d1e7dd' }}>
                        <i className="bi bi-check-circle fs-4 text-success"></i>
                      </div>
                    </div>
                    <div className="flex-grow-1 ms-3">
                      <div className="text-muted small text-uppercase fw-semibold mb-1">Active Keys</div>
                      <div className="h3 fw-bold mb-0 text-success">{keys.filter(key => key.isActive).length}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card border-0 shadow-sm overflow-hidden" style={{ borderLeft: '4px solid #dc3545' }}>
                <div className="card-body p-4">
                  <div className="d-flex align-items-center">
                    <div className="flex-shrink-0">
                      <div className="rounded-3 p-3" style={{ backgroundColor: '#f8d7da' }}>
                        <i className="bi bi-shield-x fs-4 text-danger"></i>
                      </div>
                    </div>
                    <div className="flex-grow-1 ms-3">
                      <div className="text-muted small text-uppercase fw-semibold mb-1">Revoked Keys</div>
                      <div className="h3 fw-bold mb-0 text-danger">{keys.filter(key => !key.isActive).length}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        

          {/* --- API Keys Table --- */}
          <div className="card shadow-sm border-0">
            {isLoading ? (
              <div className="p-5 text-center">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3 text-muted">Loading keys...</p>
              </div>
            ) : keys.length === 0 ? (
              <div className="text-center py-5">
                <div className="mb-3">
                  <i className="bi bi-key-fill fs-1 text-muted"></i>
                </div>
                <h5 className="text-dark">No API keys yet</h5>
                <p className="text-muted">Create your first key to get started</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead className="table-light">
                    <tr>
                      <th className="px-4 py-3">Name</th>
                      <th className="px-4 py-3">Key Prefix</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Created</th>
                      <th className="px-4 py-3 text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {keys.map((key) => (
                      <tr key={key.id}>
                        <td className="px-4 py-3 fw-semibold">{key.name}</td>
                        <td className="px-4 py-3">
                          <code className="bg-light px-2 py-1 rounded small">
                            {key.keyPrefix}
                          </code>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`badge ${key.isActive ? 'bg-success' : 'bg-secondary'}`}>
                            {key.isActive ? 'Active' : 'Revoked'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-muted">
                          {new Date(key.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 text-end">
                          {key.isActive && (
                            <button 
                              onClick={() => handleRevokeKey(key.id)} 
                              className="btn btn-sm btn-outline-danger"
                            >
                              Revoke
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* --- Create Key Modal --- */}
          {showCreateModal && (
            <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={() => setShowCreateModal(false)}>
              <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Create New API Key</h5>
                    <button type="button" className="btn-close" onClick={() => setShowCreateModal(false)}></button>
                  </div>
                  <div className="modal-body">
                    <label className="form-label">Key Name</label>
                    <input 
                      type="text" 
                      autoFocus
                      placeholder="e.g. Production Key" 
                      className="form-control"
                      value={newKeyName}
                      onChange={(e) => setNewKeyName(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleCreateKey()}
                    />
                  </div>
                  <div className="modal-footer">
                    <button onClick={() => setShowCreateModal(false)} className="btn btn-secondary">
                      Cancel
                    </button>
                    <button onClick={handleCreateKey} className="btn btn-primary">
                      Create
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* --- Key Created Success Modal --- */}
          {createdKeyData && (
            <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }} onClick={() => setCreatedKeyData(null)}>
              <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
                <div className="modal-content">
                  <div className="modal-body p-4">
                    <div className="text-center mb-4">
                      <i className="bi bi-check-circle-fill fs-1 text-success mb-3 d-block"></i>
                      <h5 className="fw-bold">API Key Created!</h5>
                      <p className="text-muted small">
                        Copy this key now. <span className="text-danger">You won't see it again.</span>
                      </p>
                    </div>
                    
                    <div className="bg-light p-3 rounded border d-flex align-items-center mb-3">
                      <code className="flex-grow-1 text-break small">
                        {createdKeyData.rawKey || createdKeyData.key}
                      </code>
                      <button 
                        onClick={() => copyToClipboard(createdKeyData.rawKey || createdKeyData.key)} 
                        className="btn btn-sm btn-outline-primary ms-2"
                      >
                        <i className="bi bi-clipboard"></i>
                      </button>
                    </div>

                    <button onClick={() => setCreatedKeyData(null)} className="btn btn-primary w-100">
                      Done
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
};

export default Dashboard;
