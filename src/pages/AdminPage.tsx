// ADMIN PAGE — This is a demo admin panel using localStorage only.
// There is NO real authentication here. The passcode check is purely cosmetic.
// Do NOT use this in production without proper authentication.

import React, { useState, useEffect } from 'react';
import { Shield, Download, Upload, RefreshCw, Edit2, Trash2, Plus, CheckCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { exportData, importData, resetToSampleData } from '../utils/storage';
import { Button } from '../components/ui/Button';
import { useToast } from '../components/ui/Toast';
import { Community, CommunityStatus } from '../types';

const PASSCODE = 'admin123'; // NOT real security — demo only

const STATUSES: CommunityStatus[] = ['Under Construction','Future Subdivision','Coming Soon','Recently Completed','Completed','Leasing','Sold Out','Price TBD'];

export function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const [tab, setTab] = useState<'communities'|'builders'|'import'>('communities');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<Community>>({});
  const { communities, builders, refreshData } = useApp();
  const { showToast } = useToast();

  const handleLogin = () => {
    if (input === PASSCODE) { setAuthed(true); setError(''); }
    else setError('Incorrect passcode');
  };

  const handleExport = () => {
    const json = exportData();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'mbnh-data.json'; a.click();
    URL.revokeObjectURL(url);
    showToast('Data exported');
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        importData(evt.target?.result as string);
        refreshData();
        showToast('Data imported successfully');
      } catch { showToast('Import failed — invalid JSON', 'error'); }
    };
    reader.readAsText(file);
  };

  const handleReset = () => {
    if (!confirm('Reset to sample data? This cannot be undone.')) return;
    resetToSampleData();
    refreshData();
    showToast('Reset to sample data');
  };

  const handleSaveEdit = () => {
    if (!editingId) return;
    try {
      const stored = JSON.parse(localStorage.getItem('mbnh_communities') || 'null');
      const list = stored || communities;
      const updated = list.map((c: Community) => c.id === editingId ? { ...c, ...editData } : c);
      localStorage.setItem('mbnh_communities', JSON.stringify(updated));
      refreshData();
      setEditingId(null);
      setEditData({});
      showToast('Community updated');
    } catch { showToast('Save failed', 'error'); }
  };

  const handleDelete = (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      const stored = JSON.parse(localStorage.getItem('mbnh_communities') || 'null');
      const list = (stored || communities).filter((c: Community) => c.id !== id);
      localStorage.setItem('mbnh_communities', JSON.stringify(list));
      refreshData();
      showToast('Community deleted');
    } catch { showToast('Delete failed', 'error'); }
  };

  if (!authed) return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="card p-8 max-w-sm w-full text-center">
        <Shield size={36} className="mx-auto mb-4 text-navy" />
        <h1 className="text-xl font-bold text-primary mb-2">Admin Access</h1>
        <p className="text-sm text-muted mb-5">Demo passcode gate — not real security.</p>
        <input type="password" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleLogin()}
          placeholder="Enter passcode" className="w-full border border-border rounded-lg px-4 py-2.5 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-teal text-center" />
        {error && <p className="text-error text-sm mb-3">{error}</p>}
        <Button onClick={handleLogin} className="w-full justify-center">Enter Admin</Button>
        <p className="text-xs text-muted mt-3">Demo passcode: admin123</p>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8 pb-20 lg:pb-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Shield size={24} className="text-teal" />
          <h1 className="text-2xl font-bold text-primary">Admin Panel</h1>
          <span className="badge bg-warning/20 text-amber-700 text-xs">Demo only — not secure</span>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={handleExport}><Download size={14} /> Export JSON</Button>
          <label className="btn-secondary text-sm cursor-pointer">
            <Upload size={14} /> Import JSON
            <input type="file" accept=".json" onChange={handleImport} className="hidden" />
          </label>
          <Button variant="ghost" size="sm" onClick={handleReset} className="text-error hover:bg-red-50"><RefreshCw size={14} /> Reset Data</Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-border mb-6">
        {(['communities','builders','import'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium capitalize transition-colors ${tab === t ? 'text-teal border-b-2 border-teal' : 'text-muted hover:text-primary'}`}>
            {t} {t === 'communities' ? `(${communities.length})` : t === 'builders' ? `(${builders.length})` : ''}
          </button>
        ))}
      </div>

      {tab === 'communities' && (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-bg border-b border-border">
                <tr>
                  {['Name','Builder','Area','Status','Price','Confidence','Actions'].map(h => (
                    <th key={h} className="px-4 py-3 text-left font-semibold text-primary text-xs whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {communities.map(c => (
                  <React.Fragment key={c.id}>
                    <tr className="border-b border-border hover:bg-bg/50">
                      <td className="px-4 py-3 font-medium text-primary max-w-[180px] truncate">{c.name}</td>
                      <td className="px-4 py-3 text-muted whitespace-nowrap">{c.builderName}</td>
                      <td className="px-4 py-3 text-muted whitespace-nowrap">{c.area}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {editingId === c.id ? (
                          <select value={editData.status || c.status} onChange={e => setEditData(d => ({ ...d, status: e.target.value as CommunityStatus }))}
                            className="border border-border rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-teal">
                            {STATUSES.map(s => <option key={s}>{s}</option>)}
                          </select>
                        ) : <span className="badge bg-teal-light text-teal-dark text-xs">{c.status}</span>}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {editingId === c.id ? (
                          <input type="number" defaultValue={c.startingPrice} onChange={e => setEditData(d => ({ ...d, startingPrice: Number(e.target.value) || undefined, priceLabel: e.target.value ? `Estimated from $${Number(e.target.value).toLocaleString()}` : 'Price TBD' }))}
                            className="border border-border rounded px-2 py-1 text-xs w-28 focus:outline-none focus:ring-1 focus:ring-teal" placeholder="Price" />
                        ) : <span className="text-navy font-medium">{c.priceLabel}</span>}
                      </td>
                      <td className="px-4 py-3">
                        {editingId === c.id ? (
                          <select value={editData.dataConfidence || c.dataConfidence} onChange={e => setEditData(d => ({ ...d, dataConfidence: e.target.value as any }))}
                            className="border border-border rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-teal">
                            {['High','Medium','Low'].map(v => <option key={v}>{v}</option>)}
                          </select>
                        ) : <span className={`badge text-xs ${c.dataConfidence === 'High' ? 'bg-success/10 text-success' : c.dataConfidence === 'Low' ? 'bg-error/10 text-error' : 'bg-warning/10 text-amber-700'}`}>{c.dataConfidence}</span>}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {editingId === c.id ? (
                            <>
                              <button onClick={handleSaveEdit} className="p-1.5 text-success hover:bg-success/10 rounded transition-colors" aria-label="Save"><CheckCircle size={15} /></button>
                              <button onClick={() => { setEditingId(null); setEditData({}); }} className="p-1.5 text-muted hover:bg-sand-light rounded transition-colors text-xs">Cancel</button>
                            </>
                          ) : (
                            <>
                              <button onClick={() => { setEditingId(c.id); setEditData({}); }} className="p-1.5 text-muted hover:text-teal hover:bg-teal-light rounded transition-colors" aria-label={`Edit ${c.name}`}><Edit2 size={14} /></button>
                              <button onClick={() => handleDelete(c.id, c.name)} className="p-1.5 text-muted hover:text-error hover:bg-red-50 rounded transition-colors" aria-label={`Delete ${c.name}`}><Trash2 size={14} /></button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'builders' && (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-bg border-b border-border">
                <tr>
                  {['Name','Type','Areas Served','Communities','Last Verified'].map(h => (
                    <th key={h} className="px-4 py-3 text-left font-semibold text-primary text-xs whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {builders.map(b => (
                  <tr key={b.id} className="border-b border-border hover:bg-bg/50">
                    <td className="px-4 py-3 font-medium text-primary">{b.name}</td>
                    <td className="px-4 py-3 text-muted capitalize">{b.builderType}</td>
                    <td className="px-4 py-3 text-muted">{b.areasServed.join(', ')}</td>
                    <td className="px-4 py-3 text-muted">{b.communityIds.length}</td>
                    <td className="px-4 py-3 text-muted text-xs">{b.lastVerified || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'import' && (
        <div className="max-w-xl space-y-4">
          <div className="card p-6">
            <h2 className="font-semibold text-primary mb-3">Import / Export Data</h2>
            <p className="text-sm text-muted mb-5">Export the current dataset as JSON, or import a JSON file to replace the current data. Data is stored in localStorage only.</p>
            <div className="flex flex-col gap-3">
              <Button onClick={handleExport} variant="teal"><Download size={15} /> Export Current Data as JSON</Button>
              <label className="btn-secondary cursor-pointer justify-center"><Upload size={15} /> Import JSON File<input type="file" accept=".json" onChange={handleImport} className="hidden" /></label>
              <Button onClick={handleReset} variant="ghost" className="text-error hover:bg-red-50 border border-error/30"><RefreshCw size={15} /> Reset to Sample Data</Button>
            </div>
          </div>
          <div className="bg-warning/10 border border-warning/30 rounded-xl p-4 text-sm text-amber-700">
            <strong>Note:</strong> All data is stored in your browser's localStorage. Clearing browser data will reset everything to sample data. This admin panel has no server-side storage.
          </div>
        </div>
      )}
    </div>
  );
}
