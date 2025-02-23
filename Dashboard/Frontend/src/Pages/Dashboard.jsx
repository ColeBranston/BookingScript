import React, { useState, useEffect, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { checkLogin } from '../contexts/isLoggedIn';

const Dashboard = () => {
  const { isLoggedIn } = useContext(checkLogin);
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/entries', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          setEntries(data); // Store the fetched entries in the state
        } else {
          console.error('Failed to fetch entries:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching entries:', error);
      }
    };

    fetchEntries(); // Call the fetchEntries function when the component mounts
  }, []);

  return (
    <>
      {isLoggedIn ? null : <Navigate to="/" />}
      <div className="dashboard-container">
        <h1>Dashboard</h1>
        <div className="entries-container">
          {entries.map((entry, index) => (
            <div className="entry-card" key={entry._id} style={{ animationDelay: `${index * 0.1}s` }}>
              <h2>{entry.Room}</h2>
              <p>Date: {entry.Date}</p>
              <p>Time: {entry.Time}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
