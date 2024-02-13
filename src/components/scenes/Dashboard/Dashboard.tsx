import { ChangeEvent, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { AuthContext } from "src/contexts/AuthContext";
import supabase from "src/services/db";
import { FileType } from "src/Types";

// =======================================================================================================

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [files, setFiles] = useState<FileType[] | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    const { data, error } = await supabase.from("files").select();
    if (error) {
      toast.error(error.message);
    } else {
      setFiles(data!);
    }
  };

  const uploadFile = async (e: ChangeEvent<HTMLInputElement>) => {
    setUploading(true);
    const file = (e.target as HTMLInputElement).files
      ? (e.target as HTMLInputElement).files![0]
      : null;
    const fileExt = file!.name.split(".").pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("files")
      .upload(filePath, file!);
    if (uploadError) {
      toast.error(uploadError.message);
      return;
    }
    const { data, error: updateError } = await supabase
      .from("files")
      .update({ file_name: file!.name })
      .eq("unique_name", filePath);
    if (updateError) {
      toast.error(updateError.message);
      return;
    }
    fetchFiles();
    setUploading(false);
  };
  return (
    <div className="p-5">
      <h1 className="mb-5 text-3xl text-center">
        Tada{" "}
        <span className="text-cus-green">{user?.full_name || user?.email}</span>
        ! You are signed in.
      </h1>
      {uploading ? (
        "Uploading..."
      ) : (
        <input
          onChange={(e) => uploadFile(e)}
          type="file"
          className="block m-auto mb-10 w-1/2 border border-cus-gray-light file:hidden"
        />
      )}

      <table className="min-w-full">
        <thead className="border-b">
          <tr>
            <th>No</th>
            <th>Name</th>
            <th>Unique name</th>
            <th>Created At</th>
          </tr>
        </thead>
        <tbody>
          {files && files.length ? (
            files.map((file, idx) => {
              return (
                <tr className="border-b" key={file.id}>
                  <td className="text-center">{idx + 1}</td>
                  <td className="text-center">{file.file_name}</td>
                  <td className="text-center">{file.unique_name}</td>
                  <td className="text-center">{file.created_at}</td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td
                colSpan={4}
                className="border-b p-5 text-cus-pink text-center"
              >
                No files
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;
