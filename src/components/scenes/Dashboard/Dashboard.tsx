import { useEffect, useState } from "react";
import { AiOutlineUser } from "react-icons/ai";
import { MdOutlineEmail } from "react-icons/md";
import { AiOutlineBarcode } from "react-icons/ai";
import Input from "../../common/Input";
import { CUS_GRAY_MEDIUM } from "../../../lib/consts";
import supabase from "../../../services/db";

// =======================================================================================================

const Dashboard = ({ session }: { session: any }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    if (session) {
      const {
        user: { id },
      } = session;
      setLoading(true);
      fetchUser({ userId: id });
      setLoading(false);
    }
  }, [session]);

  const fetchUser = async ({ userId }: { userId: string }) => {
    const { data, error } = await supabase
      .from("profiles")
      .select()
      .eq("id", userId);
    if (error) {
      alert("Failed to fetch users list.");
    } else {
      setUser(data);
    }
  };

  return (
    <div className="p-5">
      <div className="pt-10 w-1/2 mx-auto">
        <Input
          name="email"
          type="email"
          label="Email"
          icon={<MdOutlineEmail style={{ fill: CUS_GRAY_MEDIUM }} />}
          onChange={() => {}}
          required
          value={user ? user[0].email : ""}
          className="border-cus-gray-medium mb-3"
        />
        <Input
          name="username"
          type="text"
          label="Username"
          icon={<AiOutlineUser style={{ fill: CUS_GRAY_MEDIUM }} />}
          onChange={() => {}}
          required
          value={user ? user[0].username : ""}
          className="border-cus-gray-medium mb-3"
        />
        <Input
          name="id"
          type="text"
          label="UUID"
          icon={<AiOutlineBarcode style={{ fill: CUS_GRAY_MEDIUM }} />}
          onChange={() => {}}
          required
          value={user ? user[0].id : ""}
          className="border-cus-gray-medium mb-3"
        />
      </div>
    </div>
  );
};

export default Dashboard;
