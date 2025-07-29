import { fetchPosts } from "./renderMarkdown.js";

document.addEventListener("DOMContentLoaded", async () => {
  const category = window.location.pathname.split("/").filter(Boolean)[0];
  const postCount = document.getElementById('post-count');
  const postList = document.getElementById("post-list");

  const posts = await fetchPosts(category);
  
  postCount.innerHTML = `총 <span class="highlight">${posts ? posts.length : 0}</span>개의 게시물이 있습니다.`;


  posts.forEach(post => {
    const postItem = document.createElement("div");
    postItem.className = "post-item";

    const postNum = document.createElement("div");
    postNum.className = "post-num";
    postNum.textContent = post.id;

    const title = document.createElement("span");
    title.className = "post-title";
    title.textContent = post.title;
    title.style.cursor = "pointer";

    title.addEventListener("click", async () => {
      const url = `/post?category=${post.category}&path=${post.path}`;
      window.location.href = url;
    });

    postItem.appendChild(postNum);
    postItem.appendChild(title);
    postList.appendChild(postItem);
  });
});