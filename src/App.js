import React from 'react';
import CreateTaskForm from './components/CreateTaskForm';
import LoginForm from './components/LoginForm';
import { GetReducer } from './redux/interface';

export default function App() {
  const user = GetReducer('user');
  return (
    <div className="">
      {user.email &&
        <p className="alert good">WELCOME {user.email}</p>
      }
      {user.error &&
        <p className="alert bad">{user.error}</p>
      }
      {!user.email &&
        <LoginForm />
      }
      {user.email &&
        <CreateTaskForm />
      }
    </div>
  );
}