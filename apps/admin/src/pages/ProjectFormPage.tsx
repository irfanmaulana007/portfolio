import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../api';
import {
  PROJECT_CATEGORIES,
  type ProjectCategory,
} from '@portfolio/shared-types';

interface FormState {
  title: string;
  slug: string;
  description: string;
  image: string;
  tags: string;
  demoUrl: string;
  codeUrl: string;
  date: string;
  previewImageUrl: string;
  category: ProjectCategory;
  featured: boolean;
  published: boolean;
  sortOrder: string;
}

const empty: FormState = {
  title: '',
  slug: '',
  description: '',
  image: '',
  tags: '',
  demoUrl: '',
  codeUrl: '',
  date: '',
  previewImageUrl: '',
  category: 'landing_page',
  featured: false,
  published: true,
  sortOrder: '0',
};

function splitList(value: string): string[] {
  return value
    .split(/[\n,]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

export function ProjectFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [form, setForm] = useState<FormState>(empty);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(isEdit);

  useEffect(() => {
    if (!id) return;
    api
      .getProject(Number(id))
      .then((p) => {
        setForm({
          title: p.title,
          slug: p.slug,
          description: p.description,
          image: p.image,
          tags: p.tags.join(', '),
          demoUrl: p.demoUrl ?? '',
          codeUrl: p.codeUrl ?? '',
          date: p.date.slice(0, 10),
          previewImageUrl: p.previewImageUrl.join('\n'),
          category: p.category,
          featured: p.featured,
          published: p.published,
          sortOrder: String(p.sortOrder),
        });
      })
      .catch((e) => setError(e instanceof Error ? e.message : 'Failed to load'))
      .finally(() => setLoading(false));
  }, [id]);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    const payload = {
      title: form.title,
      slug: form.slug.trim() || undefined,
      description: form.description,
      image: form.image,
      tags: splitList(form.tags),
      demoUrl: form.demoUrl.trim() || null,
      codeUrl: form.codeUrl.trim() || null,
      date: form.date,
      previewImageUrl: splitList(form.previewImageUrl),
      category: form.category,
      featured: form.featured,
      published: form.published,
      sortOrder: Number(form.sortOrder) || 0,
    };
    try {
      if (isEdit) {
        await api.updateProject(Number(id), payload);
      } else {
        await api.createProject(payload);
      }
      navigate('/projects');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="muted">Loading…</p>;

  return (
    <div>
      <h1>{isEdit ? 'Edit project' : 'New project'}</h1>
      {error && <p className="error">{error}</p>}
      <form className="card" style={{ marginTop: 16, maxWidth: 720 }} onSubmit={onSubmit}>
        <div className="field">
          <label>Title *</label>
          <input value={form.title} onChange={(e) => set('title', e.target.value)} required />
        </div>
        <div className="field">
          <label>Slug (auto from title if empty)</label>
          <input value={form.slug} onChange={(e) => set('slug', e.target.value)} placeholder="my-project" />
        </div>
        <div className="field">
          <label>Description *</label>
          <textarea
            rows={4}
            value={form.description}
            onChange={(e) => set('description', e.target.value)}
            required
          />
        </div>
        <div className="field">
          <label>Image URL *</label>
          <input value={form.image} onChange={(e) => set('image', e.target.value)} required />
        </div>
        <div className="field">
          <label>Tags (comma separated)</label>
          <input value={form.tags} onChange={(e) => set('tags', e.target.value)} />
        </div>
        <div className="row">
          <div className="field" style={{ flex: 1 }}>
            <label>Demo URL</label>
            <input value={form.demoUrl} onChange={(e) => set('demoUrl', e.target.value)} />
          </div>
          <div className="field" style={{ flex: 1 }}>
            <label>Code URL</label>
            <input value={form.codeUrl} onChange={(e) => set('codeUrl', e.target.value)} />
          </div>
        </div>
        <div className="row">
          <div className="field" style={{ flex: 1 }}>
            <label>Date *</label>
            <input type="date" value={form.date} onChange={(e) => set('date', e.target.value)} required />
          </div>
          <div className="field" style={{ flex: 1 }}>
            <label>Category *</label>
            <select
              value={form.category}
              onChange={(e) => set('category', e.target.value as ProjectCategory)}
            >
              {PROJECT_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c.replace('_', ' ')}
                </option>
              ))}
            </select>
          </div>
          <div className="field" style={{ width: 120 }}>
            <label>Sort order</label>
            <input
              type="number"
              value={form.sortOrder}
              onChange={(e) => set('sortOrder', e.target.value)}
            />
          </div>
        </div>
        <div className="field">
          <label>Preview image URLs (one per line)</label>
          <textarea
            rows={3}
            value={form.previewImageUrl}
            onChange={(e) => set('previewImageUrl', e.target.value)}
          />
        </div>
        <div className="row" style={{ marginBottom: 16 }}>
          <label style={{ display: 'flex', gap: 8, alignItems: 'center', margin: 0 }}>
            <input
              type="checkbox"
              style={{ width: 'auto' }}
              checked={form.featured}
              onChange={(e) => set('featured', e.target.checked)}
            />
            Featured
          </label>
          <label style={{ display: 'flex', gap: 8, alignItems: 'center', margin: 0 }}>
            <input
              type="checkbox"
              style={{ width: 'auto' }}
              checked={form.published}
              onChange={(e) => set('published', e.target.checked)}
            />
            Published
          </label>
        </div>
        <div className="row">
          <button className="btn" type="submit" disabled={saving}>
            {saving ? 'Saving…' : 'Save'}
          </button>
          <button className="btn btn-ghost" type="button" onClick={() => navigate('/projects')}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
