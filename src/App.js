import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { getCurrentUser, addListeners, getUserData, logOut as firebaseLogOut } from 'firebase-files/firebase';
import { GetReducer } from 'redux/interface';
import firebaseArrayConvert from 'firebase-files/firebaseArrayConvert';
import { logOut, error, clearError } from 'redux/slices/userSlice';
import { signIn as tasksSignIn, updateFromSnapshot as updateTask } from 'redux/slices/taskSlice';
import { signIn as prizesSignIn, updateFromSnapshot as updatePrizeFromSnapshot } from 'redux/slices/prizeSlice';
import { clearAll as clearAllInputs } from 'redux/slices/inputsSlice';
import CreateTaskForm from 'components/CreateTaskForm';
import CreatePrizeForm from 'components/CreatePrizeForm';
import Task from 'components/Task';
import Prize from 'components/Prize';
import Modal from 'components/Modal';
import SignInForm from 'components/SignInForm';
import Hoard from 'components/Hoard';
import { minutesPerToken } from 'helpers/consts';

var authUser = {};
var hasListeners = false;
var initialised = false;

export default function App() {
  const dispatch = useDispatch();
  const user = GetReducer('user') || { loaded: false };
  const tasks = firebaseArrayConvert(GetReducer('tasks'));
  const prizes = firebaseArrayConvert(GetReducer('prizes'));
  const [userFormIsSignIn, setUserFormIsSignIn] = useState();
  const [confirmModal, setConfirmModal] = useState();
  const [tokenChange, setTokenChange] = useState();
  const [openHoard, setOpenHoard] = useState();
  const [openPrizeWheel, setOpenPrizeWheel] = useState();

  const onLoad = async function () {
    if (!initialised) {
      dispatch(clearError());
      initialised = true;
    }

    if (!authUser.uid)
      authUser = await getCurrentUser() || {};

    // Check whether the signed in user is the same as the user in cookies.
    if (user.loaded && user.id !== authUser.uid) {
      dispatch(error("User mismatch"));
      handleLogOut();
      return;
    }

    if (!hasListeners && user.id) {
      hasListeners = true;
      addListeners(user.id, userDataCallback);
      let userData = await getUserData(user.id);
      dispatch(tasksSignIn(userData.tasks));
      dispatch(prizesSignIn(userData.prizes));
    }
  }

  useEffect(onLoad);

  const userDataCallback = function (tableName, snapshot) {
    switch (tableName) {
      case "tasks":
        dispatch(updateTask({ key: snapshot.key, val: snapshot.val() }));
        break;
      case "prizes":
        dispatch(updatePrizeFromSnapshot({ key: snapshot.key, val: snapshot.val() }));
        break;
      default: break;
    }
  }

  const handleLogOut = function () {
    dispatch(clearAllInputs());
    dispatch(logOut());
    firebaseLogOut();
  }

  const tokenAnimation = function (count) {
    setTokenChange(count);
    setTimeout(() => {
      setTokenChange(0);
    }, 1000);
  }

  let userTokenEarnedCount = tasks.reduce((count, task) =>
    count += (Math.round(task.time / minutesPerToken) * task.count)
    , 0
  );

  let somethingWhatIsThisIdkItWorks = (user.budget / (user.goalMinutesWeekly / minutesPerToken))

  let userTokenSpentCount = prizes.reduce((count, prize) =>
    count += Math.round(prize.costDollars / somethingWhatIsThisIdkItWorks) * prize.claimed
    , 0
  );

  let userTokenCount = userTokenEarnedCount - userTokenSpentCount;

  return (
    // TODO make loadingGate
    authUser === 'loading' ?
      <div>loading...</div>
      :
      <div className="">
        {user.id &&
          <div onClick={handleLogOut} className="hud hud-logout">LOGOUT</div>
        }
        {user.id &&
          <div className="hud hud-wheel" onClick={setOpenPrizeWheel}>
            <div className="wheel-icon">
              <div className="wheel-icon-pointer" />
              <div className="wheel-icon-spoke one" />
              <div className="wheel-icon-spoke two" />
              <div className="wheel-icon-spoke three" />
              <div className="wheel-icon-spoke four" />
            </div>
          </div>
        }
        {user.id &&
          <p className="alert good">WELCOME {user.email}</p>
        }
        {user.error &&
          <p className="alert bad">{user.error}</p>
        }
        {user.id &&
          <div className="hud hud-tokens">
            {userTokenCount}
            <div className={`hud-tokens-animation${tokenChange ? ' show' : ''}`}>
              {tokenChange > 0 && '+'}{tokenChange}
            </div>
          </div>
        }
        {user.id &&
          <div className="hud hud-hoard" onClick={setOpenHoard}>
            <div className="hoard-icon">
              <div className="hoard-icon-top">
                <div className="hoard-icon-top-left" />
                <div className="hoard-icon-top-center" />
                <div className="hoard-icon-top-right" />
              </div>
              <div className="hoard-icon-base" >
                <div className="hoard-icon-keyhole" />
              </div>
            </div>
          </div>
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
        {confirmModal &&
          <Modal
            title={confirmModal.title}
            body={confirmModal.body}
            buttonFunction={confirmModal.callback}
            buttonText={confirmModal.buttonText}
            close={() => setConfirmModal(null)}
          />
        }
        {openPrizeWheel &&
          <Modal
            title={"Prize wheel coming soon!"}
            close={() => setOpenPrizeWheel()}
          />
        }
        {user.id &&
          <div className="flex-row-wrap">
            <div className="flex-column">
              <h1>Prizes</h1>
              {prizes.filter(i => !i.removed).map((prize) =>
                <Prize data={prize} user={user} confirm={setConfirmModal} tokenAnimation={tokenAnimation} userTokens={userTokenCount} key={prize.id} />
              )}
              <CreatePrizeForm />
            </div>
            <div className="flex-column">
              <h1>Tasks</h1>
              {tasks.filter(i => !i.removed).map((task) =>
                <Task data={task} key={task.id} confirm={setConfirmModal} tokenAnimation={tokenAnimation} />
              )}
              <CreateTaskForm />
            </div>
          </div>
        }
        {user.id && openHoard &&
          <Hoard prizes={prizes} close={setOpenHoard} />
        }
      </div>
  );
}