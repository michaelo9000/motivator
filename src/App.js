import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { getCurrentUser, addListeners, getUserData, logOut as firebaseLogOut } from './firebase/firebase';
import { GetReducer } from './redux/interface';
import firebaseArrayConvert from './firebase/firebaseArrayConvert';
import { logOut } from './redux/slices/userSlice';
import { signIn as tasksSignIn, updateFromSnapshot as updateTask } from './redux/slices/taskSlice';
import CreateTaskForm from './components/CreateTaskForm';
import Task from './components/Task';
import SignInForm from './components/SignInForm';

export default function App() {
  const dispatch = useDispatch();
  const user = GetReducer('user');
  const tasks = GetReducer('tasks');
  const [userFormIsSignIn, setUserFormIsSignIn] = useState();
  const [hasListeners, setHasListeners] = useState();

  var authUser = {};

  const onLoad = async function () {
    // Check whether the signed in user is the same as the user in cookies.
    authUser = await getCurrentUser();
    if (user && authUser && user.id !== authUser.uid) {
      handleLogOut();
      return;
    }

    if (!hasListeners && user.id) {
      addListeners(user.id, userDataCallback);
      setHasListeners(true);
      let userData = await getUserData(user.id);
      dispatch(tasksSignIn(userData.tasks));
    }
  }

  useEffect(onLoad);

  const userDataCallback = function (tableName, snapshot) {
    switch (tableName) {
      case "tasks":
        dispatch(updateTask({ key: snapshot.key, val: snapshot.val() }));
        break;
      default: break;
    }
  }

  const handleLogOut = function () {
    dispatch(logOut());
    firebaseLogOut();
  }

  return (
    // TODO make loadingGate
    authUser === 'loading' ?
      <div>loading...</div>
      :
      <div className="">
        {user.id &&
          <div onClick={handleLogOut} className="logout">GO</div>
        }
        {user.id &&
          <p className="alert good">WELCOME {user.email}</p>
        }
        {user.error &&
          <p className="alert bad">{user.error}</p>
        }
        {!user.id &&
          <div>
            <div className="container">
              <div className={`switch-button ${userFormIsSignIn ? 'right' : 'left'}`}
                onClick={() => setUserFormIsSignIn(!userFormIsSignIn)}>
                <div className={`switch-button-label left`}>creat</div>
                <div className="switch-button-handle" />
                <div className={`switch-button-label right`}>log in</div>
              </div>
            </div>
            <SignInForm isSignIn={userFormIsSignIn} userDataCallback={userDataCallback} />
          </div>
        }
        {user.id &&
          <div>
            {firebaseArrayConvert(tasks).map((task) =>
              <Task data={task} key={task.id} />
            )}
            <CreateTaskForm />
          </div>
        }
      </div>
  );
}