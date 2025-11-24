import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, RotateCcw, Award, Lightbulb } from 'lucide-react';
import { InteractiveLesson, ExerciseQuestion, QuestionType } from '../types';

interface InteractiveExerciseProps {
  exercise?: InteractiveLesson;
  onComplete?: (score: number) => void;
}

interface Answer {
  questionId: string;
  answer: string | number | string[];
}

const InteractiveExercise: React.FC<InteractiveExerciseProps> = ({
  exercise,
  onComplete
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [showExplanation, setShowExplanation] = useState(false);
  const [completed, setCompleted] = useState(false);

  const questions = useMemo(() => exercise?.questions || [], [exercise]);

  if (!exercise || questions.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-8 text-gray-400"
      >
        <p>Nenhum exercício disponível para esta aula.</p>
      </motion.div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const currentAnswer = answers.find(a => a.questionId === currentQuestion.id);

  const isAnswered = currentAnswer !== undefined;

  const handleAnswer = (answer: string | number | string[]) => {
    const newAnswers = answers.filter(a => a.questionId !== currentQuestion.id);
    newAnswers.push({ questionId: currentQuestion.id, answer });
    setAnswers(newAnswers);
    setShowExplanation(false);
  };

  const checkAnswer = (): boolean => {
    if (!isAnswered) return false;
    const answer = currentAnswer!.answer;
    
    if (Array.isArray(currentQuestion.correctAnswer)) {
      return Array.isArray(answer) && 
        answer.length === currentQuestion.correctAnswer.length &&
        answer.every(a => currentQuestion.correctAnswer.includes(a));
    }
    
    return String(answer) === String(currentQuestion.correctAnswer);
  };

  const isCorrect = isAnswered && checkAnswer();

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setShowExplanation(false);
    } else {
      const score = answers.filter((ans, idx) => {
        const q = questions.find(q => q.id === ans.questionId);
        if (!q) return false;
        if (Array.isArray(q.correctAnswer)) {
          return Array.isArray(ans.answer) &&
            ans.answer.length === q.correctAnswer.length &&
            ans.answer.every(a => q.correctAnswer.includes(a));
        }
        return String(ans.answer) === String(q.correctAnswer);
      }).length;
      
      setCompleted(true);
      onComplete?.(Math.round((score / questions.length) * 100));
    }
  };

  const handleReset = () => {
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setShowExplanation(false);
    setCompleted(false);
  };

  if (completed) {
    const score = answers.filter((ans) => {
      const q = questions.find(q => q.id === ans.questionId);
      if (!q) return false;
      if (Array.isArray(q.correctAnswer)) {
        return Array.isArray(ans.answer) &&
          ans.answer.length === q.correctAnswer.length &&
          ans.answer.every(a => q.correctAnswer.includes(a));
      }
      return String(ans.answer) === String(q.correctAnswer);
    }).length;
    
    const percentage = Math.round((score / questions.length) * 100);
    const passed = percentage >= 70;

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-[#1a1a2e] border border-gray-700/50 rounded-lg p-8 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
        >
          {passed ? (
            <CheckCircle2 size={48} className="text-green-500 mx-auto mb-4" />
          ) : (
            <Lightbulb size={48} className="text-amber-400 mx-auto mb-4" />
          )}
        </motion.div>

        <h2 className="text-2xl font-bold text-white mb-1">
          {passed ? 'Excelente!' : 'Revise os conceitos'}
        </h2>

        <div className="text-5xl font-bold text-white my-4">
          {percentage}%
        </div>

        <p className="text-gray-400 text-sm mb-6">
          Você acertou {score} de {questions.length} questões
        </p>

        <motion.button
          onClick={handleReset}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="px-6 py-3 bg-gradient-to-r from-[#8a4add] to-[#f27983] text-white font-bold rounded-lg hover:shadow-lg hover:shadow-[#8a4add]/30"
        >
          Tentar Novamente
        </motion.button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#1a1a2e] border border-gray-700/50 rounded-lg p-8 mb-12"
    >
      {/* HEADER COM PROGRESSO */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white">Exercício Prático</h2>
          <span className="text-sm text-gray-400">
            Questão {currentQuestionIndex + 1}/{questions.length}
          </span>
        </div>

        {/* PROGRESS BAR */}
        <div className="w-full bg-white/5 rounded-full h-2">
          <motion.div
            className="h-full bg-gradient-to-r from-[#8a4add] to-[#f27983]"
            initial={{ width: 0 }}
            animate={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
      </div>

      {/* QUESTÃO */}
      <motion.div
        key={currentQuestion.id}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="mb-8"
      >
        <h3 className="text-xl font-bold text-white mb-6">{currentQuestion.question}</h3>

        {/* RENDERIZAR RESPOSTA CONFORME TIPO */}
        <div className="space-y-3 mb-6">
          {currentQuestion.type === 'multipleChoice' && (
            <div className="space-y-3">
              {currentQuestion.options?.map((option, idx) => (
                <motion.button
                  key={idx}
                  onClick={() => handleAnswer(option)}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                    currentAnswer?.answer === option
                      ? 'bg-[#8a4add]/20 border-[#8a4add] text-white'
                      : 'bg-white/5 border-white/10 text-gray-300 hover:border-[#8a4add]/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        currentAnswer?.answer === option
                          ? 'bg-[#8a4add] border-[#8a4add]'
                          : 'border-gray-500'
                      }`}
                    >
                      {currentAnswer?.answer === option && <div className="w-2 h-2 bg-white rounded-full" />}
                    </div>
                    {option}
                  </div>
                </motion.button>
              ))}
            </div>
          )}

          {currentQuestion.type === 'trueOrFalse' && (
            <div className="grid grid-cols-2 gap-3">
              {['Verdadeiro', 'Falso'].map((option) => (
                <motion.button
                  key={option}
                  onClick={() => handleAnswer(option)}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className={`p-4 rounded-lg font-bold transition-all ${
                    currentAnswer?.answer === option
                      ? 'bg-[#8a4add]/20 border-2 border-[#8a4add] text-white'
                      : 'bg-white/5 border-2 border-white/10 text-gray-300 hover:border-[#8a4add]/50'
                  }`}
                >
                  {option}
                </motion.button>
              ))}
            </div>
          )}

          {currentQuestion.type === 'fillInBlank' && (
            <input
              type="text"
              placeholder={currentQuestion.placeholder || 'Digite sua resposta...'}
              value={currentAnswer?.answer || ''}
              onChange={(e) => handleAnswer(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-[#8a4add] focus:outline-none"
            />
          )}

          {currentQuestion.type === 'dragDrop' && (
            <div className="grid grid-cols-2 gap-3">
              {currentQuestion.items?.map((item, idx) => (
                <motion.button
                  key={idx}
                  onClick={() => {
                    const current = Array.isArray(currentAnswer?.answer) ? [...(currentAnswer.answer as string[])] : [];
                    if (current.includes(item)) {
                      current.splice(current.indexOf(item), 1);
                    } else {
                      current.push(item);
                    }
                    handleAnswer(current);
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`p-3 rounded-lg text-sm font-semibold transition-all ${
                    Array.isArray(currentAnswer?.answer) && (currentAnswer.answer as string[]).includes(item)
                      ? 'bg-[#8a4add]/30 border-2 border-[#8a4add] text-white'
                      : 'bg-white/5 border-2 border-white/10 text-gray-300 hover:border-[#8a4add]/50'
                  }`}
                >
                  {item}
                </motion.button>
              ))}
            </div>
          )}
        </div>

        {/* BOTÃO REVELAR RESPOSTA */}
        {isAnswered && !showExplanation && (
          <motion.button
            onClick={() => setShowExplanation(true)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-gray-300 font-semibold hover:bg-white/10 transition-all mb-4"
          >
            <Lightbulb size={16} className="inline mr-2" />
            {isCorrect ? 'Ver Explicação' : 'Ver Solução'}
          </motion.button>
        )}

        {/* EXPLICAÇÃO */}
        {isAnswered && showExplanation && currentQuestion.explanation && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-lg mb-4 ${
              isCorrect
                ? 'bg-green-500/10 border border-green-500/30 text-green-300'
                : 'bg-yellow-500/10 border border-yellow-500/30 text-yellow-300'
            }`}
          >
            <div className="flex gap-3">
              {isCorrect ? (
                <CheckCircle2 size={20} className="flex-shrink-0 mt-0.5" />
              ) : (
                <XCircle size={20} className="flex-shrink-0 mt-0.5" />
              )}
              <div>
                <p className="font-semibold mb-1">
                  {isCorrect ? '✓ Correto!' : '✗ Incorreto'}
                </p>
                <p className="text-sm">{currentQuestion.explanation}</p>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* BOTÃO PRÓXIMA/FINALIZAR */}
      <motion.button
        onClick={handleNext}
        disabled={!isAnswered}
        whileHover={isAnswered ? { scale: 1.02 } : {}}
        whileTap={isAnswered ? { scale: 0.98 } : {}}
        className={`w-full px-6 py-3 font-bold rounded-lg transition-all ${
          isAnswered
            ? 'bg-gradient-to-r from-[#8a4add] to-[#f27983] text-white hover:shadow-lg hover:shadow-[#8a4add]/50'
            : 'bg-white/5 text-gray-500 cursor-not-allowed'
        }`}
      >
        {currentQuestionIndex === questions.length - 1 ? 'Finalizar Exercício' : 'Próxima Questão →'}
      </motion.button>
    </motion.div>
  );
};

export default InteractiveExercise;
