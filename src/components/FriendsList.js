// src/components/FriendsList.js
import React, { useEffect } from 'react';
import { Users, X, Trophy } from 'lucide-react';

const FriendsList = ({ friends = [], setFriends, onSelectFriend }) => {

  useEffect(() => {
    localStorage.setItem('leetcode-friends', JSON.stringify(friends));
  }, [friends]);

  const removeFriend = (username) => {
    const updatedFriends = friends.filter(friend => friend.username !== username);
    setFriends(updatedFriends);
  };

  const handleFriendClick = (friend) => {
    if (onSelectFriend) {
      onSelectFriend(friend);
    }
  };

  return (
    <div className="friends-list">
      <div className="friends-header">
        <Users size={20} />
        <h3>Friends ({friends.length})</h3>
      </div>

      {friends.length === 0 ? (
        <div className="no-friends">
          <p>No friends added yet</p>
          <small>Search for users and add them as friends!</small>
        </div>
      ) : (
        <div className="friends-container">
          {friends.map((friend) => (
            <div key={friend.username} className="friend-item">
              <div 
                className="friend-info"
                onClick={() => handleFriendClick(friend)}
              >
                <div className="friend-name">{friend.username}</div>
                <div className="friend-stats">
                  <Trophy size={12} />
                  <span>{friend.totalSolved} solved</span>
                </div>
              </div>
              <button 
                className="remove-friend"
                onClick={() => removeFriend(friend.username)}
                title="Remove friend"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {friends.length > 0 && (
        <div className="friends-leaderboard">
          <h4>Top Friend</h4>
          <div className="top-friend">
            {friends.sort((a, b) => b.totalSolved - a.totalSolved)[0].username}
            <span className="crown">👑</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default FriendsList;