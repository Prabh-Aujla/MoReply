"use client";

import { useState } from "react";

// Interface that describes what a social comment looks like in our app
interface SocialComment {
  id: string;
  platform: "Instagram" | "Facebook" | "X" | "TikTok";
  userName: string;
  userHandle: string;
  content: string;
  date: string;
  postPreview: string;
  likes: number;
  hasReply?: boolean;
  reply: string; // hardcoded 
}

export default function SocialPage() {
  // State for the search input and platform dropdown
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState("All");

  // Hardcoded list of example social media comments
  const comments: SocialComment[] = [
    {
      id: "1",
      platform: "Instagram",
      userName: "Alo",
      userHandle: "alo_eats",
      content: "This place is my new favorite spot 😍",
      date: "1 hour ago",
      postPreview: "Weekend brunch vibes are unmatched here!",
      likes: 42,
      hasReply: false,
      reply:
        "Hi @alo_eats, thank you so much for the love! We're so happy this is your new favorite spot and we can’t wait to see you again soon! 💙",
    },
    {
      id: "2",
      platform: "Facebook",
      userName: " Davis",
      userHandle: "Ben.davis",
      content: "Do you take reservations for large groups on weekends?",
      date: "3 hours ago",
      postPreview: "Planning something special? 👀",
      likes: 15,
      hasReply: true,
      reply:
        "Hi Ben, great question! Yes, we do take reservations for large groups on weekends. Please send us a message with your date, time, and group size so we can confirm for you.",
    },
    {
      id: "3",
      platform: "TikTok",
      userName: "Teji",
      userHandle: "Teji_foodreview",
      content: "Tried your brunch today, the pancakes were amazing 🥞",
      date: "Yesterday",
      postPreview: "Rating local brunch spots so you don’t have to!",
      likes: 128,
      hasReply: false,
      reply:
        "Hi @Teji_foodreview, thank you for stopping by and for the kind words! We’re so happy you loved the pancakes — hope to see you again for brunch soon! 🥞✨",
    },
  ];

  // Filter comments based on:
  // - search term (matches name, handle, or content)
  // - selected platform (Instagram, Facebook, X, TikTok or All)
  const filteredComments = comments.filter((comment) => {
    const matchesSearch =
      `${comment.userName} ${comment.userHandle} ${comment.content}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesPlatform =
      selectedPlatform === "All" || comment.platform === selectedPlatform;

    return matchesSearch && matchesPlatform;
  });

  return (
    <section className="space-y-6">
      {/* Page title and short description */}
      <header className="space-y-2">
        <h1 className="text-2xl font-bold text-gray-900">Social Media</h1>
        <p className="text-sm text-gray-500">
          View recent Instagram, Facebook, X, and TikTok comments and generate
          placeholder replies.
        </p>
      </header>

      {/* Search input + platform filter dropdown */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        {/* Text input for searching comments */}
        <input
          type="text"
          placeholder="Search comments..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded-full border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 shadow-sm placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />

        {/* Dropdown for filtering by platform */}
        <select
          className="w-full rounded-full border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:w-48"
          value={selectedPlatform}
          onChange={(e) => setSelectedPlatform(e.target.value)}
        >
          <option value="All">All Platforms</option>
          <option value="Instagram">Instagram</option>
          <option value="Facebook">Facebook</option>
          <option value="X">X</option>
          <option value="TikTok">TikTok</option>
        </select>
      </div>

      {/* List of filtered comments, or "no comments found" message */}
      <div className="space-y-4">
        {filteredComments.length > 0 ? (
          filteredComments.map((comment) => (
            <SocialCommentCard key={comment.id} comment={comment} />
          ))
        ) : (
          <p className="text-sm text-gray-500 italic text-center py-6">
            No comments found.
          </p>
        )}
      </div>
    </section>
  );
}

// Component to render a single social comment card
function SocialCommentCard({ comment }: { comment: SocialComment }) {
  // Local state for showing the reply box and storing the reply text
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [replyText, setReplyText] = useState("");

  // Shows the reply section and loads the hardcoded reply text
  const handleGenerate = () => {
    setShowReplyBox(true);
    setReplyText(comment.reply);
  };

  // Puts the original hardcoded reply back into the textarea
  const handleRegenerate = () => setReplyText(comment.reply);

  // Copies the reply text to clipboard
  const handleCopy = () => {
    if (!replyText) return;
    navigator.clipboard.writeText(replyText);
    alert("Reply copied to clipboard!");
  };

  // post reply (just shows an alert here)
  const handlePost = () => {
    if (!replyText) return;
    alert("Reply posted successfully!");
    setShowReplyBox(false);
  };

  // Simple styling helper to give each platform a different color
  const platformColor =
    comment.platform === "Instagram"
      ? "text-pink-500"
      : comment.platform === "Facebook"
      ? "text-blue-600"
      : comment.platform === "X"
      ? "text-gray-900"
      : "text-purple-500";

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      {/* Top section: user info, handle, platform, and date */}
      <div className="flex items-start justify-between">
        <div>
          
          <p className="font-semibold text-blue-600">{comment.userName}</p>
          <p className="text-xs text-gray-500">@{comment.userHandle}</p>
          <p className={`mt-1 text-xs font-medium ${platformColor}`}>
            {comment.platform}
          </p>
        </div>
        <p className="text-xs text-gray-400">{comment.date}</p>
      </div>

      {/* Short preview of the original post they commented on */}
      <div className="mt-3 rounded-xl bg-gray-50 p-3">
        <p className="mb-1 text-xs text-gray-500">On your post:</p>
        <p className="text-sm italic text-gray-700">"{comment.postPreview}"</p>
      </div>

      {/* The actual comment text from the user */}
      <p className="mt-3 text-sm text-gray-700">{comment.content}</p>

      {/* likes and whether it has a reply or not */}
      <div className="mt-3 text-xs text-gray-500">
        Likes:{" "}
        <span className="font-medium text-gray-700">{comment.likes}</span> •
        Status:{" "}
        <span className="font-medium text-gray-700">
          {comment.hasReply ? "Replied" : "No reply yet"}
        </span>
      </div>

      {/* Button to generate a reply. This only shows before the reply box is open. */}
      {!showReplyBox && (
        <button
          onClick={handleGenerate}
          className="mt-4 inline-flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition"
        >
          <span className="text-base">✨</span>
          Generate Reply
        </button>
      )}

      {/* Reply section: textarea + buttons, shown after "Generate Reply" */}
      {showReplyBox && (
        <div className="mt-4 space-y-3 border-t pt-3">
          <label className="text-sm font-medium text-gray-800">
            Generated Reply
          </label>
          {/* The user can edit the generated reply here */}
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            className="w-full min-h-[100px] rounded-xl border border-gray-300 p-2 text-sm text-gray-800"
            placeholder="Reply will appear here..."
          />

          {/* Actions for the reply: reset, copy, and "post" */}
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

      {/* Small label at the bottom just for branding / explanation */}
      <p className="mt-3 text-right text-[11px] text-gray-400 italic">
        Powered by MoReply AI
      </p>
    </div>
  );
}
