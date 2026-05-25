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

export function getBlogsData() {
  const blogsDirectory = path.join(dataDirectory, 'blogs');
  if (!fs.existsSync(blogsDirectory)) return [];

  const fileNames = fs.readdirSync(blogsDirectory).filter(f => f.endsWith('.md'));
  
  const blogs = fileNames.map((fileName) => {
    const slug = fileName.replace(/\.md$/, '');
    const filePath = path.join(blogsDirectory, fileName);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const matterResult = matter(fileContents);

    return {
      slug,
      ...matterResult.data,
    };
  });

  // Sort blogs by date
  return blogs.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

export async function getBlogBySlug(slug) {
  const fullPath = path.join(dataDirectory, `blogs/${slug}.md`);
  
  if (!fs.existsSync(fullPath)) return null;

  const fileContents = fs.readFileSync(fullPath, 'utf8');
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
}
