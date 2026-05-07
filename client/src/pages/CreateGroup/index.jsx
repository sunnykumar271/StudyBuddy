import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { groupService } from '../../services/groupService';
import { getErrorMessage } from '../../utils/helpers';
import { POPULAR_SKILLS, POPULAR_INTERESTS } from '../../utils/constants';
import { Plus, X } from 'lucide-react';
import toast from 'react-hot-toast';

const CreateGroup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', tags: [] });
  const [tagInput, setTagInput] = useState('');

  const suggestedTags = [...new Set([...POPULAR_SKILLS.slice(0, 10), ...POPULAR_INTERESTS.slice(0, 10)])];

  const addTag = (tag) => {
    const t = tag.trim();
    if (t && !form.tags.includes(t) && form.tags.length < 8) {
      setForm({ ...form, tags: [...form.tags, t] });
      setTagInput('');
    }
  };

  const removeTag = (tag) => {
    setForm({ ...form, tags: form.tags.filter((t) => t !== tag) });
  };

  const handleTagInputKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(tagInput);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return toast.error('Group name is required');
    setLoading(true);
    try {
      const { data } = await groupService.create(form);
      toast.success('Group created!');
      navigate(`/group/${data._id}`);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">Create a Group</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm">Start a study group and invite others to join.</p>
      </div>

      <form onSubmit={handleSubmit} className="card p-6 space-y-5">
        {/* Name */}
        <div>
          <label className="label" htmlFor="group-name">Group Name *</label>
          <input
            id="group-name"
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="e.g. React Study Group"
            className="input"
            maxLength={80}
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="label" htmlFor="group-desc">Description</label>
          <textarea
            id="group-desc"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="What is this group about? What will you study?"
            rows={4}
            className="input resize-none"
            maxLength={500}
          />
          <p className="text-xs text-gray-400 mt-1 text-right">{form.description.length}/500</p>
        </div>

        {/* Tags */}
        <div>
          <label className="label">Tags <span className="text-gray-400 font-normal">(max 8)</span></label>

          {/* Current tags */}
          {form.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {form.tags.map((tag) => (
                <span
                  key={tag}
                  className="flex items-center gap-1 bg-secondary/10 text-secondary px-3 py-1 rounded-full text-sm font-medium"
                >
                  {tag}
                  <button type="button" onClick={() => removeTag(tag)} className="hover:text-red-500 transition-colors">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* Tag input */}
          <div className="relative">
            <input
              id="tag-input"
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagInputKeyDown}
              placeholder="Type a tag and press Enter..."
              className="input"
              disabled={form.tags.length >= 8}
            />
            {tagInput && (
              <button
                type="button"
                onClick={() => addTag(tagInput)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary"
              >
                <Plus className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Suggested tags */}
          <div className="mt-3">
            <p className="text-xs text-gray-400 mb-2">Suggested tags:</p>
            <div className="flex flex-wrap gap-1.5">
              {suggestedTags
                .filter((t) => !form.tags.includes(t))
                .slice(0, 12)
                .map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => addTag(tag)}
                    disabled={form.tags.length >= 8}
                    className="px-2.5 py-1 text-xs rounded-full border border-gray-200 dark:border-gray-700
                               text-gray-500 dark:text-gray-400 hover:border-secondary hover:text-secondary
                               transition-all disabled:opacity-40"
                  >
                    + {tag}
                  </button>
                ))}
            </div>
          </div>
        </div>

        {/* Submit */}
        <button
          id="create-group-submit"
          type="submit"
          disabled={loading}
          className="btn-primary w-full py-3 text-base flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Creating...
            </>
          ) : (
            <>
              <Plus className="w-5 h-5" /> Create Group
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default CreateGroup;
