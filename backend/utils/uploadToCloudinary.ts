import cloudinary from "../config/cloudinary";

export const uploadToCloudinary = async (
  fileBuffer: Buffer,
  mimetype: string,
  folder: string
) => {
  const base64String = `data:${mimetype};base64,${fileBuffer.toString(
    "base64"
  )}`;
  const result = await cloudinary.uploader.upload(base64String, {
    resource_type: "auto",
    folder,
  });
  return result;
};
