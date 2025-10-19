import React, { useEffect, useState } from 'react';
import { MutatingDots } from 'react-loader-spinner';

const GroupList = () => {
  const [groups, setGroups] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const defaultVisibleGroups = 5; // this can be changed, for now its 5

  const filteredGroups = groups
    .filter(group =>
      group.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => a.localeCompare(b)); // Sort alphabetically

  // expand the group list
  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  // Fetch groups from the get-identity API
  useEffect(() => {
    const fetchGroupData = async () => {
      try {
        const response = await fetch('/api/userdetails');
        const data = await response.json();

        if (data && data.identity && data.identity.groups) {
          setGroups(data.identity.groups);
        } else {
          setError('No group data available');
        }
      } catch (err) {
        console.error('Error fetching group data:', err);
        setError('Error fetching group data');
      } finally {
        setLoading(false);
      }
    };

    fetchGroupData();
  }, []);

  return (
    <div className="card-container bg-white p-6 rounded-lg border border-gray-light drop-shadow-sm relative">
      <div className="flex justify-between items-center">
        <h2 className="card-title text-xl font-semibold mb-3">Your Current Groups</h2>
        <input
          type="text"
          id="searchBox"
          placeholder="Search groups"
          className="border border-steel p-2 rounded mb-5"
          onChange={(e) => setSearchTerm(e.target.value)}
          value={searchTerm}
        />
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-full w-full">
         <MutatingDots height="100" width="100" color="#ff7901" secondaryColor="#ff7901" radius="12.5" ariaLabel="mutating-dots-loading" visible={true} />
        </div>
      ) : error ? (
        <p className="text-red">{error}</p>
      ) : (
        <>
          <ul className={`info-list2 ${!expanded ? 'max-h-24 overflow-hidden' : ''}`}>
            {filteredGroups.slice(0, expanded ? filteredGroups.length : defaultVisibleGroups).map((group, index) => (
              <li key={index} className="mb-2">{group}</li>
            ))}
          </ul>
          
          <button
            className="w-full text-center text-white py-2 mt-2"
            style={{
              backgroundColor: expanded ? 'rgba(0, 0, 0, 0.5)' : 'rgba(0, 0, 0, 0.2)',
              transition: 'background-color 0.3s ease',
            }}
            onClick={toggleExpand}
          >
            {expanded ? 'Collapse list' : 'Expand list'}
          </button>
        </>
      )}
    </div>
  );
};

export default GroupList;
