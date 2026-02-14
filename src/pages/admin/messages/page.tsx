import React, { useEffect, useState } from 'react';

type Message = {
  id: number | string;
  full_name: string;
  email_address: string;
  phone?: string;
  partnership_type?: string;
  message: string;
  created_at?: string;
};

const AdminMessagesPage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string | number>>(new Set());
  const [replyOpen, setReplyOpen] = useState(false);
  const [replyTo, setReplyTo] = useState<Message | null>(null);
  const [replyBody, setReplyBody] = useState('');
  const [bulkBody, setBulkBody] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true);
      try {
        const res = await fetch('http://localhost:4000/api/messages');
        if (!res.ok) throw new Error(`Status ${res.status}`);
        const rows = await res.json();
        setMessages(rows || []);
      } catch (e: any) {
        // eslint-disable-next-line no-console
        console.error('Failed to load messages', e);
        setError(e?.message || 'Failed to load messages');
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, []);

  const toggleSelect = (id: string | number) => {
    setSelectedIds((prev) => {
      const copy = new Set(prev);
      if (copy.has(id)) copy.delete(id);
      else copy.add(id);
      return copy;
    });
  };

  const openReply = (msg: Message) => {
    setReplyTo(msg);
    setReplyBody(`Hi ${msg.full_name},\n\n`);
    setReplyOpen(true);
  };

  const sendReplyEmail = (msg: Message) => {
    const subject = encodeURIComponent('Re: Your message to DYAM');
    const body = encodeURIComponent(replyBody);
    window.location.href = `mailto:${msg.email_address}?subject=${subject}&body=${body}`;
  };

  const saveReplyRecord = async (msg: Message) => {
    // Save admin reply as a message record (backend accepts full_name,email_address,phone,partnership_type,message)
    try {
      const payload = {
        full_name: 'Admin Reply',
        email_address: msg.email_address,
        phone: msg.phone || '',
        partnership_type: 'Admin Reply',
        message: replyBody,
      };
      const res = await fetch('http://localhost:4000/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`Status ${res.status}`);
      // Optionally refetch messages
      const newMsg = await res.json();
      setMessages((prev) => [newMsg, ...prev]);
      setReplyOpen(false);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Failed to save reply', e);
      alert('Failed to save reply');
    }
  };

  const sendBulk = async () => {
    if (!selectedIds.size) return alert('Select at least one message to send bulk message');
    const targets = messages.filter((m) => selectedIds.has(m.id));
    if (!targets.length) return;
    // Offer mailto option with multiple recipients
    const emails = targets.map((t) => t.email_address).filter(Boolean);
    if (!emails.length) return alert('No valid email addresses selected');

    // Attempt to open mail client with multiple recipients
    const subject = encodeURIComponent('Message from DYAM');
    const body = encodeURIComponent(bulkBody);
    window.location.href = `mailto:${emails.join(',')}?subject=${subject}&body=${body}`;

    // Also save copies to DB (best-effort)
    setSending(true);
    try {
      await Promise.all(
        targets.map((t) =>
          fetch('http://localhost:4000/api/messages', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              full_name: 'Admin Bulk',
              email_address: t.email_address,
              phone: t.phone || '',
              partnership_type: 'Admin Bulk',
              message: bulkBody,
            }),
          })
        )
      );
      alert('Bulk messages opened in mail client and saved (where possible).');
      setSelectedIds(new Set());
      setBulkBody('');
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Bulk send failed', e);
      alert('Bulk send failed');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Messages Manager</h1>
          <p className="text-sm text-gray-500">View incoming messages, reply or send bulk messages</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              // refresh
              setLoading(true);
              fetch('http://localhost:4000/api/messages')
                .then((r) => r.json())
                .then((rows) => setMessages(rows || []))
                .catch((e) => { console.error(e); setError('Failed to refresh'); })
                .finally(() => setLoading(false));
            }}
            className="px-4 py-2 bg-ocean-600 text-white rounded-lg"
          >
            Refresh
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
        <div className="mb-4">
          <textarea
            placeholder="Write bulk message to selected recipients"
            value={bulkBody}
            onChange={(e) => setBulkBody(e.target.value)}
            className="w-full p-3 border rounded-lg"
            rows={3}
          />
          <div className="flex items-center justify-end gap-2 mt-2">
            <button
              onClick={sendBulk}
              disabled={sending}
              className="px-4 py-2 bg-amber-600 text-white rounded-lg"
            >
              Send Bulk
            </button>
          </div>
        </div>

        {loading && <p>Loading messages...</p>}
        {error && <p className="text-red-500">{error}</p>}

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left"><input type="checkbox" onChange={(e) => {
                  if (e.currentTarget.checked) setSelectedIds(new Set(messages.map(m=>m.id)));
                  else setSelectedIds(new Set());
                }} checked={selectedIds.size===messages.length && messages.length>0} /></th>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Message</th>
                <th className="px-4 py-3 text-left">Received</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {messages.map((m) => (
                <tr key={m.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <input type="checkbox" checked={selectedIds.has(m.id)} onChange={() => toggleSelect(m.id)} />
                  </td>
                  <td className="px-4 py-3">{m.full_name}</td>
                  <td className="px-4 py-3">{m.email_address}</td>
                  <td className="px-4 py-3 max-w-[40ch] truncate">{m.message}</td>
                  <td className="px-4 py-3">{m.created_at ? new Date(m.created_at).toLocaleString() : ''}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => openReply(m)} className="px-3 py-1 bg-ocean-600 text-white rounded">Reply</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {replyOpen && replyTo && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl p-6">
            <div className="flex items-start justify-between">
              <h3 className="text-lg font-semibold">Reply to {replyTo.full_name}</h3>
              <button onClick={() => setReplyOpen(false)} className="text-gray-500">Close</button>
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-600">To: {replyTo.email_address}</p>
              <textarea value={replyBody} onChange={(e)=>setReplyBody(e.target.value)} rows={8} className="w-full p-3 border rounded mt-2" />
            </div>
            <div className="flex items-center justify-end gap-2 mt-4">
              <button onClick={()=>sendReplyEmail(replyTo)} className="px-4 py-2 bg-emerald-600 text-white rounded">Send Email</button>
              <button onClick={()=>saveReplyRecord(replyTo)} className="px-4 py-2 bg-gray-200 rounded">Save Reply</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMessagesPage;
