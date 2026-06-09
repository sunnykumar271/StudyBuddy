import { useState } from 'react';
import { UserPlus, Check, X, Clock } from 'lucide-react';
import { connectionService } from '../services/connectionService';
import { getErrorMessage } from '../utils/helpers';
import toast from 'react-hot-toast';

// ✅ Add isSender to props

const ConnectionButton = ({ targetUserId, initialStatus = null, connectionId = null, isSender=false }) => {
  const [status, setStatus] = useState(initialStatus); // null | 'pending' | 'accepted' | 'rejected'
  const [loading, setLoading] = useState(false);
  const [connId, setConnId] = useState(connectionId);

  const sendRequest = async () => {
    setLoading(true);
    try {
      const res = await connectionService.sendRequest(targetUserId);
      setStatus('pending');
      setConnId(res.data._id);
      toast.success('Connection request sent!');
    } catch (err) {
      const msg = getErrorMessage(err);

       // ✅ If request already exists, fetch the real status and update button
      if(err?.response?.status===400 && msg.toLowerCase().includes('already exists')) {
        try{
          const existing = await connectionService.getConnectionStatus(targetUserId);
          setStatus(existing.data.status); // 'pending' or 'accepted'
          setConnId(existing.data.connectionId);
        } catch {
          toast.error(msg);
        }
       } else{
          toast.error(msg);
        }
    } finally {
      setLoading(false);
    }
  };

  const accept = async () => {
    if (!connId) return;
    setLoading(true);
    try {
      await connectionService.acceptRequest(connId);
      setStatus('accepted');
      toast.success('Connection accepted!');
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const reject = async () => {
    if (!connId) return;
    setLoading(true);
    try {
      await connectionService.rejectRequest(connId);
      setStatus('rejected');
      toast.success('Connection rejected');
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  if (status === 'accepted') {
    return (
      <button disabled className="btn-outline text-emerald-600 border-emerald-300 cursor-default text-xs py-1.5 px-3">
        <Check className="w-3.5 h-3.5 inline mr-1" /> Connected
      </button>
    );
  }

  if (status === 'pending') {
    // Sender sees a waiting state — NOT accept/reject
    if (isSender) {
      return (
        <div className="flex items-center gap-2">
          <button disabled className="btn-outline text-gray-500 border-gray-300 cursor-default text-xs py-1.5 px-3">
            <Clock className="w-3.5 h-3.5 inline mr-1" /> Waiting for response
          </button>
        </div>
      );
    }
    return (
      <div className="flex items-center gap-2">
        <button
          onClick={accept}
          disabled={loading}
          className="btn-primary text-xs py-1.5 px-3"
        >
          <Check className="w-3.5 h-3.5 inline mr-1" /> Accept
        </button>
        <button
          onClick={reject}
          disabled={loading}
          className="btn-danger text-xs py-1.5 px-3"
        >
          <X className="w-3.5 h-3.5 inline mr-1" /> Reject
        </button>
      </div>
    );
  }

  if (status === 'rejected') {
    return (
      <button onClick={sendRequest} disabled={loading} className="btn-outline text-xs py-1.5 px-3">
        <UserPlus className="w-3.5 h-3.5 inline mr-1" /> Connect Again
      </button>
    );
  }

  return (
    <button onClick={sendRequest} disabled={loading} className="btn-primary text-xs py-1.5 px-3">
      <UserPlus className="w-3.5 h-3.5 inline mr-1" />
      {loading ? 'Sending...' : 'Connect'}
    </button>
  );
};

export default ConnectionButton;
