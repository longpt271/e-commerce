import { useState } from 'react';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import AttachMoneyOutlinedIcon from '@mui/icons-material/AttachMoneyOutlined';
import PostAddIcon from '@mui/icons-material/PostAdd';

import './widget.scss';
import MyModal from 'components/UI/Modal/MyModal';

const Widget = ({ type, num, dataSub }) => {
  const [modalShow, setModalShow] = useState(false);

  let data;

  const amount = num || 0;

  switch (type) {
    case 'user':
      data = {
        title: 'Clients',
        isMoney: false,
        icon: <PersonAddAltIcon className="icon" />,
      };
      break;
    case 'earning':
      data = {
        title: 'Earnings of Month',
        isMoney: true,
        icon: <AttachMoneyOutlinedIcon className="icon" />,
      };
      break;
    case 'order':
      data = {
        title: 'New Order',
        isMoney: false,
        icon: <PostAddIcon className="icon" />,
      };
      break;
    default:
      break;
  }

  return (
    <div className="widget p-3">
      <MyModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        data={dataSub}
      />

      <div className="left">
        {!data.isMoney && <b className="counter">{amount}</b>}
        {data.isMoney && (
          <b className="counter money-info">
            {amount.toLocaleString('vi-VN')}
            <small>VND</small>
          </b>
        )}

        <span
          className="title"
          onClick={() => {
            data.isMoney && setModalShow(true);
          }}
        >
          {data.title}
        </span>
        <span></span>
      </div>
      <div className="right">{data.icon}</div>
    </div>
  );
};

export default Widget;
