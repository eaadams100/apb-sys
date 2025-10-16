import React from 'react';
import { Paper, InputBase, IconButton } from '@mui/material';
import { Search as SearchIcon, Tune as FilterIcon } from '@mui/icons-material';

const SearchBar: React.FC = () => {
  return (
    <Paper
      component="form"
      sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: '100%' }}
    >
      <IconButton sx={{ p: '10px' }} aria-label="search">
        <SearchIcon />
      </IconButton>
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder="Search bulletins, suspects, locations..."
        inputProps={{ 'aria-label': 'search bulletins' }}
      />
      <IconButton type="button" sx={{ p: '10px' }} aria-label="filter">
        <FilterIcon />
      </IconButton>
    </Paper>
  );
};

export default SearchBar;