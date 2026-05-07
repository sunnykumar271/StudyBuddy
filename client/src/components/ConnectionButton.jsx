import { useState } from 'react';
import { UserPlus, Check, X, Clock } from 'lucide-react';
import { connectionService } from '../services/connectionService';
import { getErrorMessage } from '../utils/helpers';
import toast from 'react-hot-toast';

const ConnectionButton = ({ targetUserId, initialStatus = null, connectionId = null }) => {
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
      toast.error(getErrorMessage(err));
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
