import React, { useState, useEffect } from 'react';
import '../App.css';

const ServiceRequests = ({ skillExchangeContract, account }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newRequest, setNewRequest] = useState({ title: '', description: '' });

  useEffect(() => {
    const fetchRequests = async () => {
      if (skillExchangeContract) {
        try {
          const requestCount = await skillExchangeContract.getRequestCount();
          const fetchedRequests = [];
          for (let i = 1; i <= requestCount; i++) {
            const request = await skillExchangeContract.getRequest(i);
            fetchedRequests.push({
              id: i,
              title: request.title,
              description: request.description,
              requester: request.requester
            });
          }
          setRequests(fetchedRequests);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching requests:", error);
          setLoading(false);
        }
      }
    };

    fetchRequests();
  }, [skillExchangeContract]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await skillExchangeContract.createRequest(newRequest.title, newRequest.description);
      setNewRequest({ title: '', description: '' });
      alert('Service request created successfully!');
      // Refresh the list of requests
      const requestCount = await skillExchangeContract.getRequestCount();
      const latestRequest = await skillExchangeContract.getRequest(requestCount);
      setRequests([...requests, {
        id: requestCount,
        title: latestRequest.title,
        description: latestRequest.description,
        requester: latestRequest.requester
      }]);
    } catch (error) {
      console.error("Error creating service request:", error);
      alert('Error creating service request. Please try again.');
    }
  };

  if (loading) {
    return <div className="page-content">Loading service requests...</div>;
  }

  return (
    <div className="page-content">
      <h2 className="page-title">Service Requests</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="request-title">Request Title</label>
          <input
            type="text"
            id="request-title"
            value={newRequest.title}
            onChange={(e) => setNewRequest({ ...newRequest, title: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="request-description">Request Description</label>
          <textarea
            id="request-description"
            value={newRequest.description}
            onChange={(e) => setNewRequest({ ...newRequest, description: e.target.value })}
            required
          />
        </div>
        <button type="submit" className="submit-btn">Create Request</button>
      </form>
      <h3>Current Requests</h3>
      {requests.length === 0 ? (
        <p>No service requests yet.</p>
      ) : (
        <div className="request-grid">
          {requests.map((request) => (
            <div key={request.id} className="request-card">
              <h3>{request.title}</h3>
              <p>{request.description}</p>
              <p>Requester: {request.requester.slice(0, 6)}...{request.requester.slice(-4)}</p>
              {request.requester !== account && (
                <button className="btn primary-btn">Offer Service</button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ServiceRequests;
