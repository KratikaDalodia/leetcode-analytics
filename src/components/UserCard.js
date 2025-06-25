// src/components/UserCard.js
import React from 'react';
import { User, Trophy, Calendar, TrendingUp, MapPin, GraduationCap } from 'lucide-react';

const UserCard = ({ user, onAddFriend, isInFriends, onViewProfile }) => {
  const { 
    username, 
    realName,
    avatar,
    totalSolved, 
    easySolved, 
    mediumSolved, 
    hardSolved, 
    ranking, 
    acceptanceRate,
    school,
    country,
    skillTags 
  } = user;

  const handleViewProfile = () => {
    if (onViewProfile) {
      onViewProfile(user);
    }
  };

  return (
    <div className="user-card">
      <div className="user-header">
        <div className="user-avatar">
          {avatar ? (
            <img src={avatar} alt={username} className="avatar-img" />
          ) : (
            <User size={40} />
          )}
        </div>
        <div className="user-info">
          <h3 className="username">{realName || username}</h3>
          {realName && realName !== username && (
            <p className="handle">@{username}</p>
          )}
          <div className="user-stats-summary">
            <span className="total-solved">{totalSolved} problems solved</span>
            {ranking && <span className="ranking">Rank: #{ranking.toLocaleString()}</span>}
          </div>
          
          {/* Additional info */}
          <div className="user-details">
            {school && (
              <div className="detail-item">
                <GraduationCap size={14} />
                <span>{school}</span>
              </div>
            )}
            {country && (
              <div className="detail-item">
                <MapPin size={14} />
                <span>{country}</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="user-actions">
          <button 
            className={`add-friend-btn ${isInFriends ? 'added' : ''}`}
            onClick={() => onAddFriend(user)}
            disabled={isInFriends}
          >
            {isInFriends ? '✓ Added' : 'Add Friend'}
          </button>
        </div>
      </div>

      <div className="problems-breakdown">
        <div className="problem-stat easy">
          <span className="count">{easySolved}</span>
          <span className="label">Easy</span>
        </div>
        <div className="problem-stat medium">
          <span className="count">{mediumSolved}</span>
          <span className="label">Medium</span>
        </div>
        <div className="problem-stat hard">
          <span className="count">{hardSolved}</span>
          <span className="label">Hard</span>
        </div>
      </div>

      <div className="additional-stats">
        <div className="stat-item">
          <Trophy size={16} />
          <span>Acceptance: {acceptanceRate}%</span>
        </div>
        <div className="stat-item">
          <TrendingUp size={16} />
          <span 
            className="view-profile-link"
            onClick={handleViewProfile}
          >
            View Profile
          </span>
        </div>
      </div>

      {/* Skill tags */}
      {skillTags && skillTags.length > 0 && (
        <div className="skill-tags">
          <h4>Skills:</h4>
          <div className="tags-container">
            {skillTags.slice(0, 5).map((tag, index) => (
              <span key={index} className="skill-tag">
                {tag}
              </span>
            ))}
            {skillTags.length > 5 && (
              <span className="skill-tag more">+{skillTags.length - 5} more</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserCard;