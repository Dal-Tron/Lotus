export const randomStringGenerator = (length: number) => {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
};

export const extractUsernameFromPath = (path: string) => {
  return path.split("/")[2];
};

export const extractFileInfo = (file: File | null) => {
  const fileExt = file!.name.split(".").pop();
  const fileName = file!.name;
  const randName = randomStringGenerator(8);
  const fileType = file!.type;
  const fileSize = formatBytes(file!.size);
  return { fileExt, randName, fileType, fileSize, fileName };
};

export const formatBytes = (bytes: number, decimals = 2) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return (
    parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + " " + sizes[i]
  );
};

export const cutString = (str: string = "", maxLength: number) => {
  if (!str) return;
  if (str.length <= maxLength) {
    return str;
  } else {
    return str.substring(0, maxLength) + "...";
  }
};
