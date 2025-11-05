"use client";

import { useEffect, useState } from "react";

type Channel = "Review" | "Social";
type Platform = "Google" | "Yelp" | "Instagram" | "Facebook" | "X" | "TikTok";
type ReplyTone = "Friendly" | "Professional" | "Playful" | "Apologetic" | "Custom";

type AutoReplyTemplate = {
  id: string;
  name: string;
  channel: Channel;
  platform: Platform;
  tone: ReplyTone | "";
  emojiPreference: string;
  replyText: string;
  isActive: boolean;
  createdAt: string;
};

type ViewMode = "grid" | "table";

export default function MoReplyViewPage() {
  const [templates, setTemplates] = useState<AutoReplyTemplate[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [platformFilter, setPlatformFilter] = useState<string>("All");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editBuffer, setEditBuffer] = useState<Partial<AutoReplyTemplate>>({});

  // Load from localStorage, or seed demo templates if empty
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const stored = localStorage.getItem("moreply-templates");
      if (stored) {
        const parsed: AutoReplyTemplate[] = JSON.parse(stored);
        if (parsed.length > 0) {
          setTemplates(parsed);
          return;
        }
      }

      // Seed demo templates if nothing is stored
      const demoTemplates: AutoReplyTemplate[] = [
        {
          id: "demo_1",
          name: "Friendly Google reply",
          channel: "Review",
          platform: "Google",
          tone: "Friendly",
          emojiPreference: "😊✨",
          replyText:
            "Thank you for taking the time to leave us a review. We really appreciate your support and love having you as a customer. 😊✨",
          isActive: true,
          createdAt: new Date().toISOString(),
        },
        {
          id: "demo_2",
          name: "Apologetic Yelp reply",
          channel: "Review",
          platform: "Yelp",
          tone: "Apologetic",
          emojiPreference: "🙏",
          replyText:
            "Thank you for taking the time to leave us a review. We’re sorry that things weren’t perfect this time and we’re committed to fixing it. 🙏",
          isActive: true,
          createdAt: new Date().toISOString(),
        },
      ];

      setTemplates(demoTemplates);
      localStorage.setItem("moreply-templates", JSON.stringify(demoTemplates));
    } catch (err) {
      console.error("Failed to load templates", err);
    }
  }, []);

  // Keep localStorage in sync with any edits/deletes
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem("moreply-templates", JSON.stringify(templates));
    } catch (err) {
      console.error("Failed to save templates", err);
    }
  }, [templates]);

  // Filter by platform
  const visibleTemplates = templates.filter((tpl) => {
    if (platformFilter === "All") return true;
    return tpl.platform === platformFilter;
  });

  const startEditing = (template: AutoReplyTemplate) => {
    setEditingId(template.id);
    setEditBuffer({
      name: template.name,
      replyText: template.replyText,
      isActive: template.isActive,
    });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditBuffer({});
  };

  const saveEditing = (id: string) => {
    setTemplates((prev) =>
      prev.map((tpl) =>
        tpl.id === id
          ? {
              ...tpl,
              name: (editBuffer.name ?? tpl.name).trim(),
              replyText: (editBuffer.replyText ?? tpl.replyText).trim(),
              isActive:
                typeof editBuffer.isActive === "boolean"
                  ? editBuffer.isActive
                  : tpl.isActive,
            }
          : tpl
      )
    );
    setEditingId(null);
    setEditBuffer({});
  };

  const handleDelete = (id: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this template?"
    );
    if (!confirmDelete) return;
    setTemplates((prev) => prev.filter((tpl) => tpl.id !== id));
  };

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-bold text-gray-900">
          View &amp; Manage Templates
        </h1>
        <p className="text-sm text-gray-500">
          These templates are loaded from the JSON created on the /moreply/create
          page (stored in localStorage for this demo).
        </p>
      </header>

      {/* Controls */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        {/* View mode buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode("grid")}
            className={`rounded-full px-4 py-1.5 text-xs font-medium ${
              viewMode === "grid"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
            }`}
          >
            Grid view
          </button>
          <button
            onClick={() => setViewMode("table")}
            className={`rounded-full px-4 py-1.5 text-xs font-medium ${
              viewMode === "table"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
            }`}
          >
            Table view
          </button>
        </div>

        {/* Platform filter */}
        <select
          className="w-full rounded-full border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:w-56"
          value={platformFilter}
          onChange={(e) => setPlatformFilter(e.target.value)}
        >
          <option value="All">All Platforms</option>
          <option value="Google">Google</option>
          <option value="Yelp">Yelp</option>
          <option value="Instagram">Instagram</option>
          <option value="Facebook">Facebook</option>
          <option value="X">X</option>
          <option value="TikTok">TikTok</option>
        </select>
      </div>

      {/* Content */}
      {visibleTemplates.length === 0 ? (
        <p className="py-10 text-center text-sm italic text-gray-500">
          No templates found. Try creating one on the /moreply/create page.
        </p>
      ) : viewMode === "grid" ? (
        <GridView
          templates={visibleTemplates}
          editingId={editingId}
          editBuffer={editBuffer}
          setEditBuffer={setEditBuffer}
          startEditing={startEditing}
          cancelEditing={cancelEditing}
          saveEditing={saveEditing}
          handleDelete={handleDelete}
        />
      ) : (
        <TableView
          templates={visibleTemplates}
          editingId={editingId}
          editBuffer={editBuffer}
          setEditBuffer={setEditBuffer}
          startEditing={startEditing}
          cancelEditing={cancelEditing}
          saveEditing={saveEditing}
          handleDelete={handleDelete}
        />
      )}
    </section>
  );
}

// Grid view cards
function GridView(props: {
  templates: AutoReplyTemplate[];
  editingId: string | null;
  editBuffer: Partial<AutoReplyTemplate>;
  setEditBuffer: React.Dispatch<
    React.SetStateAction<Partial<AutoReplyTemplate>>
  >;
  startEditing: (template: AutoReplyTemplate) => void;
  cancelEditing: () => void;
  saveEditing: (id: string) => void;
  handleDelete: (id: string) => void;
}) {
  const {
    templates,
    editingId,
    editBuffer,
    setEditBuffer,
    startEditing,
    cancelEditing,
    saveEditing,
    handleDelete,
  } = props;

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {templates.map((tpl) => {
        const isEditing = editingId === tpl.id;
        return (
          <div
            key={tpl.id}
            className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
          >
            <div className="mb-2 flex items-center justify-between">
              {isEditing ? (
                <input
                  value={editBuffer.name ?? ""}
                  onChange={(e) =>
                    setEditBuffer((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  className="w-full rounded-lg border border-gray-300 px-2 py-1 text-sm text-gray-800"
                />
              ) : (
                <h2 className="text-sm font-semibold text-blue-600">
                  {tpl.name}
                </h2>
              )}
              <span className="ml-2 text-[10px] uppercase tracking-wide text-gray-400">
                {tpl.channel}
              </span>
            </div>

            <p className="text-xs text-gray-500">
              {tpl.platform} • {tpl.tone || "No tone set"}
            </p>
            <p className="mt-1 text-xs text-gray-400">
              Emojis: {tpl.emojiPreference || "—"}
            </p>
            <p className="mt-1 text-[11px] text-gray-400">
              Created: {new Date(tpl.createdAt).toLocaleString()}
            </p>

            <div className="mt-3">
              <p className="text-[11px] font-medium text-gray-600">Reply:</p>
              {isEditing ? (
                <textarea
                  value={editBuffer.replyText ?? ""}
                  onChange={(e) =>
                    setEditBuffer((prev) => ({
                      ...prev,
                      replyText: e.target.value,
                    }))
                  }
                  className="mt-1 w-full min-h-20 rounded-lg border border-gray-300 p-2 text-xs text-gray-800"
                />
              ) : (
                <p className="mt-1 text-[11px] text-gray-700">
                  {tpl.replyText}
                </p>
              )}
            </div>

            <div className="mt-3 flex items-center justify-between text-[11px]">
              <label className="flex items-center gap-1 text-gray-600">
                <input
                  type="checkbox"
                  checked={
                    isEditing
                      ? !!editBuffer.isActive
                      : tpl.isActive
                  }
                  onChange={(e) =>
                    setEditBuffer((prev) => ({
                      ...prev,
                      isActive: e.target.checked,
                    }))
                  }
                  disabled={!isEditing}
                  className="h-3 w-3 rounded border-gray-300 text-blue-600"
                />
                Active
              </label>
              <div className="flex gap-2">
                {!isEditing ? (
                  <>
                    <button
                      onClick={() => startEditing(tpl)}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(tpl.id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => saveEditing(tpl.id)}
                      className="text-blue-600 hover:underline"
                    >
                      Save
                    </button>
                    <button
                      onClick={cancelEditing}
                      className="text-gray-500 hover:underline"
                    >
                      Cancel
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Table view
function TableView(props: {
  templates: AutoReplyTemplate[];
  editingId: string | null;
  editBuffer: Partial<AutoReplyTemplate>;
  setEditBuffer: React.Dispatch<
    React.SetStateAction<Partial<AutoReplyTemplate>>
  >;
  startEditing: (template: AutoReplyTemplate) => void;
  cancelEditing: () => void;
  saveEditing: (id: string) => void;
  handleDelete: (id: string) => void;
}) {
  const {
    templates,
    editingId,
    editBuffer,
    setEditBuffer,
    startEditing,
    cancelEditing,
    saveEditing,
    handleDelete,
  } = props;

  return (
    <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
      <table className="min-w-full text-left text-xs">
        <thead className="border-b bg-gray-50 text-[11px] uppercase text-gray-500">
          <tr>
            <th className="px-3 py-2">Name</th>
            <th className="px-3 py-2">Channel</th>
            <th className="px-3 py-2">Platform</th>
            <th className="px-3 py-2">Tone</th>
            <th className="px-3 py-2">Active</th>
            <th className="px-3 py-2">Created</th>
            <th className="px-3 py-2">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y text-[11px] text-gray-700">
          {templates.map((tpl) => {
            const isEditing = editingId === tpl.id;
            return (
              <tr key={tpl.id}>
                <td className="px-3 py-2">
                  {isEditing ? (
                    <input
                      value={editBuffer.name ?? ""}
                      onChange={(e) =>
                        setEditBuffer((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      className="w-full rounded border border-gray-300 px-1 py-0.5 text-[11px]"
                    />
                  ) : (
                    <span className="font-semibold text-blue-600">
                      {tpl.name}
                    </span>
                  )}
                </td>
                <td className="px-3 py-2">{tpl.channel}</td>
                <td className="px-3 py-2">{tpl.platform}</td>
                <td className="px-3 py-2">
                  {tpl.tone || <span className="text-gray-400">—</span>}
                </td>
                <td className="px-3 py-2">
                  {isEditing ? (
                    <input
                      type="checkbox"
                      checked={
                        typeof editBuffer.isActive === "boolean"
                          ? editBuffer.isActive
                          : tpl.isActive
                      }
                      onChange={(e) =>
                        setEditBuffer((prev) => ({
                          ...prev,
                          isActive: e.target.checked,
                        }))
                      }
                    />
                  ) : tpl.isActive ? (
                    "Yes"
                  ) : (
                    "No"
                  )}
                </td>
                <td className="px-3 py-2">
                  {new Date(tpl.createdAt).toLocaleDateString()}
                </td>
                <td className="px-3 py-2">
                  {!isEditing ? (
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEditing(tpl)}
                        className="text-blue-600 hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(tpl.id)}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={() => saveEditing(tpl.id)}
                        className="text-blue-600 hover:underline"
                      >
                        Save
                      </button>
                      <button
                        onClick={cancelEditing}
                        className="text-gray-500 hover:underline"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
