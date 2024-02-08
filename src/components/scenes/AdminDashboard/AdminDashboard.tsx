import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FaEdit } from "react-icons/fa";
import cx from "classnames";
import RoundedBtn from "src/components/common/RoundedBtn";
import UserEditModal from "src/components/elements/UserEditModal";
import UserAddModal from "src/components/elements/UserAddModal";
import supabase from "src/services/db";
import { User, NewUser } from "src/Types";
import { TEXTS } from "src/utils/consts";
import { FaUserPlus } from "react-icons/fa6";

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
  {
    name: "role",
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
      toast.error(error.message);
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
    alert("Add user");
    // const { data, error } = await supabase.from("profiles").insert({});
  };

  const onEdit = ({ idx }: { idx: number }) => {
    setSelectedUser(users[idx]);
    setShowEditModal(true);
  };

  const saveChanges = async () => {
    const { data } = await supabase
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
        <div className="px-3">
          <RoundedBtn
            variant="fill"
            onClick={() => {
              setShowAddModal(true);
            }}
            className="flex items-center gap-3 py-2 mb-3"
          >
            <FaUserPlus /> Add
          </RoundedBtn>
          <div className="">
            <div className="inline-block min-w-full">
              <div className="hidden md:block">
                <table className="min-w-full text-left text-sm font-light overflow-x-scroll">
                  <thead className="border-b font-medium dark:border-neutral-500">
                    <tr>
                      <th scope="col" className="px-3 py-2">
                        #
                      </th>
                      <th scope="col" className="px-3 py-2">
                        Avatar
                      </th>
                      {columns.map((col) => {
                        return (
                          <th scope="col" key={col.name} className="px-3 py-2">
                            {col.name}
                          </th>
                        );
                      })}
                      <th scope="col" className="px-3 py-2">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.length ? (
                      users.map((user: any, idx: number) => {
                        return (
                          <tr
                            className="border-b border-b-cus-gray-dark"
                            key={user.id}
                          >
                            <td className="whitespace-nowrap px-3 py-2 font-medium">
                              {idx + 1}
                            </td>
                            <td className="whitespace-nowrap px-3 py-2 font-medium">
                              {user.avatar_url ? (
                                <div className="flex justify-center items-center w-10 h-10 rounded-full overflow-hidden border border-cus-gray-dark">
                                  <img src={user.avatar_url} alt="avatar" />
                                </div>
                              ) : (
                                <div className="w-10 h-10 rounded-full border border-cus-gray-dark bg-cus-gray-dark"></div>
                              )}
                            </td>
                            <td className="whitespace-nowrap px-3 py-2 font-medium">
                              {user.email}
                            </td>
                            <td className="whitespace-nowrap px-3 py-2">
                              {user.username}
                            </td>
                            <td className="whitespace-nowrap px-3 py-2">
                              {user.full_name}
                            </td>
                            <td className="whitespace-nowrap px-3 py-2">
                              {user.role}
                            </td>
                            <td className="whitespace-nowrap px-3 py-2">
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
                          colSpan={7}
                          className="text-center text-cus-pink px-6 py-4"
                        >
                          {TEXTS.NO_DATA}
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
                          {user.avatar_url ? (
                            <div className="flex justify-center items-center w-20 h-20 rounded-full overflow-hidden border border-cus-gray-dark mx-auto mb-2">
                              <img src={user.avatar_url} alt="avatar" />
                            </div>
                          ) : (
                            <div className="w-20 h-20 rounded-full border border-cus-gray-dark bg-cus-gray-dark mx-auto mb-2"></div>
                          )}
                          <p>
                            Email: <span>{user.email}</span>
                          </p>
                          <p>
                            Username: <span>{user.username}</span>
                          </p>
                          <p>
                            Full name: <span>{user.full_name}</span>
                          </p>
                          <p>
                            Role: <span>{user.role}</span>
                          </p>
                        </div>
                      );
                    })
                  : TEXTS.NO_DATA}
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
