import classes from './ChatHeader.module.css';

const ChatHeader = () => {
  return (
    <div className={`${classes.chatHeader} p-3 no-copy-text`}>
      <h6 className="mb-0 ms-3">Customer Support</h6>
      <button type="button" className="btn btn-sm">
        Let's Chat App
      </button>
    </div>
  );
};

export default ChatHeader;
