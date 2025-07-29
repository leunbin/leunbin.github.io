import { fetchMarkdown } from "../js/renderMarkdown.js";

document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const path = params.get("path");
  const category = params.get("category");

  if (!path || !category) return;

  const raw = await fetchMarkdown(`/posts/${category}/${path}.md`);

  const markdown = raw.replace(/^---[\r\n]+([\s\S]*?)---[\r\n]+/, '').trim();

  const html = marked.parse(markdown);

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  const codeBlocks = doc.querySelectorAll('pre > code');

  codeBlocks.forEach((codeBlock, index) => {
    const pre = codeBlock.parentElement;
    const langClass = codeBlock.className || "language-js";
    const lang = langClass.replace("language-", "") || "txt";
    const fileName = `example-${index + 1}.${lang}`;

    const wrapper = document.createElement("div");
    wrapper.className = "code-wrapper";
    wrapper.innerHTML = `
      <div class="code-header">
        <div class="code-buttons">
          <span class="btn red"></span>
          <span class="btn yellow"></span>
          <span class="btn green"></span>
        </div>
        <span class="file-name">${fileName}</span>
      </div>
    `;

    wrapper.appendChild(pre.cloneNode(true));
    pre.replaceWith(wrapper);
  });

    const inlineCodes = doc.querySelectorAll("code");
    inlineCodes.forEach(codeEl => {
      if (!codeEl.closest("pre")) {
        codeEl.classList.add("highlight-word");
      }
    });

  const body = document.querySelector(".post-body");
  if (body) {
    body.innerHTML = `
      <div class="detail-body">
        ${doc.body.innerHTML}
      </div>
    `;
  }
});
