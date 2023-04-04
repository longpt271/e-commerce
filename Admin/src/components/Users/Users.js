import { useCallback, useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { confirmAlert } from 'react-confirm-alert';

import ApiContext from 'context/ApiContext';
import { Table } from 'react-bootstrap';
import { toastActions } from 'store/toast';
import { authActions } from 'store/auth';

const Users = props => {
  const dispatch = useDispatch();
  const [dataFetch, setDataFetch] = useState([]);

  const userId = useSelector(state => state.auth.userId);

  // Sử dụng useContext để lấy data api
  const ctx = useContext(ApiContext);

  // url Users or Transactions
  const urlFetch = ctx.requests.getUsers;
  // url Edit Status
  const urlChangeRole = ctx.requests.patchChangeRole;

  // func get data Api
  const getData = useCallback(async () => {
    try {
      const res = await fetch(urlFetch, {
        credentials: 'include',
      });
      if (res.status === 401) {
        throw new Error('Please login!');
      }
      if (res.ok) {
        const data = await res.json();
        setDataFetch(data.users);
      }
    } catch (error) {
      console.log(error);
    }
  }, [urlFetch]);

  // hàm xử lý click edit status
  const handleChangeRole = useCallback(
    userData => {
      // fetch update status tran
      const fetchChangeRole = role => {
        // console.log(userData._id, role);
        fetch(urlChangeRole, {
          method: 'PATCH',
          headers: { 'Content-type': 'application/json' },
          body: JSON.stringify({ userId: userData._id, role }),
          credentials: 'include',
        })
          .then(res => {
            if (res.ok) {
              // nếu admin hiện tại login muốn đổi role sang chat-staff
              if (userId === userData._id && role === 'chat-staff') {
                dispatch(
                  authActions.ON_CHANGE_ROLE_STAFF({ role: 'chat-staff' }) // cập nhật lại role auth redux
                );
              }

              // nếu admin hiện tại login muốn đổi role sang user
              if (userId === userData._id && role === 'user') {
                dispatch(authActions.ON_LOGOUT());
              }
            }

            return res.json();
          })
          .then(data => {
            getData();
            dispatch(
              toastActions.SHOW_SUCCESS(data.message || 'Edit role success!')
            );
          })
          .catch(err => console.log(err));
      };

      confirmAlert({
        message: 'Choose new role',
        buttons: [
          {
            label: 'Admin',
            onClick: () => {
              fetchChangeRole('admin');
            },
          },
          {
            label: 'Chat Staff',
            onClick: () => {
              fetchChangeRole('chat-staff');
            },
          },
          {
            label: 'User',
            onClick: () => {
              fetchChangeRole('user');
            },
          },
        ],
      });
    },
    [urlChangeRole, getData, dispatch, userId]
  );

  useEffect(() => {
    //  get data Api
    getData();
  }, [getData]);

  return (
    <div className="dataTable">
      <div className="pb-2 fw-bold">Users</div>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Full Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Address</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {dataFetch?.length !== 0 &&
            dataFetch.map((user, i) => {
              return (
                <tr key={user._id}>
                  <td className="small">{i + 1}</td>
                  <td className="small">{user.fullName}</td>
                  <td className="small">{user.email}</td>
                  <td className="small">{user.phone}</td>
                  <td className="small">{user.address}</td>
                  <td
                    className={`cellWithStatus ${user.role}`}
                    onClick={handleChangeRole.bind(this, user)}
                  >
                    {user.role}
                  </td>
                </tr>
              );
            })}
        </tbody>
      </Table>
    </div>
  );
};

export default Users;
