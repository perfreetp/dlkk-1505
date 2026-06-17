import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { useAuthStore } from '@/store/useAuthStore';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-brand-500 via-brand-600 to-brand-800 items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, rgba(77, 132, 186, 0.4) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(175, 82, 222, 0.3) 0%, transparent 50%)`,
        }} />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 max-w-md"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur flex items-center justify-center">
              <span className="text-white font-bold text-xl">M</span>
            </div>
            <span className="text-2xl font-display font-bold text-white">MacHub</span>
          </div>
          <h1 className="text-4xl font-display font-bold text-white mb-6 leading-tight">
            发现最好的
            <br />
            Mac 软件
          </h1>
          <p className="text-silver-200 text-lg mb-10">
            加入社区，与百万 Mac 用户一起发现、评价和交流常用软件。
          </p>
          <div className="space-y-4">
            {[
              '精选优质软件推荐',
              '真实用户评价与评分',
              '活跃的讨论交流社区',
              '限时免费提醒推送',
            ].map((feature, i) => (
              <motion.div
                key={feature}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-3"
              >
                <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center">
                  <Sparkles className="w-3.5 h-3.5 text-apple-orange" />
                </div>
                <span className="text-white">{feature}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-silver-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="w-full max-w-md"
        >
          <div className="lg:hidden flex items-center gap-3 mb-10 justify-center">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
              <span className="text-white font-bold">M</span>
            </div>
            <span className="text-2xl font-display font-bold text-gradient">MacHub</span>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-display font-bold text-brand-800 mb-2">
              {isRegister ? '创建账号' : '欢迎回来'}
            </h2>
            <p className="text-silver-500">
              {isRegister ? '加入 MacHub 社区' : '登录你的 MacHub 账号'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {isRegister && (
              <div>
                <label className="block text-sm font-medium text-brand-700 mb-2">昵称</label>
                <Input
                  placeholder="输入你的昵称"
                  leftIcon={<User className="w-4 h-4" />}
                  value="Mac用户"
                  onChange={(e) => {}}
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-brand-700 mb-2">邮箱</label>
              <Input
                type="email"
                placeholder="输入你的邮箱"
                leftIcon={<Mail className="w-4 h-4" />}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-700 mb-2">密码</label>
              <Input
                type="password"
                placeholder="输入你的密码"
                leftIcon={<Lock className="w-4 h-4" />}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {!isRegister && (
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-silver-600">
                  <input type="checkbox" className="w-4 h-4 rounded text-brand-500" />
                  记住我
                </label>
                <a href="#" className="text-brand-600 hover:text-brand-700 font-medium">
                  忘记密码？
                </a>
              </div>
            )}

            <Button fullWidth size="lg" type="submit">
              {isRegister ? '注册' : '登录'}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-silver-500">
              {isRegister ? '已有账号？' : '还没有账号？'}
              <button
                onClick={() => setIsRegister(!isRegister)}
                className="text-brand-600 hover:text-brand-700 font-medium ml-1"
              >
                {isRegister ? '立即登录' : '立即注册'}
              </button>
            </p>
          </div>

          <div className="mt-8 p-4 rounded-xl bg-brand-50 border border-brand-100">
            <p className="text-sm text-brand-700 text-center">
              💡 <strong>演示模式</strong>：点击按钮即可体验登录
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
