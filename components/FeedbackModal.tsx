
import React, { useState } from 'react';
import { XCircleIcon } from './icons';

interface FeedbackModalProps {
  onClose: () => void;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({ onClose }) => {
  const [feedback, setFeedback] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (feedback.trim()) {
      console.log('Feedback submitted:', feedback);
      setIsSubmitted(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 relative animate-in fade-in-0 zoom-in-95">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
          <XCircleIcon className="h-6 w-6" />
        </button>
        
        {isSubmitted ? (
            <div className="text-center py-8">
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Thank You!</h2>
                <p className="text-slate-600">Your feedback has been submitted successfully.</p>
            </div>
        ) : (
            <>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Provide Feedback</h2>
                <p className="text-sm text-slate-500 mb-6">Help us improve the Smart Spaces Navigator.</p>

                <form onSubmit={handleSubmit}>
                    <textarea
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        className="w-full h-32 p-3 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        placeholder="Tell us what you think..."
                        required
                    />
                    <div className="mt-6 flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-md hover:bg-slate-200 transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition disabled:bg-blue-300"
                            disabled={!feedback.trim()}
                        >
                            Submit Feedback
                        </button>
                    </div>
                </form>
            </>
        )}
      </div>
    </div>
  );
};

export default FeedbackModal;
