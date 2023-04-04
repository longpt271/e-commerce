import React from 'react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import { faFacebookMessenger } from '@fortawesome/free-brands-svg-icons';
import openSocket from 'socket.io-client';

import './ChatApp.css';
import ChatHeader from './ChatHeader';
import ChatBody from './ChatBody';
import ChatFooter from './ChatFooter';
import { chatAppActions } from 'store/chatApp';
import { toastActions } from 'store/toast';

// Sử dụng bootstrap 5 tạo giao diện
const ChatApp = () => {
  const dispatch = useDispatch();
  const roomId = useSelector(state => state.chatApp.roomId);
  const domain = useSelector(state => state.api.domain);
  const [messages, setMessages] = useState([]);
  // console.log(messages);

  useEffect(() => {
    if (!roomId) {
      const socket = openSocket(domain);
      // Đăng ký sự kiện 'messages' để tạo room Chat mới
      socket.on('messages', data => {
        // check nếu là emit 'create'
        if (data.action === 'create') {
          // console.log('create', data.session);
          data.session.messages && setMessages(data.session.messages);
        }
      });

      // Ngắt kết nối socket khi component unmount
      return () => {
        if (socket) {
          socket.disconnect();
        }
      };
    } else {
      const socket = openSocket(domain);
      // Đăng ký sự kiện thêm mới tin nhắn dựa vào 'roomId'
      socket.on(roomId, data => {
        // check nếu là emit 'add-mess'
        if (data.action === 'add-mess') {
          data.messages && setMessages(data.messages);
          if (data.content && data.content === '/end') {
            dispatch(chatAppActions.REMOVE_ROOM());
            setMessages([]);
            dispatch(toastActions.SHOW_SUCCESS('Đã kết thúc phiên chat!'));

            socket.off(roomId);
          }
        }
      });
    }
  }, [domain, roomId, dispatch]);

  return (
    <div>
      <input type="checkbox" id="check" />
      <label className="chat-btn" htmlFor="check">
        <FontAwesomeIcon icon={faClose} className="close" />
        <FontAwesomeIcon icon={faFacebookMessenger} className="comment" />
      </label>
      <div className="chat-app-wrapper">
        <ChatHeader />
        <ChatBody messages={messages} onSetMessages={setMessages} />
        <ChatFooter />
      </div>
    </div>
  );
};

export default ChatApp;
