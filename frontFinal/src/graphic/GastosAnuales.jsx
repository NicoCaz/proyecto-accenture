import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Box, Container, Paper, Typography } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useAuth } from 'src/hooks/use-auth';

const defaultTheme = createTheme();

function GastosAnuales() {
  const [gastos, setGastos] = useState([]);
  const [ingresos, setIngresos] = useState([]);
  const auth = useAuth();

  useEffect(() => {
    async function fetchData() {
      try {
        const token = auth.user.token;
        const headers = {
          'Authorization': `Bearer ${token}`
        };
        const response = await axios.get('http://localhost:8001/api/clients/accounts/statistics/anual', { headers });
        const negativeTransactions = response.data.negativeTransactionsByMonth;
        const positiveTransactions = response.data.positiveTransactionsByMonth;

        const newGastos = [];
        const newIngresos = [];

        for (let i = 0; i < 12; i++) {
          const transaction = negativeTransactions.find(trans => trans.month === i + 1);
          newGastos[i] = transaction ? -transaction.amount : 0;
        }

        for (let i = 0; i < 12; i++) {
          const transaction = positiveTransactions.find(trans => trans.month === i + 1);
          newIngresos[i] = transaction ? transaction.amount : 0;
        }

        setGastos(newGastos);
        setIngresos(newIngresos);
      } catch (error) {
        console.log(error);
        setGastos([]);
        setIngresos([]);
      }
    }
    fetchData();
  }, [auth.user.token]);

  const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ag', 'Sep', 'Oct', 'Nov', 'Dic'];
  const data = months.map((month, index) => ({
    name: month,
    gastos: gastos[index],
    ingresos: ingresos[index],
  }));

  const maxDataValue = Math.max(
    ...data.map(entry => Math.max(entry.gastos, entry.ingresos))
  );

  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <Container component="main" maxWidth="lg">
        <Paper elevation={3} style={{ padding: '20px', marginBottom: '20px' }}>
          <Typography variant="h4" gutterBottom>
            Gastos e Ingresos Anuales
          </Typography>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis
                domain={[0, maxDataValue]}
                tickFormatter={value => `${value / 1000}K`}
              />
              <Tooltip formatter={value => new Intl.NumberFormat('es-ES').format(value)} />
              <Legend />
              <Line
                type="monotone"
                dataKey="gastos"
                name="Gastos"
                stroke="#f26c6d"
                strokeWidth={2}
                dot={{ strokeWidth: 2, r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="ingresos"
                name="Ingresos"
                stroke="#4caf50"
                strokeWidth={2}
                dot={{ strokeWidth: 2, r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Paper>
      </Container>
    </ThemeProvider>
  );
}

export default GastosAnuales;
