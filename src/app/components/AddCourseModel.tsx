// AddCourseModel (app/components/AddCourseModel.tsx)
"use client";

import React, { useState } from "react";
import { CourseService } from "../services/CourseService";
import { Course } from "../model/Course";
import { CourseModel } from "../types/model";

interface AddCourseModelProps {
  closeModel: () => void;
  onCourseAdded: (course: CourseModel) => void;
}

export default function AddCourseModel({
  closeModel,
  onCourseAdded,
}: AddCourseModelProps) {
  const [courseName, setCourseName] = useState("");
  const [author, setAuthor] = useState("");
  const [level, setLevel] = useState("A1");
  const [language, setLanguage] = useState("Kurmanji");
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError("");
    try {
      const newCourse: CourseModel = {
        ...Course.empty(),
        title: courseName,
        author: author,
        level: level,
        language: { id: "", name: language, flagName: "" },
      };
      const cs = new CourseService();
      const createdCourse = await cs.createCourse(newCourse);
      onCourseAdded(createdCourse);
      closeModel();
    } catch (err: any) {
      setError(err.message || "Fehler beim Erstellen des Kurses");
    }
    setIsSaving(false);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className="absolute inset-0 bg-black opacity-50"
        onClick={closeModel}
      ></div>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-md shadow-md z-10 w-96">
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">
          Neuen Kurs hinzufügen
        </h2>
        {error && <div className="mb-4 text-red-500">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Kursname
            </label>
            <input
              type="text"
              className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 p-2"
              placeholder="Kursname"
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Autor
            </label>
            <input
              type="text"
              className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 p-2"
              placeholder="Name des Autors"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Level
            </label>
            <select
              className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 p-2"
              value={level}
              onChange={(e) => setLevel(e.target.value)}
            >
              <option value="A1">A1</option>
              <option value="A2">A2</option>
              <option value="B1">B1</option>
              <option value="B2">B2</option>
              <option value="C1">C1</option>
              <option value="C2">C2</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Sprache
            </label>
            <select
              className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 p-2"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              <option value="Kurmanji">Kurmanji</option>
              <option value="Sorani">Sorani</option>
              <option value="Zazakî">Zazakî</option>
              <option value="Behdini">Behdini</option>
              <option value="Kelhuri">Kelhuri</option>
              <option value="leki">leki</option>
              <option value="luri">luri</option>
              <option value="hewrami">hewrami</option>
            </select>
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={closeModel}
              className="mr-2 px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-100 rounded hover:bg-gray-400 dark:hover:bg-gray-500"
            >
              Abbrechen
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {isSaving ? "Speichern..." : "Speichern"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
