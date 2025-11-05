"use client";

import { useState } from "react";

// defines what data each review will contain.
interface Review {
  id: string;
  platform: "Google" | "Yelp";
  userName: string;
  rating: number;
  content: string;
  date: string;
  reply: string; // hardcoded AI-style reply for each review
}

export default function ReviewsPage() {
  // These useState hooks store user input for searching and filtering reviews
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState<"All" | "Google" | "Yelp">("All");

  // Hardcoded review
  const allReviews: Review[] = [
    {
      id: "1",
      platform: "Google",
      userName: "Alo",
      rating: 5,
      content:
        "Amazing service! The staff was super friendly and helpful. I’ll definitely be coming back.",
      date: "2 hours ago",
      reply:
        "Hi Alo, thank you so much for your kind words! We're thrilled you enjoyed your experience and we can’t wait to see you again soon!",
    },
    {
      id: "2",
      platform: "Yelp",
      userName: "Ben Davis",
      rating: 2,
      content:
        "The wait time was too long and my order was incorrect when it finally arrived.",
      date: "5 hours ago",
      reply:
        "Hi Ben, we’re really sorry to hear about the delay and the mix-up. We appreciate your feedback and will work on making sure this doesn’t happen again.",
    },
    {
      id: "3",
      platform: "Google",
      userName: "Enrique",
      rating: 4,
      content:
        "Good experience overall, but the parking situation was confusing the first time.",
      date: "1 day ago",
      reply:
        "Hi Enrique, thanks for the honest feedback! We’re glad you enjoyed your visit and will look into improving our parking directions.",
    },
  ];

  // Filtering logic:
  // - Checks if the search term is inside the review text, name, or platform.
  // - Also filters based on whether the user selected "Google", "Yelp", or "All".
  const filteredReviews = allReviews.filter((review) => {
    const matchesSearch =
      `${review.userName} ${review.platform} ${review.content}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesPlatform =
      selectedPlatform === "All" || review.platform === selectedPlatform;

    return matchesSearch && matchesPlatform;
  });

  return (
    <section className="space-y-6">
      {/* Title and description at the top of the page */}
      <header className="space-y-2">
        <h1 className="text-2xl font-bold text-gray-900">Reviews</h1>
        <p className="text-sm text-gray-500">
          View recent Google &amp; Yelp reviews and generate placeholder replies.
        </p>
      </header>

      {/* Search bar and dropdown to filter reviews */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        {/* Search input box - filters by user name or review text */}
        <input
          type="text"
          placeholder="Search reviews..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded-full border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 shadow-sm placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />

        {/* Dropdown that filters reviews by platform */}
        <select
          className="w-full rounded-full border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:w-48"
          value={selectedPlatform}
          onChange={(e) => setSelectedPlatform(e.target.value as "All" | "Google" | "Yelp")}
        >
          <option value="All">All Platforms</option>
          <option value="Google">Google</option>
          <option value="Yelp">Yelp</option>
        </select>
      </div>

      {/* If reviews match the filters, show them, otherwise show "no reviews found" */}
      <div className="space-y-4">
        {filteredReviews.length > 0 ? (
          filteredReviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))
        ) : (
          <p className="py-6 text-center text-sm italic text-gray-500">
            No reviews found.
          </p>
        )}
      </div>
    </section>
  );
}

// Component that displays one review card at a time
function ReviewCard({ review }: { review: Review }) {
  // These control when to show the reply section and what text it contains
  const [showReply, setShowReply] = useState(false);
  const [replyText, setReplyText] = useState("");

  // When the user clicks "Generate Reply", show the reply box with a preset response
  const handleGenerate = () => {
    setShowReply(true);
    setReplyText(review.reply);
  };

  // "Regenerate" just resets it back to the original text
  const handleRegenerate = () => {
    setReplyText(review.reply);
  };

  // Copies the reply text into the clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(replyText);
    alert("Reply copied to clipboard!");
  };

  // post the reply 
  const handlePost = () => {
    alert("Reply posted successfully!");
    setShowReply(false);
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      {/* Review header with username, platform, and rating */}
      <div className="flex items-start justify-between">
        <div>
          {/* User name highlighted in blue */}
          <p className="font-semibold text-blue-600">{review.userName}</p>
          <p className="text-xs text-gray-500">{review.platform}</p>
          <div className="mt-1 text-yellow-400">
            {"⭐".repeat(review.rating)}
          </div>
          <p className="mt-2 text-sm text-gray-600">{review.content}</p>
        </div>
        {/* Review date aligned to the right */}
        <p className="text-xs text-gray-400">{review.date}</p>
      </div>

      {/* Only show this button until a reply is generated */}
      {!showReply && (
        <button
          onClick={handleGenerate}
          className="mt-4 inline-flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition"
        >
          <span className="text-base">✨</span> Generate Reply
        </button>
      )}

      {/* This part appears once you click "Generate Reply" */}
      {showReply && (
        <div className="mt-4 space-y-3 border-t pt-3">
          <p className="text-sm font-medium text-gray-800">Generated Reply:</p>
          {/* The textarea allows editing the reply */}
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            className="w-full min-h-[100px] rounded-xl border border-gray-300 p-2 text-sm text-gray-800"
          />

          {/* Buttons to interact with the reply */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleRegenerate}
              className="rounded-full border border-gray-300 bg-white px-4 py-1.5 text-xs font-medium text-gray-800 hover:bg-gray-100 transition"
            >
              Regenerate
            </button>
            <button
              onClick={handleCopy}
              className="rounded-full border border-gray-300 bg-white px-4 py-1.5 text-xs font-medium text-gray-800 hover:bg-gray-100 transition"
            >
              Copy
            </button>
            <button
              onClick={handlePost}
              className="ml-auto rounded-full bg-blue-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 transition"
            >
              Post Reply
            </button>
          </div>
        </div>
      )}

      {/* Small note at the bottom for branding */}
      <p className="mt-3 text-right text-[11px] italic text-gray-400">
        Powered by MoReply AI
      </p>
    </div>
  );
}
