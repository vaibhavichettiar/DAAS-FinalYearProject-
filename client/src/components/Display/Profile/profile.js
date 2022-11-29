import Form from 'react-bootstrap/Form';
import {Container, Button} from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from "react-redux";
import {userLogout} from '../../../redux/actions/loginAction';

function Profile() {
    let {datasetDetails} = useSelector(state => state.dashboard.userDetails);
    const navigate = useNavigate();
    const [flag, setFlag] = useState(false);
    const dispatch = useDispatch();

    // useEffect(() => {
    //     if (flag) {
    //         navigate('/');
    //     }
    // })

    console.log("da = ", datasetDetails)
    const datasetCount = datasetDetails.length;

    const handleUpdate = () => {
        alert("User details updated successfully");
    }

    const handleLogout = () => {
        setFlag(true);
        dispatch(userLogout());
    }
  return (
    <Container>
        {flag == true && navigate('/')}
      <div style={{marginTop:'80px'}}>
    <Form>
      <Form.Group className="mb-3" controlId="formGroupName">
        <Form.Label>Name</Form.Label>
        <Form.Control type="text" placeholder="Enter Name" />
      </Form.Group>
      <Form.Group className="mb-3" controlId="formGroupEmail">
        <Form.Label>Email address</Form.Label>
        <Form.Control type="email" placeholder="Enter email" />
      </Form.Group>
      <Form.Group className="mb-3" controlId="formGroupContact">
        <Form.Label>Contact No.</Form.Label>
        <Form.Control type="text" placeholder="(123)-456-7890" />
      </Form.Group>
      <Form.Group className="mb-3" controlId="formGroupContact">
        <Form.Label>The Number of Datasets Uploaded {datasetCount}</Form.Label>
      </Form.Group>
      <Form.Group className="mb-3" controlId="formGroupUpdate">
        <Button variant='success' onClick={handleUpdate}>Update</Button>
      </Form.Group>
      <Form.Group className="mb-3" controlId="formGroupLogout">
        <Button variant='dark' onClick={handleLogout}>Logout</Button>
      </Form.Group>
    </Form>
    </div>
    </Container>
  );
}

export default Profile;