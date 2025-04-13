import React from "react";

const Dashboard = () => {
  const username = localStorage.getItem("username");
  const role = localStorage.getItem("role");

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Welcome, {username}!</h1>
      <p className="text-lg">Your role is: <strong>{role}</strong></p>
      <p className="mt-4">This is the dashboard. We'll show different content based on role next.</p>
    </div>
  );
};

export default Dashboard;
