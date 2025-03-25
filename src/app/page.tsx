// HomePage (app/page.tsx or similar)
"use client";

import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import LoginScreen from "../app/components/LoginScreen";
import CourseList from "../app/components/CourseList";
import AddCourseCard from "../app/components/AddCourseCard";
import AddCourseModel from "../app/components/AddCourseModel";
import { CourseService } from "../app/services/CourseService";
import { CourseModel } from "../app/types/model";

export default function HomePage() {
  const [courses, setCourses] = useState<CourseModel[]>([]);
  const [isModelOpen, setIsModelOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const auth = getAuth();

  // Auth-Status überwachen
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [auth]);

  // Kurse laden, sobald der Nutzer eingeloggt ist
  useEffect(() => {
    if (user) {
      async function fetchCourses() {
        try {
          const coursesData = await new CourseService().getAllCourses();
          setCourses(coursesData);
        } catch (error) {
          console.error("Fehler beim Laden der Kurse:", error);
        }
      }
      fetchCourses();
    }
  }, [user]);

  const openModel = () => setIsModelOpen(true);
  const closeModel = () => setIsModelOpen(false);

  // Callback, um einen neu erstellten Kurs direkt zur Liste hinzuzufügen
  const addCourseToList = async (course: CourseModel) => {
    try {
      // Create the course in Firestore using CourseService
      const createdCourse = await new CourseService().createCourse(course);

      // Update the local state with the created course (which now has an ID)
      setCourses((prevCourses) => [createdCourse, ...prevCourses]);
    } catch (error) {
      console.error("Fehler beim Erstellen des Kurses:", error);
      // You might want to add user feedback for errors here
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-900 dark:text-gray-100">
        Lade...
      </div>
    );
  }

  if (!user) {
    return <LoginScreen />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">
          Meine Sprachkurse
        </h1>

        <AddCourseCard openModel={openModel} />

        <CourseList courses={courses} />

        {isModelOpen && (
          <AddCourseModel
            closeModel={closeModel}
            onCourseAdded={addCourseToList}
          />
        )}
      </div>
    </div>
  );
}
