import { Link } from 'react-router-dom';
import { Github, Twitter, Mail, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-brand-800 text-silver-200 mt-16">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">M</span>
              </div>
              <span className="text-xl font-display font-bold text-white">MacHub</span>
            </div>
            <p className="text-sm text-silver-400 max-w-md mb-4">
              MacHub 是 Mac 用户的软件社区，发现最好的 macOS 应用，分享使用心得，与志同道合的用户交流。
            </p>
            <div className="flex items-center gap-3">
              <a href="#" className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
                <Github className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">探索</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-white transition-colors">首页</Link></li>
              <li><Link to="/category" className="hover:text-white transition-colors">软件分类</Link></li>
              <li><Link to="/forum" className="hover:text-white transition-colors">讨论区</Link></li>
              <li><Link to="/category" className="hover:text-white transition-colors">限免专区</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">关于</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">关于我们</a></li>
              <li><a href="#" className="hover:text-white transition-colors">投稿指南</a></li>
              <li><a href="#" className="hover:text-white transition-colors">隐私政策</a></li>
              <li><a href="#" className="hover:text-white transition-colors">服务条款</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-silver-400">
            © 2024 MacHub. 保留所有权利。
          </p>
          <p className="text-sm text-silver-400 flex items-center gap-1">
            用 <Heart className="w-3.5 h-3.5 text-apple-red fill-apple-red" /> 为 Mac 用户打造
          </p>
        </div>
      </div>
    </footer>
  );
}
