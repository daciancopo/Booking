import React, { Component } from "react";
import { url } from "../config";
import "./Auth.css";
import AuthContext from "../context/auth-context";

export default class AuthPage extends Component {
  static contextType = AuthContext;

  constructor(props) {
    super(props);
    this.state = {
      isLogin: true,
    };
    this.emailEl = React.createRef();
    this.passwordEl = React.createRef();
  }

  switchModeHandler = () => {
    this.setState((prevState) => {
      return { isLogin: !prevState.isLogin };
    });
  };

  handleSbmit = (event) => {
    event.preventDefault();
    const email = this.emailEl.current.value;
    const password = this.passwordEl.current.value;

    if (email.trim().length === 0 || password.trim().length === 0) {
      return;
    }

    let requestBody = {
      query: `
        query Login($email: String!, $password: String!) {
            login(email: $email, password: $password) {
                userId
                token
                tokenExpiration
            }
        }
        `,
      variables: {
        email: email,
        password: password,
      },
    };

    if (!this.state.isLogin) {
      requestBody = {
        query: `
            mutation CreateUser($email: String!, $password: String!){
                createUser(userInput: {email: $email, password: $password}) {
                  _id
                  email
                }
            }        
        `,
        variables: {
          email: email,
          password: password,
        },
      };
    }

    fetch(url, {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Failed!");
        }
        return res.json();
      })
      .then((resData) => {
        if (resData.data.login.token) {
          this.context.login(
            resData.data.login.token,
            resData.data.login.userId,
            resData.data.login.tokenExpiration
          );
        }
      })
      .catch((err) => {
        console.log("Submit failed!");
      });
  };

  render() {
    return (
      <form className="auth-form" onSubmit={this.handleSbmit}>
        <div className="form-control">
          <label htmlFor="email">Email</label>
          <input type="email" id="email" ref={this.emailEl}></input>
        </div>
        <div className="form-control">
          <label htmlFor="password">Password</label>
          <input type="password" id="password" ref={this.passwordEl}></input>
        </div>
        <div className="form-actions">
          <button type="submit">Submit</button>
          <button type="button" onClick={this.switchModeHandler}>
            Swhitch to {this.state.isLogin ? "Signup" : "Login"}
          </button>
        </div>
      </form>
    );
  }
}
