import React, { useState } from 'react';
import '../App.css';

const Governance = ({ createProposal }) => {
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    createProposal(description);
  };

  return (
    <div className="page-content">
      <h2 className="page-title">Create a Proposal</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="proposal-description">Proposal Description</label>
          <textarea
            id="proposal-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter your proposal description"
            required
          />
        </div>
        <button type="submit" className="submit-btn">Create Proposal</button>
      </form>
    </div>
  );
};

export default Governance;
