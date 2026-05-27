import { FaStar } from "react-icons/fa";
import { assets } from "../assets/data/assets";

const reviews = [
  {
    id: 1,
    name: "Aisha Khan",
    rating: 5,
    comment: "Beautiful bag. Quality is amazing and looks premium.",
    date: "2 days ago",
  },
  {
    id: 2,
    name: "Riya Sharma",
    rating: 4,
    comment: "Perfect size for travel. Fast delivery.",
    date: "1 week ago",
  },
  {
    id: 3,
    name: "Neha Patel",
    rating: 5,
    comment: "Loved the material and finishing.",
    date: "2 weeks ago",
  },
];

const colors = [
  "bg-pink-100 text-pink-600",
  "bg-purple-100 text-purple-600",
  "bg-blue-100 text-blue-600",
  "bg-green-100 text-green-600",
];

const ReviewSection = () => {
  return (
    <div className="mt-16 ml-12">
      {/* Heading */}
      <h2 className="text-2xl font-semibold mb-6 ml-4">Customer Reviews</h2>

      {/* Rating Summary */}
      <div className="flex items-center gap-4 mb-8 ml-4">
        <span className="text-3xl font-semibold">4.7</span>

        <div className="flex text-gray-500">
          {Array(5)
            .fill("")
            .map((_, i) => (
              <img key={i} src={assets.rating} alt="star" className="w-5" />
            ))}
        </div>

        <span className="text-gray-500">Based on {reviews.length} reviews</span>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {reviews.map((review) => (
          <div key={review.id} className="p-5 flex gap-4">
            {/* Avatar */}
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold ${colors[review.id % colors.length]}`}
            >
              {review.name.charAt(0)}
            </div>

            {/* Content */}
            <div className="flex-1">
              <div className="flex justify-between items-center mb-1">
                <p className="font-medium text-[#130944]">{review.name}</p>

                <span className="text-sm text-gray-400 mr-4">
                  {review.date}
                </span>
              </div>

              {/* Stars */}
              <div className="flex text-gray-500 text-sm mb-2">
                {Array(review.rating)
                  .fill("")
                  .map((_, i) => (
                    <img key={i} src={assets.rating} alt="star" className="w-5" />
                  ))}
              </div>

              {/* Comment */}
              <p className="text-gray-600 text-sm leading-relaxed">
                {review.comment}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewSection;
