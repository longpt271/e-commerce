import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import openSocket from 'socket.io-client';

import './chatApp.scss';
import ForumIcon from '@mui/icons-material/Forum';
import ApiContext from 'context/ApiContext';
import ChatSideBar from './ChatSideBar';
import ChatBody from './ChatBody';
import ChatForm from './ChatForm';

const ChatApp = () => {
  const { requests, mainApi } = useContext(ApiContext);
  const urlSessions = requests.getSessions;

  const [sessions, setSessions] = useState([]);
  const [sessionId, setSessionId] = useState('');
  const [messages, setMessages] = useState([]);
  const [isEndChat, setIsEndChat] = useState(false);

  // dùng Ref lưu sessions để socket io tránh render lại khi thêm mới data giống State
  const sessionsRef = useRef([]);

  // fetch data sessions
  const fetchDataSessions = useCallback(async () => {
    try {
      const res = await fetch(urlSessions, { credentials: 'include' });

      if (res.status === 401) {
        throw new Error('Please login!');
      }
      if (res.ok) {
        const data = await res.json(); // get data sessions
        setSessions(data.sessions);
        sessionsRef.current = data.sessions;
      }
    } catch (error) {
      console.log(error);
    }
  }, [urlSessions]);
  useEffect(() => {
    // lấy ra tin nhắn cuối cùng của mảng messages
    const lastMessage = messages[messages.length - 1];
    // nếu content === '/end' thì trả về setIsEndChat = true
    if (lastMessage && lastMessage.content === '/end') {
      setIsEndChat(true);
    } else {
      setIsEndChat(false);
    }

    fetchDataSessions();
  }, [fetchDataSessions, messages]);

  // Lưu trữ biến socket hiện tại vào một biến tham chiếu
  const socketRef = useRef(null);
  //--- Thực hiện đăng ký sự kiện
  useEffect(() => {
    socketRef.current = openSocket(mainApi);

    // Đăng ký sự kiện 'messages' để check room Chat mới
    socketRef.current.on('messages', data => {
      // check nếu là emit 'create'
      if (data.action === 'create') {
        const updatedSessions = [data.session, ...sessionsRef.current];
        setSessions(updatedSessions);
        sessionsRef.current = updatedSessions;
        // console.log('create', updatedSessions);
      }
    });

    // nếu tồn tại sessionId
    if (sessionId) {
      // Ngắt kết nối socket với sự kiện sessionId cũ (nếu có)
      if (socketRef.current) {
        // console.log('disconnected' + sessionId);
        socketRef.current.off(sessionId);
      }

      // Đăng ký sự kiện sessionId mới
      socketRef.current.on(sessionId, data => {
        if (data.action === 'add-mess') {
          // console.log('add-mess', sessionId);
          data.messages && setMessages(data.messages);
          if (data.content && data.content === '/end') {
            fetchDataSessions();
          }
        }
      });
    }

    // Ngắt kết nối socket khi component unmount
    return () => {
      if (socketRef.current) {
        // console.log('disconnected');
        socketRef.current.disconnect();
      }
    };
  }, [mainApi, sessionId, fetchDataSessions]);

  return (
    <main className="chat-app">
      <ChatSideBar
        data={sessions}
        sessionId={sessionId}
        onSetSessionId={setSessionId}
        onFetchDataSessions={fetchDataSessions}
      />
      <div className="chat-container">
        {sessionId && (
          <>
            <div className="top-roomId d-flex d-md-none">{sessionId}</div>
            <ChatBody
              sessionId={sessionId}
              messages={messages}
              onSetMessages={setMessages}
            />
            <ChatForm sessionId={sessionId} isEndChat={isEndChat} />
          </>
        )}

        {!sessionId && (
          <div className="defaultChatIcon">
            <ForumIcon />
          </div>
        )}
      </div>
    </main>
  );
};

export default ChatApp;
