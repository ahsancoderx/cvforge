import { Box, Typography, Card, CardContent, Grid, Button } from "@mui/material";
import ArticleIcon from "@mui/icons-material/Article";
import Link from "next/link";

export const metadata = {
  title: "CVStudio Blog | Resume, ATS & Aggregate Guides 2026",
  description:
    "Learn resume tips, ATS guides, aggregate calculator insights for NUST, FAST, UET and career growth in Pakistan 2026.",
};

const blogs = [
  {
    title: "Best Resume Templates for Freshers in 2026",
    slug: "resume-templates-2026",
    desc: "ATS-friendly resume templates for jobs in 2026.",
  },
  {
    title: "ATS Resume Guide 2026",
    slug: "ats-resume-guide",
    desc: "Learn how ATS works and how to pass screening.",
  },
  {
    title: "Aggregate Calculator in Pakistan 2026",
    slug: "aggregate-calculator-pakistan-2026",
    desc: "NUST, FAST, UET aggregate formula explained in detail.",
  },
  {
    title:"Free ATS Checker Guide 2026: How to Fix Your Resume Score & Get More Interviews",
    slug:"ats-checker-guide-2026",
    desc:"Learn how ATS checker tools work in 2026, how they score your resume, and how to improve your CV to increase ATS score and get more job interviews easily."
  },
  {
    title:"CVStudio Free Career Tools 2026: Resume Templates, ATS Checker, Converter & Aggregate Calculator",
    slug:"cvstudio-free-career-tools-2026",
    desc:"Discover CVStudio free career tools including ATS resume templates, resume builder, ATS checker, converter, and aggregate calculator to improve jobs and university admission chances in 2026."
  }  
];

export default function BlogPage() {
  return (
    <Box sx={{ maxWidth: 1100, mx: "auto", p: 3 }}>
      
      <Typography variant="h3" fontWeight="bold" gutterBottom>
        CVStudio Blog
      </Typography>

      <Typography variant="body1" sx={{ mb: 4 }}>
        Resume tips, ATS guides, and Pakistan university admission insights.
      </Typography>

      <Grid container spacing={3}>
        {blogs.map((blog) => (
          <Grid  xs={12} md={6} key={blog.slug}>
            <Card sx={{ height: "100%" }}>
              <CardContent>
                <ArticleIcon />

                <Typography variant="h6" fontWeight="bold">
                  {blog.title}
                </Typography>

                <Typography variant="body2" sx={{ my: 1 }}>
                  {blog.desc}
                </Typography>

                <Link href={`/blog/${blog.slug}`}>
                  <Button variant="contained">
                    Read More
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}