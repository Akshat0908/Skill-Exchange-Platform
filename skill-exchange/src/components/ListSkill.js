import React, { useState } from 'react';
import '../App.css';

const ListSkill = ({ listSkill, skillExchangeContract }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!skillExchangeContract) {
      alert('Skill exchange contract not initialized. Please connect your wallet.');
      return;
    }
    try {
      await listSkill(title, description, price);
      setTitle('');
      setDescription('');
      setPrice('');
      // Remove the alert as we're using Snackbar for notifications
    } catch (error) {
      console.error("Error listing skill:", error);
      // Remove the alert as we're using Snackbar for notifications
    }
  };

  return (
    <div className="page-content">
      <h2 className="page-title">List a Skill</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="skill-title">Skill Title</label>
          <input
            type="text"
            id="skill-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="skill-description">Skill Description</label>
          <textarea
            id="skill-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="skill-price">Price (ETH)</label>
          <input
            type="number"
            id="skill-price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            step="0.001"
            min="0"
            required
          />
        </div>
        <button type="submit" className="submit-btn">List Skill</button>
      </form>
    </div>
  );
};

export default ListSkill;
