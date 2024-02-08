import { PropsWithChildren } from "react";
import Footer from "src/components/common/Footer";
import Header from "src/components/common/Header";

// =======================================================================================================

const AnonLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className="bg-cus-black">
      <Header />
      <main className="min-h-[var(--main-height)]">
        <div className="">{children}</div>
      </main>
      <Footer />
    </div>
  );
};

export default AnonLayout;
