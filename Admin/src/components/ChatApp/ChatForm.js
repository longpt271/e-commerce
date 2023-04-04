import { useState, useRef, useContext } from 'react';
import { useDispatch } from 'react-redux';
import TelegramIcon from '@mui/icons-material/Telegram';

import classes from './ChatForm.module.css';
import ApiContext from 'context/ApiContext';
import { toastActions } from 'store/toast';

const ChatForm = ({ sessionId, isEndChat }) => {
  const dispatch = useDispatch();
  const { requests } = useContext(ApiContext);

  const urlFetch = requests.postChatAddMess;
  // state value của input
  const [enteredMess, setEnteredMess] = useState('');
  const messChangeHandler = e => setEnteredMess(e.target.value);
  const messInputRef = useRef();

  // Xử lý submit
  const submitHandler = async event => {
    event.preventDefault();

    if (enteredMess === '') {
      messInputRef.current.focus();
      return;
    }

    // Xóa trường cũ
    setEnteredMess('');

    try {
      const res = await fetch(urlFetch, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomId: sessionId,
          message: enteredMess,
          isChatStaff: true,
        }),
        credentials: 'include',
      });

      if (res.status === 401) {
        throw new Error('Please login first!');
      }

      if (!res.ok) {
        const resData = await res.json();

        if (resData.message) {
          throw new Error(resData.message);
        } else {
          throw new Error('Fetch failed!');
        }
      }
    } catch (error) {
      console.log(error);
      dispatch(toastActions.SHOW_WARN(error.toString() || 'Send failed!'));
    }
  };

  return (
    <form className={classes.ChatForm} onSubmit={submitHandler}>
      <input
        id="exampleFormControlInput1"
        type="text"
        className={`${classes['form-control']} form-control`}
        placeholder={!isEndChat ? 'Type and enter' : 'Disabled'}
        value={enteredMess}
        onChange={messChangeHandler}
        ref={messInputRef}
        disabled={isEndChat}
      />
      <button>
        <TelegramIcon />
      </button>
    </form>
  );
};

export default ChatForm;
