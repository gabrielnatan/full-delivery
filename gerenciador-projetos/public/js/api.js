// Wrapper fino de fetch para as rotas do backend.

async function request(url, options = {}) {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = data.details ? `${data.error}: ${data.details.join('; ')}` : data.error || `Erro ${res.status}`;
    throw new Error(msg);
  }
  return data;
}

export const api = {
  project: () => request('/api/project'),
  updateProject: (changes) => request('/api/project', { method: 'PATCH', body: JSON.stringify(changes) }),

  stories: () => request('/api/stories'),
  story: (id) => request(`/api/stories/${id}`),
  squads: () => request('/api/squads'),
  squadsFull: () => request('/api/squads/full'),
  createSquad: (payload) => request('/api/squads', { method: 'POST', body: JSON.stringify(payload) }),
  patchSquad: (id, changes) => request(`/api/squads/${id}`, { method: 'PATCH', body: JSON.stringify(changes) }),
  deleteSquad: (id) => request(`/api/squads/${id}`, { method: 'DELETE' }),

  team: () => request('/api/team'),
  teamCapacity: (sprint) => request(`/api/team/capacity${sprint ? `?sprint=${encodeURIComponent(sprint)}` : ''}`),
  createMember: (payload) => request('/api/team/members', { method: 'POST', body: JSON.stringify(payload) }),
  patchMember: (id, changes) => request(`/api/team/members/${id}`, { method: 'PATCH', body: JSON.stringify(changes) }),
  deleteMember: (id) => request(`/api/team/members/${id}`, { method: 'DELETE' }),

  oneOnOnes: (member) => request(`/api/one-on-ones${member ? `?member=${encodeURIComponent(member)}` : ''}`),
  createOneOnOne: (payload) => request('/api/one-on-ones', { method: 'POST', body: JSON.stringify(payload) }),
  patchOneOnOne: (id, changes) => request(`/api/one-on-ones/${id}`, { method: 'PATCH', body: JSON.stringify(changes) }),
  deleteOneOnOne: (id) => request(`/api/one-on-ones/${id}`, { method: 'DELETE' }),

  growthGoals: (member) => request(`/api/growth-goals${member ? `?member=${encodeURIComponent(member)}` : ''}`),
  createGrowthGoal: (payload) => request('/api/growth-goals', { method: 'POST', body: JSON.stringify(payload) }),
  patchGrowthGoal: (id, changes) => request(`/api/growth-goals/${id}`, { method: 'PATCH', body: JSON.stringify(changes) }),
  deleteGrowthGoal: (id) => request(`/api/growth-goals/${id}`, { method: 'DELETE' }),
  createStory: (payload) => request('/api/stories', { method: 'POST', body: JSON.stringify(payload) }),
  patchStory: (id, changes) => request(`/api/stories/${id}`, { method: 'PATCH', body: JSON.stringify(changes) }),
  deleteStory: (id) => request(`/api/stories/${id}`, { method: 'DELETE' }),

  // Subtasks = histórias-filhas (cria um STORY com parent apontando para :id)
  addSubtask: (id, payload) => request(`/api/stories/${id}/subtasks`, { method: 'POST', body: JSON.stringify(payload) }),

  // Comentários
  addComment: (id, payload) => request(`/api/stories/${id}/comments`, { method: 'POST', body: JSON.stringify(payload) }),
  deleteComment: (id, commentId) => request(`/api/stories/${id}/comments/${commentId}`, { method: 'DELETE' }),

  // Anexos de imagem (upload via data URL base64)
  addAttachment: (id, payload) => request(`/api/stories/${id}/attachments`, { method: 'POST', body: JSON.stringify(payload) }),
  deleteAttachment: (id, attId) => request(`/api/stories/${id}/attachments/${attId}`, { method: 'DELETE' }),

  // Links Git (branch, commit, PR, repo)
  addLink: (id, payload) => request(`/api/stories/${id}/links`, { method: 'POST', body: JSON.stringify(payload) }),
  deleteLink: (id, linkId) => request(`/api/stories/${id}/links/${linkId}`, { method: 'DELETE' }),

  decisions: () => request('/api/decisions'),
  createDecision: (payload) => request('/api/decisions', { method: 'POST', body: JSON.stringify(payload) }),

  sprints: () => request('/api/sprints'),
  sprint: (id) => request(`/api/sprints/${id}`),
  createSprint: (payload) => request('/api/sprints', { method: 'POST', body: JSON.stringify(payload) }),

  docsList: () => request('/api/docs'),
  doc: (name) => request(`/api/docs/${name}`),
  updateDoc: (name, payload) => request(`/api/docs/${name}`, { method: 'PATCH', body: JSON.stringify(payload) }),
  personas: () => request('/api/docs/personas'),

  okrs: () => request('/api/okrs'),
  okr: (id) => request(`/api/okrs/${id}`),
  createOkr: (payload) => request('/api/okrs', { method: 'POST', body: JSON.stringify(payload) }),
  patchOkr: (id, changes) => request(`/api/okrs/${id}`, { method: 'PATCH', body: JSON.stringify(changes) }),
  deleteOkr: (id) => request(`/api/okrs/${id}`, { method: 'DELETE' }),
};
