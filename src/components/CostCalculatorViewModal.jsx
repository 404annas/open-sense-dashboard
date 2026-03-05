import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box, List, ListItem, ListItemText } from '@mui/material';
import { format } from 'date-fns';

const CostCalculatorViewModal = ({ open, onClose, request }) => {
    if (!request) return null;

    return (
        <Dialog 
            open={open} 
            onClose={onClose} 
            maxWidth="md" 
            fullWidth
        >
            <DialogTitle>
                <Typography variant="h6" component="div">
                    Cost Calculator Request Details
                </Typography>
            </DialogTitle>
            <DialogContent dividers>
                <Box sx={{ py: 1 }}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        User Name
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        {request.userName}
                    </Typography>
                </Box>
                <Box sx={{ py: 1 }}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        User Email
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        {request.userEmail}
                    </Typography>
                </Box>
                <Box sx={{ py: 1 }}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Selected Options
                    </Typography>
                    <List dense>
                        {request.selectedOptions?.map((option, index) => {
                            const key = Object.keys(option)[0];
                            const value = option[key];
                            return (
                                <ListItem key={index} sx={{ py: 0.5 }}>
                                    <ListItemText 
                                        primary={key}
                                        secondary={value}
                                        sx={{ margin: 0 }}
                                    />
                                </ListItem>
                            );
                        })}
                    </List>
                </Box>
                <Box sx={{ py: 1 }}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Date Submitted
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        {format(new Date(request.createdAt), 'PPpp')}
                    </Typography>
                </Box>
                {request.updatedAt && (
                    <Box sx={{ py: 1 }}>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                            Last Updated
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            {format(new Date(request.updatedAt), 'PPpp')}
                        </Typography>
                    </Box>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Close</Button>
            </DialogActions>
        </Dialog>
    );
};

export default CostCalculatorViewModal;