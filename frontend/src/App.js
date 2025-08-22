import React, { useState, useEffect } from "react";
import Dashboard from "./components/Dashboard";
import Purchases from "./components/Purchases";
import Transfers from "./components/Transfers";
import Login from "./components/Login";
import AssignmentsExpenditures from "./components/AssignmentsExpenditures";

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [token, setToken] = useState(null);

  useEffect(() => {
    // Check for saved token on app load
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (savedToken && savedUser) {
      setToken(savedToken);
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (token, user) => {
    setCurrentUser(user);
    setToken(token);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setCurrentPage('dashboard');
  };

  if (!currentUser || !token) {
    return <Login onLogin={handleLogin} />;
  }

  const renderCurrentPage = () => {
    switch(currentPage) {
      case 'dashboard':
        return <Dashboard token={token} user={currentUser} onNavigate={setCurrentPage} />;
      case 'purchases':
        return <Purchases token={token} user={currentUser} onNavigate={setCurrentPage} />;
      case 'transfers':
        return <Transfers token={token} user={currentUser} onNavigate={setCurrentPage} />;
      case 'assignments':
        return <AssignmentsExpenditures token={token} user={currentUser} onNavigate={setCurrentPage} />;
      default:
        return <Dashboard token={token} user={currentUser} onNavigate={setCurrentPage} />;
    }
  };

  const getNavItems = () => {
    const allItems = [
      { id: 'dashboard', name: 'Dashboard', icon: 'chart', roles: ['admin', 'base_commander', 'logistics_officer'] },
      { id: 'purchases', name: 'Purchases', icon: 'shopping', roles: ['admin', 'base_commander', 'logistics_officer'] },
      { id: 'transfers', name: 'Transfers', icon: 'truck', roles: ['admin', 'base_commander', 'logistics_officer'] },
      { id: 'assignments', name: 'Assignments & Expenditures', icon: 'users', roles: ['admin', 'base_commander'] }
    ];

    return allItems.filter(item => item.roles.includes(currentUser.role));
  };

  const getIconPath = (iconType) => {
    const icons = {
      chart: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
      shopping: "M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17M17 13v4a2 2 0 01-2 2H9a2 2 0 01-2-2v-4m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01",
      truck: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z",
      users: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a4 4 0 11-8 0 4 4 0 018 0z"
    };
    return icons[iconType] || icons.chart;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h1 className="text-xl font-bold text-gray-900">Military Asset Management</h1>
              </div>
              
              {/* Navigation Links */}
              <div className="hidden md:ml-10 md:flex md:space-x-8">
                {getNavItems().map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setCurrentPage(item.id)}
                    className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      currentPage === item.id
                        ? 'text-blue-600 bg-blue-50'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={getIconPath(item.icon)} />
                    </svg>
                    {item.name}
                  </button>
                ))}
              </div>
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <div className="flex flex-col text-right">
                <span className="text-sm font-medium text-gray-900">{currentUser.username}</span>
                <span className="text-xs text-gray-500 capitalize">
                  {currentUser.role.replace('_', ' ')} {currentUser.base_name && `• ${currentUser.base_name}`}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 px-4">
        {renderCurrentPage()}
      </main>
    </div>
  );
}

export default App;
