const API_URL = 'http://localhost:5001/api';

const getHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('token')}`,
});

export const getContacts = async () => {
  const response = await fetch(`${API_URL}/contacts`, {
    headers: getHeaders(),
  });
  if (!response.ok) throw new Error('Failed to fetch contacts');
  return response.json();
};

export const createContact = async (contact: { name: string; email: string; phone: string }) => {
  const response = await fetch(`${API_URL}/contacts`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(contact),
  });
  if (!response.ok) throw new Error('Failed to create contact');
  return response.json();
};

export const updateContact = async (id: string, contact: { name: string; email: string; phone: string }) => {
  console.log(id);
  console.log(contact);
  const response = await fetch(`${API_URL}/contacts/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(contact),
  });
  if (!response.ok) throw new Error('Failed to update contact');
  return response.json();
};

export const deleteContact = async (id: string) => {
  const response = await fetch(`${API_URL}/contacts/${id}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });
  if (!response.ok) throw new Error('Failed to delete contact');
  return response.json();
};