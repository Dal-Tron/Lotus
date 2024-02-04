import { PropsWithChildren } from "react";
import Footer from "../../components/common/Footer";
import Header from "../../components/common/Header";

// =======================================================================================================

const AnonLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className="bg-cus-black">
      <Header />
      <main className="h-main-height">
        <div className="">{children}</div>
      </main>
      <Footer />
    </div>
  );
};

export default AnonLayout;
