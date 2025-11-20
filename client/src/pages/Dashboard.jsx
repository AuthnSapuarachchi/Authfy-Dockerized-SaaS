import React, { useState, useEffect, useContext } from 'react';
import Menubar from '../components/Menubar';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const { backendUrl, isLoggedIn } = useContext(AppContext);

  // --- State Management ---
  const [keys, setKeys] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  
  // This state holds the secret key IMMEDIATELY after creation (to show it once)
  const [createdKeyData, setCreatedKeyData] = useState(null);

  // --- API Logic ---

  // 1. Fetch Keys on Load
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

  // 2. Create a New Key
  const handleCreateKey = async () => {
    if (!newKeyName.trim()) {
      toast.warning("Please enter a key name");
      return;
    }
    
    try {
      axios.defaults.withCredentials = true;
      const response = await axios.post(`${backendUrl}/keys`, { name: newKeyName });

      if (response.status === 200 || response.status === 201) {
        setCreatedKeyData(response.data); // Store the response (contains the raw key)
        setShowCreateModal(false); // Close input modal
        setNewKeyName(''); // Reset name
        toast.success("API Key created successfully!");
        fetchKeys(); // Refresh the table list
      }
    } catch (error) {
      console.error("Error creating key:", error);
      toast.error(error.response?.data?.message || "Failed to create key");
    }
  };

  // 3. Revoke (Delete) a Key
  const handleRevokeKey = async (id) => {
    if (!window.confirm("Are you sure? This will immediately stop any software using this key.")) return;

    try {
      axios.defaults.withCredentials = true;
      const response = await axios.delete(`${backendUrl}/keys/${id}`);

      if (response.status === 200) {
        toast.success("Key revoked successfully!");
        fetchKeys(); // Refresh list to show it's gone/inactive
      }
    } catch (error) {
      console.error("Failed to revoke", error);
      toast.error(error.response?.data?.message || "Failed to revoke key");
    }
  };

  // Run fetch on component mount
  useEffect(() => {
    fetchKeys();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn]);

  // Helper for the "Copy" button
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
          <div className="d-flex justify-content-between align-items-end mb-4">
            <div>
              <h1 className="display-5 fw-bold text-dark">Developer Dashboard</h1>
              <p className="text-muted mt-2">Manage your API keys and secure your applications.</p>
            </div>
            <button 
              onClick={() => setShowCreateModal(true)}
              className="btn btn-primary btn-lg shadow-sm d-flex align-items-center gap-2"
            >
              <span className="fs-4 fw-bold">+</span> Create New Key
            </button>
          </div>

          {/* --- Main Table Section --- */}
          <div className="card shadow-sm border-0 rounded-3 overflow-hidden">
            {isLoading ? (
              <div className="p-5 text-center text-muted">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3">Loading your keys...</p>
              </div>
            ) : keys.length === 0 ? (
              // Empty State
              <div className="text-center py-5 px-4">
                <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '64px', height: '64px' }}>
                  <i className="bi bi-key-fill fs-1 text-primary"></i>
                </div>
                <h3 className="h5 fw-semibold text-dark">No API keys found</h3>
                <p className="text-muted mt-2 mx-auto" style={{ maxWidth: '400px' }}>
                  You haven't created any keys yet. Click the button above to generate your first secure key.
                </p>
              </div>
            ) : (
              // Table State
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead className="table-light">
                    <tr>
                      <th className="px-4 py-3 text-uppercase small text-muted fw-semibold">Key Name</th>
                      <th className="px-4 py-3 text-uppercase small text-muted fw-semibold">Prefix</th>
                      <th className="px-4 py-3 text-uppercase small text-muted fw-semibold">Status</th>
                      <th className="px-4 py-3 text-uppercase small text-muted fw-semibold">Created At</th>
                      <th className="px-4 py-3 text-uppercase small text-muted fw-semibold text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {keys.map((key) => (
                      <tr key={key.id}>
                        <td className="px-4 py-3 fw-semibold text-dark">{key.name}</td>
                        <td className="px-4 py-3">
                          <code className="bg-light px-2 py-1 rounded small text-muted">
                            {key.keyPrefix}
                          </code>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`badge ${key.isActive ? 'bg-success' : 'bg-danger'} px-3 py-2`}>
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

          {/* --- MODAL 1: Create Key Input --- */}
          {showCreateModal && (
            <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={() => setShowCreateModal(false)}>
              <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
                <div className="modal-content">
                  <div className="modal-header border-0">
                    <h5 className="modal-title fw-bold">Name Your Key</h5>
                    <button type="button" className="btn-close" onClick={() => setShowCreateModal(false)}></button>
                  </div>
                  <div className="modal-body">
                    <p className="text-muted small mb-3">Give this key a friendly name so you know what it's used for.</p>
                    
                    <input 
                      type="text" 
                      autoFocus
                      placeholder="e.g. Payment Service Production" 
                      className="form-control form-control-lg"
                      value={newKeyName}
                      onChange={(e) => setNewKeyName(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleCreateKey()}
                    />
                  </div>
                  <div className="modal-footer border-0">
                    <button 
                      onClick={() => setShowCreateModal(false)} 
                      className="btn btn-secondary"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleCreateKey} 
                      className="btn btn-primary"
                    >
                      Create Key
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* --- MODAL 2: Success / Show Secret Key --- */}
          {createdKeyData && (
            <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }} onClick={() => setCreatedKeyData(null)}>
              <div className="modal-dialog modal-dialog-centered modal-lg" onClick={(e) => e.stopPropagation()}>
                <div className="modal-content">
                  <div className="modal-body p-4">
                    <div className="text-center mb-4">
                      <div className="bg-success bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '64px', height: '64px' }}>
                        <i className="bi bi-check-circle-fill fs-1 text-success"></i>
                      </div>
                      <h3 className="h4 fw-bold text-dark">API Key Generated!</h3>
                      <p className="text-muted mt-2">
                        Please copy this key and save it somewhere safe. <br/> 
                        <span className="text-danger fw-semibold">You will not be able to see it again.</span>
                      </p>
                    </div>
                    
                    <div className="bg-light p-3 rounded border d-flex justify-content-between align-items-center mb-4">
                      <code className="text-primary flex-grow-1 text-break" style={{ fontSize: '1.1rem' }}>
                        {createdKeyData.rawKey || createdKeyData.key}
                      </code>
                      <button 
                        onClick={() => copyToClipboard(createdKeyData.rawKey || createdKeyData.key)} 
                        className="btn btn-sm btn-outline-primary ms-3"
                        title="Copy to clipboard"
                      >
                        <i className="bi bi-clipboard"></i>
                      </button>
                    </div>

                    <button 
                      onClick={() => setCreatedKeyData(null)} 
                      className="btn btn-primary w-100 btn-lg"
                    >
                      I have saved it
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
