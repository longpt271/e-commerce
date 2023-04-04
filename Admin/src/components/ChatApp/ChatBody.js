import React, { useEffect, useRef, useContext } from 'react';

import './chatBody.scss';
import ChatUser from 'data/chat-user.png';
import ApiContext from 'context/ApiContext';

const ChatBody = ({ sessionId, messages = [], onSetMessages }) => {
  const messagesEndRef = useRef(null);

  const { requests } = useContext(ApiContext);
  const urlSessionChat = requests.getSessionChat + '/' + sessionId;

  // fetch data session
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(urlSessionChat, { credentials: 'include' });

        if (res.status === 401) {
          throw new Error('Please login!');
        }
        if (res.ok) {
          const data = await res.json();
          onSetMessages(data.session.messages);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [urlSessionChat, onSetMessages]);

  // Hàm này sẽ được gọi mỗi khi có tin nhắn mới được thêm vào trong thẻ div
  useEffect(() => {
    messages?.length !== 0 &&
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [messages]); // Chỉ gọi lại hàm khi messages thay đổi

  return (
    <div className="chat-body px-3 py-4">
      {messages?.length !== 0 &&
        messages.map(messData => {
          return (
            <div key={Math.random()}>
              {!messData.isChatStaff && (
                <div className="d-flex flex-row justify-content-start mb-3">
                  <img
                    src={ChatUser}
                    alt="avatar 1"
                    className="avatarImg me-2"
                  />
                  <div className="customerMess">
                    <p className="small p-2 mb-0 text-muted rounded-1">
                      Client: {messData.content}
                    </p>
                  </div>
                </div>
              )}

              {messData.isChatStaff && (
                <div className="d-flex flex-row justify-content-end mb-3">
                  <div className="adminMess">
                    <p className="small p-2 mb-0 rounded-1 text-muted">
                      You: {messData.content}
                    </p>
                  </div>
                </div>
              )}

              {messData.content === '/end' && (
                <div className="small d-flex flex-row justify-content-center text-danger ">
                  Đã kết thúc phiên chat.
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
