import { motion } from 'framer-motion';
import { Shield, UserCog, UserPlus, User } from 'lucide-react';

const roles = [
  {
    title: 'Super Admin',
    desc: 'Manage Family Admins, view payments and analytics, and configure the system.',
    icon: Shield,
    accent: 'from-fuchsia-500 to-pink-500',
  },
  {
    title: 'Family Admin',
    desc: 'Add/Edit members, define relationships, assign Sub Admins and manage tree.',
    icon: UserCog,
    accent: 'from-cyan-500 to-blue-600',
  },
  {
    title: 'Sub Admin',
    desc: 'Perform CRUD on members only. No access to system or payments.',
    icon: UserPlus,
    accent: 'from-emerald-500 to-teal-500',
  },
  {
    title: 'Member',
    desc: 'Sign in to view profile and explore the read-only family tree.',
    icon: User,
    accent: 'from-amber-500 to-orange-500',
  },
];

export default function RoleCards() {
  return (
    <section className="py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Role-based dashboards</h2>
            <p className="text-white/70 mt-2">Purpose-built experiences for each role keep your family organized and secure.</p>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {roles.map((role, i) => (
            <motion.div
              key={role.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="relative rounded-2xl border border-white/10 bg-white/5 p-5 hover:bg-white/10 transition-colors"
            >
              <div className={`mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${role.accent} text-white shadow-lg`}>
                <role.icon className="h-5 w-5" />
              </div>
              <h3 className="text-white font-semibold">{role.title}</h3>
              <p className="mt-2 text-sm text-white/70">{role.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
