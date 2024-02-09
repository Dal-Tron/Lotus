import AdminDashboard from "src/components/scenes/AdminDashboard";
import AdminLayout from "src/layouts/AdminLayout";

const AdminDashboardPage = () => {
  return (
    <AdminLayout>
      {(isExpanded) => <AdminDashboard isSidebarExpanded={isExpanded} />}
    </AdminLayout>
  );
};

export default AdminDashboardPage;
