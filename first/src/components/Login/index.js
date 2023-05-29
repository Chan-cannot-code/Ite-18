import React, { useState } from "react";
import { Col, Button, FormGroup, Input, Row, Toast } from "reactstrap";
import axios from "axios";
import { toast } from "react-toastify"; 
import { Link, useNavigate } from "react-router-dom";
import { storeUser } from "../../helpers";
import Particle from "../Particle";

const initialUser = { password: "", identifier: ""};


const Login = () => {
    const [user, setUser] = useState(initialUser);
    const navigate = useNavigate();
    const handleChange = ({target}) => {
        const {name, value} = target
        setUser((currentUser) => ({
                    ...currentUser,
                    [name] : value,
                                }));
    };
    const handleLogin = async () => {
        const url = 'http://localhost:1337/api/auth/local';
        try {
            if (user.identifier && user.password){
                    const { data } = await axios.post(url, user); //server url
            if ( data.jwt){
                storeUser(data);
                toast.success('Logged in successfully!', {
                    hideProgressBar: true,
                });
                setUser(initialUser);
                navigate('/');
            }
            }
        } catch (error) {
            toast.error("Invalid Login Credentials. Please Try again!", {
                hideProgressBar: true,
            });
        }
    };

    return <Row className="login">
        <Col sm="12" md={{size: 4, offset: 4}}>
                <div>
                    <h2>Login: </h2>
                    <FormGroup>
                        <Input 
                        type="email"
                        name="identifier" 
                        value={user.identifier} 
                        onChange={handleChange} 
                        placeholder="Enter your Email" />
                    </FormGroup>
                    <FormGroup>
                        <Input type="password" 
                        name="password" 
                        value={user.password} 
                        onChange={handleChange} 
                        placeholder="Enter your Password" />
                    </FormGroup>
                    <Button color="primary"onClick={handleLogin}>Login</Button>
                    <h6>
                        Click <Link to='/registration'> Here. </Link> Sign up!
                    </h6>
                    
                </div>
        </Col><Particle/>
    </Row>;
        
    
};

export default Login;