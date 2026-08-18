import { Check, PackageCheck, Truck, Box, XCircle } from "lucide-react";

const statuses = [
  {
    key: "confirmed",
    label: "Order Confirmed",
    description: "Your order has been confirmed.",
    icon: PackageCheck,
  },
  {
    key: "processing",
    label: "Processing",
    description: "Your order is being prepared.",
    icon: Box,
  },
  {
    key: "shipped",
    label: "Shipped",
    description: "Your order is on the way.",
    icon: Truck,
  },
  {
    key: "delivered",
    label: "Delivered",
    description: "Your order has been delivered.",
    icon: PackageCheck,
  },
];

const OrderStatusTimeline = ({ status }) => {
  // Handle cancelled orders separately
  if (status === "cancelled") {
    return (
      <div className="border border-red-200 bg-red-50 rounded-xl p-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
            <XCircle size={22} className="text-red-600" />
          </div>

          <div>
            <h3 className="font-semibold text-red-700">Order Cancelled</h3>

            <p className="text-sm text-red-600 mt-1">
              This order has been cancelled.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const currentIndex = statuses.findIndex((item) => item.key === status);

  return (
    <div className="border rounded-xl p-6 bg-white">
      <h2 className="text-lg font-semibold mb-6">Order Progress</h2>

      <div className="space-y-0">
        {statuses.map((item, index) => {
          const Icon = item.icon;
          const isCompleted = currentIndex >= index;
          const isCurrent = currentIndex === index;

          return (
            <div key={item.key} className="flex gap-4">
              {/* Timeline */}

              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                    isCompleted
                      ? "bg-black border-black text-white"
                      : "bg-white border-gray-300 text-gray-400"
                  }`}
                >
                  {isCompleted ? <Check size={18} /> : <Icon size={18} />}
                </div>

                {index !== statuses.length - 1 && (
                  <div
                    className={`w-0.5 h-12 ${
                      currentIndex > index ? "bg-black" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>

              {/* Content */}

              <div className="pb-8">
                <h3
                  className={`font-medium ${
                    isCurrent
                      ? "text-black"
                      : isCompleted
                        ? "text-gray-800"
                        : "text-gray-400"
                  }`}
                >
                  {item.label}
                </h3>
                <p className="text-sm text-gray-500 mt-1">{item.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderStatusTimeline;
