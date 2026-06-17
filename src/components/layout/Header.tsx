import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import {
  Search,
  LayoutGrid,
  MessageSquare,
  User,
  Menu,
  X,
  LogOut,
  Settings,
  Shield,
  UploadCloud,
} from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { useAuthStore } from '@/store/useAuthStore';
import { cn } from '@/lib/utils';

export function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isLoggedIn, logout } = useAuthStore();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const navItems = [
    { label: '首页', path: '/' },
    { label: '分类', path: '/category' },
    { label: '讨论区', path: '/forum' },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/category?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  return (
    <header className="sticky top-0 z-40 glass border-b border-silver-100">
      <div className="container">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
                <span className="text-white font-bold text-sm">M</span>
              </div>
              <span className="text-xl font-display font-bold text-gradient">MacHub</span>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    'px-4 py-2 rounded-xl font-medium transition-all',
                    location.pathname === item.path ||
                    (item.path !== '/' && location.pathname.startsWith(item.path))
                      ? 'bg-brand-50 text-brand-600'
                      : 'text-silver-600 hover:text-brand-600 hover:bg-silver-50'
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex-1 max-w-md mx-8 hidden lg:block">
            <form onSubmit={handleSearch}>
              <Input
                searchMode
                placeholder="搜索软件、讨论..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
          </div>

          <div className="flex items-center gap-2">
            <button
              className="md:hidden p-2 rounded-xl hover:bg-silver-100 text-silver-600"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {isLoggedIn && user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 p-1.5 pr-3 rounded-xl hover:bg-silver-100 transition-colors"
                >
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-8 h-8 rounded-lg bg-silver-200"
                  />
                  <span className="hidden sm:block text-sm font-medium text-brand-700">
                    {user.name}
                  </span>
                </button>

                {showUserMenu && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowUserMenu(false)} />
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-heavy border border-silver-100 py-2 z-20">
                      <Link
                        to="/user/profile"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-brand-700 hover:bg-silver-50"
                      >
                        <User className="w-4 h-4" />
                        个人中心
                      </Link>
                      <Link
                        to="/contributor"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-brand-700 hover:bg-silver-50"
                      >
                        <UploadCloud className="w-4 h-4" />
                        贡献者后台
                      </Link>
                      {user.role === 'admin' && (
                        <Link
                          to="/admin"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-brand-700 hover:bg-silver-50"
                        >
                          <Shield className="w-4 h-4" />
                          审核管理
                        </Link>
                      )}
                      <div className="h-px bg-silver-100 my-1" />
                      <button
                        onClick={() => {
                          logout();
                          setShowUserMenu(false);
                        }}
                        className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-apple-red hover:bg-red-50"
                      >
                        <LogOut className="w-4 h-4" />
                        退出登录
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link to="/login" className="btn-primary text-sm">
                登录
              </Link>
            )}
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-silver-100">
            <form onSubmit={handleSearch} className="mb-4">
              <Input
                searchMode
                placeholder="搜索软件、讨论..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
            <nav className="flex flex-col gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    'px-4 py-3 rounded-xl font-medium flex items-center gap-3',
                    location.pathname === item.path
                      ? 'bg-brand-50 text-brand-600'
                      : 'text-silver-600 hover:bg-silver-50'
                  )}
                >
                  {item.label === '首页' && <LayoutGrid className="w-5 h-5" />}
                  {item.label === '分类' && <Settings className="w-5 h-5" />}
                  {item.label === '讨论区' && <MessageSquare className="w-5 h-5" />}
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
