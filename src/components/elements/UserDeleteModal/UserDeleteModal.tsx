import { Dispatch, SetStateAction } from "react";
import { FaTimes } from "react-icons/fa";
import { User } from "src/Types";
import RoundedBtn from "src/components/common/RoundedBtn";

// =======================================================================================================

interface UserDeleteModalProps {
  setShowModal: Dispatch<SetStateAction<boolean>>;
  deleteUser: VoidFunction;
  selectedUser: User | null | undefined;
}

// =======================================================================================================

const UserDeleteModal = ({
  setShowModal,
  deleteUser,
  selectedUser,
}: UserDeleteModalProps) => {
  return (
    <>
      <div className="fixed flex justify-center items-center overflow-x-hidden overflow-y-auto inset-0 z-50 outline-none focus:outline-none">
        <div className="relative my-6 mx-auto w-10/12 md:w-1/2 max-w-3xl">
          <div className="relative flex flex-col w-full border-0 rounded-lg shadow-lg bg-cus-gray-dark outline-none focus:outline-none">
            <div className="flex justify-between items-start border-b border-cus-gray-medium rounded-t p-3">
              <h3 className="text-3xl font-semibold">Delete a user</h3>
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
              <h3 className="mb-3 text-2xl text-center">
                Are you sure to delete this user?
              </h3>
              <p>Email: {selectedUser?.email}</p>
              <p>Username: {selectedUser?.username}</p>
              <p>Full name: {selectedUser?.full_name}</p>
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
                onClick={deleteUser}
              >
                Delete
              </RoundedBtn>
            </div>
          </div>
        </div>
      </div>
      <div className="fixed opacity-80 inset-0 bg-cus-blackest z-40"></div>
    </>
  );
};

export default UserDeleteModal;
