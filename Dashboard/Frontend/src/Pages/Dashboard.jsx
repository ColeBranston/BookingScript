import React, { useState, useEffect } from 'react';
import moment from 'moment';

const PAGE_SIZE = 5;

const Dashboard = () => {
  const [entries, setEntries] = useState([]);
  const [page, setPage] = useState(0);

  // Fetch all entries on mount
  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const response = await fetch(
          'https://bookingbackend.vercel.app/api/entries',
          { headers: { 'Content-Type': 'application/json' } }
        );
        if (!response.ok) throw new Error(response.statusText);
        const data = await response.json();
        // Sort by date/time if needed, then reverse to have most recent first
        const sorted = data.slice().reverse();
        setEntries(sorted);
      } catch (err) {
        console.error('Failed to fetch entries:', err);
      }
    };
    fetchEntries();
  }, []);

  const currentDate = moment().format('YYYY-MM-DD');

  // Pagination logic
  const start = page * PAGE_SIZE;
  const end = start + PAGE_SIZE;
  const pageEntries = entries.slice(start, end);
  const totalPages = Math.ceil(entries.length / PAGE_SIZE);

  const prevPage = () => setPage((p) => Math.max(p - 1, 0));
  const nextPage = () => setPage((p) => Math.min(p + 1, totalPages - 1));

  // Image mapping
  const image = {
    "ACEB 2437": "/assets/ACEB-2437.PNG",
    "ACEB 2439": "/assets/ACEB-2439.PNG",
    "ACEB 2450": "/assets/ACEB-2450.PNG",
    "ACEB 2445": "/assets/ACEB-2445.PNG",
    "ACEB 2448": "/assets/ACEB-2448.PNG",
    "ACEB 3448": "/assets/ACEB-3448.PNG",
  };

  return (
    <div className="dashboard-container">
      <h1>Dashboard</h1>
      <div className="pagination-controls" style={{ marginBottom: '1rem' }}>
        <button onClick={prevPage} disabled={page === 0} style={{ marginRight: '0.5rem' }}>
          ← Previous
        </button>
        <span>Page {page + 1} of {totalPages || 1}</span>
        <button
          onClick={nextPage}
          disabled={page >= totalPages - 1}
          style={{ marginLeft: '0.5rem' }}
        >
          Next →
        </button>
      </div>
      <div className="entries-container">
        {pageEntries.map((entry, idx) => (
          <div className="entireCard" key={entry._id}>
            <div
              className="entry-card"
              style={{
                animationDelay: `${idx * 0.1}s`,
                border: entry.Date === currentDate ? '3px solid red' : 'none',
              }}
            >
              <div className="cardInfo">
                <h2>{entry.Room}</h2>
                <p>Date: {entry.Date}</p>
                <p>Time: {entry.Time}</p>
              </div>
              <div className="cardImage">
                <img
                  src={image[entry.Room]}
                  alt={entry.Room}
                  className="roomImage"
                />
              </div>
            </div>
            <div
              className="behind-card"
              style={{
                animationDelay: `${idx * 0.1}s`,
                border: entry.Date === currentDate ? '3px solid red' : 'none',
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
export default Dashboard