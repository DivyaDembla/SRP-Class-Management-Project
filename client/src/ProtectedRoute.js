import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  // While checking auth state
  if (user === undefined) {
    return <div>Loading...</div>;
  }

  // If not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If logged in
  return <Outlet />;
};

export default ProtectedRoute;
