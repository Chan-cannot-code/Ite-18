import React, { useState } from "react";
import { toast } from "react-toastify";
import { Col, Button, FormGroup, Input, Row } from "reactstrap";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Particle from "../Particle";

const initialUser = { email: '', password: '', username: '' };

const Registration = () => {
  const [user, setUser] = useState(initialUser);
  const navigate = useNavigate();

  const signUp = async () => {
    try {
      const url = 'http://localhost:1337/api/auth/local/register';
      if (user.username && user.email && user.password) {
        const response = await axios.post(url, user);
        if (response) {
          setUser(initialUser);
          navigate('/login');
        }
      }
    } catch (error) {
      toast.error(error.message, {
        hideProgressBar: true,
      });
    }
  };

  const handleUserChange = ({ target }) => {
    const { name, value } = target;
    setUser((currentUser) => ({
      ...currentUser,
      [name]: value,
    }));
  };

  return (
    <div>
      <Row className="register">
        <Col sm="12" md={{ size: 4, offset: 4 }}>
          <div>
            <h2>Register:</h2>
            <FormGroup>
              <Input
                type="text"
                name="username"
                value={user.username}
                onChange={handleUserChange}
                placeholder="Enter your Full name"
              />
            </FormGroup>
            <FormGroup>
              <Input
                type="email"
                name="email"
                value={user.email}
                onChange={handleUserChange}
                placeholder="Enter your Email"
              />
            </FormGroup>
            <FormGroup>
              <Input
                type="password"
                name="password"
                value={user.password}
                onChange={handleUserChange}
                placeholder="Enter your Password"
              />
            </FormGroup>
            <Button color="primary" onClick={signUp}>
              Sign Up!
            </Button>
            <div className="mt-3">
              <span>Already have an account? </span>
              <Link to="/login">Login!</Link>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

const RegistrationPage = () => (
  <>
    <Registration />
    <Particle />
  </>
);

export default RegistrationPage;
