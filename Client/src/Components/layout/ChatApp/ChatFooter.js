import { useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useDispatch, useSelector } from 'react-redux';
import { chatAppActions } from 'store/chatApp';
import {
  faPaperclip,
  faPaperPlane,
  faSmile,
} from '@fortawesome/free-solid-svg-icons';

import Image from 'img/Image';
import classes from './ChatFooter.module.css';
import { toastActions } from 'store/toast';

const ChatFooter = () => {
  const dispatch = useDispatch();

  // state value của input
  const [enteredMess, setEnteredMess] = useState('');
  const messChangeHandler = e => setEnteredMess(e.target.value);
  const messInputRef = useRef();

  const userId = useSelector(state => state.auth.userId);
  const roomId = useSelector(state => state.chatApp.roomId);
  const urlChatNew = useSelector(state => state.api.urlChatNew);
  const urlChatAddMess = useSelector(state => state.api.urlChatAddMess);

  // Kiểm tra giá trị xem có tồn tại roomId k thì sẽ có data fetch tương ứng
  const urlFetch = !roomId ? urlChatNew : urlChatAddMess;
  const methodFetch = !roomId ? 'PUT' : 'POST';
  const dataFetch = !roomId
    ? { userId, message: enteredMess }
    : { userId, roomId, message: enteredMess };
  // console.log(roomId, urlFetch, methodFetch);

  // Xử lý submit
  const submitHandler = async event => {
    event.preventDefault();

    if (enteredMess === '') {
      messInputRef.current.focus();
      return;
    }
    setEnteredMess(''); // Xóa trường cũ

    try {
      if (userId) {
        const res = await fetch(urlFetch, {
          method: methodFetch,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dataFetch),
          credentials: 'include',
        });

        if (res.status === 401) {
          throw new Error('Please login first!');
        }

        if (res.ok) {
          const resData = await res.json();

          resData.roomId && dispatch(chatAppActions.SET_ROOM(resData.roomId));
        } else {
          const resData = await res.json();

          if (resData.message) {
            throw new Error(resData.message);
          } else {
            throw new Error('Fetch failed!');
          }
        }
      } else {
        throw new Error('Please login first!');
      }
    } catch (error) {
      dispatch(toastActions.SHOW_WARN(error.toString() || 'Send failed!'));
    }
  };

  return (
    <form className={`${classes.chatFooter} p-3`} onSubmit={submitHandler}>
      <img src={Image.chatUser} alt="avatar 3" className="avatarImg mx-2" />
      <input
        id="exampleFormControlInput1"
        type="text"
        className={`${classes['form-control']} form-control`}
        placeholder="Enter Message!"
        value={enteredMess}
        onChange={messChangeHandler}
        ref={messInputRef}
      />
      <a className="ms-3" href="#!">
        <FontAwesomeIcon icon={faPaperclip} />
      </a>
      <a className="ms-3" href="#!">
        <FontAwesomeIcon icon={faSmile} />
      </a>
      <button className="ms-3">
        <FontAwesomeIcon icon={faPaperPlane} className={classes.iconSend} />
      </button>
    </form>
  );
};

export default ChatFooter;
