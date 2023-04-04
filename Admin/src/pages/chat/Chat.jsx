import './chat.scss';
import Layout from 'components/layout/Layout';
import ChatApp from 'components/ChatApp/ChatApp';

const Chat = () => {
  return (
    <Layout className="chat bg-light">
      <div className="chat-title fw-bold">Chat</div>
      <div className="chat-title-sub small text-secondary fw-bold">
        Apps / Chat
      </div>
      <div className="listContainer">
        <ChatApp />
      </div>
    </Layout>
  );
};

export default Chat;
