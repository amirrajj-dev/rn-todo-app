import cloudinary from "./cloudinary.js";

export const uploadToCloudinary = async (
  file
) => {
  try {
    const base64Image = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
    const result = await cloudinary.uploader.upload(base64Image, {
      folder : "profiles",
      resource_type: "image",
      transformation : [
        {
          width : 800 ,
          height : 600 ,
          crop : "limit"
        },
        {
          quality : "auto"
        },
        {
          format : "auto"
        }
      ]
    });
    return {
      secure_url: result.secure_url,
      public_id: result.public_id,
    };
  } catch (error) {
    console.error("Error in Cloudinary upload => ", error);
    throw new Error("Error uploading file to Cloudinary");
  }
};

export const deleteFromCloudinary = async (publicId , resourceType) => {
  try {
    await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType
    });
  } catch (error) {
    console.error(`Failed to delete ${publicId} from Cloudinary:`, error);
    throw new Error(`Failed to delete ${publicId} from Cloudinary`);
  }
};