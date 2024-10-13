import React, { useState, useEffect } from 'react';

const Profile = ({ account, skillExchangeContract }) => {
  const [userSkills, setUserSkills] = useState([]);

  useEffect(() => {
    const fetchUserSkills = async () => {
      if (skillExchangeContract && account) {
        try {
          const skills = await skillExchangeContract.getUserSkills(account);
          setUserSkills(skills);
        } catch (error) {
          console.error("Error fetching user skills:", error);
        }
      }
    };

    fetchUserSkills();
  }, [skillExchangeContract, account]);

  return (
    <div className="profile">
      <h2>User Profile</h2>
      <p>Account: {account}</p>
      <h3>Your Skills</h3>
      {userSkills.map((skill, index) => (
        <div key={index} className="skill-item">
          <h4>{skill.title}</h4>
          <p>{skill.description}</p>
        </div>
      ))}
    </div>
  );
};

export default Profile;
