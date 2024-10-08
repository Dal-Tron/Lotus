import cx from "classnames";
import { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { FaUserPlus } from "react-icons/fa6";
import { toast } from "react-toastify";
import DefaultAvatar from "src/assets/images/60111.png";
import RoundedBtn from "src/components/common/RoundedBtn";
import UserAddModal from "src/components/elements/UserAddModal";
import UserDeleteModal from "src/components/elements/UserDeleteModal";
import UserEditModal from "src/components/elements/UserEditModal";
import {
  addNewUserReq,
  deleteUserReq,
  fetchUsersReq,
  getFilePublicUrlReq,
} from "src/services/api";
import { NewUser, User } from "src/Types";
import { CUS_COLORS, TEXTS } from "src/utils/consts";

const columns: {
  name: string;
}[] = [
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
  const [loading, setLoading] = useState<boolean>(true);
  const [users, setUsers] = useState<User[] | []>([]);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<User | null>();
  const [newUser, setNewUser] = useState<NewUser>({
    email: "",
    username: "",
    fullName: "",
    avatarUrl: "",
    avatar: null,
  });

  const fetchUsers = async () => {
    setLoading(true);
    const { data, error } = await fetchUsersReq();
    if (error) {
      toast.error(error.message);
    } else {
      const _users: User[] = [];
      for (let user of data!) {
        if (user.avatar_url && !user.avatar_url.includes("https://")) {
          const { publicUrl } = await getFilePublicUrlReq({
            filePath: user.avatar_url,
            bucket: "avatars",
          });
          user.avatar_url = publicUrl
        }
        _users.push(user);
      }
      setUsers(data!);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const addNewUser = async () => {
    const { error } = await addNewUserReq({
      email: newUser.email,
      password: "adminuser",
      user_metadata: { full_name: newUser.fullName },
    });
    if (error) {
      toast.error(error.message);
    } else {
      fetchUsers();
      setShowAddModal(false);
    }
  };

  const onEdit = ({ idx }: { idx: number }) => {
    setSelectedUser(users[idx]);
    setShowEditModal(true);
  };

  const onDelete = ({ idx }: { idx: number }) => {
    setSelectedUser(users[idx]);
    setShowDeleteModal(true);
  };

  const deleteUser = async () => {
    const { error } = await deleteUserReq(selectedUser?.id!);
    if (error) {
      toast.error(error.message);
    } else {
      fetchUsers();
      setShowDeleteModal(false);
    }
  };

  const saveChanges = async () => {
    alert("edit user");
  };

  return (
    <div className="h-full p-3 overflow-auto">
        <div className="px-3">
          <RoundedBtn
            variant="fill"
            onClick={() => {
              setShowAddModal(true);
            }}
            className="flex items-center gap-3 mb-3 py-2"
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
                    <>
                      {loading ? <tr className="border-b">
                          <td
                            colSpan={7}
                            className="px-6 py-4 text-center"
                          >
                            Loading...
                          </td>
                        </tr> : users.length ? (
                        users.map((user: any, idx: number) => {
                          return (
                            <tr
                              className="border-b border-b-cus-gray-dark"
                              key={user.id}
                            >
                              <td className="px-3 py-2 whitespace-nowrap font-medium">
                                {idx + 1}
                              </td>
                              <td className="px-3 py-2 whitespace-nowrap font-medium">
                                {user.avatar_url ? (
                                  <div className="flex justify-center items-center w-10 h-10 border border-cus-gray-dark rounded-full overflow-hidden">
                                    <img src={user.avatar_url} alt="avatar" />
                                  </div>
                                ) : (
                                  <div className="w-10 h-10 border border-cus-gray-dark rounded-full bg-cus-gray-dark overflow-hidden">
                                    <img src={DefaultAvatar} alt="avatar" />
                                  </div>
                                )}
                              </td>
                              <td className="px-3 py-2 whitespace-nowrap font-medium">
                                {user.email}
                              </td>
                              <td className="px-3 py-2 whitespace-nowrap">
                                {user.username || user.user_id}
                              </td>
                              <td className="px-3 py-2 whitespace-nowrap">
                                {user.full_name}
                              </td>
                              <td className="px-3 py-2 whitespace-nowrap">
                                {user.role}
                              </td>
                              <td className="px-3 py-2 whitespace-nowrap">
                                <button
                                  onClick={() => onEdit({ idx })}
                                  className="mr-3"
                                >
                                  <FaEdit />
                                </button>
                                {user.role !== "admin" ? (
                                  <button
                                    onClick={() => onDelete({ idx })}
                                    className="text-cus-pink"
                                  >
                                    <FaTrash
                                      style={{ fill: CUS_COLORS.PINK }}
                                    />
                                  </button>
                                ) : null}
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr className="border-b">
                          <td
                            colSpan={7}
                            className="px-6 py-4 text-center text-cus-pink"
                          >
                            {TEXTS.NO_DATA}
                          </td>
                        </tr>
                      )}
                    </>
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
                            <div className="flex justify-center items-center mx-auto mb-2 w-20 h-20 border border-cus-gray-dark rounded-full overflow-hidden">
                              <img src={user.avatar_url} alt="avatar" />
                            </div>
                          ) : (
                            <div className="mx-auto mb-2 w-20 h-20 border border-cus-gray-dark rounded-full bg-cus-gray-dark overflow-hidden">
                              <img src={DefaultAvatar} alt="avatar" />
                            </div>
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
      {showDeleteModal ? (
        <UserDeleteModal
          setShowModal={setShowDeleteModal}
          deleteUser={deleteUser}
          selectedUser={selectedUser}
        />
      ) : null}
    </div>
  );
};

export default AdminDashboard;
