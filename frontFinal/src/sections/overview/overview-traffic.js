import PropTypes from 'prop-types';
import ComputerDesktopIcon from '@heroicons/react/24/solid/ComputerDesktopIcon';
import DeviceTabletIcon from '@heroicons/react/24/solid/DeviceTabletIcon';
import PhoneIcon from '@heroicons/react/24/solid/PhoneIcon';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Grid,
  SvgIcon,
  Typography,
  useTheme
} from '@mui/material';
import { Chart } from 'src/components/chart';

// Definir una paleta de colores
const colorPalette = [
  '#F94144', // Rojo
  '#F3722C', // Naranja
  '#F8961E', // Amarillo
  '#FDCB58', // Amarillo claro
  '#277DA1', // Azul
  '#43AA8B', // Verde
  '#577590', // Azul pálido
  '#6B4226', // Marrón
  '#9A8C98', // Gris
  '#D9BF77'  // Beige
];

const useChartOptions = (labels, colors) => {
  const theme = useTheme();

  return {
    chart: {
      background: 'transparent'
    },
    colors,
    dataLabels: {
      enabled: false
    },
    labels,
    legend: {
      show: false
    },
    plotOptions: {
      pie: {
        expandOnClick: false
      }
    },
    states: {
      active: {
        filter: {
          type: 'none'
        }
      },
      hover: {
        filter: {
          type: 'none'
        }
      }
    },
    stroke: {
      width: 0
    },
    theme: {
      mode: theme.palette.mode
    },
    tooltip: {
      fillSeriesColor: false
    }
  };
};

const iconMap = {
  Desktop: (
    <SvgIcon>
      <ComputerDesktopIcon />
    </SvgIcon>
  ),
  Tablet: (
    <SvgIcon>
      <DeviceTabletIcon />
    </SvgIcon>
  ),
  Phone: (
    <SvgIcon>
      <PhoneIcon />
    </SvgIcon>
  )
};

export const OverviewTraffic = (props) => {
  const { chartSeries, labels, sx } = props;

  // Verificar si la cantidad de colores en la paleta coincide con la cantidad de categorías
  if (chartSeries.length > colorPalette.length) {
    throw new Error('No hay suficientes colores en la paleta para todas las categorías.');
  }

  // Seleccionar colores de la paleta para las categorías
  const selectedColors = colorPalette.slice(0, chartSeries.length);
  const chartOptions = useChartOptions(labels, selectedColors);

  // Calcular la suma de todos los valores en chartSeries
  const total = chartSeries.reduce((acc, value) => acc + value, 0);

  return (
    <Card sx={sx}>
      <CardHeader title="Category Info" />
      <CardContent>
        <Chart
          height={300}
          options={chartOptions}
          series={chartSeries}
          type="donut"
          width="100%"
        />
        <Grid container spacing={2} justifyContent="center" sx={{ mt: 2 }}>
          {chartSeries.map((item, index) => {
            const label = labels[index];
            const percentage = ((item / total) * 100).toFixed(2);
            const categoryColor = selectedColors[index];

            return (
              <Grid item key={label}>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center'
                  }}
                >
                  <div
                    style={{
                      backgroundColor: categoryColor,
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      marginBottom: '8px'
                    }}
                  />
                  {iconMap[label]}
                  <Typography variant="h6" sx={{ mt: 1 }}>
                    {label}
                  </Typography>
                  <Typography color="text.secondary" variant="subtitle2">
                    {percentage}%
                  </Typography>
                </Box>
              </Grid>
            );
          })}
        </Grid>
      </CardContent>
    </Card>
  );
};

OverviewTraffic.propTypes = {
  chartSeries: PropTypes.array.isRequired,
  labels: PropTypes.array.isRequired,
  sx: PropTypes.object
};
