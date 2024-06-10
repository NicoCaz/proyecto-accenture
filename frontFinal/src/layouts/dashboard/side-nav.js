import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import PropTypes from 'prop-types';
import ArrowTopRightOnSquareIcon from '@heroicons/react/24/solid/ArrowTopRightOnSquareIcon';
import ChevronUpDownIcon from '@heroicons/react/24/solid/ChevronUpDownIcon';
import {
  Box,
  Button,
  Divider,
  Drawer,
  Stack,
  SvgIcon,
  Typography,
  useMediaQuery
} from '@mui/material';
import { Logo } from 'src/components/logo';
import { Scrollbar } from 'src/components/scrollbar';
import { items } from './config';
import { SideNavItem } from './side-nav-item';
import UserSelect from 'src/components/selectUsers';
import { useAuth } from 'src/hooks/use-auth';
import { useAuthContext } from 'src/contexts/auth-context';
import PlusIcon from '@heroicons/react/24/solid/PlusIcon';
import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';

export const SideNav = (props) => {
  const { open, onClose } = props;
  const pathname = usePathname();
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [description, setDescription] = useState();
  const [balance, setBalance] = useState();
  const [newAccount, setNewAccount] = useState();
  const auth = useAuth();

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handleBalanceChange = (event) => {
    setBalance(event.target.value);
  };

  const handleCreate = async () => {
    const clientId = auth.user.currentClientId
    const accountData = {
      ClientId: clientId,
      description,
      balance,
    };

    try {
      const response = await fetch("http://localhost:8001/api/clients/current/accounts", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth.user.token}`,
        },
        body: JSON.stringify(accountData)
      });
      console.log(response);
      if (response.ok) {
        setNewAccount(accountData)
        console.log(accountData)
        setDescription();
        setBalance();
        handleCloseModal();
        auth.getUpdatedUserInfo();
      } else {
        console.error("Error creating account");
      }
    } catch (error) {
      console.error("Error creating account:", error);
    }
  };


  const { user, accountId } = useAuthContext();

  const content = (
    <Scrollbar
      sx={{
        height: '100%',
        '& .simplebar-content': {
          height: '100%'
        },
        '& .simplebar-scrollbar:before': {
          background: 'neutral.400'
        }
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%'
        }}
      >
        <Box sx={{ p: 2 }}>
          <Box
            component={NextLink}
            href="/"
            sx={{
              display: 'inline-flex',
              height: 32,
              width: 32
            }}
          >
            <Logo />
          </Box>
        </Box>
          <Divider sx={{ borderColor: 'neutral.700' }} />
          <Box>
            
            
          </Box>
          <Box
            sx={{
              alignItems: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.00)',
              borderRadius: 1,
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'space-between',
              mt: 0,
              p: '12px',
              flexDirection: 'column',
              width: '100%'
            }}
          >
<Dialog PaperProps={{
    sx: {
      maxWidth: '400px',
      borderRadius: '8px',
    },
  }}open={isModalOpen} onClose={handleCloseModal}>
  <DialogTitle sx={{ background: 'primary.main', color: 'dark-grey' , textAlign: 'center', p: 2,}}>Create a New Account</DialogTitle>
  <DialogContent>
    <DialogContentText>
      <TextField
        id="outlined-basic"
        label="Description"
        fullWidth
        margin="normal"
        value={description}
        onChange={handleDescriptionChange}
      /> 
        <TextField
        id="outlined-basic"
        type="number"
        label="Balance"
        fullWidth       
        margin="normal"
        value={balance}
        onChange={handleBalanceChange}
      />
    </DialogContentText>
  </DialogContent>
  <DialogActions>
    <Button onClick={handleCloseModal} color="primary" variant="outlined">
      Cancel
    </Button>
    <Button onClick={handleCreate} color="primary" variant="contained">
      Create
    </Button>
  </DialogActions>
</Dialog>


            <Box sx = {{ backgroundColor: 'rgba(255, 255, 255, 0.04)', p: 3, borderRadius: 2, minWidth: '200px', textAlign: 'center' }}>
              <Typography
                color="inherit"
                variant="subtitle1"
              >
                {user.name + " " + user.lastName}
              </Typography>
              <Typography
                color="neutral.400"
                variant="body2"
              >
                {user.email}
              </Typography>
            </Box>
            <Typography
              color="neutral.400"
              variant="body2"
            >
              
              {/* accountId = {accountId}      este guarda cualquier cosa no se porque */}
            </Typography>
              <Box sx= {{ height: 20}} />
            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
              <UserSelect />
              <Button onClick={handleOpenModal} variant="contained" color="primary">
                    <SvgIcon fontSize="small">
                      <PlusIcon />
                    </SvgIcon>
                <span style={{ marginLeft: '5px' }}>Create new account</span>
              </Button>
            </Box>
          </Box>
        
        <Divider sx={{ borderColor: 'neutral.700' }} />
        <Box
          component="nav"
          sx={{
            flexGrow: 1,
            px: 2,
            py: 3
          }}
        >
          <Stack
            component="ul"
            spacing={0.5}
            sx={{
              listStyle: 'none',
              p: 0,
              m: 0
            }}
          >
            {items.map((item) => {
              const active = item.path ? (pathname === item.path) : false;

              return (
                <SideNavItem
                  active={active}
                  disabled={item.disabled}
                  external={item.external}
                  icon={item.icon}
                  key={item.title}
                  path={item.path}
                  title={item.title}
                />
              );
            })}
          </Stack>
        </Box>
        <Divider sx={{ borderColor: 'neutral.700' }} />
        <Box
          sx={{
            px: 2,
            py: 3
          }}
        >
          <Typography
            color="neutral.100"
            variant="subtitle2"
          >
            Expense Tracker{/* aca poner el nombre del usuario registrado*/}
          </Typography>
        </Box>
      </Box>
    </Scrollbar>
  );

  if (lgUp) {
    return (
      <Drawer
        anchor="left"
        open
        PaperProps={{
          sx: {
            backgroundColor: 'neutral.800',
            color: 'common.white',
            width: 280
          }
        }}
        variant="permanent"
      >
        {content}
      </Drawer>
    );
  }

  return (
    <Drawer
      anchor="left"
      onClose={onClose}
      open={open}
      PaperProps={{
        sx: {
          backgroundColor: 'neutral.800',
          color: 'common.white',
          width: 280
        }
      }}
      sx={{ zIndex: (theme) => theme.zIndex.appBar + 100 }}
      variant="temporary"
    >
      {content}
    </Drawer>
  );
};

SideNav.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool
};
