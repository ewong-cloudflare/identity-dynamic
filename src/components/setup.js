import React, { useState, useEffect } from "react";

const Setup = () => {
  const [primaryColor, setPrimaryColor] = useState("#ffadfc");
  const [secondaryColor, setSecondaryColor] = useState("#a30adb");
  const [tertiaryColor, setTertiaryColor] = useState("#ffffff");
  const [statusMessage, setStatusMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [tooltip, setTooltip] = useState({});
  const [logo, setLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);

  useEffect(() => {
    const fetchTheme = async () => {
      try {
        const response = await fetch("/api/env");
        if (!response.ok) {
          throw new Error("Failed to fetch theme configuration");
        }
        const data = await response.json();
        const theme = data.theme || {};

        setPrimaryColor(theme.primaryColor || "#ffadfc");
        setSecondaryColor(theme.secondaryColor || "#a30adb");
        setTertiaryColor(theme.tertiaryColor || "#ffffff");
        setLogo(theme.logoUrl || null);

        if (theme.logoUrl) setLogoPreview(`/assets/logo`);

        applyTheme(theme.primaryColor, theme.secondaryColor, theme.tertiaryColor);
      } catch (error) {
        console.error("Error fetching theme:", error);
      }
    };

    fetchTheme();
    // eslint-disable-next-line
  }, []);

  const applyTheme = (primary, secondary, tertiary) => {
    document.documentElement.style.setProperty(
      "--primary-color",
      primary || primaryColor
    );
    document.documentElement.style.setProperty(
      "--secondary-color",
      secondary || secondaryColor
    );
    document.documentElement.style.setProperty(
      "--tertiary-color",
      tertiary || tertiaryColor
    );
  };

  const handleSaveTheme = async () => {
    const theme = { primaryColor, secondaryColor, tertiaryColor };
    setIsSaving(true);
    setStatusMessage("");

    try {
      // Save theme colors
      const response = await fetch("/api/env", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(theme),
      });

      if (!response.ok) {
        throw new Error("Failed to save theme configuration");
      }

      // Upload logo
      if (logo) await uploadImage(logo, "logo");

      setStatusMessage("Saved successfully!");
    } catch (error) {
      console.error("Error saving theme:", error);
      setStatusMessage("Error saving changes. Please refresh and try again.");
    } finally {
      setIsSaving(false);
      setTimeout(() => setStatusMessage(""), 5000); // Clear message after 5 seconds
    }
  };

  const uploadImage = async (file, type) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", type);

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Failed to upload ${type}`);
    }
  };

  const handleImageUpload = (event, setImage, setPreview) => {
    const file = event.target.files[0];
    if (
      file &&
      ["image/png", "image/jpeg", "image/svg+xml"].includes(file.type)
    ) {
      setImage(file); // Store the file
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result); // show preview of the file
      reader.readAsDataURL(file);
    } else {
      alert("Only PNG, JPG, and SVG files are allowed.");
    }
  };

  const renderColorPicker = (
    label,
    color,
    setColor,
    description,
    tooltipKey
  ) => (
    <div className="flex flex-col items-center space-x-2">
      <div className="flex items-center space-x-2">
        <label className="font-semibold text-gray-dark">{label}</label>
        <div
          className="relative cursor-pointer"
          onMouseEnter={() => setTooltip({ [tooltipKey]: description })}
          onMouseLeave={() => setTooltip({})}
        >
          {/* This is just to show one icon lol */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-info-circle-fill text-gray-500 hover:text-gray-700"
            viewBox="0 0 16 16"
          >
            <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2" />
          </svg>
          {tooltip[tooltipKey] && (
            <div className="tooltip" style={{ width: "300px" }}>
              {tooltip[tooltipKey]}
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-col items-center">
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="w-12 h-12 rounded"
          style={{ border: "none" }}
        />
        <input
          type="text"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="w-24 border rounded mt-2 text-center"
          placeholder="#HEX"
        />
      </div>
    </div>
  );

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Customize Theme</h2>

      {/* Image Upload Section */}
      <div className="flex justify-center space-x-6 mb-6">
        <div className="flex flex-col items-center">
          <h3 className="text-lg font-semibold mb-2">Upload Logo</h3>
          <div
            className="w-40 h-40 border border-gray-300 rounded flex items-center justify-center"
            style={{ overflow: "hidden", position: "relative" }}
          >
            {logoPreview ? (
              <img
                src={logoPreview}
                alt="Uploaded Logo"
                className="w-full h-full object-contain"
              />
            ) : (
              <p className="text-gray-400 text-center">
                Drag & Drop or Click to Upload
              </p>
            )}
            <input
              type="file"
              accept=".png,.jpg,.jpeg,.svg"
              className="absolute w-full h-full opacity-0 top-0 left-0 cursor-pointer"
              onChange={(e) => handleImageUpload(e, setLogo, setLogoPreview)}
            />
          </div>
        </div>
      </div>

      {/* Color Pickers */}
      <div className="flex justify-center space-x-4">
        {renderColorPicker(
          "Primary",
          primaryColor,
          setPrimaryColor,
          "This is the color used by loading elements as well as the navigation bar.",
          "primaryColorTooltip"
        )}
        {renderColorPicker(
          "Secondary",
          secondaryColor,
          setSecondaryColor,
          "Used for link highlighting as well as buttons.",
          "secondaryColorTooltip"
        )}
        {renderColorPicker(
          "Tertiary",
          tertiaryColor,
          setTertiaryColor,
          "Used for the page title and navigation tab text.",
          "tertiaryColorTooltip"
        )}
      </div>

      {/* Save Button */}
      <div className="mt-6 text-center">
        <button
          onClick={handleSaveTheme}
          disabled={isSaving}
          className={`mt-4 text-white font-bold py-2 px-4 rounded transition-all duration-300 ${
            isSaving ? "opacity-50 cursor-not-allowed" : ""
          } bg-gunmetal hover:bg-opacity-80`}
        >
          {isSaving ? "Saving..." : "Save Theme"}
        </button>
      </div>

      {/* Status Message */}
      {statusMessage && (
        <p className="mt-4 text-gray-dark text-center">{statusMessage}</p>
      )}
    </div>
  );
};

export default Setup;
