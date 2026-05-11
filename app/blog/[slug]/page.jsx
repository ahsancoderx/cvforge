import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { Box, Typography, Chip } from "@mui/material";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { notFound } from "next/navigation";

const getBlogFile = (slug) =>
  path.join(process.cwd(), "content/blog", `${slug}.md`);

export async function generateMetadata({ params }) {
  const { slug } = await params;

  if (!slug) return {};

  const filePath = getBlogFile(slug);
  const fileContent = fs.readFileSync(filePath, "utf8");
  const { data } = matter(fileContent);

  return {
    title: data.title,
    description: data.description,
  };
}

export default async function BlogPost({ params }) {
  const { slug } = await params;

  if (!slug) return notFound();

  const filePath = getBlogFile(slug);

  if (!fs.existsSync(filePath)) {
    return notFound();
  }

  const fileContent = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(fileContent);

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", p: 3 }}>
      <Typography variant="h3" fontWeight="bold">
        {data.title}
      </Typography>

      <Chip label="Resume Blog" sx={{ my: 2 }} />

      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {content}
      </ReactMarkdown>
    </Box>
  );
}