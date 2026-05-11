"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Box, Typography } from "@mui/material";

export default function BlogRenderer({ content }) {
  return (
    <Box
      sx={{
        maxWidth: 800,
        mx: "auto",
        p: 3,
        fontFamily: "system-ui",
        lineHeight: 2,
        fontSize: "1.05rem",
      }}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <Typography variant="h4" fontWeight="bold" sx={{ mt: 2 }}>
              {children}
            </Typography>
          ),
          h2: ({ children }) => (
            <Typography variant="h5" fontWeight="bold" sx={{ mt: 3 }}>
              {children}
            </Typography>
          ),
          p: ({ children }) => (
            <Typography sx={{ mb: 2 }}>{children}</Typography>
          ),
          li: ({ children }) => (
            <li style={{ marginBottom: 6 }}>{children}</li>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </Box>
  );
}