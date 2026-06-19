import { useEffect, useState } from "react";
import { SiLeetcode } from "react-icons/si";
import "./LeetCodeCard.css";

const LeetCodeCard = ({ username }) => {
  const [data, setData] = useState({
    solved: 0,
    total: 0,
    rank: 0,
    badges: 0,
    reputation: 0,
    easy: { solved: 0, total: 0, beats: 75 },
    medium: { solved: 0, total: 0, beats: 68 },
    hard: { solved: 0, total: 0, beats: 45 },
    loading: true,
  });

  useEffect(() => {
    const fetchLeetCodeData = async () => {
      try {
        const [profileRes, badgesRes] = await Promise.all([
          fetch(`https://alfa-leetcode-api.onrender.com/userProfile/${username}`),
          fetch(`https://alfa-leetcode-api.onrender.com/${username}/badges`)
        ]);

        const profile = await profileRes.json();
        const badges = await badgesRes.json();

        setData({
          solved: profile.totalSolved || 0,
          total: profile.totalQuestions || 0,
          rank: profile.ranking || 0,
          badges: badges.badgesCount || 0,
          reputation: profile.reputation || 0,
          easy: { 
            solved: profile.easySolved || 0, 
            total: profile.totalEasy || 1, 
            beats: 82 
          },
          medium: { 
            solved: profile.mediumSolved || 0, 
            total: profile.totalMedium || 1, 
            beats: 65 
          },
          hard: { 
            solved: profile.hardSolved || 0, 
            total: profile.totalHard || 1, 
            beats: 48 
          },
          loading: false,
        });
      } catch (error) {
        console.error("Error fetching LeetCode data:", error);
        setData(prev => ({ ...prev, loading: false }));
      }
    };

    fetchLeetCodeData();
  }, [username]);

  if (data.loading) {
    return <div className="stats-card leetcode-card skeleton-loading">Loading...</div>;
  }

  const ringDasharray = 251.2; // 2 * PI * r (r=40)
  const ringDashoffset = ringDasharray - (data.solved / (data.total || 1)) * ringDasharray;

  return (
    <div className="stats-card leetcode-card">
      <a href={`https://leetcode.com/u/${username}/`} target="_blank" rel="noreferrer" className="card-header-link">
        <div className="card-header">
          <SiLeetcode className="card-icon" />
          <h3>LeetCode</h3>
        </div>
      </a>
      
      <div className="leetcode-top-grid">
        <div className="solved-ring-container">
          <svg className="solved-ring" width="100" height="100" viewBox="0 0 100 100">
            <circle className="ring-bg" cx="50" cy="50" r="40" />
            <circle 
              className="ring-progress" 
              cx="50" cy="50" r="40" 
              strokeDasharray={ringDasharray} 
              strokeDashoffset={ringDashoffset}
            />
          </svg>
          <div className="ring-text">
            <span className="ring-val">{data.solved}</span>
            <span className="ring-total">{data.total}</span>
          </div>
        </div>

        <div className="lc-stats-grid">
          <div className="lc-stat-box">
            <span className="lc-stat-val">{data.rank.toLocaleString()}</span>
            <span className="lc-stat-name">RANK</span>
          </div>
          <div className="lc-stat-box">
            <span className="lc-stat-val text-gold">{data.badges}</span>
            <span className="lc-stat-name">BADGES</span>
          </div>
          <div className="lc-stat-box full-width">
            <span className="lc-stat-val text-purple">{data.reputation}</span>
            <span className="lc-stat-name">REPUTATION</span>
          </div>
        </div>
      </div>

      <div className="lc-difficulty-section">
        {/* Easy */}
        <div className="difficulty-row">
          <div className="diff-header">
            <span className="diff-label text-easy">Easy</span>
            <div className="diff-stats">
              <span className="diff-counts">{data.easy.solved}/{data.easy.total}</span>
              <span className="diff-beats text-easy">Beats {data.easy.beats}%</span>
            </div>
          </div>
          <div className="diff-bar-bg">
            <div 
              className="diff-bar-fill bg-easy" 
              style={{ width: `${(data.easy.solved / data.easy.total) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Medium */}
        <div className="difficulty-row">
          <div className="diff-header">
            <span className="diff-label text-medium">Medium</span>
            <div className="diff-stats">
              <span className="diff-counts">{data.medium.solved}/{data.medium.total}</span>
              <span className="diff-beats text-medium">Beats {data.medium.beats}%</span>
            </div>
          </div>
          <div className="diff-bar-bg">
            <div 
              className="diff-bar-fill bg-medium" 
              style={{ width: `${(data.medium.solved / data.medium.total) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Hard */}
        <div className="difficulty-row">
          <div className="diff-header">
            <span className="diff-label text-hard">Hard</span>
            <div className="diff-stats">
              <span className="diff-counts">{data.hard.solved}/{data.hard.total}</span>
              <span className="diff-beats text-hard">Beats {data.hard.beats}%</span>
            </div>
          </div>
          <div className="diff-bar-bg">
            <div 
              className="diff-bar-fill bg-hard" 
              style={{ width: `${(data.hard.solved / data.hard.total) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeetCodeCard;
