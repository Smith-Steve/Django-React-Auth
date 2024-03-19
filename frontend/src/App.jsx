import React from "react";
import Cookies from "universal-cookie";

const cookies = new Cookies();

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      error: "",
      isauthenticated: false,
    };
  }
  componentDidMount = () => {
    this.getSession();
  };

  getSession = () => {
    fetch("/api/session", {
      credentials: "same-origin",
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.isauthenticated) {
          this.setState({ isauthenticated: true });
        } else {
          this.setState({ isauthenticated: false });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  whoami = () => {
    fetch("/api/whoami/", {
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "same-origin",
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("You're logged in as + ", data.username);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  handleChangePassword = (event) => {
    // This handles changes to a new password.
    // It takes in the input as a param.
    // triggered when user enters password in the input field.
    // This is a common mehtod for react input components.

    this.setState({ password: event.target.value });
  };

  handleChangeUserNameChange = (event) => {
    this.setState({ username: event.target.value });
  };

  isResponseOk(response) {
    //This handles responses from the network.
    if (response.status >= 200 && response.status <= 299) {
      return response.json();
    } else {
      throw Error(response.statusText);
    }
  }

  login = (event) => {
    event.preventDefault();
    // Make a post request. To API 'login'
    fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": cookies.get("csrftoken"),
      },
      credentials: "same-origin",
      body: JSON.stringify({
        username: this.state.username,
        password: this.state.password,
      }),
    })
      .then(this.isResponseOk)
      .then((data) => {
        console.log(data);
        this.setState({
          isauthenticated: true,
          username: "",
          password: "",
          error: "",
        });
      })
      .catch((error) => {
        console.log(error);
        this.setState({ error: "Wrong username or password" });
      });

    // eslint-disable-next-line no-undef
    logout = () => {
      fetch("/api/logout", {
        credentials: "same-origin",
      })
        .then(this.isResponseOk)
        .then((data) => {
          console.log(data);
          this.setState({ isauthenticated: false });
        })
        .catch((error) => {
          console.log(error);
        });
    };
  };

  render() {
    if (!this.state.isauthenticated) {
      return (
        <div className="container mt-3">
          <br />
          <h1>React Cookie Auth</h1>
          <form onSubmit={this.login}>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input type="text" className="from-control" id="username" />
            </div>
            <div className="form-group">
              <label htmlFor="username">Password</label>
              <input
                type="password"
                className="from-control"
                id="password"
                name="password"
                value={this.state.password}
                onChange={this.handleChangePassword}
              />
              <div>
                {this.state.error && (
                  <small className="text-danger">{this.state.error}</small>
                )}
              </div>
            </div>
            <button className="btn btn-primary" type="submit">
              Login
            </button>
          </form>
        </div>
      );
    }
    return (
      <div className="container-mt-3">
        <h1>React Cookie Auth</h1>
        <p>You are logged in.</p>
        <button className="btn-btn-primary-mr-2">Who Am I?</button>
        <button className="btn btn-danger">Log Out</button>
      </div>
    );
  }
}
