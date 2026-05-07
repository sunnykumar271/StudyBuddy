import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { CheckCircle2, ChevronRight, ChevronLeft, X } from 'lucide-react';
import { updateUser, selectUser } from '../../features/authSlice';
import { userService } from '../../services/userService';
import { getErrorMessage } from '../../utils/helpers';
import { POPULAR_SKILLS, POPULAR_INTERESTS, POPULAR_SUBJECTS, DEPARTMENTS, YEARS } from '../../utils/constants';
import toast from 'react-hot-toast';

const STEPS = ['Your Info', 'Pick Skills', 'Pick Interests', 'Study Subjects'];

const TagSelector = ({ options, selected, onToggle, max = 10 }) => (
  <div className="flex flex-wrap gap-2">
    {options.map((item) => {
      const isSelected = selected.includes(item);
      return (
        <button
          key={item}
          type="button"
          onClick={() => onToggle(item)}
          disabled={!isSelected && selected.length >= max}
          className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all duration-150
            ${isSelected
              ? 'bg-secondary text-white border-secondary shadow-glow'
              : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-secondary hover:text-secondary disabled:opacity-40'
            }`}
        >
          {isSelected && <X className="w-3 h-3 inline mr-1 -mt-0.5" />}
          {item}
        </button>
      );
    })}
  </div>
);

const Onboarding = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectUser);

  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    bio: user?.bio || '',
    department: user?.department || '',
    year: user?.year || '',
    skills: user?.skills || [],
    interests: user?.interests || [],
    subjects: user?.subjects || [],
  });

  const toggle = (field, value) => {
    setData((d) => ({
      ...d,
      [field]: d[field].includes(value)
        ? d[field].filter((x) => x !== value)
        : [...d[field], value],
    }));
  };

  const handleFinish = async () => {
    setLoading(true);
    try {
      const { data: updated } = await userService.completeOnboarding(data);
      dispatch(updateUser(updated));
      toast.success('Profile set up! Welcome to StudyBuddy 🎉');
      navigate('/dashboard');
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const progress = ((step + 1) / STEPS.length) * 100;

  return (
    <div className="min-h-screen bg-surface-light dark:bg-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold gradient-text mb-2">Let&apos;s set up your profile</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Step {step + 1} of {STEPS.length} — {STEPS[step]}
          </p>
          {/* Progress bar */}
          <div className="mt-4 h-1.5 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-secondary to-accent-light rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          {/* Step dots */}
          <div className="flex justify-center gap-2 mt-4">
            {STEPS.map((s, i) => (
              <div
                key={s}
                className={`flex items-center gap-2 ${i < step ? 'text-secondary' : i === step ? 'text-gray-800 dark:text-gray-100' : 'text-gray-400'}`}
              >
                {i < step
                  ? <CheckCircle2 className="w-5 h-5 text-secondary" />
                  : <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center text-xs font-bold
                      ${i === step ? 'border-secondary text-secondary' : 'border-gray-300 dark:border-gray-600'}`}>
                      {i + 1}
                    </div>
                }
              </div>
            ))}
          </div>
        </div>

        {/* Card */}
        <div className="card p-8 space-y-6 animate-slide-up">
          {/* Step 0: Info */}
          {step === 0 && (
            <div className="space-y-4">
              <div>
                <label className="label">Bio <span className="text-gray-400 font-normal">(optional)</span></label>
                <textarea
                  id="onboard-bio"
                  value={data.bio}
                  onChange={(e) => setData({ ...data, bio: e.target.value })}
                  placeholder="Tell others about yourself, what you're studying, goals..."
                  rows={4}
                  className="input resize-none"
                  maxLength={300}
                />
                <p className="text-xs text-gray-400 mt-1 text-right">{data.bio.length}/300</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Department</label>
                  <select
                    id="onboard-dept"
                    value={data.department}
                    onChange={(e) => setData({ ...data, department: e.target.value })}
                    className="input"
                  >
                    <option value="">Select</option>
                    {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">Year</label>
                  <select
                    id="onboard-year"
                    value={data.year}
                    onChange={(e) => setData({ ...data, year: e.target.value })}
                    className="input"
                  >
                    <option value="">Select</option>
                    {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 1: Skills */}
          {step === 1 && (
            <div>
              <h2 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">
                What are your skills?
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Pick up to 10. Selected: {data.skills.length}
              </p>
              <TagSelector options={POPULAR_SKILLS} selected={data.skills} onToggle={(v) => toggle('skills', v)} />
            </div>
          )}

          {/* Step 2: Interests */}
          {step === 2 && (
            <div>
              <h2 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">
                What are you interested in?
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Pick up to 10. Selected: {data.interests.length}
              </p>
              <TagSelector options={POPULAR_INTERESTS} selected={data.interests} onToggle={(v) => toggle('interests', v)} />
            </div>
          )}

          {/* Step 3: Subjects */}
          {step === 3 && (
            <div>
              <h2 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">
                What subjects do you study?
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                This helps us find perfect study partners. Selected: {data.subjects.length}
              </p>
              <TagSelector options={POPULAR_SUBJECTS} selected={data.subjects} onToggle={(v) => toggle('subjects', v)} />
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between pt-2">
            <button
              type="button"
              onClick={() => setStep((s) => s - 1)}
              disabled={step === 0}
              className="btn-ghost flex items-center gap-2 disabled:opacity-30"
            >
              <ChevronLeft className="w-4 h-4" /> Back
            </button>

            {step < STEPS.length - 1 ? (
              <button
                id="onboard-next"
                type="button"
                onClick={() => setStep((s) => s + 1)}
                className="btn-primary flex items-center gap-2"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                id="onboard-finish"
                type="button"
                onClick={handleFinish}
                disabled={loading}
                className="btn-primary flex items-center gap-2"
              >
                {loading ? 'Saving...' : 'Finish Setup 🎉'}
              </button>
            )}
          </div>
        </div>

        <p className="text-center text-sm text-gray-400 mt-4">
          <button onClick={() => navigate('/dashboard')} className="hover:text-secondary transition-colors">
            Skip for now →
          </button>
        </p>
      </div>
    </div>
  );
};

export default Onboarding;
