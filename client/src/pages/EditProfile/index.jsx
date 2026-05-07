import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser, updateUser } from '../../features/authSlice';
import { userService } from '../../services/userService';
import { getErrorMessage } from '../../utils/helpers';
import { DEPARTMENTS, YEARS, POPULAR_SKILLS, POPULAR_INTERESTS, POPULAR_SUBJECTS } from '../../utils/constants';
import { Save, X } from 'lucide-react';
import Avatar from '../../components/Avatar';
import toast from 'react-hot-toast';

const TagInput = ({ label, options, selected, onToggle }) => (
  <div>
    <label className="label">{label}</label>
    <div className="flex flex-wrap gap-2">
      {options.map((item) => {
        const isSelected = selected.includes(item);
        return (
          <button
            key={item}
            type="button"
            onClick={() => onToggle(item)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all
              ${isSelected
                ? 'bg-secondary text-white border-secondary'
                : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-secondary'
              }`}
          >
            {isSelected && <X className="w-3 h-3 inline mr-1 -mt-0.5" />}
            {item}
          </button>
        );
      })}
    </div>
  </div>
);

const EditProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    department: user?.department || '',
    year: user?.year || '',
    skills: user?.skills || [],
    interests: user?.interests || [],
    subjects: user?.subjects || [],
  });

  const toggle = (field, value) => {
    setForm((f) => ({
      ...f,
      [field]: f[field].includes(value)
        ? f[field].filter((x) => x !== value)
        : [...f[field], value],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await userService.editProfile(form);
      dispatch(updateUser(data));
      toast.success('Profile updated successfully!');
      navigate(`/profile/${user._id}`);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <Avatar name={user?.name} size="lg" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Edit Profile</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Keep your profile up to date</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="card p-6 space-y-4">
          <h2 className="font-semibold text-gray-800 dark:text-gray-200">Basic Information</h2>

          <div>
            <label className="label" htmlFor="edit-name">Full Name</label>
            <input
              id="edit-name"
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="input"
              required
            />
          </div>

          <div>
            <label className="label" htmlFor="edit-bio">Bio</label>
            <textarea
              id="edit-bio"
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              rows={4}
              className="input resize-none"
              placeholder="Tell others about yourself..."
              maxLength={300}
            />
            <p className="text-xs text-gray-400 mt-1 text-right">{form.bio.length}/300</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label" htmlFor="edit-dept">Department</label>
              <select
                id="edit-dept"
                value={form.department}
                onChange={(e) => setForm({ ...form, department: e.target.value })}
                className="input"
              >
                <option value="">Select</option>
                {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="label" htmlFor="edit-year">Year</label>
              <select
                id="edit-year"
                value={form.year}
                onChange={(e) => setForm({ ...form, year: e.target.value })}
                className="input"
              >
                <option value="">Select</option>
                {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="card p-6">
          <TagInput label="Skills" options={POPULAR_SKILLS} selected={form.skills} onToggle={(v) => toggle('skills', v)} />
        </div>

        {/* Interests */}
        <div className="card p-6">
          <TagInput label="Interests" options={POPULAR_INTERESTS} selected={form.interests} onToggle={(v) => toggle('interests', v)} />
        </div>

        {/* Subjects */}
        <div className="card p-6">
          <TagInput label="Study Subjects" options={POPULAR_SUBJECTS} selected={form.subjects} onToggle={(v) => toggle('subjects', v)} />
        </div>

        <div className="flex gap-3">
          <button
            id="edit-save"
            type="submit"
            disabled={loading}
            className="btn-primary flex items-center gap-2"
          >
            <Save className="w-4 h-4" /> {loading ? 'Saving...' : 'Save Changes'}
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="btn-ghost"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;
