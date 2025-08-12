import React from 'react';
import { Box } from '@mui/material';
import { Check } from '@mui/icons-material';

const CustomStepIcon = (props) => {
  const { active, completed, className, icon } = props;
  return (
    <div className={className ?? ''}>
      {completed ? (
        <Check sx={{ fontSize: '1.5rem', color: 'success.main' }} />
      ) : (
        <Box component="span" sx={{
          color: active ? 'white' : 'text.secondary',
          fontWeight: 'bold',
          backgroundColor: active ? 'primary.main' : 'grey.300',
          borderRadius: '50%',
          width: 32, height: 32, display: 'flex',
          alignItems: 'center', justifyContent: 'center'
        }}>
          {icon}
        </Box>
      )}
    </div>
  );
};

export default CustomStepIcon;
