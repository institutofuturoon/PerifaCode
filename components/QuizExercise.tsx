import React, { useState, useEffect } from 'react';
import { QuizExerciseData } from '../types';

interface QuizExerciseProps {
  exercise: QuizExerciseData;
  onComplete: () => void;
  isCompleted: boolean;
}

const QuizExercise: React.FC<QuizExerciseProps> = ({ exercise, onComplete, isCompleted }) => {
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  useEffect(() => {
    // Reset state when exercise changes
    setSelectedOptionId(null);
    setFeedback(null);
    setIsCorrect(null);
  }, [exercise.id]);
  
  const handleSubmit = () => {
    if (isCompleted || !selectedOptionId) return;

    if (selectedOptionId === exercise.correctOptionId) {
      setFeedback(exercise.feedback.correct);
      setIsCorrect(true);
      onComplete();
    } else {
      setFeedback(exercise.feedback.incorrect);
      setIsCorrect(false);
    }
  };

  const getOptionClasses = (optionId: string) => {
    let classes = 'w-full text-left p-4 border rounded-lg transition-all duration-200 ';
    
    if (isCompleted || isCorrect !== null) {
      // After submission
      if(optionId === exercise.correctOptionId) {
        return classes + 'bg-green-500/20 border-green-500 text-white';
      }
      if(optionId === selectedOptionId && !isCorrect) {
        return classes + 'bg-red-500/20 border-red-500 text-white';
      }
      return classes + 'border-white/10 text-gray-400 bg-black/20';
    } else {
      // Before submission
      if(selectedOptionId === optionId) {
        return classes + 'bg-purple-500/30 border-purple-400';
      }
      return classes + 'border-white/20 hover:bg-white/10 hover:border-purple-400';
    }
  };


  return (
    <div>
      <p className="text-lg text-gray-300 mb-6">{exercise.prompt}</p>
      <div className="space-y-4">
        {exercise.options.map(option => (
          <button
            key={option.id}
            onClick={() => setSelectedOptionId(option.id)}
            disabled={isCompleted || isCorrect !== null}
            className={getOptionClasses(option.id)}
          >
            {option.text}
          </button>
        ))}
      </div>
      
      {!isCompleted && !isCorrect && (
        <button
          onClick={handleSubmit}
          disabled={!selectedOptionId}
          className="mt-6 font-semibold py-2 px-6 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed bg-purple-600 text-white hover:bg-purple-700 shadow-lg shadow-purple-500/20"
        >
          Verificar Resposta
        </button>
      )}

      {feedback && (
        <div className={`mt-4 p-4 rounded-lg text-sm ${isCorrect ? 'bg-green-500/10 text-green-300' : 'bg-red-500/10 text-red-300'}`}>
            {feedback}
        </div>
      )}

      {isCompleted && (
         <div className="mt-4 p-4 rounded-lg text-sm bg-green-500/10 text-green-300 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
            Parabéns, você concluiu esta atividade!
        </div>
      )}
    </div>
  );
};

export default QuizExercise;