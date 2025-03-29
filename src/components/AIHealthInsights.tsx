import React from 'react';
import { Brain, AlertTriangle, Trophy } from 'lucide-react';
import type { HealthInsight } from '../types';

interface AIHealthInsightsProps {
  insights: HealthInsight[];
  onDismiss: (id: string) => void;
}

const AIHealthInsights: React.FC<AIHealthInsightsProps> = ({ insights, onDismiss }) => {
  const getInsightIcon = (type: HealthInsight['type']) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'achievement':
        return <Trophy className="h-5 w-5 text-green-500" />;
      default:
        return <Brain className="h-5 w-5 text-blue-500" />;
    }
  };

  return (
    <div className="space-y-4">
      {insights.map((insight) => (
        <div
          key={insight.id}
          className="bg-white rounded-lg shadow-sm p-4 flex items-start space-x-4"
        >
          {getInsightIcon(insight.type)}
          <div className="flex-1">
            <p className="text-gray-800">{insight.message}</p>
            <span className="text-sm text-gray-500">{new Date(insight.date).toLocaleDateString()}</span>
          </div>
          {!insight.dismissed && (
            <button
              onClick={() => onDismiss(insight.id)}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          )}
        </div>
      ))}
    </div>
  );
};