import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

function Search() {
    const [query, setQuery] = useState("");
    const [search,setSearch] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSearch = async (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.trim() === "") {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`http://localhost:3000/search?q=${value}`);
      const data = await res.json();
      setSearch(data);
    } catch (err) {
      console.error("Error fetching search:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center p-6">
  {/* Search Input */}
  <input
    type="text"
    value={query}
    onChange={handleSearch}
    placeholder="Search users, posts, hashtags..."
    className="rounded-full p-2 w-[300px] text-center focus:outline-none focus:ring-2 focus:ring-blue-400 border-none"
  />

  {/* Loading / Empty States */}
  {loading && <p className="text-gray-500 mt-3">Searching...</p>}

  {!loading && search.length === 0 && query.trim() !== "" && (
    <p className="text-gray-400 mt-3">No results found</p>
  )}

  {/* Results Section */}
  <div className="mt-5 w-[320px] bg-white rounded-xl p-3 space-y-3">
    {search.map((item) =>
      item.type === "profile" ? (
        <div
          key={item.id}
          className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 cursor-pointer transition-all"
          onClick={() => navigate(`/profile/${item.id}`)}
        >
          <img
            src={item.profile_pic}
            alt={item.username}
            className="search-image"
          />
          <span className="font-medium text-gray-700">{item.username}</span>
        </div>
      ) : (
        <div
          key={item.id}
          className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 cursor-pointer transition-all"
          onClick={() => navigate(`/post/${item.postId}`)}
        >
          <img
            src={item.image}
            alt={item.caption}
            className="w-16 h-16 object-cover rounded-lg border"
          />
          <div>
            <p className="text-sm font-medium text-gray-800 line-clamp-2">
              {item.caption}
            </p>
            <span className="text-xs text-gray-500">by {item.postedBy}</span>
          </div>
        </div>
      )
    )}
  </div>
</div>
)};

export default Search;