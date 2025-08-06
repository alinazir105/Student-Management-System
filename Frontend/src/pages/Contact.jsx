import React, { useState } from "react";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState(null); // "success" | "error" | null

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Simple front-end validation
    if (!form.name || !form.email || !form.message) {
      setStatus({ type: "error", text: "All fields are required." });
      return;
    }

    // Placeholder: replace with actual API or mailto
    try {
      // Example: open mail client fallback
      window.location.href = `mailto:alinazir105@gmail.com?subject=Contact from ${encodeURIComponent(
        form.name
      )}&body=${encodeURIComponent(form.message + "\n\nFrom: " + form.email)}`;

      setStatus({ type: "success", text: "Opening your mail client..." });
    } catch (err) {
      setStatus({ type: "error", text: "Failed to send message." });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50 p-6">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow p-8">
        <h1 className="text-3xl font-bold mb-2">Contact Us</h1>
        <p className="text-gray-600 mb-6">
          Have questions or feedback? Drop a message below.
        </p>

        {status && (
          <div
            className={`mb-4 px-4 py-2 rounded ${
              status.type === "success"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {status.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring"
              placeholder="Your name"
              type="text"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring"
              placeholder="you@example.com"
              type="email"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Message</label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring"
              placeholder="Write your message..."
              rows={5}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white px-5 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
};

