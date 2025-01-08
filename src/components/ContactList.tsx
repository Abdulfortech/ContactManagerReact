import React, { useState, useEffect } from 'react';
import { getContacts, createContact, updateContact, deleteContact } from '../api/contacts';
import { Contact } from '../types';
import { Plus, Edit2, Trash2, LogOut } from 'lucide-react';

interface ContactListProps {
  onLogout: () => void;
}

export function ContactList({ onLogout }: ContactListProps) {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentContact, setCurrentContact] = useState<Contact | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    try {
      const data = await getContacts();
      setContacts(data);
    } catch (err) {
      setError('Failed to load contacts');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log(currentContact);
      
      if (currentContact) {
        await updateContact(currentContact._id!, formData);
      } else {
        await createContact(formData);
      }
      setIsModalOpen(false);
      setCurrentContact(null);
      setFormData({ name: '', email: '', phone: '' });
      loadContacts();
    } catch (err) {
      setError('Failed to save contact');
    }
  };

  const handleEdit = (contact: Contact) => {
    setCurrentContact(contact);
    setFormData({
      name: contact.name,
      email: contact.email,
      phone: contact.phone,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      try {
        await deleteContact(id);
        loadContacts();
      } catch (err) {
        setError('Failed to delete contact');
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    onLogout();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Contacts</h1>
          <div className="space-x-2">
            <button
              onClick={() => {
                setCurrentContact(null);
                setFormData({ name: '', email: '', phone: '' });
                setIsModalOpen(true);
              }}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Contact
            </button>
            <button
              onClick={handleLogout}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 text-red-500">{error}</div>
        )}

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <ul className="divide-y divide-gray-200">
            {contacts.map((contact) => (
              <li key={contact._id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{contact.name}</h3>
                    <p className="text-sm text-gray-500">{contact.email}</p>
                    <p className="text-sm text-gray-500">{contact.phone}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(contact)}
                      className="p-2 text-indigo-600 hover:text-indigo-900"
                    >
                      <Edit2 className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => contact._id && handleDelete(contact._id)}
                      className="p-2 text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">
              {currentContact ? 'Edit Contact' : 'Add Contact'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  required
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  required
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <input
                  type="tel"
                  required
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}