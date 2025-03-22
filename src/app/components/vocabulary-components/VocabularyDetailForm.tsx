// vocabulary-components/VocabularyDetailForm.tsx
import React, { useRef } from "react";
import { Upload, Trash2, Volume2 } from "lucide-react";
import { ListenVocabularyModel } from "../../types/model";

interface VocabularyDetailFormProps {
  formData: Partial<ListenVocabularyModel>;
  setFormData: (data: Partial<ListenVocabularyModel>) => void;
}

const VocabularyDetailForm: React.FC<VocabularyDetailFormProps> = ({
  formData,
  setFormData,
}) => {
  // Refs for file inputs
  const imageInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);

  // Form change handler
  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Image upload handlers
  const handleImageUpload = () => {
    imageInputRef.current?.click();
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // In a real project, we would upload to a server
    // For this example, we create a local URL
    const imageUrl = URL.createObjectURL(file);
    setFormData({
      ...formData,
      imageUrl,
    });
  };

  // Audio upload handlers
  const handleAudioUpload = () => {
    audioInputRef.current?.click();
  };

  const handleAudioFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // In a real project, we would upload to a server
    // For this example, we store the filename and create a local URL
    setFormData({
      ...formData,
      soundFileName: file.name,
    });
  };

  return (
    <div className="p-6 bg-white rounded-lg">
      <h2 className="text-xl font-bold mb-4 text-black">
        Vokabeldetails bearbeiten
      </h2>

      {/* Main form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="form-group">
          <label className="block text-black mb-2" htmlFor="mainText">
            Vokabel
          </label>
          <input
            type="text"
            id="mainText"
            name="mainText"
            value={formData.mainText || ""}
            onChange={handleFormChange}
            className="w-full border border-gray-300 rounded px-3 py-2 text-black placeholder-gray-500"
            placeholder="z.B. der Baum"
          />
        </div>

        <div className="form-group">
          <label className="block text-black mb-2" htmlFor="secondaryText">
            Übersetzung
          </label>
          <input
            type="text"
            id="secondaryText"
            name="secondaryText"
            value={formData.secondaryText || ""}
            onChange={handleFormChange}
            className="w-full border border-gray-300 rounded px-3 py-2 text-black placeholder-gray-500"
            placeholder="z.B. the tree"
          />
        </div>

        <div className="form-group md:col-span-2">
          <label className="block text-black mb-2" htmlFor="descriptionText">
            Beschreibungstext
          </label>
          <input
            type="text"
            id="descriptionText"
            name="descriptionText"
            value={formData.descriptionText || ""}
            onChange={handleFormChange}
            className="w-full border border-gray-300 rounded px-3 py-2 text-black placeholder-gray-500"
            placeholder="z.B. ist eine gängige Bezeichnung für..."
          />
          <p className="text-xs text-gray-500 mt-1">
            Dieser Text wird in der Vokabelansicht unter der Übersetzung
            angezeigt.
          </p>
        </div>

        {/* Image upload */}
        <div className="form-group">
          <label className="block text-black mb-2" htmlFor="imageUrl">
            Bild
          </label>
          <div className="flex items-center">
            <div className="flex-grow">
              <input
                type="text"
                id="imageUrl"
                name="imageUrl"
                value={formData.imageUrl || ""}
                onChange={handleFormChange}
                className="w-full border border-gray-300 rounded-l px-3 py-2 text-black placeholder-gray-500"
                placeholder="URL oder Datei hochladen"
                readOnly={false}
              />
              <input
                type="file"
                ref={imageInputRef}
                onChange={handleImageFileChange}
                accept="image/*"
                className="hidden"
              />
            </div>
            <button
              type="button"
              onClick={handleImageUpload}
              className="bg-blue-500 text-white px-3 py-2 rounded-r flex items-center"
            >
              <Upload size={20} />
            </button>
          </div>
          {formData.imageUrl && (
            <div className="mt-2 relative">
              <img
                src={formData.imageUrl}
                alt="Vorschau"
                className="w-full max-h-40 object-contain rounded"
              />
              <button
                type="button"
                onClick={() => setFormData({ ...formData, imageUrl: "" })}
                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
              >
                <Trash2 size={16} />
              </button>
            </div>
          )}
        </div>

        {/* Audio upload */}
        <div className="form-group">
          <label className="block text-black mb-2" htmlFor="soundFileName">
            Audio
          </label>
          <div className="flex items-center">
            <div className="flex-grow">
              <input
                type="text"
                id="soundFileName"
                name="soundFileName"
                value={formData.soundFileName || ""}
                onChange={handleFormChange}
                className="w-full border border-gray-300 rounded-l px-3 py-2 text-black placeholder-gray-500"
                placeholder="Datei hochladen"
                readOnly={false}
              />
              <input
                type="file"
                ref={audioInputRef}
                onChange={handleAudioFileChange}
                accept="audio/*"
                className="hidden"
              />
            </div>
            <button
              type="button"
              onClick={handleAudioUpload}
              className="bg-blue-500 text-white px-3 py-2 rounded-r flex items-center"
            >
              <Upload size={20} />
            </button>
          </div>
          {formData.soundFileName && (
            <div className="mt-2 flex items-center justify-between">
              <div className="flex items-center">
                <Volume2 size={20} className="text-blue-500 mr-2" />
                <span className="text-black">{formData.soundFileName}</span>
              </div>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, soundFileName: "" })}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VocabularyDetailForm;
