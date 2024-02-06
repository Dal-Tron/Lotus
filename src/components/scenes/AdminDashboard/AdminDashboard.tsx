import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FaEdit } from "react-icons/fa";
import cx from "classnames";
import RoundedBtn from "src/components/common/RoundedBtn";
import UserEditModal from "src/components/elements/UserEditModal";
import UserAddModal from "src/components/elements/UserAddModal";
import supabase from "src/services/db";
import { User, NewUser } from "src/Types";
import { TEXT_NO_DATA } from "src/lib/consts";

// =======================================================================================================
interface columnType {
  name: string;
}
const columns: columnType[] = [
  {
    name: "Email",
  },
  {
    name: "Username",
  },
  {
    name: "Full name",
  },
];

const AdminDashboard = ({
  isSidebarExpanded,
}: {
  isSidebarExpanded: boolean;
}) => {
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
    <div className="h-full p-3 overflow-auto">
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
          <div className="">
            <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
              <div className="hidden md:block">
                <table className="min-w-full text-left text-sm font-light overflow-x-scroll">
                  <thead className="border-b font-medium dark:border-neutral-500">
                    <tr>
                      <th scope="col" className="px-3 py-1">
                        #
                      </th>
                      <th scope="col" className="px-3 py-1">
                        Avatar
                      </th>
                      {columns.map((col) => {
                        return (
                          <th scope="col" key={col.name} className="px-3 py-1">
                            {col.name}
                          </th>
                        );
                      })}
                      <th scope="col" className="px-3 py-1">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.length ? (
                      users.map((user: any, idx: number) => {
                        return (
                          <tr className="border-b" key={user.id}>
                            <td className="whitespace-nowrap px-3 py-1 font-medium">
                              {idx + 1}
                            </td>
                            <td className="whitespace-nowrap px-3 py-1 font-medium">
                              <div className="flex justify-center items-center w-20 h-20 rounded-sm overflow-hidden border border-cus-gray-dark">
                                {user.avatar_url ? (
                                  <img src={user.avatar_url} />
                                ) : (
                                  <p className="text-cus-gray-medium">
                                    No image
                                  </p>
                                )}
                              </div>
                            </td>
                            <td className="whitespace-nowrap px-3 py-1 font-medium">
                              {user.email}
                            </td>
                            <td className="whitespace-nowrap px-3 py-1">
                              {user.username}
                            </td>
                            <td className="whitespace-nowrap px-3 py-1">
                              {user.full_name}
                            </td>
                            <td className="whitespace-nowrap px-3 py-1">
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
                          {TEXT_NO_DATA}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div
                className={cx(
                  "grid gap-2 md:hidden",
                  isSidebarExpanded
                    ? "grid-cols-1"
                    : "grid-cols-1 sm:grid-cols-2"
                )}
              >
                {users.length
                  ? users.map((user) => {
                      return (
                        <div
                          key={user.id}
                          className="border border-cus-gray-dark p-2 overflow-hidden"
                        >
                          <div className="flex justify-center items-center w-20 h-20 rounded-sm overflow-hidden border border-cus-gray-dark">
                            {user.avatar_url ? (
                              <img src={user.avatar_url} />
                            ) : (
                              <p className="text-cus-gray-medium">No image</p>
                            )}
                          </div>
                          <p>
                            Email: <span>{user.email}</span>
                          </p>
                          <p>
                            Username: <span>{user.username}</span>
                          </p>
                          <p>
                            Full name: <span>{user.full_name}</span>
                          </p>
                        </div>
                      );
                    })
                  : TEXT_NO_DATA}
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
