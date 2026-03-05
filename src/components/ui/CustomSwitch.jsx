import React from 'react';
import { FormControlLabel, Switch as MuiSwitch } from '@mui/material';
import { Box, Typography } from '@mui/material';

/**
 * A custom Switch component that accepts a label and an optional icon.
 * This wraps the standard Material-UI FormControlLabel for convenience and consistent styling.
 */
const CustomSwitch = ({
    label,
    icon,
    name,
    checked,
    onChange,
    disabled = false,
    ...props // Pass any other MuiSwitch props
}) => {
    return (
        <FormControlLabel
            sx={{
                width: '100%',
                justifyContent: 'space-between',
                marginLeft: 0,
                padding: '4px 8px',
                borderRadius: '8px',
                '&:hover': {
                    backgroundColor: 'action.hover'
                }
            }}
            control={
                <MuiSwitch
                    name={name}
                    checked={checked}
                    onChange={onChange}
                    disabled={disabled}
                    {...props}
                />
            }
            label={
                <Box display="flex" alignItems="center" gap={1.5}>
                    {icon && React.cloneElement(icon, { size: 18, className: 'text-gray-600' })}
                    <Typography variant="body2" fontWeight="medium">
                        {label}
                    </Typography>
                </Box>
            }
            labelPlacement="start" // This puts the label on the left and the switch on the right
        />
    );
};

export default CustomSwitch;