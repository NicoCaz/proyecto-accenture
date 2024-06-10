import React, { useEffect, useState } from 'react';
import { PieChart, ResponsiveContainer, Pie, Tooltip, Cell } from 'recharts';
import axios from 'axios';
import { useAuth } from 'src/hooks/use-auth';
import { Paper, Typography, Container } from '@mui/material';

function CategoryStatistics() {
  const [data, setData] = useState([]);
  const auth = useAuth();

  useEffect(() => {
    async function fetchData() {
      try {
        const token = auth.user.token;
        const headers = {
          'Authorization': `Bearer ${token}`
        };
        const response = await axios.get('http://localhost:8001/api/clients/accounts/statistics/category', { headers });
        const groupedTransactions = response.data.groupedTransactions;
        const categories = [
          "GENERAL",
          "FOOD",
          "ENTERTAINMENT",
          "SERVICES",
          "SUPERMARKET",
          "TRANSPORT"
        ];
        const expenses = [];
   
        for (let i = 0; i < 6; i++) {
          const transaction = groupedTransactions.find(trans => trans.category === i + 1);
          expenses[i] = transaction ? -transaction.amount : 0;
        }
        
        const newData = categories.map((category, index) => ({
          name: category,
          value: expenses[index]
        }));
        
        setData(newData);
        console.log(newData);
      } catch (error) {
        console.log(error);
        setData([]);
      }
    }

    fetchData();
  }, [auth.user.token]);

  const COLORS = ['#ce93d8', '#5c6bc0', '#b39ddb', '#4dd0e1', '#f48fb1', '#d500f9'];

  return (
    <Container maxWidth="sm" style={{ marginTop: '20px' }}>
      <Paper elevation={3} style={{ padding: '20px' }}>
        <Typography variant="h4" gutterBottom>
          Category Statistics
        </Typography>
        <div style={{ width: '100%', height: 400 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                dataKey="value"
                data={data}
                innerRadius={60}
                outerRadius={85}
                fill="#82ca9d"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </Paper>
    </Container>
  );
}

export default CategoryStatistics;
