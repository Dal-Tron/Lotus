import { Dispatch, SetStateAction } from "react";
import { AiOutlineUser } from "react-icons/ai";
import { MdOutlineEmail } from "react-icons/md";
import { FaTimes } from "react-icons/fa";
import { NewUser } from "src/Types";
import Input from "src/components/common/Input";
import RoundedBtn from "src/components/common/RoundedBtn";

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
  return (
    <>
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <div className="relative w-10/12 md:w-1/2 my-6 mx-auto max-w-3xl">
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-cus-gray-dark outline-none focus:outline-none">
            <div className="flex items-start justify-between p-3 border-b border-cus-gray-medium rounded-t">
              <h3 className="text-3xl font-semibold">Add a user</h3>
              <button
                className="p-1 ml-auto bg-transparent border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                onClick={() => setShowModal(false)}
              >
                <span className="bg-transparent text-cus-gray-light h-6 w-6 text-2xl block outline-none focus:outline-none">
                  <FaTimes />
                </span>
              </button>
            </div>
            <div className="relative p-3 flex flex-col gap-2">
              <div className="w-40 h-40 mx-auto rounded overflow-hidden relative border border-cus-gray-medium flex justify-center items-center">
                <img width="100%" src={newUser?.avatarUrl} />
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
              <Input
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
                label="username"
                icon={<AiOutlineUser />}
              />
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
            {/*footer*/}
            <div className="flex items-center justify-end p-3 border-t border-cus-gray-medium rounded-b">
              <button
                className="text-cus-pink background-transparent px-6 py-2 outline-none focus:outline-none mr-1 mb-1 transition-all duration-300 hover:opacity-80"
                type="button"
                onClick={() => setShowModal(false)}
              >
                Close
              </button>
              <RoundedBtn
                className="bg-cus-pink text-cus-gray-light py-2 rounded outline-none focus:outline-none mr-1 duration-300 hover:opacity-80"
                variant="fill"
                onClick={addNewUser}
              >
                Add
              </RoundedBtn>
            </div>
          </div>
        </div>
      </div>
      <div className="opacity-80 fixed inset-0 z-40 bg-cus-blackest"></div>
    </>
  );
};

export default UserAddModal;
