import ImageUpload from "../../ImageUpload";

const VariantImages = ({ index, variant, updateField }) => {
  
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Variant Images</label>

      <ImageUpload
        idPrefix={`variant-${index}`}
        files={variant.images}
        setFiles={(files) => updateField("images", files)}
        maxImages={4}
      />
    </div>
  );
};

export default VariantImages;
