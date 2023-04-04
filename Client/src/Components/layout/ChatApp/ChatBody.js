import { useSelector } from 'react-redux';
import { useEffect, useRef } from 'react';

import classes from './ChatBody.module.css';
import Image from 'img/Image';

const ChatBody = ({ messages = [], onSetMessages }) => {
  const roomId = useSelector(state => state.chatApp.roomId);
  const urlChat = useSelector(state => state.api.urlChat);
  const urlFetch = urlChat + '/' + roomId;

  // fetch data session
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(urlFetch, { credentials: 'include' });

        if (res.status === 401) {
          throw new Error('Please login first!');
        }

        if (res.ok) {
          const data = await res.json();
          onSetMessages(data.session.messages);
        } else {
          const data = await res.json();

          if (data.message) {
            throw new Error(data.message);
          } else {
            throw new Error('Fetch failed!');
          }
        }
      } catch (error) {
        console.log(error);
      }
    };
    if (roomId) {
      fetchData();
    }
  }, [roomId, urlFetch, onSetMessages]);

  // Hàm này sẽ được gọi mỗi khi có tin nhắn mới được thêm vào trong thẻ div
  const messagesEndRef = useRef(null);
  useEffect(() => {
    messages?.length !== 0 &&
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [messages]); // Chỉ gọi lại hàm khi messages thay đổi

  return (
    <div
      className={`${classes.chatBody} card-body overflow-auto p-3`}
      data-mdb-perfect-scrollbar="true"
    >
      {/* <div
        className={`${classes.divider} divider d-flex align-items-center mb-4`}
      >
        <p className="text-center mx-3 mb-0" style={{ color: '#a2aab7' }}>
          Today
        </p>
      </div> */}

      {messages &&
        messages.map(messData => {
          return (
            <div key={Math.random()}>
              {!messData.isChatStaff && (
                <div className="d-flex flex-row justify-content-end mb-2">
                  <div className={classes.customerMess}>
                    <p className="small p-2 mb-2 text-white rounded-1">
                      You: {messData.content}
                    </p>
                  </div>
                </div>
              )}
              {messData.isChatStaff && (
                <div className="d-flex flex-row justify-content-start mb-2">
                  <img
                    src={Image.chatUser}
                    alt="avatar 1"
                    className="avatarImg"
                  />
                  <div className={classes.adminMess}>
                    <p
                      className="small p-2 ms-3 mb-2 rounded-1 text-muted"
                      style={{ backgroundColor: '#f5f6f7' }}
                    >
                      Cộng tác viên: {messData.content}
                    </p>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
              {/* Thẻ div này sẽ được sử dụng để scroll đến cuối của thẻ div */}
            </div>
          );
        })}
    </div>
  );
};

export default ChatBody;
