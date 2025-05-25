import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <Sidebar>
      <Outlet />
    </Sidebar>
  );
}
