'use client';
import { useState } from 'react';
import { Box, Chip, TextField, Button, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

export default function SkillTags({ skills, onAdd, onRemove }) {
  const [input, setInput] = useState('');

  const handleAdd = () => {
    const v = input.trim();
    if (v) { onAdd(v); setInput(''); }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8, mb: 1.5, minHeight: 32 }}>
        {skills.map((sk) => (
          <Chip
            key={sk}
            label={sk}
            onDelete={() => onRemove(sk)}
            size="small"
            sx={{
              background: 'rgba(108,99,255,0.15)',
              color: '#a78bfa',
              border: '1px solid rgba(108,99,255,0.3)',
              '& .MuiChip-deleteIcon': { color: '#a78bfa', '&:hover': { color: '#f87171' } },
              fontSize: '0.78rem',
            }}
          />
        ))}
        {skills.length === 0 && (
          <Typography sx={{ fontSize: '0.78rem', color: '#8b8fa8', fontStyle: 'italic' }}>
            No skills added yet
          </Typography>
        )}
      </Box>

      <Box sx={{ display: 'flex', gap: 1 }}>
        <TextField
          size="small"
          fullWidth
          placeholder="Add a skill (e.g. React, Python…)"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
        />
        <Button
          variant="outlined"
          size="small"
          onClick={handleAdd}
          startIcon={<AddIcon fontSize="small" />}
          sx={{
            borderColor: 'rgba(108,99,255,0.4)',
            color: '#a78bfa',
            whiteSpace: 'nowrap',
            '&:hover': { background: 'rgba(108,99,255,0.08)', borderColor: '#6c63ff' },
          }}
        >
          Add
        </Button>
      </Box>
    </Box>
  );
}
