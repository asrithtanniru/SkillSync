import { useState } from 'react';

interface ReviewFormProps {
  onSubmit: (review: { rating: number; feedback: string }) => void;
}

export default function ReviewForm({ onSubmit }: ReviewFormProps) {
  const [rating, setRating] = useState(5);
  const [feedback, setFeedback] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ rating, feedback });
  };

  return (
    <form onSubmit={handleSubmit} className="review-form flex flex-col gap-4 my-4">
      <div>
        <label className="block text-sm font-medium mb-1">Rating: </label>
        <select
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className="w-full p-2 border border-gray-300 rounded-md"
        >
          <option value={5}>⭐⭐⭐⭐⭐ Excellent</option>
          <option value={4}>⭐⭐⭐⭐ Good</option>
          <option value={3}>⭐⭐⭐ Average</option>
          <option value={2}>⭐⭐ Poor</option>
          <option value={1}>⭐ Very Poor</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Feedback: </label>
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="How was your experience?"
          required
          className="w-full p-2 border border-gray-300 rounded-md min-h-[100px]"
        />
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
      >
        Submit Review
      </button>
    </form>
  );
} 
