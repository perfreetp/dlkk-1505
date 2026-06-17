import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import HomePage from "@/pages/HomePage";
import AppDetailPage from "@/pages/AppDetailPage";
import CategoryPage from "@/pages/CategoryPage";
import ForumPage from "@/pages/ForumPage";
import ForumPostPage from "@/pages/ForumPostPage";
import UserProfilePage from "@/pages/UserProfilePage";
import ContributorDashboard from "@/pages/ContributorDashboard";
import AdminDashboard from "@/pages/AdminDashboard";
import LoginPage from "@/pages/LoginPage";

function LayoutWrapper() {
  const location = useLocation();
  const isAuthPage = location.pathname === "/login";

  if (isAuthPage) {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <Routes location={location}>
            <Route path="/login" element={<LoginPage />} />
          </Routes>
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-silver-50">
      <Header />
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <Routes location={location}>
              <Route path="/" element={<HomePage />} />
              <Route path="/app/:id" element={<AppDetailPage />} />
              <Route path="/category" element={<CategoryPage />} />
              <Route path="/category/:category" element={<CategoryPage />} />
              <Route path="/forum" element={<ForumPage />} />
              <Route path="/forum/:postId" element={<ForumPostPage />} />
              <Route path="/user/profile" element={<UserProfilePage />} />
              <Route path="/contributor" element={<ContributorDashboard />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="*" element={
                <div className="container py-20 text-center">
                  <h1 className="text-4xl font-display font-bold text-brand-800 mb-4">404</h1>
                  <p className="text-silver-500 mb-6">页面不存在</p>
                </div>
              } />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <LayoutWrapper />
    </Router>
  );
}
