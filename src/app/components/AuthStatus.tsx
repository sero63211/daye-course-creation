// src/app/components/AuthStatus.tsx
"use client";

import React, { useState, useEffect } from "react";
import { auth } from "../../firebase/firebaseClient";
import { onAuthStateChanged, signOut } from "firebase/auth";
import Link from "next/link";

export const AuthStatus = () => {
  const [user, setUser] = useState(auth.currentUser);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Logout-Fehler:", err);
    }
  };

  if (!user) {
    return (
      <Link href="/login">
        <button className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100">
          Login
        </button>
      </Link>
    );
  }

  return (
    <div className="flex items-center space-x-4">
      <span className="text-gray-700 dark:text-gray-300">
        angemeldet als: {user.email}
      </span>
      <button
        onClick={handleLogout}
        className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
      >
        Logout
      </button>
    </div>
  );
};

export default AuthStatus;
