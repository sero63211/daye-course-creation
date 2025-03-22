// src/data/mockData.ts
import { CourseModel, LessonType } from "../types/model";

export const mockCourses: CourseModel[] = [
  {
    id: "1",
    image: "/assets/images/courses/kurdish.jpg",
    level: "Beginner",
    title: "Kurdish for Beginners",
    language: {
      id: "ku",
      name: "Kurdish",
      flagName: "kurdistan",
    },
    chapters: [
      {
        id: "ch1",
        title: "Introduction to Kurdish",
        completedLessons: 2,
        totalLessons: 5,
        lessons: [
          {
            id: "l1",
            type: LessonType.Exercise,
            title: "Basic Greetings",
            description: "Learn basic Kurdish greetings",
            isCompleted: true,
            imageName: "greeting",
            duration: "10 min",
            category: "Basics",
          },
          {
            id: "l2",
            type: LessonType.Exercise,
            title: "Introduce Yourself",
            description: "Learn to introduce yourself in Kurdish",
            isCompleted: true,
            imageName: "introduction",
            duration: "15 min",
            category: "Conversation",
          },
          {
            id: "l3",
            type: LessonType.Quiz,
            title: "Greetings Quiz",
            description: "Test your knowledge of Kurdish greetings",
            isCompleted: false,
            imageName: "quiz",
            duration: "5 min",
            category: "Test",
          },
        ],
      },
    ],
    description:
      "Start your Kurdish language journey with this beginner-friendly course.",
  },
  {
    id: "2",
    image: "/assets/images/courses/korean.jpg",
    level: "Intermediate",
    title: "Korean Conversations",
    language: {
      id: "ko",
      name: "Korean",
      flagName: "korea",
    },
    chapters: [
      {
        id: "ch1",
        title: "Everyday Conversations",
        completedLessons: 1,
        totalLessons: 3,
        lessons: [
          {
            id: "l1",
            type: LessonType.Exercise,
            title: "At the Cafe",
            isCompleted: true,
            imageName: "cafe",
            duration: "20 min",
            category: "Conversation",
          },
          {
            id: "l2",
            type: LessonType.Exercise,
            title: "Shopping Dialogue",
            isCompleted: false,
            imageName: "shopping",
            duration: "15 min",
            category: "Dialogue",
          },
        ],
      },
    ],
    description:
      "Improve your Korean conversation skills with practical dialogues.",
    lastCompletedDate: new Date(2025, 2, 1),
  },
];
