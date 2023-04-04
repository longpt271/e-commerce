import { useState } from 'react';

import './newUser.scss';
import Layout from 'components/layout/Layout';
import { userInputs } from 'data/formSource';

const NewUser = () => {
  const [info, setInfo] = useState({});

  const handleChange = e => {
    setInfo(prev => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleClick = e => {
    e.preventDefault();

    console.log(info);
  };
  return (
    <Layout className="new">
      <div className="top">
        <h1>Add New User</h1>
      </div>
      <div className="bottom">
        <form>
          {userInputs.map(input => (
            <div className="formInput" key={input.id}>
              <label>{input.label}</label>
              <input
                id={input.id}
                onChange={handleChange}
                type={input.type}
                placeholder={input.placeholder}
              />
            </div>
          ))}

          <button onClick={handleClick}>Send</button>
        </form>
      </div>
    </Layout>
  );
};

export default NewUser;
