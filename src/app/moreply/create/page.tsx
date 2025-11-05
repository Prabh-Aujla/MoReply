"use client";

import { useEffect, useState } from "react";

type Platform = "Google" | "Yelp" | "Instagram" | "Facebook" | "X" | "TikTok";
type ReplyTone = "Friendly" | "Professional" | "Playful" | "Apologetic" | "Custom";

type TemplateForm = {
  name: string;
  platform: Platform;
  tone: ReplyTone | "";
  exampleText: string; // what we are replying to
  isActive: boolean;
};

type AutoReplyTemplate = {
  id: string;
  name: string;
  platform: Platform;
  tone: ReplyTone | "";
  exampleText: string;
  replyText: string; // hardcoded based on tone
  isActive: boolean;
  createdAt: string;
};

type FormErrors = Partial<Record<keyof TemplateForm, string>>;

export default function MoReplyCreatePage() {
  const [form, setForm] = useState<TemplateForm>({
    name: "",
    platform: "Google",
    tone: "",
    exampleText: "",
    isActive: true,
  });

  const [replyText, setReplyText] = useState<string>(""); // generated reply
  const [errors, setErrors] = useState<FormErrors>({});
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [templates, setTemplates] = useState<AutoReplyTemplate[]>([]);

  // Load existing templates from localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const stored = localStorage.getItem("moreply-templates");
      if (stored) {
        setTemplates(JSON.parse(stored));
      }
    } catch (err) {
      console.error("Failed to load templates from localStorage", err);
    }
  }, []);

  // Save templates to localStorage on change
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem("moreply-templates", JSON.stringify(templates));
    } catch (err) {
      console.error("Failed to save templates to localStorage", err);
    }
  }, [templates]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!form.name.trim()) {
      newErrors.name = "Please give this template a name.";
    }
    if (!form.tone) {
      newErrors.tone = "Please choose a reply tone.";
    }
    if (!form.exampleText.trim()) {
      newErrors.exampleText = "Please add an example review or comment.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Hardcoded reply based ONLY on tone
  const handleGenerateReply = () => {
    setStatusMessage(null);

    if (!form.tone) {
      setErrors((prev) => ({
        ...prev,
        tone: "Please pick a tone before generating.",
      }));
      return;
    }
    if (!form.exampleText.trim()) {
      setErrors((prev) => ({
        ...prev,
        exampleText: "Please add something we are replying to.",
      }));
      return;
    }

    const toneReplies: Record<ReplyTone, string> = {
      Friendly:
        "Thank you so much for your message! We really appreciate your support and we’re so happy you had a great experience with us. 😊",
      Professional:
        "Thank you for taking the time to share this. We value your feedback and will use it to keep improving our service.",
      Playful:
        "You just made our day! 🎉 Thanks for the love — we can’t wait to see you again soon!",
      Apologetic:
        "Thank you for letting us know about this. We’re really sorry for the inconvenience and we’re committed to making this right.",
      Custom:
        "Thanks for the feedback. We’ll tailor our response style to match your brand’s voice and preferences.",
    };

    const reply = toneReplies[form.tone as ReplyTone];
    setReplyText(reply);
    setErrors((prev) => ({ ...prev, tone: undefined, exampleText: undefined }));
    setStatusMessage("Reply generated. You can now save this template.");
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setStatusMessage(null);

    const valid = validateForm();
    if (!valid) {
      setStatusMessage("Please fix the highlighted fields before saving.");
      return;
    }
    if (!replyText.trim()) {
      setStatusMessage("Please click 'Generate Reply' before saving.");
      return;
    }

    const newTemplate: AutoReplyTemplate = {
      id: `tpl_${Date.now()}`,
      name: form.name.trim(),
      platform: form.platform,
      tone: form.tone,
      exampleText: form.exampleText.trim(),
      replyText: replyText.trim(),
      isActive: form.isActive,
      createdAt: new Date().toISOString(),
    };

    setTemplates((prev) => [...prev, newTemplate]);
    setStatusMessage("Template saved successfully!");

    // Reset some fields but keep platform and tone
    setForm((prev) => ({
      ...prev,
      name: "",
      exampleText: "",
    }));
    setReplyText("");
    setErrors({});
  };

  const handleDownloadJson = () => {
    if (templates.length === 0) {
      alert("There is no template data to download yet.");
      return;
    }

    const jsonString = JSON.stringify(templates, null, 2);
    const blob = new Blob([jsonString], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "moreply-templates.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <section className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-2xl font-bold text-gray-900">
          Create Auto-Reply Template
        </h1>
        <p className="text-sm text-gray-500">
          Choose a platform and reply tone, add an example review or comment,
          then generate a hardcoded reply for this template.
        </p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
      >
        {/* Template Name */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-800">
            Template name
          </label>
          <input
            type="text"
            value={form.name}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, name: e.target.value }))
            }
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="e.g. Friendly Google reply"
          />
          {errors.name && (
            <p className="text-xs text-red-600">{errors.name}</p>
          )}
        </div>

        {/* Platform + Tone */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-800">
              Platform
            </label>
            <select
              value={form.platform}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  platform: e.target.value as Platform,
                }))
              }
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="Google">Google</option>
              <option value="Yelp">Yelp</option>
              <option value="Instagram">Instagram</option>
              <option value="Facebook">Facebook</option>
              <option value="X">X</option>
              <option value="TikTok">TikTok</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-800">
              Reply tone
            </label>
            <select
              value={form.tone}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  tone: e.target.value as ReplyTone | "",
                }))
              }
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">Select a tone</option>
              <option value="Friendly">Friendly</option>
              <option value="Professional">Professional</option>
              <option value="Playful">Playful</option>
              <option value="Apologetic">Apologetic</option>
              <option value="Custom">Custom</option>
            </select>
            {errors.tone && (
              <p className="text-xs text-red-600">{errors.tone}</p>
            )}
          </div>
        </div>

        {/* Example text (what we are replying to) */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-800">
            Example review or comment (what we are replying to)
          </label>
          <textarea
            value={form.exampleText}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, exampleText: e.target.value }))
            }
            className="w-full min-h-24 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Paste or type a sample customer review or social comment here..."
          />
          {errors.exampleText && (
            <p className="text-xs text-red-600">{errors.exampleText}</p>
          )}
        </div>

        {/* Active checkbox */}
        <div className="flex items-center gap-2">
          <input
            id="isActive"
            type="checkbox"
            checked={form.isActive}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, isActive: e.target.checked }))
            }
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="isActive" className="text-sm text-gray-700">
            Mark template as active
          </label>
        </div>

        {/* Buttons + status */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleGenerateReply}
            className="rounded-full bg-blue-600 px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition"
          >
            Generate Reply
          </button>

          <button
            type="submit"
            className="rounded-full border border-gray-300 bg-white px-6 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-100 transition"
          >
            Save Template
          </button>

          <button
            type="button"
            onClick={handleDownloadJson}
            className="rounded-full border border-gray-300 bg-white px-6 py-2 text-sm font-medium text-gray-800 hover:bg-gray-100 transition"
          >
            Download JSON as .txt
          </button>

          {statusMessage && (
            <p className="text-sm text-gray-500">{statusMessage}</p>
          )}
        </div>
      </form>

      {/* Generated reply */}
      <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-4">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
          Generated reply
        </p>
        {replyText ? (
          <p className="text-sm text-gray-800">{replyText}</p>
        ) : (
          <p className="text-xs text-gray-400">
            Click &quot;Generate Reply&quot; to see the hardcoded response for
            the selected tone.
          </p>
        )}
      </div>

      {/* JSON preview */}
      <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-4">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
          JSON output (all saved templates)
        </p>
        <pre className="max-h-72 overflow-auto text-xs text-gray-800">
          {templates.length === 0
            ? "// No templates saved yet."
            : JSON.stringify(templates, null, 2)}
        </pre>
      </div>
    </section>
  );
}
