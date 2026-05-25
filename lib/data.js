import fs from 'fs';
import path from 'path';

const dataDirectory = path.join(process.cwd(), 'data');

export function getAboutData() {
  const filePath = path.join(dataDirectory, 'about.json');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(fileContents);
}

export function getProjectsData() {
  const filePath = path.join(dataDirectory, 'projects.json');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(fileContents);
}

export function getBlogsData() {
  const filePath = path.join(dataDirectory, 'blogs.json');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(fileContents);
}

export function getBlogBySlug(slug) {
  const blogs = getBlogsData();
  return blogs.find((blog) => blog.slug === slug);
}
