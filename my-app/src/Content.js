import { useEffect, useState } from "react";

import axios from "axios";

import Card from "react-bootstrap/Card";

import Container from "react-bootstrap/Container";

import Table from "react-bootstrap/Table";



function Content(){

    const [users,setUsers]=useState([]);

    useEffect(()=>{

        axios

        .get("https://jsonplaceholder.typicode.com/users")

        .then((res)=>{

            setUsers(res.data);

        })

    },[])

    return(

        <Container>

            <Card className="glass-card">

                <Card.Body>

                    <h2 className="mb-4">

                        <i className="bi bi-people-fill text-primary"></i>

                        {" "}User List

                    </h2>

                    <Table hover responsive>

                        <thead>

                            <tr>

                                <th>ID</th>

                                <th>Name</th>

                                <th>Email</th>

                                <th>Company</th>

                            </tr>

                        </thead>

                        <tbody>

                            {

                                users.map((user)=>(

                                    <tr key={user.id}>

                                        <td>{user.id}</td>

                                        <td>{user.name}</td>

                                        <td>{user.email}</td>

                                        <td>{user.company.name}</td>

                                    </tr>

                                ))

                            }

                        </tbody>

                    </Table>

                </Card.Body>

            </Card>

        </Container>

    )

}

export default Content;