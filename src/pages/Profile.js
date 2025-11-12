import React from 'react';
import { useAudio } from '../context/AudioContext';

const Profile = () => {
  const { user, audioItems } = useAudio();
  const userItems = audioItems.filter(item => item.artist === user?.username);

  return (
    <div className="page">
      <h2>Your Profile</h2>
      <div className="profile-info">
        <p><strong>Username:</strong> {user?.username}</p>
        <p><strong>Email:</strong> {user?.email}</p>
        <p><strong>Uploads:</strong> {userItems.length}</p>
      </div>
      
      <h3>Your Uploads</h3>
      <div className="audio-grid">
        {userItems.map(item => (
          <div key={item.id} className="audio-card">
            <h4>{item.title}</h4>
            <p>Type: {item.type}</p>
            <audio controls>
              <source src={item.audioUrl} type="audio/mpeg" />
            </audio>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Profile;