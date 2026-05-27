import { Mail, Building2, Phone } from "lucide-react";

export default function ContactSection() {
  return (
    <div className="max-w-5xl w-full mx-auto p-10 text-gray-800">
      <span className="px-2 py-1 text-xs border border-gray-300 rounded-full">
        Reach Out To Us
      </span>
      <h1 className="text-4xl font-bold text-left mt-4">
        We'd love to Hear From You.
      </h1>
      <p className="text-left mt-4">
        Or just reach out manually to{" "}
        <a
          href="mailto:contact@example.com"
          className="text-indigo-600 hover:underline"
        >
          contact@example.com
        </a>
      </p>
      <div className="grid md:grid-cols-3 gap-8 mt-16">
        <div>
          <div className="text-indigo-500 bg-indigo-500/20 p-2.5 aspect-square rounded-full size-10 flex items-center justify-center">
            <Mail className="w-5 h-5" />
          </div>
          <p className="text-lg font-bold mt-2">Email Support</p>
          <p className="text-gray-500 mt-1 mb-4">
            Our team can respond in real time.
          </p>
          <a
            href="mailto:support@example.com"
            className="text-indigo-600 font-semibold"
          >
            support@example.com
          </a>
        </div>
        <div>
          <div className="text-indigo-500 bg-indigo-500/20 p-2.5 aspect-square rounded-full size-10 flex items-center justify-center">
            <Building2 className="w-5 h-5" />
          </div>
          <p className="text-lg font-bold mt-2">Visit Our Office</p>
          <p className="text-gray-500 mt-1 mb-4">
            Visit our location in real life.
          </p>
          <span className="text-indigo-600 font-semibold">
            221b Elementary Avenue, NY
          </span>
        </div>
        <div>
          <div className="text-indigo-500 bg-indigo-500/20 p-2.5 aspect-square rounded-full size-10 flex items-center justify-center">
            <Phone className="w-5 h-5" />
          </div>
          <p className="text-lg font-bold mt-2">Call Us Directly</p>
          <p className="text-gray-500 mt-1 mb-4">
            Available during working hours.
          </p>
          <span className="text-indigo-600 font-semibold">
            (+1) 234 - 4567 - 789
          </span>
        </div>
      </div>
    </div>
  );
}
