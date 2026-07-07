import { useEffect, useState } from "react";
import axios from "axios";
import Table from "react-bootstrap/Table";

function Content() {

  const [users,setUsers]=useState([]);

  useEffect(()=>{

    axios.get("https://jsonplaceholder.typicode.com/users")
      .then(res=>{
        setUsers(res.data);
      })

  },[])

  return(

    <Table striped bordered hover>

      <thead>

      <tr>
        <th>Name</th>
        <th>ID</th>
        <th>Status</th>
      </tr>

      </thead>

      <tbody>

      {
        users.slice(0,1).map(user=>(

          <tr key={user.id}>
            <td>{user.name}</td>
            <td>{user.id}</td>
            <td>Active</td>
          </tr>

        ))
      }

      </tbody>

    </Table>

  )

}

export default Content;