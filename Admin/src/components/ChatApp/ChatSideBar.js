import './chatSideBar.scss';
import ChatUser from 'data/chat-user.png';

const ChatSideBar = ({
  data = [],
  sessionId,
  onSetSessionId,
  onFetchDataSessions,
}) => {
  return (
    <div className="chat-sidebar">
      <div className="chat-sidebar-top">
        <span>Search</span>
      </div>
      <div className="chat-sidebar-center">
        <ul>
          {data.length !== 0 &&
            data.map(session => {
              return (
                <li
                  key={session._id}
                  onClick={() => {
                    onSetSessionId(session._id);
                    onFetchDataSessions();
                  }}
                  className={sessionId === session._id ? 'active' : ''}
                >
                  <div className="avatarContainer">
                    <img src={ChatUser} alt="avatar 1" className="avatarImg" />
                    <div
                      className={session.active ? 'dot dotActive' : 'dot'}
                    ></div>
                  </div>
                  <span className="d-none d-md-inline-block">
                    {session._id}
                  </span>
                </li>
              );
            })}
        </ul>
      </div>
    </div>
  );
};

export default ChatSideBar;
