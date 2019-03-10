import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import logo from './images/alpha-h-box2.png'
import '../css/Header.css';
import '../css/Application.css';
import Search from './Search';
import 'bootstrap/dist/css/bootstrap.min.css';
import PostForm from './PostForm';
import {withRouter} from 'react-router';
import {Col, Row, Button,} from 'reactstrap';

export class Header extends Component {
  constructor(props) {
    super(props)
    this.switchToProfile = this.switchToProfile.bind(this)
  }

  // move to the profile page
  switchToProfile() {
    this.props.history.push({
      pathname: '/profile',
    });
  }
 
  // reloads a page
  reloadPage() {
    window.location.reload();
  }
 
  render() {
    return (
      <header className="background-primary header-layout">
        <Row>
          <Col >    
            <Link to="/main" onClick={this.reloadPage}>
              <img src={logo} className="logo-style" alt="logo"/>
            </Link>
          </Col>
          <Col>
            <Search ser={this.props.header} user={this.props.user} searchUsers={this.props.searchUsers} checkFriend={this.props.checkFriend}
              addFriend={this.props.addFriend} deleteFriend={this.props.deleteFriend}/>
          </Col>
          <Col>
            <Button onClick={this.switchToProfile} color="secondary">Profile</Button>{' '}
          </Col>
          <Col>
            <PostForm user={this.props.user}/>
          </Col>
        </Row>
      </header>
    );
  }
}

export default withRouter(Header)
