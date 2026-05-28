import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const dataDirectory = path.join(process.cwd(), 'data');

export async function getAboutData() {
  const filePath = path.join(dataDirectory, 'about.md');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const matterResult = matter(fileContents);

  const processedContent = await remark()
    .use(html)
    .process(matterResult.content);
  const contentHtml = processedContent.toString();

  return {
    ...matterResult.data,
    contentHtml,
  };
}

export function getProjectsData() {
  const projectsDirectory = path.join(dataDirectory, 'projects');
  if (!fs.existsSync(projectsDirectory)) return [];

  const fileNames = fs.readdirSync(projectsDirectory).filter(f => f.endsWith('.md'));

  return fileNames.map((fileName) => {
    const slug = fileName.replace(/\.md$/, '');
    const filePath = path.join(projectsDirectory, fileName);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const matterResult = matter(fileContents);

    return {
      slug,
      ...matterResult.data,
    };
  });
}

export async function getBlogsData() {
  try {
    const headers = {};
    if (process.env.GITHUB_TOKEN) {
      headers['Authorization'] = `Bearer ${process.env.GITHUB_TOKEN}`;
    }
    headers['User-Agent'] = 'spencerjl-website';

    const repo = process.env.GITHUB_REPO;
    let res = await fetch(`https://api.github.com/repos/${repo}/contents/`, {
      headers,
      next: { revalidate: 3600 } // Cache for 1 hour
    });

    // Fallback if unauthorized (e.g. token expired/invalid)
    if (res.status === 401 && process.env.GITHUB_TOKEN) {
      console.warn(`GitHub Token unauthorized. Retrying fetch without token for public repo ${repo}...`);
      const publicHeaders = { 'User-Agent': 'spencerjl-website' };
      res = await fetch(`https://api.github.com/repos/${repo}/contents/`, {
        headers: publicHeaders,
        next: { revalidate: 3600 }
      });
    }

    if (!res.ok) {
      console.error(`Failed to fetch blogs list from GitHub: ${res.statusText}`);
      return [];
    }

    const files = await res.json();
    if (!Array.isArray(files)) return [];

    const mdFiles = files.filter(file => file.name.endsWith('.md'));

    const blogs = await Promise.all(
      mdFiles.map(async (file) => {
        const slug = file.name.replace(/\.md$/, '');
        // Fetch raw file content
        let rawRes = await fetch(file.download_url, {
          headers: process.env.GITHUB_TOKEN ? {
            Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
            'User-Agent': 'spencerjl-website'
          } : {
            'User-Agent': 'spencerjl-website'
          },
          next: { revalidate: 3600 }
        });

        // Fallback for file contents fetch if unauthorized
        if (rawRes.status === 401 && process.env.GITHUB_TOKEN) {
          rawRes = await fetch(file.download_url, {
            headers: { 'User-Agent': 'spencerjl-website' },
            next: { revalidate: 3600 }
          });
        }

        if (!rawRes.ok) {
          return null;
        }

        const fileContents = await rawRes.text();
        const matterResult = matter(fileContents);

        // Extract title: use frontmatter title if exists, otherwise slug (filename)
        const title = matterResult.data.title || slug;

        // Extract description: use frontmatter description, otherwise first few lines of content
        let description = matterResult.data.description;
        if (!description) {
          const lines = matterResult.content
            .split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0 && !line.startsWith('#') && !line.startsWith('!['))
            .slice(0, 5);
          description = lines.join(' ');
          if (description.length > 300) {
            description = description.slice(0, 297) + '...';
          }
        }

        return {
          slug,
          ...matterResult.data,
          title,
          description,
        };
      })
    );

    // Filter out nulls and sort by date descending safely
    return blogs
      .filter(Boolean)
      .sort((a, b) => {
        const dateA = a.date ? new Date(a.date) : new Date(0);
        const dateB = b.date ? new Date(b.date) : new Date(0);
        return dateB - dateA;
      });
  } catch (error) {
    console.error('Error fetching blogs from GitHub:', error);
    return [];
  }
}

export async function getBlogBySlug(slug) {
  try {
    const headers = {};
    if (process.env.GITHUB_TOKEN) {
      headers['Authorization'] = `Bearer ${process.env.GITHUB_TOKEN}`;
    }
    headers['User-Agent'] = 'spencerjl-website';

    const repo = process.env.GITHUB_REPO;
    // Use decodeURIComponent and encodeURIComponent to support space characters in slug correctly
    const decodedSlug = decodeURIComponent(slug);
    const encodedSlug = encodeURIComponent(decodedSlug);
    const rawUrl = `https://raw.githubusercontent.com/${repo}/main/${encodedSlug}.md`;
    let res = await fetch(rawUrl, {
      headers,
      next: { revalidate: 3600 }
    });

    if (res.status === 401 && process.env.GITHUB_TOKEN) {
      console.warn(`GitHub Token unauthorized. Retrying fetch without token for raw content...`);
      const publicHeaders = { 'User-Agent': 'spencerjl-website' };
      res = await fetch(rawUrl, {
        headers: publicHeaders,
        next: { revalidate: 3600 }
      });
    }

    if (!res.ok) {
      console.error(`Failed to fetch blog post ${slug} from GitHub: ${res.statusText}`);
      return null;
    }

    const fileContents = await res.text();
    const matterResult = matter(fileContents);

    const processedContent = await remark()
      .use(html)
      .process(matterResult.content);
    const contentHtml = processedContent.toString();

    // Extract title: use frontmatter title if exists, otherwise slug (filename)
    const title = matterResult.data.title || slug;

    // Extract description: use frontmatter description, otherwise first few lines of content
    let description = matterResult.data.description;
    if (!description) {
      const lines = matterResult.content
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0 && !line.startsWith('#') && !line.startsWith('!['))
        .slice(0, 5);
      description = lines.join(' ');
      if (description.length > 300) {
        description = description.slice(0, 297) + '...';
      }
    }

    return {
      slug,
      contentHtml,
      ...matterResult.data,
      title,
      description,
    };
  } catch (error) {
    console.error(`Error fetching blog post by slug ${slug}:`, error);
    return null;
  }
}
