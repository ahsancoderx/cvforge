'use client';
import {
  AppBar, Toolbar, Box, Button, Typography, IconButton,
  Drawer, List, ListItemButton, ListItemText, Divider, useMediaQuery, useTheme,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import StyleRoundedIcon from '@mui/icons-material/StyleRounded';
import EditNoteRoundedIcon from '@mui/icons-material/EditNoteRounded';
import FactCheckRoundedIcon from '@mui/icons-material/FactCheckRounded';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz'; // ✅ added
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { useRouter, usePathname } from 'next/navigation';
import { useState } from 'react';

const LINKS = [
  { label: 'Home',      href: '/',          icon: <HomeRoundedIcon sx={{ fontSize: 16 }} /> },
  { label: 'Dashboard', href: '/dashboard', icon: <DashboardRoundedIcon sx={{ fontSize: 16 }} /> },
  { label: 'Templates', href: '/template',  icon: <StyleRoundedIcon sx={{ fontSize: 16 }} /> },
  { label: 'Editor',    href: '/editor',    icon: <EditNoteRoundedIcon sx={{ fontSize: 16 }} /> },
  { label: 'ATS Check', href: '/ats',       icon: <FactCheckRoundedIcon sx={{ fontSize: 16 }} /> },

  // ✅ NEW CONVERTER PAGE
  { label: 'Converter', href: '/converter', icon: <SwapHorizIcon sx={{ fontSize: 16 }} /> },
];

export default function Navbar() {
  const router   = useRouter();
  const pathname = usePathname();
  const theme    = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleNav = (href) => {
    router.push(href);
    setDrawerOpen(false);
  };

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          background: 'rgba(13,15,20,0.92)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, md: 3 }, minHeight: { xs: 60, md: 64 } }}>

          {/* Brand */}
          <Box
            onClick={() => router.push('/')}
            sx={{
              display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer',
              '&:hover .brand-icon': { transform: 'rotate(20deg) scale(1.1)' },
            }}
          >
            <Box
              className="brand-icon"
              sx={{
                width: 32, height: 32, borderRadius: '10px',
                background: 'linear-gradient(135deg, #6c63ff, #a78bfa)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'transform 0.3s ease',
                boxShadow: '0 0 14px rgba(108,99,255,0.5)',
              }}
            >
              <AutoAwesomeIcon sx={{ fontSize: 17, color: '#fff' }} />
            </Box>
            <Typography
              sx={{
                fontFamily: '"Playfair Display", serif',
                fontWeight: 700,
                fontSize: { xs: '1.25rem', md: '1.4rem' },
                background: 'linear-gradient(135deg, #a78bfa, #6c63ff, #f59e0b)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '-0.02em',
              }}
            >
              CVForge
            </Typography>
          </Box>

          {/* Desktop Nav Links */}
          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
              {LINKS.map((l) => {
                const active = pathname === l.href;
                return (
                  <Button
                    key={l.href}
                    onClick={() => handleNav(l.href)}
                    startIcon={l.icon}
                    sx={{
                      color: active ? '#f0f0f8' : '#8b8fa8',
                      background: active ? 'rgba(108,99,255,0.12)' : 'transparent',
                      border: active ? '1px solid rgba(108,99,255,0.25)' : '1px solid transparent',
                      borderRadius: '10px',
                      fontSize: '0.82rem',
                      px: 1.6,
                      py: 0.7,
                      textTransform: 'none',
                      fontWeight: active ? 600 : 400,
                      transition: 'all 0.2s',
                      '& .MuiButton-startIcon': { mr: 0.5 },
                      '&:hover': {
                        background: 'rgba(255,255,255,0.06)',
                        color: '#f0f0f8',
                        border: '1px solid rgba(255,255,255,0.1)',
                      },
                    }}
                  >
                    {l.label}
                  </Button>
                );
              })}
            </Box>
          )}

          {/* CTA / Mobile */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {!isMobile && (
              <Button
                variant="contained"
                onClick={() => router.push('/editor')}
                sx={{
                  background: 'linear-gradient(135deg, #6c63ff, #a78bfa)',
                  px: 2.5, py: 0.85,
                  borderRadius: '10px',
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  boxShadow: '0 4px 14px rgba(108,99,255,0.35)',
                }}
              >
                Build CV →
              </Button>
            )}
            {isMobile && (
              <IconButton onClick={() => setDrawerOpen(true)}>
                <MenuIcon />
              </IconButton>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Drawer remains unchanged */}
      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 280, p: 2 }}>
          <IconButton onClick={() => setDrawerOpen(false)}>
            <CloseIcon />
          </IconButton>

          <List>
            {LINKS.map((l) => (
              <ListItemButton key={l.href} onClick={() => handleNav(l.href)}>
                {l.icon}
                <ListItemText primary={l.label} />
              </ListItemButton>
            ))}
          </List>
        </Box>
      </Drawer>
    </>
  );
}