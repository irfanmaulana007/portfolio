import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';

export function DashboardPage() {
  const [projectCount, setProjectCount] = useState<number | null>(null);
  const [publishedCount, setPublishedCount] = useState<number | null>(null);
  const [newContacts, setNewContacts] = useState<number | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([api.listProjects(), api.listContacts('new')])
      .then(([projects, contacts]) => {
        setProjectCount(projects.length);
        setPublishedCount(projects.filter((p) => p.published).length);
        setNewContacts(contacts.total);
      })
      .catch((e) => setError(e instanceof Error ? e.message : 'Failed to load'));
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>
      {error && <p className="error">{error}</p>}
      <div
        className="grid"
        style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', marginTop: 16 }}
      >
        <Link to="/projects" className="card">
          <div className="muted">Total projects</div>
          <div className="stat">{projectCount ?? '—'}</div>
        </Link>
        <Link to="/projects" className="card">
          <div className="muted">Published</div>
          <div className="stat">{publishedCount ?? '—'}</div>
        </Link>
        <Link to="/contacts" className="card">
          <div className="muted">Unread contacts</div>
          <div className="stat">{newContacts ?? '—'}</div>
        </Link>
      </div>
    </div>
  );
}
