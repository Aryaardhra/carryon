import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({

    name: {
      type: String,
      required: true,
      trim: true,
      unique: true
    },

    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },

    image: {
        public_id: {
            type: String,
            default: ""
        },

        url: {
            type: String,
            default: ""
        },

        originalName: {
            type: String,
            default: ""
        },

        mimeType: {
            type: String,
            default: ""
        },
    },
        isActive: {
            type: Boolean,
            default: true
        },
    },
     { timestamps: true }
);

export default mongoose.model("Category", categorySchema);