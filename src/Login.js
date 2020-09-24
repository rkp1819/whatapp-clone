import React from "react";
import "./Login.css";
import WhatsAppIcon from "@material-ui/icons/WhatsApp";
import Button from "@material-ui/core/Button";

import { auth, provider } from "./firebase";
import { actionTypes } from "./reducer";
import { useStateValue } from "./StateProvider";
import firebase from "firebase";

function Login() {
  const [{}, dispatch] = useStateValue();
  auth.onAuthStateChanged((user) => {
    if (user) {
      dispatch({
        type: actionTypes.SET_USER,
        user: user,
      });
    }
  });

  const signIn = () => {
    auth
      .signInWithPopup(provider)
      .then((result) => {
        dispatch({
          type: actionTypes.SET_USER,
          user: result.user,
        });
        console.log(result);
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  return (
    <div className="login_app">
      <div className="login_app_container">
        <div className="login_app_whats_app">
          <WhatsAppIcon className="login_app_whats_app_icon" />
          <h1>Sign in to WhatsApp</h1>
        </div>
        <div className="login_app_google_sign_in">
          {/* <div className="login_app_google_sign_in_google_svg"></div> */}
          <Button onClick={signIn} color={"inherit"}>
            Sign in with Google
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Login;
