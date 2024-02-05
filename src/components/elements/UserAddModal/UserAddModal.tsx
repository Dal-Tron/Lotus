import { Dispatch, SetStateAction } from "react";
import { AiOutlineUser } from "react-icons/ai";
import { MdOutlineEmail } from "react-icons/md";
import { NewUser } from "../../../Types";
import Input from "../../common/Input";

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
        <div className="relative w-auto my-6 mx-auto max-w-3xl">
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-cus-gray-dark outline-none focus:outline-none">
            <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
              <h3 className="text-3xl font-semibold">Add</h3>
              <button
                className="p-1 ml-auto bg-transparent border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                onClick={() => setShowModal(false)}
              >
                <span className="bg-transparent text-cus-gray-light h-6 w-6 text-2xl block outline-none focus:outline-none">
                  x
                </span>
              </button>
            </div>
            <div className="relative p-6 flex-auto">
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
                icon={<AiOutlineUser />}
              />
            </div>
            {/*footer*/}
            <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
              <button
                className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                type="button"
                onClick={() => setShowModal(false)}
              >
                Close
              </button>
              <button
                className="bg-cus-pink text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                type="button"
                onClick={addNewUser}
              >
                Add
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </>
  );
};

export default UserAddModal;
