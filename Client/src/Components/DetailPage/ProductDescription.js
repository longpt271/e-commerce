import { useState } from 'react';

import classes from './ProductDescription.module.css';

// Hàm chuyển đổi thành dạng chuỗi
// và bổ sung <br /> và "- "
const brText = txt => {
  return String(txt).replace(/•|- /g, '<br />- ');
};

const ProductDescription = props => {
  // Trả về desc HTML string
  const descString = brText(props.desc);

  // State show/hide desc
  const [isShowDesc, setIsShowDesc] = useState(true);

  const viewDescBtnHandler = () => {
    setIsShowDesc(prevShow => !prevShow);
  };

  return (
    <div>
      <button
        className={`${classes.btnDesDetail} my-0 small fw-bold d-none d-lg-block`}
        onClick={viewDescBtnHandler}
      >
        DESCRIPTION
      </button>
      {isShowDesc && (
        <div>
          <h6 className="pt-0 pt-lg-4 pb-4 fw-bold">PRODUCT DESCRIPTION</h6>
          {props.desc && (
            <div
              className="text-muted small mb-0"
              style={{
                // whiteSpace: 'pre-wrap',
                lineHeight: 2,
              }}
              // Hàm chuyển đổi "HTML string" as 'real HTML' in react component
              dangerouslySetInnerHTML={{ __html: descString }}
            />
          )}
          {!props.desc && (
            <p className="text-secondary">- Chưa có thông tin chi tiết.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductDescription;
