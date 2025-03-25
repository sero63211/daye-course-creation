"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ChevronDown, ChevronRight, Plus, X, Edit, Save } from "lucide-react";
import { Chapter } from "@/app/types/model";
import { CourseModel } from "@/app/types/model";
import { CourseService } from "@/app/services/CourseService";
import { LessonModel } from "@/app/types/model";
import { LessonType } from "@/app/types/model";
import { FormInput } from "../../components/FormInput";

// Reusable ChapterItem Component mit klickbaren Lektionen
export const ChapterItem: React.FC<{
  chapter: {
    id: string;
    title: string;
    completedLessons: number;
    totalLessons: number;
    lessons: any[];
  };
  expanded: boolean;
  toggle: (id: string) => void;
  editing: boolean;
  newTitle: string;
  onEditStart: (id: string, title: string) => void;
  onTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSaveTitle: (id: string) => void;
  onDelete: (id: string) => void;
  lessons: any[];
  handleAddLesson: (chapterId: string) => void;
  onEditLesson: (lessonId: string) => void;
  onLessonClick: (lessonId: string) => void; // Für Klick auf die gesamte Lektion
}> = ({
  chapter,
  expanded,
  toggle,
  editing,
  newTitle,
  onEditStart,
  onTitleChange,
  onSaveTitle,
  onDelete,
  lessons,
  handleAddLesson,
  onEditLesson,
  onLessonClick,
}) => (
  <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
    <div
      className="flex justify-between items-center p-4 dark:bg-gray-750 cursor-pointer"
      onClick={() => toggle(chapter.id)}
    >
      <div className="flex items-center gap-2">
        {expanded ? (
          <ChevronDown size={18} className="text-gray-500" />
        ) : (
          <ChevronRight size={18} className="text-gray-500" />
        )}
        {editing ? (
          <div
            className="flex items-center gap-2"
            onClick={(e) => e.stopPropagation()}
          >
            <input
              type="text"
              value={newTitle}
              onChange={onTitleChange}
              className="border border-gray-300 dark:border-gray-600 rounded p-1"
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSaveTitle(chapter.id);
              }}
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 p-1"
            >
              <Save size={16} />
            </button>
          </div>
        ) : (
          <span className="font-medium">{chapter.title}</span>
        )}
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500">
          {chapter.completedLessons}/{chapter.totalLessons} Lektionen
        </span>
        {!editing && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEditStart(chapter.id, chapter.title);
              }}
              className="p-1 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400"
            >
              <Edit size={16} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(chapter.id);
              }}
              className="p-1 text-gray-500 hover:text-red-600 dark:hover:text-red-400"
            >
              <X size={16} />
            </button>
          </>
        )}
      </div>
    </div>
    {expanded && (
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        {lessons && lessons.length > 0 ? (
          <div className="space-y-2">
            {lessons.map((lesson) => (
              <div
                key={lesson.id}
                className="p-3 border border-gray-100 dark:border-gray-700 rounded bg-gray-50 dark:bg-gray-700 flex justify-between items-center cursor-pointer transition-colors hover:bg-gray-100 dark:hover:bg-gray-600"
                onClick={() => onLessonClick(lesson.id)}
              >
                <div>
                  <div className="font-medium">{lesson.title}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {lesson.duration} • {lesson.category}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Verhindert Bubble-Up des Klick-Events
                      onEditLesson(lesson.id);
                    }}
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 text-sm px-3 py-1 border border-blue-200 rounded hover:bg-blue-50 dark:hover:bg-blue-900"
                  >
                    Bearbeiten
                  </button>
                </div>
              </div>
            ))}

            {/* Button zum Hinzufügen weiterer Lektionen */}
            <button
              onClick={() => handleAddLesson(chapter.id)}
              className="w-full mt-3 p-2 border border-dashed border-blue-300 rounded-md flex items-center justify-center text-blue-600 hover:bg-blue-50 hover:text-blue-700 transition-colors dark:border-blue-700 dark:text-blue-400 dark:hover:bg-blue-900 dark:hover:text-blue-300"
            >
              <Plus size={16} className="mr-2" />
              Weitere Lektion hinzufügen
            </button>
          </div>
        ) : (
          <div className="text-center py-6 text-gray-500 dark:text-gray-400">
            <p>Keine Lektionen in diesem Kapitel</p>
            <button
              onClick={() => handleAddLesson(chapter.id)}
              className="mt-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 text-sm font-medium"
            >
              + Lektion hinzufügen
            </button>
          </div>
        )}
      </div>
    )}
  </div>
);

// Reusable CourseOverview Component (Right Sidebar)
export const CourseOverview: React.FC<{ formData: CourseModel }> = ({
  formData,
}) => (
  <div className="md:w-1/3">
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
      <div className="p-4 bg-blue-50 dark:bg-blue-900 border-b border-blue-100 dark:border-blue-800">
        <h3 className="font-semibold text-blue-700 dark:text-blue-300">
          Kursübersicht
        </h3>
      </div>
      <div className="p-4">
        {formData.image && (
          <div className="mb-4 rounded-lg overflow-hidden h-40 bg-gray-100 dark:bg-gray-700">
            <img
              src={formData.image}
              alt={formData.title || "Kursbild"}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "/api/placeholder/400/320";
              }}
            />
          </div>
        )}
        <div className="space-y-3">
          <div>
            <h2 className="text-xl font-bold">
              {formData.title || "Kein Titel"}
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              von {formData.author || "Unbekannt"}
            </p>
          </div>
          {formData.level && (
            <div className="inline-block px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-full">
              Level: {formData.level}
            </div>
          )}
          {formData.language?.name && (
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm">Sprache:</span>
              <span>{formData.language.name}</span>
            </div>
          )}
          {formData.chapters && (
            <div className="pt-2">
              <div className="font-medium mb-2">
                Kapitel ({formData.chapters.length})
              </div>
              <ul className="space-y-1">
                {formData.chapters.map((chapter) => (
                  <li key={chapter.id} className="flex justify-between text-sm">
                    <span>{chapter.title}</span>
                    <span className="text-gray-500 dark:text-gray-400">
                      {chapter.lessons?.length || 0} Lektionen
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
);

// Main CourseDetailPage Component
export default function CourseDetailPage() {
  const { courseId } = useParams();
  const router = useRouter();
  const [course, setCourse] = useState<CourseModel | null>(null);
  const [formData, setFormData] = useState<CourseModel | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanged, setHasChanged] = useState(false);
  const [expandedChapters, setExpandedChapters] = useState<
    Record<string, boolean>
  >({});
  const [activeTab, setActiveTab] = useState<"details" | "chapters">("details");
  const [editingChapter, setEditingChapter] = useState<string | null>(null);
  const [newChapterTitle, setNewChapterTitle] = useState("");
  const [isAddingChapter, setIsAddingChapter] = useState(false);

  useEffect(() => {
    if (courseId) {
      (async () => {
        const cs = new CourseService();
        const courseData = await cs.getCourseById(courseId);
        if (courseData) {
          setCourse(courseData);
          setFormData(courseData);
          if (courseData.chapters?.length) {
            const initialExpandState: Record<string, boolean> = {};
            courseData.chapters.forEach((chapter) => {
              initialExpandState[chapter.id] = false;
            });
            setExpandedChapters(initialExpandState);
          }
        }
      })();
    }
  }, [courseId]);

  const checkForChanges = (updatedData: CourseModel) => {
    setHasChanged(JSON.stringify(updatedData) !== JSON.stringify(course));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (!formData) return;
    const { name, value } = e.target;
    const updatedData = { ...formData, [name]: value };
    setFormData(updatedData);
    checkForChanges(updatedData);
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!formData) return;
    const updatedLanguage = { ...formData.language, name: e.target.value };
    const updatedData = { ...formData, language: updatedLanguage };
    setFormData(updatedData);
    checkForChanges(updatedData);
  };

  const toggleChapter = (chapterId: string) => {
    setExpandedChapters((prev) => ({
      ...prev,
      [chapterId]: !prev[chapterId],
    }));
  };

  const startEditingChapter = (chapterId: string, title: string) => {
    setEditingChapter(chapterId);
    setNewChapterTitle(title);
  };

  const saveChapterTitle = (chapterId: string) => {
    if (!formData || !formData.chapters) return;
    const updatedChapters = formData.chapters.map((chapter) =>
      chapter.id === chapterId
        ? { ...chapter, title: newChapterTitle }
        : chapter
    );
    const updatedData = { ...formData, chapters: updatedChapters };
    setFormData(updatedData);
    checkForChanges(updatedData);
    setEditingChapter(null);
  };

  const startAddingChapter = () => {
    setIsAddingChapter(true);
    setNewChapterTitle("");
  };

  const addNewChapter = () => {
    if (!formData || !newChapterTitle.trim()) return;
    const newChapter: Chapter = {
      id: `chapter_${Date.now()}`,
      title: newChapterTitle,
      completedLessons: 0,
      totalLessons: 0,
      lessons: [],
    };
    const updatedChapters = formData.chapters
      ? [...formData.chapters, newChapter]
      : [newChapter];
    const updatedData = { ...formData, chapters: updatedChapters };
    setFormData(updatedData);
    checkForChanges(updatedData);
    setIsAddingChapter(false);
    setExpandedChapters((prev) => ({ ...prev, [newChapter.id]: true }));
  };

  const deleteChapter = (chapterId: string) => {
    if (!formData || !formData.chapters) return;
    const updatedChapters = formData.chapters.filter(
      (chapter) => chapter.id !== chapterId
    );
    const updatedData = { ...formData, chapters: updatedChapters };
    setFormData(updatedData);
    checkForChanges(updatedData);
  };

  const handleSave = async () => {
    if (!formData || !hasChanged) return;
    setIsSaving(true);
    try {
      const cs = new CourseService();
      await cs.updateCourse(formData);
      setCourse(formData);
      setHasChanged(false);
    } catch (error) {
      console.error("Fehler beim Speichern:", error);
    }
    setIsSaving(false);
  };

  const handleAddLesson = (chapterId: string) => {
    if (!formData) return;
    const newLesson: LessonModel = {
      id: `lesson_${Date.now()}`,
      type: LessonType.Exercise, // Geändert von Interactive zu Exercise
      title: "Neue Lektion",
      description: "",
      isCompleted: false,
      imageName: "",
      duration: "0 min",
      category: "",
    };
    const updatedChapters = formData.chapters?.map((chapter) => {
      if (chapter.id === chapterId) {
        return {
          ...chapter,
          lessons: [...(chapter.lessons || []), newLesson],
          totalLessons: (chapter.totalLessons || 0) + 1,
        };
      }
      return chapter;
    });
    const updatedData = { ...formData, chapters: updatedChapters };
    setFormData(updatedData);
    checkForChanges(updatedData);

    // Optional: Nach dem Hinzufügen der Lektion direkt zur Bearbeitungsansicht navigieren
    // router.push(`/lessons/${newLesson.id}/edit`);
  };

  const handleEditLesson = (lessonId: string) => {
    if (!formData?.id) return;
    router.push(
      `/lessons/${lessonId}/edit?courseId=${encodeURIComponent(formData.id)}`
    );
  };

  // Funktion für Klick auf die gesamte Lektion - navigiert ebenfalls zur Bearbeitung
  const handleLessonClick = (lessonId: string) => {
    if (!formData?.id) return;
    router.push(
      `/lessons/${lessonId}/edit?courseId=${encodeURIComponent(formData.id)}`
    );
  };

  if (!formData) {
    return <div className="text-center py-10">Lade Kursdaten...</div>;
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            {courseId ? "Kurs bearbeiten" : "Neuen Kurs erstellen"}
          </h1>
          <button
            onClick={handleSave}
            disabled={!hasChanged || isSaving}
            className={`px-6 py-2 rounded-lg font-medium flex items-center gap-2 ${
              !hasChanged || isSaving
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            <Save size={18} />
            {isSaving ? "Speichern..." : "Speichern"}
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Main content area */}
          <div className="md:w-2/3">
            <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden mb-6">
              <div className="border-b border-gray-200 dark:border-gray-700">
                <div className="flex">
                  <button
                    className={`px-6 py-3 font-medium text-sm ${
                      activeTab === "details"
                        ? "border-b-2 border-blue-500 text-blue-600"
                        : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    }`}
                    onClick={() => setActiveTab("details")}
                  >
                    Kursdetails
                  </button>
                  <button
                    className={`px-6 py-3 font-medium text-sm ${
                      activeTab === "chapters"
                        ? "border-b-2 border-blue-500 text-blue-600"
                        : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    }`}
                    onClick={() => setActiveTab("chapters")}
                  >
                    Kapitel
                  </button>
                </div>
              </div>

              {activeTab === "details" && (
                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormInput
                      label="Titel"
                      name="title"
                      value={formData.title || ""}
                      onChange={handleChange}
                    />
                    <FormInput
                      label="Autor"
                      name="author"
                      value={formData.author || ""}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormInput
                      label="Level"
                      name="level"
                      value={formData.level || ""}
                      onChange={handleChange}
                    />
                    <FormInput
                      label="Sprache"
                      name="language"
                      value={formData.language?.name || ""}
                      onChange={handleLanguageChange}
                    />
                  </div>
                  <FormInput
                    label="Bild URL"
                    name="image"
                    value={formData.image || ""}
                    onChange={handleChange}
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Beschreibung
                    </label>
                    <textarea
                      name="description"
                      value={formData.description || ""}
                      onChange={handleChange}
                      rows={4}
                      className="block w-full border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm p-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
              )}

              {activeTab === "chapters" && (
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold">Kapitel verwalten</h2>
                    <button
                      onClick={startAddingChapter}
                      className="flex items-center gap-1 text-sm bg-blue-50 text-blue-600 dark:bg-blue-900 dark:text-blue-300 px-3 py-1 rounded-md hover:bg-blue-100 dark:hover:bg-blue-800"
                    >
                      <Plus size={16} />
                      Kapitel hinzufügen
                    </button>
                  </div>

                  {isAddingChapter && (
                    <div className="mb-4 p-4 border border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-gray-800 rounded-lg">
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={newChapterTitle}
                          onChange={(e) => setNewChapterTitle(e.target.value)}
                          placeholder="Kapiteltitel eingeben"
                          className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded"
                        />
                        <button
                          onClick={addNewChapter}
                          disabled={!newChapterTitle.trim()}
                          className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 disabled:bg-gray-300 disabled:text-gray-500"
                        >
                          Hinzufügen
                        </button>
                        <button
                          onClick={() => setIsAddingChapter(false)}
                          className="bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 px-3 py-2 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
                        >
                          Abbrechen
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="space-y-3">
                    {formData.chapters && formData.chapters.length > 0 ? (
                      formData.chapters.map((chapter) => (
                        <ChapterItem
                          key={chapter.id}
                          chapter={chapter}
                          expanded={!!expandedChapters[chapter.id]}
                          toggle={toggleChapter}
                          editing={editingChapter === chapter.id}
                          newTitle={newChapterTitle}
                          onEditStart={startEditingChapter}
                          onTitleChange={(e) =>
                            setNewChapterTitle(e.target.value)
                          }
                          onSaveTitle={saveChapterTitle}
                          onDelete={deleteChapter}
                          lessons={chapter.lessons || []}
                          handleAddLesson={handleAddLesson}
                          onEditLesson={handleEditLesson}
                          onLessonClick={handleLessonClick} // Jetzt auf die Edit-Seite
                        />
                      ))
                    ) : (
                      <div className="text-center py-8 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
                        <p className="text-gray-500 dark:text-gray-400 mb-3">
                          Noch keine Kapitel vorhanden
                        </p>
                        <button
                          onClick={startAddingChapter}
                          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                          Erstes Kapitel hinzufügen
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          <CourseOverview formData={formData} />
        </div>
      </div>
    </div>
  );
}
