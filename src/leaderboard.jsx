import React, { useEffect, useState } from 'react';
import app from './firebase';
import { collection, query, orderBy, limit, onSnapshot, getFirestore } from "firebase/firestore";
import { Trophy, Medal } from 'lucide-react';
import './leaderboard.css';

export default function Leaderboard() {
  const db = getFirestore(app);
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const scoresRef = collection(db, "scores");
    const q = query(scoresRef, orderBy("score", "desc"), limit(10));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const leaderboardData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setLeaders(leaderboardData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [db]);

  const getRankIcon = (index) => {
    if (index === 0) return <Trophy size={20} color="#FFD700" />;
    if (index === 1) return <Medal size={20} color="#C0C0C0" />;
    if (index === 2) return <Medal size={20} color="#CD7F32" />;
    return <span className="rank-number">#{index + 1}</span>;
  };

  return (
    <div className="leaderboard-container">
      <div className="leaderboard-header">
        <h2>🏆 Top Players</h2>
      </div>

      {loading ? (
        <p className="loading-text">Loading scores...</p>
      ) : (
        <div className="leaderboard-list">
          {leaders.map((player, index) => (
            <div key={player.id} className={`leaderboard-item rank-${index + 1}`}>
              <div className="player-rank">{getRankIcon(index)}</div>
              
              <div className="player-info">
                <span className="player-name">{player.name}</span>
                <span className="player-date">
                    {/* SAFETY CHECK: Only call toDate if createdAt exists */}
                    {player.createdAt && typeof player.createdAt.toDate === 'function' 
                      ? player.createdAt.toDate().toLocaleDateString() 
                      : ''}
                </span>
              </div>
              
              <div className="player-score">{player.score} pts</div>
            </div>
          ))}

          {leaders.length === 0 && (
            <div className="no-scores">No scores yet. Be the first!</div>
          )}
        </div>
      )}
    </div>
  );
}