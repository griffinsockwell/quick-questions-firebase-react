import React, { Component } from 'react';
import { Link } from 'react-router';
import Spinner from 'react-spinkit';
import { authRef, providerGoogle } from '../reference';

class Navbar extends Component {
  state = {
    authenticating: true,
    user: null,
  }

  componentDidMount() {
    authRef.onAuthStateChanged((user) => {
      if (user) {
        this.setState({ authenticating: false, user });
      } else {
        this.setState({ authenticating: false, user: null });
      }
    });
  }

  handleSignIn = () => {
    this.setState({ authenticating: true });
    authRef.signInWithRedirect(providerGoogle);
  }

  handleSignOut = () => {
    this.setState({ authenticating: true });
    authRef.signOut();
  }

  render() {
    const { authenticating, user } = this.state;

    const authButton = user
      ? (<button onClick={this.handleSignOut}>
        <div>Sign Out</div>
        <img src={user.photoURL} alt="profile-pic" />
      </button>)
      : (<button onClick={this.handleSignIn}>
        <div>Sign In With Google</div>
      </button>);

    return (
      <div className="Navbar">
        <div className="Navbar-home">
          <Link to="/">Quick Questions</Link>
        </div>

        {user ?
          <Link to="/new-question">
            New Question
          </Link> : ''}

        {user ?
          <Link to="/my-questions">
            My Questions
          </Link> : ''}

        <div className="Navbar-auth">
          {authenticating ?
            <button>
              <Spinner spinnerName="three-bounce" />
            </button> : authButton}
        </div>
      </div>
    );
  }
}

export default Navbar;
