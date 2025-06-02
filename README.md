# 📌 Project Enhancements & Design Notes

## ✅ Google API Integration

- Integrated **Google OAuth 2.0** to authenticate users and retrieve the `accessToken` and user info.
- Implemented **full CRUD operations** on Google Tasks using the authenticated session.
- Since **Google access tokens expire after 1 hour**, users are **automatically redirected to the login route** to re-authenticate once the token becomes invalid, ensuring continued secure access to Google APIs.

## 🗂️ Task & Task List Management

- The provided Figma design only covered **task CRUD**, but for greater flexibility and completeness, I implemented **task list CRUD** alongside task CRUD functionality.
- This allows users to manage multiple task lists efficiently.

## 🔍 Feature Additions

- **Status filter** implemented to toggle between `Completed` and `Pending` tasks.
- **Task click behavior**:
  - On **mobile**, clicking a task navigates to a detailed task page.
  - On **desktop/laptop**, clicking a task opens a **dialog** for inline editing.
- **Infinite scrolling** with **TanStack's `useInfiniteQuery`** for optimized performance with large task lists.
- **Loading states** and **empty states** added for a smoother and more user-friendly experience.
- **Dark mode toggle** for accessibility and modern design preferences.
- **Push notifications** using the **Web Notification API** + **IndexedDB** for local notification history.
- **Multi-language support** with `react-i18next`.

## 💡 UI/UX & Responsiveness

- Fully **responsive layout** across all devices.
- Followed and referenced **Figma layout and button styles** closely as per the original design.

## 🧩 Code Architecture

- Clean and maintainable folder structure.
- Reusable **components**, **custom hooks**, and **utility functions** for better scalability and separation of concerns.
