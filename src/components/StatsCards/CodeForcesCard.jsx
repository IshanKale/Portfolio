import { useEffect, useState } from "react";
import { SiCodeforces } from "react-icons/si";
import "./CodeForcesCard.css";

const rankColors = {
  newbie: "#808080",
  pupil: "#008000",
  specialist: "#03a89e",
  expert: "#0000ff",
  "candidate master": "#aa00aa",
  master: "#ff8c00",
  "international master": "#ff8c00",
  grandmaster: "#ff0000",
  "international grandmaster": "#ff0000",
  "legendary grandmaster": "#ff0000",
};

const CodeForcesCard = ({ username }) => {
  const [data, setData] = useState({
    rating: 0,
    maxRating: 0,
    rank: "newbie",
    maxRank: "newbie",
    solved: 0,
    contests: 0,
    loading: true,
  });

  useEffect(() => {
    const fetchCodeforcesData = async () => {
      try {
        const [infoRes, ratingRes, statusRes] = await Promise.all([
          fetch(`https://codeforces.com/api/user.info?handles=${username}`),
          fetch(`https://codeforces.com/api/user.rating?handle=${username}`),
          fetch(`https://codeforces.com/api/user.status?handle=${username}`)
        ]);

        const infoData = await infoRes.json();
        const ratingData = await ratingRes.json();
        const statusData = await statusRes.json();

        if (infoData.status === "OK" && infoData.result.length > 0) {
          const info = infoData.result[0];
          
          // Calculate unique solved problems
          let solvedCount = 0;
          if (statusData.status === "OK" && Array.isArray(statusData.result)) {
            const solvedSet = new Set(
              statusData.result
                .filter(sub => sub.verdict === "OK")
                .map(sub => `${sub.problem.contestId}-${sub.problem.index}`)
            );
            solvedCount = solvedSet.size;
          }

          const contestCount = (ratingData.status === "OK" && Array.isArray(ratingData.result)) 
            ? ratingData.result.length 
            : 0;

          setData({
            rating: info.rating || 0,
            maxRating: info.maxRating || 0,
            rank: info.rank || "newbie",
            maxRank: info.maxRank || "newbie",
            solved: solvedCount,
            contests: contestCount,
            loading: false,
          });
        } else {
          setData(prev => ({ ...prev, loading: false }));
        }
      } catch (error) {
        console.error("Error fetching Codeforces data:", error);
        setData(prev => ({ ...prev, loading: false }));
      }
    };

    fetchCodeforcesData();
  }, [username]);

  if (data.loading) {
    return (
      <div className="stats-card skeleton-card">
        <div className="skeleton-element skeleton-image"></div>
        <div className="skeleton-group">
          <div className="skeleton-element skeleton-line w-40"></div>
          <div className="skeleton-element skeleton-line w-90"></div>
        </div>
        <div className="skeleton-group">
          <div className="skeleton-element skeleton-line w-60"></div>
          <div className="skeleton-element skeleton-line w-80"></div>
        </div>
        <div className="skeleton-element skeleton-footer"></div>
      </div>
    );
  }

  const rankColor = rankColors[data.rank.toLowerCase()] || "#808080";
  const maxRankColor = rankColors[data.maxRank.toLowerCase()] || "#808080";

  return (
    <div className="stats-card codeforces-card">
      <a href={`https://codeforces.com/profile/${username}`} target="_blank" rel="noreferrer" className="card-header-link">
        <div className="card-header">
          <SiCodeforces className="card-icon" style={{ color: "#3182ce" }} />
          <h3>Codeforces</h3>
        </div>
      </a>

      <div className="cf-stats-grid">
        <div className="cf-grade-container">
          <div className="cf-grade-badge" style={{ borderColor: rankColor, boxShadow: `0 0 15px ${rankColor}33` }}>
            <span className="cf-badge-label">RANK</span>
            <span className="cf-badge-value" style={{ color: rankColor }}>
              {data.rank.charAt(0).toUpperCase() + data.rank.slice(1)}
            </span>
          </div>
        </div>

        <div className="cf-stats-boxes">
          <div className="cf-stat-box">
            <span className="cf-stat-val">{data.rating}</span>
            <span className="cf-stat-name">RATING</span>
          </div>
          <div className="cf-stat-box">
            <span className="cf-stat-val">{data.maxRating}</span>
            <span className="cf-stat-name">MAX RATING</span>
          </div>
          <div className="cf-stat-box">
            <span className="cf-stat-val">{data.solved}</span>
            <span className="cf-stat-name">SOLVED</span>
          </div>
          <div className="cf-stat-box">
            <span className="cf-stat-val">{data.contests}</span>
            <span className="cf-stat-name">CONTESTS</span>
          </div>
        </div>
      </div>

      <div className="cf-footer-row">
        <span>Max Rank: <strong style={{ color: maxRankColor }}>{data.maxRank.charAt(0).toUpperCase() + data.maxRank.slice(1)}</strong></span>
      </div>
    </div>
  );
};

export default CodeForcesCard;
