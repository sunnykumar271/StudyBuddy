import { useState } from 'react';
import { Search, X, ChevronDown } from 'lucide-react';
import { DEPARTMENTS, POPULAR_INTERESTS } from '../utils/constants';

const SearchBar = ({ onSearch, onFilter, placeholder = 'Search students...', showFilters = true }) => {
  const [query, setQuery] = useState('');
  const [department, setDepartment] = useState('');
  const [interest, setInterest] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch?.({ search: query, department, interest });
  };

  const clearAll = () => {
    setQuery('');
    setDepartment('');
    setInterest('');
    onSearch?.({ search: '', department: '', interest: '' });
  };

  const hasFilters = query || department || interest;

  return (
    <div className="w-full">
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            id="search-input"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            className="input pl-10 pr-4"
          />
        </div>
        <button type="submit" className="btn-primary">Search</button>
        {showFilters && (
          <button
            type="button"
            onClick={() => setFiltersOpen((o) => !o)}
            className="btn-outline flex items-center gap-2"
          >
            Filters <ChevronDown className={`w-4 h-4 transition-transform ${filtersOpen ? 'rotate-180' : ''}`} />
          </button>
        )}
        {hasFilters && (
          <button type="button" onClick={clearAll} className="btn-ghost">
            <X className="w-4 h-4" />
          </button>
        )}
      </form>

      {/* Filter dropdowns */}
      {showFilters && filtersOpen && (
        <div className="mt-3 p-4 card flex flex-wrap gap-4 animate-slide-up">
          <div className="flex-1 min-w-[180px]">
            <label className="label">Department</label>
            <select
              id="dept-filter"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="input"
            >
              <option value="">All Departments</option>
              {DEPARTMENTS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          <div className="flex-1 min-w-[180px]">
            <label className="label">Interest</label>
            <select
              id="interest-filter"
              value={interest}
              onChange={(e) => setInterest(e.target.value)}
              className="input"
            >
              <option value="">All Interests</option>
              {POPULAR_INTERESTS.map((i) => (
                <option key={i} value={i}>{i}</option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              type="button"
              onClick={() => onSearch?.({ search: query, department, interest })}
              className="btn-primary"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
