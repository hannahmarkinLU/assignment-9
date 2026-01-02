import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

const ArticlesContext = createContext();

export function ArticlesProvider({ children }) {
  const { user } = useAuth();

  const [userSavedArticles, setUserSavedArticles] = useState([]);

  // load saved articles when user changes
  useEffect(() => {
    if (!user) {
      setUserSavedArticles([]);
      return;
    }

    // load all saved articles grouped by user
    const allSavedArticles =
      JSON.parse(localStorage.getItem("savedArticlesByUser")) || {};

    // get only the current user's articles
    const articlesForUser = allSavedArticles[user.username] || [];
    setUserSavedArticles(articlesForUser);
  }, [user]);

  const persistUserArticles = (updatedArticles) => {
    if (!user) return;

    const allSavedArticles =
      JSON.parse(localStorage.getItem("savedArticlesByUser")) || {};

    allSavedArticles[user.username] = updatedArticles;
    localStorage.setItem(
      "savedArticlesByUser",
      JSON.stringify(allSavedArticles)
    );
  };

  const saveArticle = (article) => {
    if (!user) return;

    setUserSavedArticles((prev) => {
      if (prev.some((a) => a.url === article.url)) {
        return prev;
      }

      const updated = [...prev, article];
      persistUserArticles(updated);
      return updated;
    });
  };

  const removeArticle = (url) => {
    if (!user) return;

    setUserSavedArticles((prev) => {
      const updated = prev.filter((a) => a.url !== url);
      persistUserArticles(updated);
      return updated;
    });
  };

  const isArticleSaved = (url) => {
    if (!user) return false;
    return userSavedArticles.some((a) => a.url === url);
  };

  const getUserSavedArticles = () => {
    return user ? userSavedArticles : [];
  };

  const getAllUserArticles = () => {
    return JSON.parse(localStorage.getItem("savedArticlesByUser")) || {};
  };

  return (
    <ArticlesContext.Provider
      value={{
        saveArticle,
        removeArticle,
        isArticleSaved,
        getUserSavedArticles,
        getAllUserArticles,
      }}
    >
      {children}
    </ArticlesContext.Provider>
  );
}

export const useArticles = () => {
  const context = useContext(ArticlesContext);
  if (!context) {
    throw new Error("useArticles must be used within ArticlesProvider");
  }
  return context;
};
