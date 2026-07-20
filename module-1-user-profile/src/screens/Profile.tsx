import { useState } from 'react';
import {
  Activity,
  LogOut,
  QrCode,
  Droplet,
  AlertTriangle,
  HeartPulse,
  Pill,
  Pencil,
  Plus,
  Phone,
  X,
  Check,
  User as UserIcon,
} from 'lucide-react';
import { BLOOD_GROUPS, type BloodGroup, type EmergencyContact, type User } from '../types';

interface Props {
  user: User;
  onUpdate: (u: User) => void;
  onLogout: () => void;
  onOpenQR: () => void;
}

export default function Profile({ user, onUpdate, onLogout, onOpenQR }: Props) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<User>(user);

  const save = () => {
    onUpdate(draft);
    setEditing(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <header className="sticky top-0 z-10 bg-white/90 backdrop-blur border-b border-gray-100">
        <div className="max-w-md mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center">
              <Activity className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
            <span className="font-bold text-gray-900">LifeLink AI</span>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-red-600 transition"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Profile header */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center gap-4">
            {user.photoUrl ? (
              <img
                src={user.photoUrl}
                alt={user.fullName}
                className="w-16 h-16 rounded-2xl object-cover ring-2 ring-red-100"
              />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center">
                <UserIcon className="w-8 h-8 text-red-400" />
              </div>
            )}
            <div className="min-w-0">
              <h1 className="text-lg font-bold text-gray-900 truncate">{user.fullName}</h1>
              <p className="text-sm text-gray-500 truncate">{user.email}</p>
              <p className="text-xs text-gray-400 truncate mt-0.5">{user.phone}</p>
            </div>
          </div>
          <button
            onClick={onOpenQR}
            className="mt-4 w-full flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-700 font-semibold py-2.5 rounded-xl border border-red-100 transition"
          >
            <QrCode className="w-4 h-4" />
            View My QR Medical ID
          </button>
        </section>

        {/* Emergency Medical Profile */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 bg-gradient-to-r from-red-600 to-red-500 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HeartPulse className="w-5 h-5 text-white" />
              <h2 className="font-bold text-white">Emergency Medical Profile</h2>
            </div>
            {!editing && (
              <button
                onClick={() => {
                  setDraft(user);
                  setEditing(true);
                }}
                className="flex items-center gap-1 text-xs font-semibold text-white/90 hover:text-white bg-white/15 hover:bg-white/25 px-2.5 py-1.5 rounded-lg transition"
              >
                <Pencil className="w-3.5 h-3.5" />
                Edit Profile
              </button>
            )}
          </div>

          {editing ? (
            <EditForm draft={draft} setDraft={setDraft} onCancel={() => setEditing(false)} onSave={save} />
          ) : (
            <div className="p-5 space-y-4">
              <InfoRow icon={<Droplet className="w-4 h-4 text-red-500" />} label="Blood Group">
                <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-red-50 text-red-700 font-bold text-sm">
                  {user.medical.bloodGroup}
                </span>
              </InfoRow>
              <InfoList icon={<AlertTriangle className="w-4 h-4 text-amber-500" />} label="Allergies" items={user.medical.allergies} emptyText="No known allergies" tone="amber" />
              <InfoList icon={<HeartPulse className="w-4 h-4 text-red-500" />} label="Medical Conditions" items={user.medical.conditions} emptyText="None reported" tone="red" />
              <InfoList icon={<Pill className="w-4 h-4 text-blue-500" />} label="Current Medications" items={user.medical.medications} emptyText="No medications" tone="blue" />
            </div>
          )}
        </section>

        {/* Emergency Contacts */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Phone className="w-5 h-5 text-red-500" />
              <h2 className="font-bold text-gray-900">Emergency Contacts</h2>
            </div>
            <span className="text-xs font-medium text-gray-400">{user.contacts.length}/3</span>
          </div>
          <div className="p-3 space-y-2">
            {user.contacts.map((c) => (
              <div key={c.id} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                  <UserIcon className="w-5 h-5 text-red-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-gray-900 text-sm truncate">{c.name}</p>
                  <p className="text-xs text-gray-500 truncate">{c.phone}</p>
                </div>
                <button
                  onClick={() => onUpdate({ ...user, contacts: user.contacts.filter((x) => x.id !== c.id) })}
                  className="text-gray-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition"
                  aria-label="Remove contact"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
            {user.contacts.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-4">No emergency contacts yet.</p>
            )}
            {user.contacts.length < 3 && <AddContact onAdd={(c) => onUpdate({ ...user, contacts: [...user.contacts, c] })} />}
          </div>
        </section>

        <p className="text-center text-xs text-gray-400 pt-2">LifeLink AI · In an emergency, call 911 immediately.</p>
      </main>
    </div>
  );
}

function InfoRow({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
        {icon}
        {label}
      </div>
      <div>{children}</div>
    </div>
  );
}

function InfoList({
  icon,
  label,
  items,
  emptyText,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  items: string[];
  emptyText: string;
  tone: 'amber' | 'red' | 'blue';
}) {
  const chipTone = {
    amber: 'bg-amber-50 text-amber-700',
    red: 'bg-red-50 text-red-700',
    blue: 'bg-blue-50 text-blue-700',
  }[tone];
  return (
    <div>
      <div className="flex items-center gap-2 text-sm font-medium text-gray-600 mb-2">
        {icon}
        {label}
      </div>
      {items.length === 0 ? (
        <p className="text-sm text-gray-400 pl-6">{emptyText}</p>
      ) : (
        <div className="flex flex-wrap gap-1.5 pl-6">
          {items.map((it) => (
            <span key={it} className={`text-xs font-medium px-2.5 py-1 rounded-lg ${chipTone}`}>
              {it}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function AddContact({ onAdd }: { onAdd: (c: EmergencyContact) => void }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [err, setErr] = useState('');

  const submit = () => {
    if (!name.trim() || phone.replace(/\D/g, '').length < 7) {
      setErr('Enter a name and valid phone number.');
      return;
    }
    onAdd({ id: `c${Date.now()}`, name: name.trim(), phone: phone.trim() });
    setName('');
    setPhone('');
    setErr('');
    setOpen(false);
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 border-dashed border-gray-200 text-gray-500 hover:border-red-300 hover:text-red-600 text-sm font-medium transition"
      >
        <Plus className="w-4 h-4" />
        Add Contact
      </button>
    );
  }
  return (
    <div className="p-3 rounded-xl border border-red-100 bg-red-50/50 space-y-2">
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Contact name"
        className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm outline-none focus:ring-2 focus:ring-red-200"
      />
      <input
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="Phone number"
        className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm outline-none focus:ring-2 focus:ring-red-200"
      />
      {err && <p className="text-xs text-red-500">{err}</p>}
      <div className="flex gap-2">
        <button onClick={() => { setOpen(false); setErr(''); }} className="flex-1 py-2 rounded-lg bg-white border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50">
          Cancel
        </button>
        <button onClick={submit} className="flex-1 py-2 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-700">
          Save
        </button>
      </div>
    </div>
  );
}

function EditForm({
  draft,
  setDraft,
  onCancel,
  onSave,
}: {
  draft: User;
  setDraft: (u: User) => void;
  onCancel: () => void;
  onSave: () => void;
}) {
  const setMed = (k: keyof User['medical'], v: string[]) => setDraft({ ...draft, medical: { ...draft.medical, [k]: v } });
  const parseList = (s: string) => s.split(',').map((x) => x.trim()).filter(Boolean);

  return (
    <div className="p-5 space-y-4">
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1.5">Blood Group</label>
        <select
          value={draft.medical.bloodGroup}
          onChange={(e) => setDraft({ ...draft, medical: { ...draft.medical, bloodGroup: e.target.value as BloodGroup } })}
          className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-sm outline-none focus:ring-2 focus:ring-red-200"
        >
          {BLOOD_GROUPS.map((b) => (
            <option key={b} value={b}>{b}</option>
          ))}
        </select>
      </div>
      <EditList label="Allergies (comma separated)" value={draft.medical.allergies.join(', ')} onChange={(v) => setMed('allergies', parseList(v))} />
      <EditList label="Medical Conditions (comma separated)" value={draft.medical.conditions.join(', ')} onChange={(v) => setMed('conditions', parseList(v))} />
      <EditList label="Current Medications (comma separated)" value={draft.medical.medications.join(', ')} onChange={(v) => setMed('medications', parseList(v))} />

      <div className="flex gap-2 pt-1">
        <button onClick={onCancel} className="flex-1 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-100">
          Cancel
        </button>
        <button onClick={onSave} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700">
          <Check className="w-4 h-4" />
          Save
        </button>
      </div>
    </div>
  );
}

function EditList({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1.5">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={2}
        className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-sm outline-none focus:ring-2 focus:ring-red-200 resize-none"
      />
    </div>
  );
}
