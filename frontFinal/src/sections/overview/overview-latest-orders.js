import { format } from 'date-fns';
import PropTypes from 'prop-types';
import ArrowRightIcon from '@heroicons/react/24/solid/ArrowRightIcon';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardHeader,
  Divider,
  SvgIcon,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography // Importamos Typography
} from '@mui/material';
import { Scrollbar } from 'src/components/scrollbar';
import { SeverityPill } from 'src/components/severity-pill';

const statusMap = {
  pending: 'warning',
  delivered: 'success',
  refunded: 'error'
};
const categoriesMap=[
  "GENERAL",
  "FOOD",
  "ENTERTAINMENT",
  "SERVICES",
  "SUPERMARKET",
  "TRANSPORT"
];

export const OverviewLatestOrders = (props) => {
  const { orders = [], sx } = props;

  return (
    <Card sx={sx}>
      <CardHeader title="Transactions History" />
      <Scrollbar sx={{ flexGrow: 1 }}>
        <Box sx={{ minWidth: 800 }}>
          {orders.length > 0 ? ( // Verificamos si hay órdenes
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    Amount
                  </TableCell>
                  <TableCell>
                    Description
                  </TableCell>
                  <TableCell>
                    Category
                  </TableCell>
                  <TableCell sortDirection="desc">
                    Date
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map((order) => {
                  const createdAt = format(new Date(order.creationDate), 'yyyy/MM/dd');

                  return (
                    <TableRow
                      hover
                      key={order.id}
                    >
                      <TableCell>
                        ${order.amount}
                      </TableCell>
                      <TableCell>
                        {order.description}
                      </TableCell>
                      <TableCell>
                        {categoriesMap[order.category-1]}
                      </TableCell>
                      <TableCell>
                        {createdAt}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          ) : (
            // Mensaje "No data" si no hay órdenes
            <Typography variant="body2" sx={{ p: 2, textAlign: 'center' }}>
              No data
            </Typography>
          )}
        </Box>
      </Scrollbar>
      <Divider />
      <CardActions sx={{ justifyContent: 'flex-end' }}>
        <Button
          color="inherit"
          endIcon={(
            <SvgIcon fontSize="small">
              <ArrowRightIcon />
            </SvgIcon>
          )}
          size="small"
          variant="text"
        >
          View all
        </Button>
      </CardActions>
    </Card>
  );
};

OverviewLatestOrders.propTypes = {
  orders: PropTypes.array,
  sx: PropTypes.object
};
