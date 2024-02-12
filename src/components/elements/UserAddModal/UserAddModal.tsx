import { ChangeEvent, Dispatch, SetStateAction } from "react";
import { AiOutlineUser } from "react-icons/ai";
import { MdOutlineEmail } from "react-icons/md";
import { FaTimes } from "react-icons/fa";
import { NewUser } from "src/Types";
import Input from "src/components/common/Input";
import RoundedBtn from "src/components/common/RoundedBtn";
import DefaultAvatar from "src/assets/images/60111.png";

// =======================================================================================================

interface UserAddModalProps {
  setShowModal: Dispatch<SetStateAction<boolean>>;
  setNewUser: Dispatch<SetStateAction<NewUser>>;
  newUser: NewUser;
  addNewUser: VoidFunction;
}

// =======================================================================================================

const UserAddModal = ({
  setShowModal,
  setNewUser,
  newUser,
  addNewUser,
}: UserAddModalProps) => {
  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewUser({
      ...newUser,
      avatarUrl: URL.createObjectURL(e.target.files![0]),
      avatar: e.target.files![0] || null,
    });
  };

  return (
    <>
      <div className="fixed flex justify-center items-center overflow-x-hidden overflow-y-auto inset-0 z-50 outline-none focus:outline-none">
        <div className="relative my-6 mx-auto w-10/12 md:w-1/2 max-w-3xl">
          <div className="relative flex flex-col w-full border-0 rounded-lg shadow-lg bg-cus-gray-dark outline-none focus:outline-none">
            <div className="flex justify-between items-start border-b border-cus-gray-medium rounded-t p-3">
              <h3 className="text-3xl font-semibold">Add a user</h3>
              <button
                className="float-right ml-auto border-0 p-1 bg-transparent text-black text-3xl leading-none font-semibold outline-none focus:outline-none"
                onClick={() => setShowModal(false)}
              >
                <span className="block h-6 w-6 bg-transparent text-cus-gray-light text-2xl outline-none focus:outline-none">
                  <FaTimes />
                </span>
              </button>
            </div>
            <div className="relative flex flex-col gap-2 p-3">
              <div className="relative flex justify-center items-center mx-auto w-40 h-40 rounded overflow-hidden border border-cus-gray-medium">
                <input
                  type="file"
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    onFileChange(e)
                  }
                  className="absolute h-full w-full text-transparent file:hidden cursor-pointer"
                />
                <img
                  width="100%"
                  src={newUser?.avatarUrl || DefaultAvatar}
                  alt="avatar"
                />
              </div>
              <Input
                type="email"
                name="email"
                required={true}
                value={newUser.email}
                onChange={(e) => {
                  setNewUser({
                    ...newUser,
                    email: e.target.value,
                  });
                }}
                label="Email"
                icon={<MdOutlineEmail />}
              />
              {/* <Input
                type="text"
                name="username"
                required={true}
                value={newUser.username}
                onChange={(e) => {
                  setNewUser({
                    ...newUser,
                    username: e.target.value,
                  });
                }}
                label="Username"
                icon={<AiOutlineUser />}
              /> */}
              <Input
                type="text"
                name="fullName"
                required={true}
                value={newUser?.fullName}
                onChange={(e) => {
                  setNewUser({
                    ...newUser,
                    fullName: e.target.value,
                  });
                }}
                label="Full name"
                icon={<AiOutlineUser />}
              />
            </div>
            <div className="flex items-center justify-end border-t border-cus-gray-medium rounded-b p-3">
              <button
                className="mr-1 mb-1 px-6 py-2 text-cus-pink background-transparent outline-none focus:outline-none transition-all duration-300 hover:opacity-80"
                type="button"
                onClick={() => setShowModal(false)}
              >
                Close
              </button>
              <RoundedBtn
                className="mr-1 rounded py-2 bg-cus-pink text-cus-gray-light outline-none focus:outline-none duration-300 hover:opacity-80"
                variant="fill"
                onClick={addNewUser}
              >
                Add
              </RoundedBtn>
            </div>
          </div>
        </div>
      </div>
      <div className="fixed opacity-80 inset-0 bg-cus-blackest z-40"></div>
    </>
  );
};

export default UserAddModal;
