import { useState }, React from "react";
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
    fetch('/api/session', {
      credentials: 'same-origin'
    }).then((response) => response.json())
    .then((data) => {
      console.log(data)
      if(data.isauthenticated){
        this.setState({isauthenticated: true});
      } else {
        this.setState({isauthenticated: false})
      }
    }).catch((error) => {
      console.log(error)
    })
  }

  }
