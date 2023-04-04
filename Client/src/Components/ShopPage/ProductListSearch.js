import { useEffect, useState } from 'react';

import classes from './ProductListSearch.module.css';
import { useDebounce } from 'hooks/use-debounce';

const ProductListSearch = props => {
  const [searchTerm, setSearchTerm] = useState(props.enteredSearch);
  const debouncedSearchTerm = useDebounce(searchTerm, 1000); // set debounce time 1000ms

  // call setEnteredSearch after the search term has been debounced
  useEffect(() => {
    props.setEnteredSearch(debouncedSearchTerm);
  }, [debouncedSearchTerm, props]);

  const searchChangeHandler = e => setSearchTerm(e.target.value); // state input change handler

  return (
    <input
      className={`${classes.input} mb-1 mb-md-0`}
      type="text"
      placeholder="Enter Search Here!"
      value={searchTerm}
      onChange={searchChangeHandler}
    />
  );
};

export default ProductListSearch;
