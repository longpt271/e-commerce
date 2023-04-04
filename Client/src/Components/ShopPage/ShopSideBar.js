import React from 'react';

import classes from './ShopSideBar.module.css';

// Sidebar data
const initialCategories = [
  {
    id: 'c1',
    name: 'IPHONE & MAC',
    products: ['iphone', 'ipad', 'macbook'],
  },
  {
    id: 'c2',
    name: 'accessory',
    products: ['airpod', 'watch'],
  },
  {
    id: 'c3',
    name: 'OTHER',
    products: ['mouse', 'keyboard', 'other'],
  },
];

// Hàm tạo viết hoa chữ cái đầu
const txtFirstUpper = txt => {
  return txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase();
};

const ShopSideBar = props => {
  // set lại category khi click
  const clickCategoryHandler = categoryClicked => {
    // Sử dụng hàm setCategory() lấy từ cha
    props.onSetCategory(categoryClicked);

    props.onSetPageNumber(1);

    window.scrollTo(0, 0);
  };

  return (
    <div className={classes.shopSideBar}>
      <h4 className="h5 fw-bold text-uppercase mb-4">CATEGORIES</h4>

      <div className="py-2 px-4 bg-dark text-white mb-3">
        <strong className="small text-uppercase fw-bold">Apple</strong>
      </div>

      <div className="text-muted">
        <button className="ps-4" onClick={clickCategoryHandler.bind(this, '')}>
          All
        </button>
      </div>
      {initialCategories.map(category => {
        return (
          <div key={category.id}>
            <div className="py-2 px-4 bg-light mb-3">
              <strong className="small text-uppercase fw-bold">
                {category.name}
              </strong>
            </div>

            <ul className="list-unstyled small text-muted ps-4 fw-normal">
              {category.products.map(product => {
                return (
                  <li key={product} className="mb-2">
                    <button onClick={clickCategoryHandler.bind(this, product)}>
                      {txtFirstUpper(product)}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </div>
  );
};

export default ShopSideBar;
