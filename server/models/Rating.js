import mongoose from "mongoose";
const { Schema } = mongoose;

const ratingSchema = new Schema(
  {
    hotel: {
      type: String, // ✅ Sửa từ String sang ObjectId
      ref: "Hotel",
      required: true,
      index: true,
    },
    user: {
      type: String, // ✅ Sửa từ String sang ObjectId
      ref: "User",
      required: true,
      index: true, // ✅ Thêm index cho user
    },
    ratings: {
      overall: {
        type: Number,
        min: 1,
        max: 5,
        required: true,
      },
      cleanliness: {
        type: Number,
        min: 1,
        max: 5,
        default: function() { return this.ratings.overall } // ✅ Default bằng overall
      },
      service: {
        type: Number,
        min: 1,
        max: 5,
        default: function() { return this.ratings.overall }
      },
      staff: {
        type: Number,
        min: 1,
        max: 5,
        default: function() { return this.ratings.overall }
      },
    },
    comment: {
      type: String,
      trim: true,
      maxlength: 1000, // ✅ Giới hạn độ dài comment
    },
  },
  { 
    timestamps: true 
  }
);

// ✅ Thêm compound index để ngăn user review trùng
ratingSchema.index({ hotel: 1, user: 1 }, { unique: true });

// ✅ Thêm virtual field để tính số sao trung bình
ratingSchema.virtual('averageRating').get(function() {
  const { overall, cleanliness, service, staff } = this.ratings;
  return ((overall + cleanliness + service + staff) / 4).toFixed(1);
});

// ✅ Ensure virtuals are included in JSON
ratingSchema.set('toJSON', { virtuals: true });
ratingSchema.set('toObject', { virtuals: true });

export default mongoose.model("Rating", ratingSchema);