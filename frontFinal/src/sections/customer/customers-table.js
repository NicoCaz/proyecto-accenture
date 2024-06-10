import PropTypes from 'prop-types';
import { format } from 'date-fns';
import {
  Avatar,
  Box,
  Card,
  Checkbox,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography
} from '@mui/material';
import { Scrollbar } from 'src/components/scrollbar';
import { getInitials } from 'src/utils/get-initials';

export const CustomersTable = (props) => {
  const {
    items = [],
    categories = [],
  } = props;

  return (
    <Card>
      <Scrollbar>
        <Box sx={{ minWidth: 800 }}>
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
                <TableCell>
                   Date
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
               {items.map((transaction) => {
                const createdAt = format(new Date(transaction.creationDate), 'dd/MM/yyyy');
                return (
                  <TableRow
                    hover
                    key={transaction.id}
                  >
                    <TableCell>
                      {transaction.amount}
                    </TableCell>
                    <TableCell>
                      {transaction.description}
                    </TableCell>
                    <TableCell>
                      {categories.find(cat=>cat.value===transaction.category)?.label}
                    </TableCell>
                    <TableCell>
                      {createdAt}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Box>
      </Scrollbar>
    </Card>
  );
};

CustomersTable.propTypes = {
  count: PropTypes.number,
  items: PropTypes.array,
  onDeselectAll: PropTypes.func,
  onDeselectOne: PropTypes.func,
  onPageChange: PropTypes.func,
  onRowsPerPageChange: PropTypes.func,
  onSelectAll: PropTypes.func,
  onSelectOne: PropTypes.func,
  page: PropTypes.number,
  rowsPerPage: PropTypes.number,
  selected: PropTypes.array
};
