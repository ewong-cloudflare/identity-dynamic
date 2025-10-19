import React from "react";

const Information = () => {
  return (
    <div className="bg-steel min-h-screen">
      <div className="max-w-7xl mx-auto p-6 sm:p-10">
        <h1 className="text-4xl font-bold mb-6 text-center">Information</h1>
        <hr className="my-6 border-gray-light" />
      </div>

      <div className="max-w-7xl mx-auto p-6 sm:p-10">
        {/* FAQs Section */}

        <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>

        <div className="mb-8">
          <h4 className="text-l font-bold mb-2">
            How do I identify my current Gateway organization?
          </h4>
          <p>
            If you need to confirm the currently enrolled Gateway organization
            for your WARP client instance, run the command{" "}
            <code>warp-cli registration show</code> in your terminal
            (Linux/MacOS) or command prompt (Windows).
          </p>
        </div>

        <hr className="my-6 border-gray-light" />

        <div className="mb-8">
          <h4 className="text-l font-bold mb-2">Example FAQ 1</h4>
          <p>Example answer and details.</p>
        </div>

        <hr className="my-6 border-gray-light" />

        <div className="mb-8">
          <h4 className="text-l font-bold mb-2">Example FAQ 2</h4>
          <p>
            https://developers.cloudflare.com/cloudflare-one/faq/troubleshooting/
          </p>
        </div>
        <hr className="my-6 border-gray-light" />
      </div>
    </div>
  );
};

export default Information;
