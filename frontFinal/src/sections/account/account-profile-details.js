import { useCallback, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  TextField,
  Unstable_Grid2 as Grid
} from '@mui/material';
import axios from 'axios';
import { useAuth } from 'src/hooks/use-auth';

export const AccountProfileDetails = () => {
  const auth = useAuth();
  const [values, setValues] = useState({
    firstName: auth.user.name,
    lastName: auth.user.lastName,
    email: auth.user.email
  });

  const handleChange = useCallback(
    (event) => {
      setValues((prevState) => ({
        ...prevState,
        [event.target.name]: event.target.value
      }));
    },
    []
  );

  const handleSubmit = useCallback(
    async (event) => {



      event.preventDefault();

      try {
        const token = auth.user.token;
        const headers = {
          Authorization: `Bearer ${token}`
        };

        // Los datos actualizados que se enviarán al servidor
        const updatedData = {
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email
        };

        // Reemplaza la URL y el método HTTP según lo necesario (PUT o POST)
        const response = await axios.put(
          'http://localhost:8001/api/Clients/update',
          updatedData,
          { headers }
        );

        if (response.status === 200) {
          // La solicitud fue exitosa, puedes manejar la respuesta o redirigir al usuario si es necesario
          console.log('Datos actualizados con éxito');
          console.log(updatedData)
          console.log(updatedData)
          auth.setUser((prevUser) => ({
            ...prevUser,
            name: updatedData.firstName,
            lastName: updatedData.lastName,
            email: updatedData.email
          }));

        } else {
          console.error('Error al actualizar los datos');
        }
      } catch (error) {
        console.error('Error al actualizar el usuario:', error);
      }
    },
    [auth.user.token, values]
  );

  return (
    <form autoComplete="off" noValidate onSubmit={handleSubmit}>
      <Card>
        <CardHeader
          subheader="The information can be edited"
          title="Profile"
        />
        <CardContent sx={{ pt: 0 }}>
          <Box sx={{ m: -1.5 }}>
            <Grid container spacing={3}>
              {/* Tus campos de entrada de datos aquí */}
              <Grid
                xs={12}
                md={6}
              >
                <TextField
                  fullWidth
                  helperText="Please specify the first name"
                  label="First name"
                  name="firstName"
                  onChange={handleChange}
                  required
                  value={values.firstName}
                />
              </Grid>
              <Grid
                xs={12}
                md={6}
              >
                <TextField
                  fullWidth
                  label="Last name"
                  name="lastName"
                  onChange={handleChange}
                  required
                  value={values.lastName}
                />
              </Grid>
              <Grid
                xs={12}
                md={6}
              >
                <TextField
                  fullWidth
                  label="Email Address"
                  name="email"
                  onChange={handleChange}
                  required
                  value={values.email}
                />
              </Grid>
            </Grid>
          </Box>
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button variant="contained" type="submit">
            Save details
          </Button>
        </CardActions>
      </Card>
    </form>
  );
};
