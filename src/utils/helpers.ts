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
  const pattern = /\/users\/(\w+)\/dashboard/;
  const match = path.match(pattern) || "";
  const extractedUsername = match[1];
  return extractedUsername;
};
