import { useCallback, useMemo, useState,useEffect} from 'react';
import Head from 'next/head';
import { subDays, subHours } from 'date-fns';
import ArrowDownOnSquareIcon from '@heroicons/react/24/solid/ArrowDownOnSquareIcon';
import ArrowUpOnSquareIcon from '@heroicons/react/24/solid/ArrowUpOnSquareIcon';
import PlusIcon from '@heroicons/react/24/solid/PlusIcon';
import { Box, Button, Container, Stack, SvgIcon, Typography } from '@mui/material';
import { useSelection } from 'src/hooks/use-selection';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { CustomersTable } from 'src/sections/customer/customers-table';
import { CustomersSearch } from 'src/sections/customer/customers-search';
import { applyPagination } from 'src/utils/apply-pagination';
import useGastos from 'src/helpers/useGastos';
import * as React from 'react';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { borderRadius, flexbox } from '@mui/system';
import { useAuth } from 'src/hooks/use-auth';
import { InputBase } from '@mui/material';
import axios from 'axios';

const now = new Date();

const data = [
]; /* aca van las transacciones */

const useCustomers = (page, rowsPerPage) => {
  return useMemo(
    () => {
      return applyPagination(data, page, rowsPerPage);
    },
    [page, rowsPerPage]
  );
};

const useCustomerIds = (customers) => {
  return useMemo(
    () => {
      return customers.map((customer) => customer.id);
    },
    [customers]
  );
};


const Page = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const customers = useCustomers(page, rowsPerPage);
  const customersIds = useCustomerIds(customers);
  const customersSelection = useSelection(customersIds);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const auth = useAuth();
  const [description, setDescription] = useState();
  const [amount, setAmount] = useState();
  const [PaymentMethodId, setPaymentMethodId] = useState();
  const [CategoryId, setCategoryId] = useState();
  const [transactions, setTransactions] = useState([]);
  const [newTransaction, setNewTransaction] = useState(null);
  const [AccountId, setAccountId] = useState(1);
  const handlePageChange = useCallback(
    (event, value) => {
      setPage(value);
    },
    []
  );

 /////////
 async function fetchTransactionsData(id){
  try{
    const token = auth.user.token;
    const id=auth.user.currentAccountId
    const headers = {
      'Authorization': `Bearer ${token}`
    };
    const response = await axios.get(`http://localhost:8001/api/clients/current/account/${id}/transactions`, { headers });
    setTransactions(response.data);
    console.log(response.data);
  }
  catch (error) {
    console.log(error);
    setTransactions([]);
  }
  }

  useEffect(() => {fetchTransactionsData()},[auth])

  const { curretAccount, setCurretAccount } = useGastos()

  const currencies = [
    {
      value: 1,
      label: 'General',
    },
    {
      value: 2,
      label: 'Food',
    },
    {
      value: 3,
      label: 'Entertainment',
    },
    {
      value: 4,
      label: 'Services',

    },
    {
      value: 5,
      label: 'Market',
    },
    {
      value: 6,
      label: 'Transport',
    },
  ];

  const payment = [
    {
      value: 1,
      label: 'Cash',
    },
    {
      value: 2,
      label: 'Debit',
    },
    {
      value: 3,
      label: 'Credit',
    }
  ];

  //esto es del modal
  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handleAmountChange = (event) => {
    setAmount(event.target.value);
  };

  const handleCategoryChange = (event) => {
    setCategoryId(event.target.value);
  };
  const handlePaymentChange = (event) => {
    setPaymentMethodId(event.target.value);
  };


  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 450,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    borderRadius: 2,
    p: 4,
  };

  const handleCreate = async () => {
    const accountId = auth.user.currentAccountId
    const transactionData = {
      AccountId: accountId,
      description,
      amount,
      CategoryId,
      PaymentMethodId,
    };

    console.log(transactionData)
    try {
      const response = await fetch("http://localhost:8001/api/clients/current/transactions", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth.user.token}`,
        },
        body: JSON.stringify(transactionData)
      });
      console.log(response);
      if (response.ok) {
        setNewTransaction(transactionData)
        console.log(transactionData)
        setDescription();
        setAmount();
        setCategoryId('Select your Category');
        setPaymentMethodId('Select your method');
        handleClose();
        //PARECE QUE FUNCIONA CON ESTA LINEA, NO SE SI ESTA BIEN
        auth.getUpdatedUserInfo();
      } else {
        console.error("Error creating transaction");
      }
    } catch (error) {
      console.error("Error creating transaction:", error);
    }
  };
  
  return (
    <>
      <Head>
        <title>
          Transactions
        </title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8
        }}
      >
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Stack
              direction="row"
              justifyContent="space-between"
              spacing={4}
            >
              <Stack spacing={1}>
                <Typography variant="h4">
                  {curretAccount.user}
                </Typography>
                <Stack
                  alignItems="center"
                  direction="row"
                  spacing={1}
                >
                </Stack>
              </Stack>
              <div>
              <Button variant="contained" startIcon={(
                    <SvgIcon fontSize="small">
                      <PlusIcon />
                    </SvgIcon>
                  )} onClick={handleOpen}>Add</Button>
<Modal
  open={open}
  onClose={handleClose}
>
<Box sx={style}>
                <h2>New Transaction</h2>
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
        label="Amount"
        fullWidth       
        margin="normal"
        value={amount}
        onChange={handleAmountChange}
      />
      <TextField
        id="outlined-select-currency"
        select
        label="Category"
        defaultValue="Select your Category"
        fullWidth
        margin="normal"
        value={CategoryId}
        onChange={handleCategoryChange}
      >
        {currencies.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        id="outlined-select-currency"
        select
        label="Payment Method"
        defaultValue="Select your method"
        fullWidth
        margin="normal"
        value={PaymentMethodId}
        onChange={handlePaymentChange}
      >
        {payment.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>
      <Button onClick={handleCreate} variant="contained" fullWidth color="primary">
        Create
      </Button>
    </Box>
</Modal>
              </div>
            </Stack>
            <CustomersTable
              items={transactions}
              categories={currencies}
            />
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Page;
