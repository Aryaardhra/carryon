import { assets } from "../../assets/data/assets";
import { IoCloseCircle } from "react-icons/io5";

const ImageUpload = ({
  files = [],
  setFiles,
  maxImages = 4,
  idPrefix = "upload",
}) => {
  /* ---------- Get Preview ---------- */

  const getImageSrc = (image) => {
    if (!image) return null;

    // Newly selected image
    if (image instanceof File) {
      return URL.createObjectURL(image);
    }

    // Cloudinary image object
    if (typeof image === "object" && image.url) {
      return image.url;
    }

    // URL string
    if (typeof image === "string") {
      return image;
    }

    return null;
  };

  /* ---------- Select Image ---------- */

  const handleChange = (e, index) => {
    const file = e.target.files[0];

    if (!file) return;

    const updatedFiles = [...files];

    updatedFiles[index] = file;

    setFiles(updatedFiles.filter(Boolean));
  };

  /* ---------- Remove Image ---------- */

  const removeImage = (index) => {
    const updatedFiles = [...files];

    updatedFiles.splice(index, 1);

    setFiles(updatedFiles);
  };

  return (
    <div className="flex flex-wrap gap-4">
      {Array.from({ length: maxImages }).map((_, index) => {
        const preview = getImageSrc(files[index]);

        return (
          <div key={index} className="relative w-24 h-24">
            <label htmlFor={`${idPrefix}-${index}`} className="cursor-pointer">
              <input
                id={`${idPrefix}-${index}`}
                hidden
                type="file"
                accept="image/*"
                onChange={(e) => handleChange(e, index)}
              />

              <img
                src={preview || assets.upload_area}
                alt=""
                className="w-24 h-24 rounded-lg border object-cover"
              />
            </label>

            {preview && (
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute -top-2 -right-2 bg-white rounded-full"
              >
                <IoCloseCircle className="text-red-500" size={22} />
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ImageUpload;
