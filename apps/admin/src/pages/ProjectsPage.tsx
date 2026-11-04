import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import type { ProjectDTO } from '@portfolio/shared-types';

export function ProjectsPage() {
  const [projects, setProjects] = useState<ProjectDTO[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    api
      .listProjects()
      .then(setProjects)
      .catch((e) => setError(e instanceof Error ? e.message : 'Failed to load'))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const onDelete = async (p: ProjectDTO) => {
    if (!confirm(`Delete "${p.title}"? This cannot be undone.`)) return;
    try {
      await api.deleteProject(p.id);
      setProjects((prev) => prev.filter((x) => x.id !== p.id));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Delete failed');
    }
  };

  const togglePublished = async (p: ProjectDTO) => {
    try {
      const updated = await api.updateProject(p.id, { published: !p.published });
      setProjects((prev) => prev.map((x) => (x.id === p.id ? updated : x)));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Update failed');
    }
  };

  return (
    <div>
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <h1>Projects</h1>
        <Link to="/projects/new" className="btn">
          + New project
        </Link>
      </div>
      {error && <p className="error">{error}</p>}
      {loading ? (
        <p className="muted">Loading…</p>
      ) : (
        <div className="card" style={{ marginTop: 16, padding: 0 }}>
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Featured</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {projects.map((p) => (
                <tr key={p.id}>
                  <td>
                    <Link to={`/projects/${p.id}`}>{p.title}</Link>
                    <div className="muted">{p.slug}</div>
                  </td>
                  <td>{p.category.replace('_', ' ')}</td>
                  <td>{p.featured ? 'Yes' : '—'}</td>
                  <td>
                    <span className="badge">{p.published ? 'Published' : 'Draft'}</span>
                  </td>
                  <td>
                    <div className="row">
                      <button className="btn btn-ghost" onClick={() => togglePublished(p)}>
                        {p.published ? 'Unpublish' : 'Publish'}
                      </button>
                      <Link to={`/projects/${p.id}`} className="btn btn-ghost">
                        Edit
                      </Link>
                      <button className="btn btn-danger" onClick={() => onDelete(p)}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {projects.length === 0 && (
                <tr>
                  <td colSpan={5} className="muted">
                    No projects yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
