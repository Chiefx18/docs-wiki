import React, { useState } from "react";
import MDEditor from "@uiw/react-md-editor";
import Layout from "@theme/Layout";
import { useHistory } from "@docusaurus/router";

const GITHUB_TOKEN = "ghp_..."; // Your personal GitHub token
const REPO_OWNER = "your-github-username";
const REPO_NAME = "your-repo";
const BRANCH = "main";

export default function EditorPage() {
  const [value, setValue] = useState("# Write your markdown here...");
  const [filename, setFilename] = useState("new-post.md");
  const history = useHistory();

  const saveToGitHub = async () => {
    const path = `docs/${filename}`;
    const base64Content = btoa(unescape(encodeURIComponent(value)));
    const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${path}`;

    // Check if file exists (to get its SHA)
    const existing = await fetch(url, {
      headers: { Authorization: `Bearer ${GITHUB_TOKEN}` },
    }).then(res => res.ok ? res.json() : null);

    const payload = {
      message: `Add ${filename}`,
      content: base64Content,
      branch: BRANCH,
      ...(existing?.sha && { sha: existing.sha }),
    };

    const res = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      alert("Saved! The site will now reload to reflect changes.");
      // Give GitHub Pages some time to deploy before reload
      setTimeout(() => {
        window.location.href = "/docs"; // Redirect to main docs
      }, 5000);
    } else {
      alert("Error saving file.");
    }
  };

  return (
    <Layout title="Markdown Editor">
      <div style={{ padding: "2rem" }}>
        <h1>Markdown Editor</h1>
        <input
          type="text"
          value={filename}
          onChange={(e) => setFilename(e.target.value)}
          placeholder="Filename (e.g. hello-world.md)"
          style={{ padding: "0.5rem", marginBottom: "1rem", width: "300px" }}
        />
        <MDEditor value={value} onChange={setValue} height={400} />
        <button
          onClick={saveToGitHub}
          style={{
            marginTop: "1rem",
            padding: "10px 20px",
            backgroundColor: "#25c2a0",
            border: "none",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          Save to GitHub
        </button>
      </div>
    </Layout>
  );
}
