import { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import './newProduct.scss';
import Layout from 'components/layout/Layout';
import ApiContext from 'context/ApiContext';
import { toastActions } from 'store/toast';

const EditProduct = () => {
  // Sử dụng useContext
  const ctx = useContext(ApiContext);

  // navigate điều hướng
  const navigate = useNavigate();

  // Dùng useDispatch() cập nhật state redux
  const dispatch = useDispatch();

  //  dùng params lấy id Product
  const params = useParams();

  // lưu value input vào state
  const [enteredProductName, setEnteredProductName] = useState('');
  const [enteredPrice, setEnteredPrice] = useState('');
  const [enteredCount, setEnteredCount] = useState('');
  const [enteredCategory, setEnteredCategory] = useState('');
  const [enteredShortDesc, setEnteredShortDesc] = useState('');
  const [enteredLongDesc, setEnteredLongDesc] = useState('');

  // handlers
  const productNameChangeHandler = e => setEnteredProductName(e.target.value);
  const priceChangeHandler = e => setEnteredPrice(+e.target.value);
  const countChangeHandler = e => setEnteredCount(+e.target.value);
  const categoryChangeHandler = e => setEnteredCategory(e.target.value);
  const shortDescChangeHandler = e => setEnteredShortDesc(e.target.value);
  const longDescChangeHandler = e => setEnteredLongDesc(e.target.value);

  // dùng useRef() để lấy value input dùng focus()
  const productNameInputRef = useRef();
  const priceInputRef = useRef();
  const countInputRef = useRef();
  const categoryInputRef = useRef();
  const shortDescInputRef = useRef();
  const longDescInputRef = useRef();

  // Fetch data input khi editing
  const urlFetch = `${ctx.requests.getProduct}/${params.productId}`;
  useEffect(() => {
    // fetch by id
    fetch(urlFetch)
      .then(res => res.json())
      .then(data => {
        // console.log(data);
        setEnteredProductName(data.product.name);
        setEnteredPrice(data.product.price);
        setEnteredCount(data.product.count);
        setEnteredCategory(data.product.category);
        setEnteredShortDesc(data.product.short_desc);
        setEnteredLongDesc(data.product.long_desc);
      })
      .catch(err => console.log(err));
  }, [urlFetch]);

  // xử lý submit
  const submitHandler = async e => {
    e.preventDefault();

    // Validate dữ liệu
    if (enteredProductName === '') {
      productNameInputRef.current.focus();
      return;
    } else if (enteredPrice === '') {
      priceInputRef.current.focus();
      return;
    } else if (enteredCount === '') {
      countInputRef.current.focus();
      return;
    } else if (enteredCategory === '') {
      categoryInputRef.current.focus();
      return;
    } else if (enteredShortDesc === '') {
      shortDescInputRef.current.focus();
      return;
    } else if (enteredLongDesc === '') {
      longDescInputRef.current.focus();
      return;
    }

    const newProduct = {
      name: enteredProductName,
      price: enteredPrice,
      count: enteredCount,
      category: enteredCategory,
      short_desc: enteredShortDesc,
      long_desc: enteredLongDesc,
    };

    // post update product
    try {
      const res = await fetch(ctx.requests.postEditProduct, {
        method: 'PUT',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify({ prodId: params.productId, ...newProduct }),
        credentials: 'include',
      });

      if (res.ok) {
        dispatch(toastActions.SHOW_SUCCESS('Edit Product successfully!')); // toast
        navigate('/products'); // điều hướng
      } else {
        const data = await res.json();
        dispatch(
          toastActions.SHOW_WARN(
            data.message ? data.message : 'Something error!'
          )
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout className="new-product">
      <div className="top fw-bold">Update Product</div>

      <div className="bottom bg-light">
        <form onSubmit={submitHandler}>
          <div className="formInput">
            <label htmlFor="productName">Product Name</label>
            <input
              id="productName"
              type="text"
              placeholder="Enter Product Name"
              value={enteredProductName}
              onChange={productNameChangeHandler}
              ref={productNameInputRef}
            />
          </div>
          <div className="formInput">
            <label htmlFor="price">Price</label>
            <input
              id="price"
              type="number"
              min="0"
              placeholder="Enter Price"
              value={enteredPrice}
              onChange={priceChangeHandler}
              ref={priceInputRef}
            />
          </div>
          <div className="formInput">
            <label htmlFor="count">Count</label>
            <input
              id="count"
              type="number"
              min="0"
              placeholder="Enter Count"
              value={enteredCount}
              onChange={countChangeHandler}
              ref={countInputRef}
            />
          </div>
          <div className="formInput">
            <label htmlFor="category">Category</label>
            <input
              id="category"
              type="text"
              placeholder="Enter Category"
              value={enteredCategory}
              onChange={categoryChangeHandler}
              ref={categoryInputRef}
            />
          </div>
          <div className="formInput">
            <label htmlFor="short_desc">Short Description</label>
            <textarea
              id="short_desc"
              type="text"
              placeholder="Enter Short Description"
              rows="4"
              value={enteredShortDesc}
              onChange={shortDescChangeHandler}
              ref={shortDescInputRef}
            />
          </div>
          <div className="formInput">
            <label htmlFor="long_desc">Long Description</label>
            <textarea
              id="long_desc"
              type="text"
              placeholder="Enter Long Description"
              rows="6"
              value={enteredLongDesc}
              onChange={longDescChangeHandler}
              ref={longDescInputRef}
            />
          </div>

          <button>Update</button>
        </form>
      </div>
    </Layout>
  );
};

export default EditProduct;
