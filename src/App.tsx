import supabase from "./services/db";
import AdminLayout from "./layouts/AdminLayout";

function App() {
  return (
    <h1 className="text-3xl font-bold text-cus-gray-light bg-cus-black">
      <AdminLayout>
        CRA + Tailwind CSS + TypeScript + Supabase Starter
      </AdminLayout>
    </h1>
  );
}

export default App;
