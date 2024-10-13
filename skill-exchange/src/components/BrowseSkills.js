import React, { useState, useEffect } from 'react';
import '../App.css';

const BrowseSkills = ({ skillExchangeContract }) => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSkills = async () => {
      if (skillExchangeContract) {
        try {
          const skillCount = await skillExchangeContract.getSkillCount();
          const fetchedSkills = [];
          for (let i = 1; i <= skillCount; i++) {
            const skill = await skillExchangeContract.getSkill(i);
            fetchedSkills.push({
              id: i,
              title: skill.title,
              description: skill.description,
              price: skill.price.toString(),
              owner: skill.owner
            });
          }
          setSkills(fetchedSkills);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching skills:", error);
          setLoading(false);
        }
      }
    };

    fetchSkills();
  }, [skillExchangeContract]);

  if (loading) {
    return <div className="page-content">Loading skills...</div>;
  }

  return (
    <div className="page-content">
      <h2 className="page-title">Browse Skills</h2>
      {skills.length === 0 ? (
        <p>No skills listed yet.</p>
      ) : (
        <div className="skill-grid">
          {skills.map((skill) => (
            <div key={skill.id} className="skill-card">
              <h3>{skill.title}</h3>
              <p>{skill.description}</p>
              <p>Price: {skill.price} ETH</p>
              <p>Owner: {skill.owner.slice(0, 6)}...{skill.owner.slice(-4)}</p>
              <button className="btn primary-btn">Request Service</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BrowseSkills;
