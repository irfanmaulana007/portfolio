import { Fragment, useEffect, useState } from 'react';
import { api } from '../api';
import type {
  ContactStatus,
  ContactSubmissionDTO,
} from '@portfolio/shared-types';

const STATUSES: Array<ContactStatus | 'all'> = ['all', 'new', 'read', 'archived'];

export function ContactsPage() {
  const [filter, setFilter] = useState<ContactStatus | 'all'>('all');
  const [items, setItems] = useState<ContactSubmissionDTO[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<number | null>(null);

  const load = () => {
    setLoading(true);
    api
      .listContacts(filter === 'all' ? undefined : filter)
      .then((res) => setItems(res.items))
      .catch((e) => setError(e instanceof Error ? e.message : 'Failed to load'))
      .finally(() => setLoading(false));
  };

  useEffect(load, [filter]);

  const setStatus = async (c: ContactSubmissionDTO, status: ContactStatus) => {
    try {
      const updated = await api.updateContactStatus(c.id, status);
      setItems((prev) => prev.map((x) => (x.id === c.id ? updated : x)));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Update failed');
    }
  };

  return (
    <div>
      <h1>Contact submissions</h1>
      <div className="row" style={{ marginTop: 8 }}>
        {STATUSES.map((s) => (
          <button
            key={s}
            className={`btn ${filter === s ? '' : 'btn-ghost'}`}
            onClick={() => setFilter(s)}
          >
            {s}
          </button>
        ))}
      </div>
      {error && <p className="error">{error}</p>}
      {loading ? (
        <p className="muted">Loading…</p>
      ) : (
        <div className="card" style={{ marginTop: 16, padding: 0 }}>
          <table>
            <thead>
              <tr>
                <th>From</th>
                <th>Subject</th>
                <th>Status</th>
                <th>Received</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {items.map((c) => (
                <Fragment key={c.id}>
                  <tr onClick={() => setExpanded(expanded === c.id ? null : c.id)} style={{ cursor: 'pointer' }}>
                    <td>
                      {c.name}
                      <div className="muted">{c.email}</div>
                    </td>
                    <td>{c.subject}</td>
                    <td>
                      <span className={`badge ${c.status === 'new' ? 'new' : ''}`}>{c.status}</span>
                    </td>
                    <td className="muted">{new Date(c.createdAt).toLocaleString()}</td>
                    <td>
                      <div className="row">
                        {c.status !== 'read' && (
                          <button
                            className="btn btn-ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              void setStatus(c, 'read');
                            }}
                          >
                            Mark read
                          </button>
                        )}
                        {c.status !== 'archived' && (
                          <button
                            className="btn btn-ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              void setStatus(c, 'archived');
                            }}
                          >
                            Archive
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                  {expanded === c.id && (
                    <tr>
                      <td colSpan={5} style={{ whiteSpace: 'pre-wrap', color: 'var(--text)' }}>
                        {c.message}
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
              {items.length === 0 && (
                <tr>
                  <td colSpan={5} className="muted">
                    No submissions.
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
