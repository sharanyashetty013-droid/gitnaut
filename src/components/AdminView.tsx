import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Search, 
  Download, 
  CheckCircle2, 
  ArrowLeft,
  User
} from 'lucide-react';
import { UserProfile, getAllUsers } from '../utils/auth';
import { playSound } from '../utils/sound';

interface AdminViewProps {
  currentUser: UserProfile | null;
  onBackToLearn: () => void;
}

export const AdminView: React.FC<AdminViewProps> = ({ onBackToLearn }) => {
  const [users] = useState<UserProfile[]>(() => getAllUsers());
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [exportNotice, setExportNotice] = useState(false);

  const filteredUsers = users.filter((u) => {
    const matchesSearch = 
      u.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.username.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleExportRoster = () => {
    playSound('click');
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(users, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `gitnaut_users_telemetry_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    setExportNotice(true);
    setTimeout(() => setExportNotice(false), 3000);
  };

  return (
    <div className="w-full space-y-6 sm:space-y-8 min-w-0 font-sans">
      {/* Top Header Card: 16px mobile, 24px desktop, 12px radius */}
      <div className="card-base p-4 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 min-w-0">
        <div className="space-y-1.5 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[8px] bg-surface-2 border border-border text-cyan text-xs font-semibold">
            <ShieldAlert className="w-4 h-4 text-cyan" strokeWidth={1.75} />
            <span>Flight Command Database</span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-text tracking-normal leading-tight">
            User Progress & Admin Console
          </h1>
          <p className="text-sm text-text-muted leading-relaxed">
            Private management console listing all registered Gitnaut operatives and their mission mastery.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportRoster}
            className="btn-secondary text-sm"
          >
            <Download className="w-4 h-4 text-cyan" strokeWidth={1.75} />
            <span>Export JSON</span>
          </button>
          <button
            onClick={onBackToLearn}
            className="btn-primary text-sm"
          >
            <ArrowLeft className="w-4 h-4" strokeWidth={1.75} />
            <span>Back to Learn</span>
          </button>
        </div>
      </div>

      {exportNotice && (
        <div className="p-3.5 rounded-[10px] bg-success/15 border border-success text-success text-sm flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-success shrink-0" strokeWidth={1.75} />
          <span>User telemetry JSON exported successfully.</span>
        </div>
      )}

      {/* Aggregate Metric Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="card-base p-5">
          <span className="text-xs text-text-muted block font-semibold uppercase tracking-wider">Total Operatives</span>
          <span className="font-heading text-2xl font-bold text-text mt-1.5 block">{users.length}</span>
        </div>
        <div className="card-base p-5">
          <span className="text-xs text-text-muted block font-semibold uppercase tracking-wider">Curriculum Commands</span>
          <span className="font-heading text-2xl font-bold text-accent mt-1.5 block">37 Total</span>
        </div>
        <div className="card-base p-5">
          <span className="text-xs text-text-muted block font-semibold uppercase tracking-wider">Security Mode</span>
          <span className="font-heading text-sm font-bold text-success block mt-2">Encrypted Client DB</span>
        </div>
        <div className="card-base p-5">
          <span className="text-xs text-text-muted block font-semibold uppercase tracking-wider">Event Logging</span>
          <span className="font-heading text-sm font-bold text-cyan block mt-2">Real-Time Reactive</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 rounded-[12px] bg-surface border border-border">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-text-muted" strokeWidth={1.75} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, email, or callsign..."
            style={{ fontSize: '16px' }}
            className="w-full pl-10 pr-3 py-2 text-sm rounded-[10px] border border-border bg-surface-2 text-text placeholder-text-muted focus:outline-none focus:border-accent min-h-[44px]"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-text-muted font-medium">Role:</span>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3.5 py-2 rounded-[10px] border border-border bg-surface-2 text-sm font-semibold text-text focus:outline-none focus:border-accent min-h-[44px]"
          >
            <option value="all">All Roles</option>
            <option value="Junior Dev">Junior Dev</option>
            <option value="Full-Stack Dev">Full-Stack Dev</option>
            <option value="DevOps Lead">DevOps Lead</option>
            <option value="Admin Operative">Admin Operative</option>
          </select>
        </div>
      </div>

      {/* Users Data Table */}
      <div className="card-base overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface-2 border-b border-border text-text font-semibold">
              <tr>
                <th className="py-3.5 px-4">Operative</th>
                <th className="py-3.5 px-4">Role</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Last Active</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-text-muted">
                    No operatives found matching the query.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-surface-2/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-[8px] bg-surface-2 border border-border flex items-center justify-center text-text shrink-0">
                          <User className="w-4 h-4 text-accent" strokeWidth={1.75} />
                        </div>
                        <div>
                          <div className="font-bold text-text flex items-center gap-1.5">
                            <span>{u.displayName}</span>
                            {u.isAdmin && (
                              <span className="text-xs bg-surface-2 text-accent border border-border px-2 py-0.5 rounded-[6px] font-bold">
                                Admin
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-text-muted">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-block px-2.5 py-0.5 rounded-[6px] border border-border bg-surface-2 text-xs text-text-muted font-medium">
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div>
                        <span className="font-bold text-text">Active Learner</span>
                        <span className="text-text-muted text-xs block">Enrolled</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-text-muted text-xs whitespace-nowrap">
                      {u.lastLogin || u.joinedAt || 'Recently'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
