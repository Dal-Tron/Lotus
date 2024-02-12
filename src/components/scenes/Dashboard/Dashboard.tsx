import { useContext } from "react";
import { AuthContext } from "src/contexts/AuthContext";

// =======================================================================================================

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  return (
    <div className="p-5">
      <h1 className="text-3xl text-center">
        Tada{" "}
        <span className="text-cus-green">{user?.full_name || user?.email}</span>
        ! You are signed in.
      </h1>
    </div>
  );
};

export default Dashboard;
