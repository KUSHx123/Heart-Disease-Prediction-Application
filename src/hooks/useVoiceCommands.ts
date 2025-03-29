import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const useVoiceCommands = () => {
  const [isListening, setIsListening] = useState(false);
  const navigate = useNavigate();

  const startListening = () => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.onresult = (event: any) => {
        const command = event.results[event.results.length - 1][0].transcript.toLowerCase();

        // Handle navigation commands
        if (command.includes('show dashboard')) {
          navigate('/dashboard');
        } else if (command.includes('show predictions') || command.includes('show history')) {
          navigate('/history');
        } else if (command.includes('new prediction')) {
          navigate('/predict');
        } else if (command.includes('show profile')) {
          navigate('/profile');
        }
      };

      recognition.start();
      return recognition;
    }
    return null;
  };

  return { isListening, startListening };
};