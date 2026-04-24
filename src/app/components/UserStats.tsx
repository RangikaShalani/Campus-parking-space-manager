import { TrendingUp, Award, CheckCircle } from 'lucide-react';

interface UserStatsProps {
  reputationScore: number;
  accurateUpdates: number;
  totalUpdates: number;
}

export function UserStats({ reputationScore, accurateUpdates, totalUpdates }: UserStatsProps) {
  const accuracy = totalUpdates > 0 ? Math.round((accurateUpdates / totalUpdates) * 100) : 0;

  const getReputationLevel = () => {
    if (reputationScore >= 100) return { level: 'Gold', color: 'text-yellow-600', bg: 'bg-yellow-50' };
    if (reputationScore >= 50) return { level: 'Silver', color: 'text-gray-600', bg: 'bg-gray-50' };
    return { level: 'Bronze', color: 'text-orange-600', bg: 'bg-orange-50' };
  };

  const reputation = getReputationLevel();

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 space-y-3">
      <div className="flex items-center gap-2">
        <Award className={`w-5 h-5 ${reputation.color}`} />
        <h3 className="font-semibold text-gray-800">Your Stats</h3>
      </div>

      <div className={`${reputation.bg} rounded-lg p-3 space-y-2`}>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-700">Reputation</span>
          <span className={`font-bold ${reputation.color}`}>{reputation.level}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full ${reputation.color.replace('text-', 'bg-')}`}
            style={{ width: `${Math.min((reputationScore % 50) * 2, 100)}%` }}
          ></div>
        </div>
        <div className="text-xs text-gray-600">{reputationScore} points</div>
      </div>

      <div className="space-y-2 pt-2 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600 flex items-center gap-1">
            <CheckCircle className="w-4 h-4" />
            Accuracy
          </span>
          <span className="font-semibold text-gray-800">{accuracy}%</span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600 flex items-center gap-1">
            <TrendingUp className="w-4 h-4" />
            Updates Today
          </span>
          <span className="font-semibold text-gray-800">{totalUpdates}</span>
        </div>
      </div>
    </div>
  );
}
