export async function fetchPosts(category) {
  const jsonPath = `/posts/${category}/index.json`;
  console.log(jsonPath)
  try {
    const res = await fetch(jsonPath);
    if (!res.ok) throw new Error('JSON fetch error');
    return await res.json();
  } catch (err) {
    console.error(err);
    return [];
  }
}

export async function fetchMarkdown(path) {
  console.log(path)
  try {
    const res = await fetch(path);
    if (!res.ok) throw new Error('Markdown fetch error');
    return await res.text();
  } catch (err) {
    console.error(err);
    return '불러오기 실패';
  }
}
