import { Form } from 'react-bootstrap';

import classes from './ProductListSort.module.css';

const ProductListSort = ({ onSetPriceOrder, onSetNameOrder }) => {
  // xử lý giá trị gán state cha
  const handleChangeSort = e => {
    switch (e.target.value) {
      case 'p-desc':
        onSetNameOrder('');
        onSetPriceOrder('desc');
        break;
      case 'p-asc':
        onSetNameOrder('');
        onSetPriceOrder('asc');
        break;
      case 'n-asc':
        onSetPriceOrder('');
        onSetNameOrder('desc');
        break;
      case 'n-desc':
        onSetPriceOrder('');
        onSetNameOrder('asc');
        break;
      default:
        onSetPriceOrder('');
        onSetNameOrder('');
        break;
    }
  };

  return (
    <Form.Select
      aria-label="Default select example"
      className={classes.dropdown}
      onChange={handleChangeSort}
    >
      <option>Default sorting</option>
      <option value="p-asc">Price Ascending</option>
      <option value="p-desc">Price Descending</option>
      <option value="n-asc">Name Ascending</option>
      <option value="n-desc">Name Descending</option>
    </Form.Select>
  );
};

export default ProductListSort;
