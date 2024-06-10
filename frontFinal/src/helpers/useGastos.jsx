import { useContext } from 'react';

import GastosContext from 'src/contexts/Providers';
const useGastos = () => {
    return useContext(GastosContext)
}


export default useGastos