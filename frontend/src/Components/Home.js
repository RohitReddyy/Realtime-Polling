import React from 'react'
import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
      <div className="d-block text-center">
        <h2>Real-Time Polling Application</h2>
        <Link to="/teacherlogin">
        <button className="btn btn-primary mr-2">Teachers</button>
        </Link>
        <Link to="/studentlogin">
        <button className="btn btn-primary mx-3">Students</button>
        </Link>
      </div>
    </div>
  )
}
