import { useEffect, useState } from 'react';

import { useDebounce } from 'use-debounce';

const ProductSearch = props => {
  const [searchTerm, setSearchTerm] = useState(props.enteredSearch);
  const debouncedSearchTerm = useDebounce(searchTerm, 1000); // set debounce time 1000ms

  // call onSetEnteredSearch after the search term has been debounced
  useEffect(() => {
    props.onSetEnteredSearch(debouncedSearchTerm[0]);
  }, [searchTerm, props, debouncedSearchTerm]);

  const searchChangeHandler = e => setSearchTerm(e.target.value); // state input change handler

  return (
    <input
      className="mb-4 py-1 px-2 w-25 small"
      style={{ border: '1px solid #dee2e6' }}
      type="text"
      placeholder="Enter Search!"
      value={searchTerm}
      onChange={searchChangeHandler}
    />
  );
};

export default ProductSearch;
