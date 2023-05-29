import React from "react";
import CustomNav from "../CustomNav";
import { userData } from "../../helpers";
import Particle from "../Particle";
import { Button } from "reactstrap";



const Home = () => {
    const {username} = userData()
    return(
        <div>
            <CustomNav />
            <div className="home">
                <h2>Welcome, {username}!</h2>
                <Button color="primary" href="/login">Login</Button>
            </div><Particle/>
        </div>
    );
};

export default Home;