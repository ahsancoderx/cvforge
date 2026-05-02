//components/converter/ConversionHistory.jsx
// ============================================================
//  ConversionHistory.jsx
//  Place this file at:  src/components/converter/ConversionHistory.jsx
//
//  Shows a log of completed conversions in the current session.
//  Props:
//    history: Array<{ id, inputName, outputName, inputExt, outputExt,
//                     inputSize, outputSize, blob, timestamp, status }>
//    onDownload: (item) => void
//    onClear: () => void
// ============================================================

'use client';
import {
  Box, Typography, Button, Chip, IconButton, Tooltip, Stack,
} from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ArticleIcon from '@mui/icons-material/Article';
import ImageIcon from '@mui/icons-material/Image';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import CodeIcon from '@mui/icons-material/Code';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import HistoryIcon from '@mui/icons-material/History';

function extIcon(ext) {
  const e = ext?.toLowerCase();
  if (e === 'pdf')  return <PictureAsPdfIcon sx={{ fontSize: 16, color: '#ef4444' }} />;
  if (e === 'docx' || e === 'doc') return <ArticleIcon sx={{ fontSize: 16, color: '#2563eb' }} />;
  if (e === 'txt')  return <TextSnippetIcon sx={{ fontSize: 16, color: '#6b7280' }} />;
  if (e === 'html') return <CodeIcon sx={{ fontSize: 16, color: '#d97706' }} />;
  if (['jpg','jpeg','png'].includes(e)) return <ImageIcon sx={{ fontSize: 16, color: '#059669' }} />;
  return <InsertDriveFileIcon sx={{ fontSize: 16, color: '#6b7280' }} />;
}

function timeAgo(ts) {
  const diff = Math.floor((Date.now() - ts) / 1000);
  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  return `${Math.floor(diff / 3600)}h ago`;
}

export default function ConversionHistory({ history = [], onDownload, onClear }) {
  if (history.length === 0) {
    return (
      <Box sx={{
        background: '#13151c', border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 3, p: 3, textAlign: 'center',
      }}>
        <HistoryIcon sx={{ fontSize: 36, color: 'rgba(255,255,255,0.1)', mb: 1 }} />
        <Typography sx={{ color: '#8b8fa8', fontSize: '0.82rem' }}>
          Your conversion history will appear here
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ background: '#13151c', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 3, p: 2.5 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <HistoryIcon sx={{ fontSize: 16, color: '#8b8fa8' }} />
          <Typography sx={{ fontWeight: 700, fontSize: '0.85rem', color: '#e2e8f0' }}>
            Recent Conversions
          </Typography>
          <Chip label={history.length} size="small"
            sx={{ height: 18, fontSize: '0.65rem', background: '#6c63ff20', color: '#a78bfa' }} />
        </Box>
        <Tooltip title="Clear history">
          <IconButton size="small" onClick={onClear}
            sx={{ color: '#8b8fa8', '&:hover': { color: '#ef4444' } }}>
            <DeleteSweepIcon sx={{ fontSize: 16 }} />
          </IconButton>
        </Tooltip>
      </Box>

      <Stack spacing={1}>
        {history.map(item => (
          <Box key={item.id} sx={{
            display: 'flex', alignItems: 'center', gap: 1.5,
            p: 1.2, background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.06)', borderRadius: 2,
          }}>
            {/* Status dot */}
            <Box sx={{ flexShrink: 0 }}>
              {item.status === 'done'
                ? <CheckCircleIcon sx={{ fontSize: 16, color: '#22c55e' }} />
                : <ErrorIcon sx={{ fontSize: 16, color: '#ef4444' }} />}
            </Box>

            {/* File info */}
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.3 }}>
                {extIcon(item.inputExt)}
                <Typography sx={{ fontSize: '0.78rem', color: '#8b8fa8' }}>→</Typography>
                {extIcon(item.outputExt)}
                <Typography sx={{ fontSize: '0.78rem', color: '#e2e8f0', ml: 0.3,
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {item.outputName}
                </Typography>
              </Box>
              <Typography sx={{ fontSize: '0.68rem', color: '#6b7280' }}>
                {timeAgo(item.timestamp)}
              </Typography>
            </Box>

            {/* Download */}
            {item.status === 'done' && item.blob && (
              <IconButton size="small" onClick={() => onDownload(item)}
                sx={{ color: '#6c63ff', flexShrink: 0,
                  '&:hover': { background: '#6c63ff15' } }}>
                <FileDownloadIcon sx={{ fontSize: 16 }} />
              </IconButton>
            )}
          </Box>
        ))}
      </Stack>
    </Box>
  );
}