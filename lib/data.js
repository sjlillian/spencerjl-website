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

    const res = await fetch('https://api.github.com/repos/sjlillian/portfolio-blogs/contents/', {
      headers,
      next: { revalidate: 3600 } // Cache for 1 hour
    });

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
        const rawRes = await fetch(file.download_url, {
          headers: process.env.GITHUB_TOKEN ? {
            Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
            'User-Agent': 'spencerjl-website'
          } : {
            'User-Agent': 'spencerjl-website'
          },
          next: { revalidate: 3600 }
        });
        
        if (!rawRes.ok) {
          return null;
        }
        
        const fileContents = await rawRes.text();
        const matterResult = matter(fileContents);
        
        return {
          slug,
          ...matterResult.data,
        };
      })
    );

    // Filter out nulls and sort by date descending
    return blogs
      .filter(Boolean)
      .sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
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

    // Fetch the raw content from GitHub directly
    const rawUrl = `https://raw.githubusercontent.com/sjlillian/portfolio-blogs/main/${slug}.md`;
    const res = await fetch(rawUrl, {
      headers,
      next: { revalidate: 3600 }
    });

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

    return {
      slug,
      contentHtml,
      ...matterResult.data,
    };
  } catch (error) {
    console.error(`Error fetching blog post by slug ${slug}:`, error);
    return null;
  }
}
