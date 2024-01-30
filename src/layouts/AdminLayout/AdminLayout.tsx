import Footer from "../../components/common/Footer";
import Header from "../../components/common/Header";

const AdminLayout = ({ children }: { children: any }) => {
  return (
    <div>
      <Header />
      <main className="h-main-height">{children}</main>
      <Footer />
    </div>
  );
};

export default AdminLayout;
