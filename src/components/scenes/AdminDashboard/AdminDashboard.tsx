import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FaEdit } from "react-icons/fa";
import RoundedBtn from "src/components/common/RoundedBtn";
import UserEditModal from "src/components/elements/UserEditModal";
import UserAddModal from "src/components/elements/UserAddModal";
import supabase from "src/services/db";
import { User, NewUser } from "src/Types";

// =======================================================================================================

const AdminDashboard = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [users, setUsers] = useState<User[] | []>([]);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<User | null>();
  const [newUser, setNewUser] = useState<NewUser>({
    email: "",
    username: "",
    fullName: "",
  });
  const fetchUsers = async () => {
    const { data, error } = await supabase.from("profiles").select();
    if (error) {
      toast.error("Failed to fetch users list.");
    } else {
      setUsers(data);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchUsers();
    setLoading(false);
  }, []);

  const addNewUser = async () => {
    const { data, error } = await supabase.from("profiles").insert({});
  };

  const onEdit = ({ idx }: { idx: number }) => {
    setSelectedUser(users[idx]);
    setShowEditModal(true);
  };

  const saveChanges = async () => {
    const { data, error } = await supabase
      .from("profiles")
      .update({ email: selectedUser?.email, username: selectedUser?.username })
      .eq("id", selectedUser?.id)
      .select();
    const updatedUsers = users.map((user: any) => {
      if (user.id === selectedUser?.id) {
        return data;
      }
      return user;
    });
    setUsers(updatedUsers);
    setShowEditModal(false);
  };

  return (
    <div className="p-3">
      {loading ? (
        "Loading..."
      ) : (
        <div className="">
          <RoundedBtn
            variant="fill"
            onClick={() => {
              setShowAddModal(true);
            }}
          >
            Add
          </RoundedBtn>
          <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
              <div className="overflow-hidden">
                <table className="min-w-full text-left text-sm font-light">
                  <thead className="border-b font-medium dark:border-neutral-500">
                    <tr>
                      <th scope="col" className="px-6 py-4">
                        #
                      </th>
                      <th scope="col" className="px-6 py-4">
                        Email
                      </th>
                      <th scope="col" className="px-6 py-4">
                        Username
                      </th>
                      <th scope="col" className="px-6 py-4">
                        Full name
                      </th>
                      <th scope="col" className="px-6 py-4">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.length ? (
                      users.map((user: any, idx: number) => {
                        return (
                          <tr className="border-b" key={user.id}>
                            <td className="whitespace-nowrap px-6 py-4 font-medium">
                              {idx + 1}
                            </td>
                            <td className="whitespace-nowrap px-6 py-4 font-medium">
                              {user.email}
                            </td>
                            <td className="whitespace-nowrap px-6 py-4">
                              {user.username}
                            </td>
                            <td className="whitespace-nowrap px-6 py-4">
                              {user.full_name}
                            </td>
                            <td className="whitespace-nowrap px-6 py-4">
                              <button onClick={() => onEdit({ idx })}>
                                <FaEdit />
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr className="border-b">
                        <td
                          colSpan={4}
                          className="text-center text-cus-pink px-6 py-4"
                        >
                          No data
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
      {showAddModal ? (
        <UserAddModal
          setShowModal={setShowAddModal}
          setNewUser={setNewUser}
          newUser={newUser}
          addNewUser={addNewUser}
        />
      ) : null}
      {showEditModal ? (
        <UserEditModal
          setShowModal={setShowEditModal}
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
          saveChanges={saveChanges}
        />
      ) : null}
    </div>
  );
};

export default AdminDashboard;
