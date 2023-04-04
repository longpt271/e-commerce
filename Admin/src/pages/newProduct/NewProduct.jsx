import { useContext, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import './newProduct.scss';
import Layout from 'components/layout/Layout';
import ApiContext from 'context/ApiContext';
import { toastActions } from 'store/toast';

const NewProduct = () => {
  // Sử dụng useContext
  const ctx = useContext(ApiContext);

  // navigate điều hướng
  const navigate = useNavigate();

  // Dùng useDispatch() cập nhật state redux
  const dispatch = useDispatch();

  // lưu value input vào state
  const [enteredProductName, setEnteredProductName] = useState('');
  const [enteredPrice, setEnteredPrice] = useState('');
  const [enteredCount, setEnteredCount] = useState('');
  const [enteredCategory, setEnteredCategory] = useState('');
  const [enteredShortDesc, setEnteredShortDesc] = useState('');
  const [enteredLongDesc, setEnteredLongDesc] = useState('');
  const [files, setFiles] = useState([]);

  // handlers
  const productNameChangeHandler = e => setEnteredProductName(e.target.value);
  const priceChangeHandler = e => setEnteredPrice(+e.target.value);
  const countChangeHandler = e => setEnteredCount(+e.target.value);
  const categoryChangeHandler = e => setEnteredCategory(e.target.value);
  const shortDescChangeHandler = e => setEnteredShortDesc(e.target.value);
  const longDescChangeHandler = e => setEnteredLongDesc(e.target.value);
  const filesChangeHandler = e => setFiles(e.target.files);

  // dùng useRef() để lấy value input dùng focus()
  const productNameInputRef = useRef();
  const priceInputRef = useRef();
  const countInputRef = useRef();
  const categoryInputRef = useRef();
  const shortDescInputRef = useRef();
  const longDescInputRef = useRef();

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
    } else if (files?.length !== 4) {
      dispatch(toastActions.SHOW_WARN('Please pick 4 images of product!'));
      return;
    }

    // Tạo data input files
    const formData = new FormData();

    // Thêm các giá trị của input text vào formData
    formData.append('name', enteredProductName);
    formData.append('price', enteredPrice);
    formData.append('count', enteredCount);
    formData.append('category', enteredCategory);
    formData.append('short_desc', enteredShortDesc);
    formData.append('long_desc', enteredLongDesc);

    // Thêm các file đã chọn vào formData
    Object.values(files).forEach(file => {
      formData.append('uploadImages', file);
    });

    // post new Product Api
    try {
      const res = await fetch(ctx.requests.postNewProduct, {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      if (res.ok) {
        dispatch(toastActions.SHOW_SUCCESS('Create Product successfully!')); // toast
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
      <div className="top fw-bold">Add New Product</div>

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
              rows="3"
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
              rows="4"
              value={enteredLongDesc}
              onChange={longDescChangeHandler}
              ref={longDescInputRef}
            />
          </div>
          <div className="formInput pb-2">
            <label htmlFor="uploadImages">Upload image (4 images)</label>
            <input
              id="uploadImages"
              type="file"
              name="uploadImages"
              className="p-0 border-0"
              multiple
              onChange={filesChangeHandler}
            />
          </div>

          <button>Submit</button>
        </form>
      </div>
    </Layout>
  );
};

export default NewProduct;
