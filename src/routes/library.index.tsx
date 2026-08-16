import { Navigate } from "react-router-dom";

export function LibraryIndexRedirect() {
  return <Navigate to="/library/watchlist" replace />;
}
