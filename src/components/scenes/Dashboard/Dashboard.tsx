import { ChangeEvent, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { AuthContext } from "src/contexts/AuthContext";
import {
  fetchFilesReq,
  getFilePublicUrlReq,
  updateFilesTableReq,
  uploadFileReq,
} from "src/services/api";
import { FileType } from "src/Types";
import { cutString, extractFileInfo } from "src/utils/helpers";

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [files, setFiles] = useState<FileType[] | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (user) {
      fetchFiles();
    }
  }, [user]);

  const fetchFiles = async () => {
    setLoading(true);
    const { data, error } = await fetchFilesReq({ userId: user?.id });
    if (error) {
      toast.error(error.message);
    } else {
      setFiles(data!);
    }
    setLoading(false);
  };

  const uploadFile = async (e: ChangeEvent<HTMLInputElement>) => {
    setUploading(true);
    const file = (e.target as HTMLInputElement).files
      ? (e.target as HTMLInputElement).files![0]
      : null;
    const {
      randName: filePath,
      fileType,
      fileSize,
      fileName,
    } = extractFileInfo(file);

    const { error: uploadError } = await uploadFileReq({
      filePath,
      file,
      bucket: "files",
    });
    if (uploadError) {
      toast.error(uploadError.message);
      return;
    }

    const { publicUrl } = await getFilePublicUrlReq({
      filePath,
      bucket: "files",
    });

    const { error: updateError } = await updateFilesTableReq({
      fileName,
      fileSize,
      fileType,
      filePath,
      publicUrl,
    });

    if (updateError) {
      toast.error(updateError.message);
      return;
    }
    fetchFiles();
    setUploading(false);
  };
  return (
    <div className="p-5">
      <h1 className="mb-10 text-3xl text-center">
        Tada{" "}
        <span className="text-cus-green">{user?.full_name || user?.email}</span>
        ! You are signed in.
      </h1>
      {uploading ? (
        <p className="mb-10 text-center">Uploading...</p>
      ) : (
        <input
          onChange={(e) => uploadFile(e)}
          type="file"
          className="block m-auto mb-10 w-1/2 border border-cus-gray-light rounded"
        />
      )}

      <table className="min-w-full">
        <thead className="border-b">
          <tr>
            <th>No</th>
            <th>Name</th>
            <th>External ID</th>
            <th>Type</th>
            <th>Size</th>
            <th>URL</th>
            <th>Created At</th>
            <th>Updated At</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={8} className="border-b p-5 text-center">
                Loading...
              </td>
            </tr>
          ) : files && files.length ? (
            files.map((file, idx) => {
              return (
                <tr className="border-b" key={file.id}>
                  <td className="text-center">{idx + 1}</td>
                  <td className="text-center" title={file.file_name}>
                    {cutString(file?.file_name, 12)}
                  </td>
                  <td className="text-center">{file.external_id}</td>
                  <td className="text-center">{file.file_type}</td>
                  <td className="text-center">{file.file_size}</td>
                  <td className="text-center" title={file.file_url}>
                    <a
                      href={file.file_url}
                      className="hover:text-cus-pink"
                      target="_blank"
                    >
                      {cutString(file?.file_url, 24)}
                    </a>
                  </td>
                  <td className="text-center">{file.created_at}</td>
                  <td className="text-center">{file.updated_at}</td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td
                colSpan={8}
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
