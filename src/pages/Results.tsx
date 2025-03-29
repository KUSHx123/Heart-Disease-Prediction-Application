interface PredictionResultsProps {
  predictionData?: {
    probability?: number;
    metrics?: {
      precision?: number;
      recall?: number;
      f1Score?: number;
    };
  };
}

const Results = ({ predictionData }: PredictionResultsProps) => {
  if (!predictionData || !predictionData.probability) {
    return <div className="text-center text-red-600">No prediction data found.</div>;
  }

  const metricsData = [
    { name: "Precision", value: predictionData.metrics?.precision || 0 },
    { name: "Recall", value: predictionData.metrics?.recall || 0 },
    { name: "F1 Score", value: predictionData.metrics?.f1Score || 0 },
  ];

  return (
    <div className="p-4 border rounded-lg">
      <h2 className="text-lg font-bold">Prediction Results</h2>
      <p>Probability of Heart Disease: <strong>{(predictionData.probability * 100).toFixed(2)}%</strong></p>
      <h3 className="mt-4 font-semibold">Model Performance:</h3>
      <ul>
        {metricsData.map((metric, index) => (
          <li key={index}>{metric.name}: {metric.value.toFixed(2)}</li>
        ))}
      </ul>
    </div>
  );
};

export default Results;
