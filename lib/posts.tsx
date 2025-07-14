import fs from "fs";
import path from "path";
import matter from "gray-matter";

const contentDir = path.join(process.cwd(), "content");
console.log("contentDir: ", contentDir)
export type PostMeta = {
  title: string;
  description: string;
  slug: string;
  date: string;
  updated?: string;
  author?: string;
  keywords?: string;
  featured_image?: string;
  tags?: string[];
  category?: string;
  affiliate_disclosure?: boolean;
};

export function getAllPostMeta(): PostMeta[] {
  const files = fs.readdirSync(contentDir);

  return files.map((file) => {
    const source = fs.readFileSync(path.join(contentDir, file), "utf8");
    const { data } = matter(source);
    return data as PostMeta;
  });
}

export function getPostBySlug(slug: string) {
  const filePath = path.join(contentDir, `${slug}.mdx`);
  const source = fs.readFileSync(filePath, "utf8");
  return matter(source);
}
