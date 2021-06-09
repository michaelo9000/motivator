import React, { useState } from 'react';
import CreateTaskForm from './components/CreateTaskForm';
import LoginForm from './components/LoginForm';
import CreateUserForm from './components/CreateUserForm';
import { getCurrentUser } from './firebase/firebase';
import { GetReducer } from './redux/interface';

export default function App() {

  const user = GetReducer('user');
  const authUser = getCurrentUser();
  const [userFormIsLogin, setUserFormIsLogin] = useState();

  return (
    <div className="">
      {user.email &&
        <p className="alert good">WELCOME {user.email}</p>
      }
      {user.error &&
        <p className="alert bad">{user.error}</p>
      }
      {!user.email &&
        <div>
          <div className="container">
            <div className={`switch-button ${userFormIsLogin ? 'right' : 'left'}`}
              onClick={() => setUserFormIsLogin(!userFormIsLogin)}>
              <div className={`switch-button-label left`}>creat</div>
              <div className="switch-button-handle" />
              <div className={`switch-button-label right`}>log in</div>
            </div>
          </div>
          {userFormIsLogin ?
            <LoginForm />
            :
            <CreateUserForm />
          }
        </div>
      }
      {user.email &&
        <CreateTaskForm />
      }
    </div>
  );
}