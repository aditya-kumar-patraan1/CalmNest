import axios from "axios";
import React, { useState } from "react";
import { toast, Toaster } from "react-hot-toast";

const AIHealthAssistant = () => {
  const [ImageURL, setImageURL] = useState(null);
  const [isShowing, setIsShowing] = useState(false);
  const [ImageFile, setImageFile] = useState(null);
  const [query, setQuery] = useState("");
  const [output, setOutput] = useState(null);
  const [processing, setProcessing] = useState(false);
  const GROQLINK = import.meta.env.VITE_GROQ_LINK;

  const setFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imgURL = URL.createObjectURL(file);
      setImageFile(file);
      setImageURL(imgURL);
    }
  };

  const closeDown = () => {
    setIsShowing(false);
    setImageURL(null);
    setImageFile(null);
  };

  const handleSubmit = async () => {
    if (!ImageFile || !query) return;

    toast.success("Wait for the Response...");
    setProcessing(true); // Start processing immediately

    try {
      const reader = new FileReader();
      reader.readAsDataURL(ImageFile);
      reader.onloadend = async () => {
        const base64Image = reader.result;

        const payload = {
          model: "meta-llama/llama-4-scout-17b-16e-instruct",
          messages: [
            {
              role: "user",
              content: [
                { type: "text", text: query },
                { type: "image_url", image_url: { url: base64Image } },
              ],
            },
          ],
          temperature: 1,
          max_completion_tokens: 1024,
          top_p: 1,
          stream: false,
        };

        const response = await axios.post(
          GROQLINK,
          payload,
          {
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
              "Content-Type": "application/json",
            },
          }
        );

        const answer = response.data.choices[0]?.message?.content;
        // Simulate 4-second delay before ending processing
        setTimeout(() => {
          setProcessing(false);
        }, 3000);

        setOutput(answer || "No response received.");
        // setOutput((answer || "").replace(/```[\s\S]*?```/g, "").replace(/`([^`]+)`/g, "$1").replace(/\*\*(.*?)\*\*/g, "$1").replace(/\*(.*?)\*/g, "$1").replace(/[_~>#+=-]/g, "").trim());
      };
    } catch (err) {
      // console.error("❌ Error in submitting form data: ", err);
      setOutput("Model failed: " + err.message);
      setProcessing(false); // End processing on error
    }
  };

return (
  <div className="min-h-screen flex flex-col items-center justify-start p-6 bg-gray-100">
    <Toaster />

    {/* Heading */}
    <h1 className="text-4xl sm:text-5xl font-bold text-center text-gray-900 mb-10">
      IntelliAid
    </h1>

    {/* Top Section */}
    <div className="flex flex-col md:flex-row w-full gap-6 mb-10 max-w-5xl">
      {/* Image Upload */}
      <div className="bg-white w-full md:w-1/2 p-6 rounded-2xl shadow-md flex flex-col items-center justify-center">
        {isShowing && (
          <img
            src={ImageURL}
            alt="Preview"
            className="rounded-xl max-h-64 mb-4"
          />
        )}

        <div className="flex justify-center items-center w-full mb-4">
          <label className="flex items-center gap-3 w-full">
            <input
              type="file"
              accept="image/*"
              onChange={setFile}
              className="hidden"
            />
            <span
              className={`${
                ImageURL ? "hidden" : "block"
              } w-full text-center py-2 px-4 rounded-lg text-sm font-medium bg-black text-white hover:bg-gray-800 cursor-pointer`}
            >
              Choose File
            </span>
            {ImageURL && (
              <span className="text-sm text-gray-700">{ImageURL.name}</span>
            )}
          </label>

          {!isShowing && ImageURL && (
            <button
              onClick={() => setIsShowing(true)}
              disabled={!ImageURL}
              className={`ml-3 px-6 py-2 rounded-lg text-white font-medium transition-all duration-300 ${
                ImageURL
                  ? "bg-green-600 hover:bg-green-700 cursor-pointer"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              Upload Image
            </button>
          )}
        </div>

        {isShowing && (
          <button
            onClick={closeDown}
            className="mt-2 px-6 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-medium"
          >
            Cancel Image
          </button>
        )}
      </div>

      {/* Query Input */}
      <div className="bg-white w-full md:w-1/2 p-6 rounded-2xl shadow-md flex flex-col justify-between">
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Type your health query here..."
          className="w-full h-56 p-4 rounded-lg border border-gray-300 resize-none focus:outline-none focus:ring-2 focus:ring-black"
        />
        <button
          onClick={handleSubmit}
          className="mt-4 px-6 py-3 rounded-lg bg-black text-white font-semibold hover:bg-gray-800 transition-all duration-300"
        >
          Submit
        </button>
      </div>
    </div>

    {/* Output Section */}
    <div className="w-full max-w-5xl bg-white rounded-2xl shadow-md p-6 md:p-10 min-h-[200px]">
      <h2 className="text-2xl font-semibold mb-4 text-gray-900">
        Remedial & Suggestions
      </h2>
      <p className="whitespace-pre-wrap text-gray-700">{output}</p>
    </div>
  </div>
);

};

export default AIHealthAssistant;
