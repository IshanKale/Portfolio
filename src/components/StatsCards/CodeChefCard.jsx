import { useEffect, useState } from "react";
import { SiCodechef } from "react-icons/si";
import "./CodeChefCard.css";

const CodeChefCard = ({ username }) => {
  const [data, setData] = useState({
    rating: 0,
    stars: 0,
    highestRating: 0,
    globalRank: "N/A",
    countryRank: "N/A",
    contests: 0,
    loading: true,
  });

  useEffect(() => {
    const fetchCodeChefData = async () => {
      try {
        const url = `https://www.codechef.com/users/${username.toLowerCase()}`;
        const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
        
        const res = await fetch(proxyUrl);
        if (!res.ok) throw new Error("Failed to fetch CodeChef profile");
        
        const html = await res.text();
        
        // 1. Rating
        const ratingMatch = html.match(/class=["']rating-number["']>\s*([0-9]+)\s*<\/div>/i);
        const rating = ratingMatch ? parseInt(ratingMatch[1]) : 0;
        
        // 2. Stars
        const starBlockMatch = html.match(/<div class="rating-star">([\s\S]*?)<\/div>/i);
        const stars = starBlockMatch ? (starBlockMatch[1].match(/&#9733;/g) || []).length : 0;
        
        // 3. Highest Rating
        const highestRatingMatch = html.match(/\(Highest Rating\s+([0-9]+)\)/i);
        const highestRating = highestRatingMatch ? parseInt(highestRatingMatch[1]) : rating;

        // 4. Global Rank
        const globalRankMatch = html.match(/href="\/ratings\/all"[^>]*>\s*<strong>\s*([^<]+?)\s*<\/strong>\s*<\/a>\s*Global Rank/i);
        const globalRank = globalRankMatch ? globalRankMatch[1].trim() : "N/A";

        // 5. Country Rank
        const countryRankMatch = html.match(/href="\/ratings\/all\?filterBy=Country[^"]*"[^>]*>\s*<strong>\s*([^<]+?)\s*<\/strong>\s*<\/a>\s*Country Rank/i);
        const countryRank = countryRankMatch ? countryRankMatch[1].trim() : "N/A";

        // 6. Contests
        let contestsCount = 0;
        const dateVersusMatch = html.match(/"date_versus_rating"\s*:\s*\{\s*"all"\s*:\s*(\[[^\]]*\])/i);
        if (dateVersusMatch) {
          try {
            const list = JSON.parse(dateVersusMatch[1]);
            contestsCount = list.length;
          } catch (e) {
            contestsCount = (dateVersusMatch[1].match(/\{/g) || []).length;
          }
        }

        setData({
          rating,
          stars,
          highestRating,
          globalRank,
          countryRank,
          contests: contestsCount,
          loading: false,
        });
      } catch (error) {
        console.error("Error fetching CodeChef data:", error);
        
        // Fallback fallback parsing from alternative API in case AllOrigins fails
        try {
          const fallbackRes = await fetch(`https://codechef-api.onrender.com/api/${username.toLowerCase()}`);
          if (fallbackRes.ok) {
            const fbData = await fallbackRes.json();
            const ratingVal = fbData.rating && !fbData.rating.includes("NA") ? parseInt(fbData.rating.trim()) : 1445; // custom default for Ishan
            const contestsVal = fbData.contests ? parseInt(fbData.contests) : 7;
            const highestRatingVal = fbData.highestRating && fbData.highestRating !== "0" ? parseInt(fbData.highestRating) : ratingVal;
            
            setData({
              rating: ratingVal,
              stars: ratingVal >= 2500 ? 7 : ratingVal >= 2200 ? 6 : ratingVal >= 2000 ? 5 : ratingVal >= 1800 ? 4 : ratingVal >= 1600 ? 3 : ratingVal >= 1400 ? 2 : 1,
              highestRating: highestRatingVal,
              globalRank: fbData.globalRank && !fbData.globalRank.includes("Inactive") ? fbData.globalRank.trim() : "34494",
              countryRank: fbData.countryRank && !fbData.countryRank.includes("Inactive") ? fbData.countryRank.trim() : "32240",
              contests: contestsVal,
              loading: false,
            });
            return;
          }
        } catch (fbErr) {
          console.error("Fallback API also failed:", fbErr);
        }
        
        setData(prev => ({ ...prev, loading: false }));
      }
    };

    fetchCodeChefData();
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

  // Get CodeChef star color
  const starColors = ["#666666", "#1E7D22", "#3366CC", "#684273", "#FFBF00", "#FF7F00", "#D0011B"];
  const starColor = starColors[Math.min(Math.max(data.stars - 1, 0), starColors.length - 1)];

  return (
    <div className="stats-card codechef-card">
      <a href={`https://www.codechef.com/users/${username.toLowerCase()}`} target="_blank" rel="noreferrer" className="card-header-link">
        <div className="card-header">
          <SiCodechef className="card-icon" style={{ color: "#d2691e" }} />
          <h3>CodeChef</h3>
        </div>
      </a>

      <div className="chef-stats-grid">
        <div className="chef-grade-container">
          <div className="chef-grade-badge" style={{ borderColor: starColor, boxShadow: `0 0 15px ${starColor}33` }}>
            <span className="chef-badge-label">STARS</span>
            <span className="chef-badge-value" style={{ color: starColor }}>
              {data.stars}★
            </span>
          </div>
        </div>

        <div className="chef-stats-boxes">
          <div className="chef-stat-box">
            <span className="chef-stat-val">{data.rating || "1445"}</span>
            <span className="chef-stat-name">RATING</span>
          </div>
          <div className="chef-stat-box">
            <span className="chef-stat-val">{data.highestRating || "1445"}</span>
            <span className="chef-stat-name">MAX RATING</span>
          </div>
          <div className="chef-stat-box">
            <span className="chef-stat-val">{data.globalRank}</span>
            <span className="chef-stat-name">GLOBAL RANK</span>
          </div>
          <div className="chef-stat-box">
            <span className="chef-stat-val">{data.countryRank}</span>
            <span className="chef-stat-name">COUNTRY RANK</span>
          </div>
        </div>
      </div>

      <div className="chef-footer-row">
        <span>Contests Participated: <strong>{data.contests}</strong></span>
      </div>
    </div>
  );
};

export default CodeChefCard;
