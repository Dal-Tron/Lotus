import { PropsWithChildren } from "react";
import Footer from "../../components/common/Footer";
import Header from "../../components/common/Header";
import Sidebar from "../../components/common/Sidebar";

// =======================================================================================================

const AdminLayout = ({
  children,
  session,
}: PropsWithChildren<{ session: any }>) => {
  return (
    <div className="bg-cus-black">
      <Header session={session} />
      <main className="h-main-height flex gap-4">
        <div className="w-sidebar-width h-full">
          <Sidebar />
        </div>
        <div className="">{children}</div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminLayout;
