const MemberManagement = () => {
  const { useState, useEffect } = React;
  const Lucide = window.LucideReact || {};
  const Fallback = (props) => React.createElement('span', { className: props && props.className });
  const IconUsers = (typeof Lucide.Users === 'function') ? Lucide.Users : Fallback;
  const IconPlus = (typeof Lucide.Plus === 'function') ? Lucide.Plus : Fallback;
  const IconSearch = (typeof Lucide.Search === 'function') ? Lucide.Search : Fallback;
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [changePasswordUser, setChangePasswordUser] = useState(null);
  const [passwordForm, setPasswordForm] = useState({ password: "", confirmPassword: "" });
  const [addForm, setAddForm] = useState({ username: "", email: "", password: "", nickname: "" });

  const fetchUsers = async (targetPage = page) => {
    setLoading(true);
    setError("");
    try {
      const url = `/api/admin/users?page=${targetPage}&size=${size}${searchTerm ? `&search=${encodeURIComponent(searchTerm)}` : ""}`;
      const response = await fetch(url, { credentials: 'same-origin' });
      const text = await response.text();
      let data = {};
      try { data = JSON.parse(text); } catch (_) { throw new Error('未登录或接口异常'); }
      if (!response.ok) throw new Error(data.message || '加载用户失败');
      setUsers(data.content || []);
      setTotalPages(data.totalPages || 0);
      setPage(data.number ?? targetPage);
    } catch (e) {
      setError(e.message || "请求失败");
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchUsers(0); }, []);

  const handleSearch = () => fetchUsers(0);
  const handlePrev = () => { if (page > 0) fetchUsers(page - 1); };
  const handleNext = () => { if (page < totalPages - 1) fetchUsers(page + 1); };

  const handleAdd = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch('/api/admin/users/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({
          username: addForm.username,
          email: addForm.email,
          password: addForm.password,
          nickname: addForm.nickname || null
        })
      });
      const text = await response.text();
      let data = {};
      try { data = JSON.parse(text || '{}'); } catch (_) { throw new Error('新增失败'); }
      if (!response.ok) throw new Error(data.message || '新增失败');
      setShowAdd(false);
      setAddForm({ username: "", email: "", password: "", nickname: "" });
      fetchUsers(0);
    } catch (e) { setError(e.message || "请求失败"); } finally { setLoading(false); }
  };

  const openEdit = (user) => { setEditUser({ ...user }); setShowEdit(true); };

  const openChangePassword = (user) => { setChangePasswordUser(user); setPasswordForm({ password: "", confirmPassword: "" }); setShowChangePassword(true); };

  const handleChangePassword = async () => {
    if (!changePasswordUser) return;
    if (passwordForm.password !== passwordForm.confirmPassword) {
      setError("两次输入的密码不一致");
      return;
    }
    if (passwordForm.password.length < 6) {
      setError("密码长度不能少于6位");
      return;
    }
    
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`/api/admin/users/${changePasswordUser.id}/password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ password: passwordForm.password })
      });
      const text = await response.text();
      let data = {};
      try { data = JSON.parse(text || '{}'); } catch (_) { throw new Error('修改密码失败'); }
      if (!response.ok) throw new Error(data.message || '修改密码失败');
      setShowChangePassword(false);
      setChangePasswordUser(null);
      setPasswordForm({ password: "", confirmPassword: "" });
      fetchUsers(page);
    } catch (e) { setError(e.message || "请求失败"); } finally { setLoading(false); }
  };

  const handleEditSave = async () => {
    if (!editUser) return;
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`/api/admin/users/${editUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({
          nickname: editUser.nickname,
          email: editUser.email,
          vipLevel: editUser.vipLevel,
          isActive: editUser.isActive
        })
      });
      const text = await response.text();
      let data = {};
      try { data = JSON.parse(text || '{}'); } catch (_) { throw new Error('更新失败'); }
      if (!response.ok) throw new Error(data.message || '更新失败');
      setShowEdit(false);
      setEditUser(null);
      fetchUsers(page);
    } catch (e) { setError(e.message || "请求失败"); } finally { setLoading(false); }
  };

  const toggleActive = async (user) => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch('/api/admin/users/status', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ userId: user.id, isActive: !user.isActive })
      });
      const text = await response.text();
      let data = {};
      try { data = JSON.parse(text || '{}'); } catch (_) { throw new Error('状态更新失败'); }
      if (!response.ok) throw new Error(data.message || '状态更新失败');
      fetchUsers(page);
    } catch (e) { setError(e.message || "请求失败"); } finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('确认删除该用户？')) return;
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`/api/admin/users/${id}`, { method: 'DELETE', credentials: 'same-origin' });
      if (!response.ok && response.status !== 204) {
        const text = await response.text();
        try { const data = JSON.parse(text || '{}'); throw new Error(data.message || '删除失败'); } catch (_) { throw new Error('删除失败'); }
      }
      fetchUsers(page);
    } catch (e) { setError(e.message || "请求失败"); } finally { setLoading(false); }
  };

  return (
    React.createElement('div', { className: 'p-6 md:p-10 bg-white rounded-xl shadow-lg w-full h-full space-y-6' },
      React.createElement('h2', { className: 'text-3xl font-bold text-gray-800 flex items-center border-b pb-4 mb-4' },
        React.createElement(IconUsers, { className: 'w-7 h-7 mr-3 text-blue-600' }), ' 会员用户管理'),
      React.createElement('div', { className: 'flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4' },
        React.createElement('button', { className: 'flex items-center bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg shadow-md transition duration-150', onClick: () => setShowAdd(true) },
          React.createElement(IconPlus, { className: 'w-5 h-5 mr-2' }), ' 新增会员'),
        React.createElement('div', { className: 'relative w-full sm:w-1/3' },
          React.createElement('input', { type: 'search', value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), onKeyDown: (e) => { if (e.key === 'Enter') handleSearch(); }, placeholder: '按用户名/昵称/邮箱搜索...', className: 'w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500' }),
          React.createElement(IconSearch, { className: 'w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' })
        ),
        React.createElement('button', { className: 'bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg shadow-md', onClick: handleSearch }, '搜索')
      ),
      error && React.createElement('div', { className: 'bg-red-100 text-red-700 border border-red-200 p-3 rounded-lg text-sm shadow-md' }, error),
      React.createElement('div', { className: 'overflow-x-auto bg-white rounded-lg border border-gray-200 shadow' },
        React.createElement('table', { className: 'min-w-full divide-y divide-gray-200' },
          React.createElement('thead', { className: 'bg-gray-50' },
            React.createElement('tr', null,
              ['ID','用户名','昵称','邮箱','会员等级','余额','状态','注册时间','操作'].map((h,i)=>React.createElement('th',{key:i,className:'px-4 py-3 text-left text-xs font-medium text-gray-500'},h))
            )
          ),
          React.createElement('tbody', { className: 'bg-white divide-y divide-gray-200' },
            loading ? React.createElement('tr', null, React.createElement('td', { className: 'px-4 py-6 text-center text-gray-500', colSpan: 8 }, '加载中...'))
            : users.length === 0 ? React.createElement('tr', null, React.createElement('td', { className: 'px-4 py-6 text-center text-gray-500', colSpan: 8 }, '暂无数据'))
            : users.map(u => React.createElement('tr', { key: u.id },
                React.createElement('td', { className: 'px-4 py-3 text-sm text-gray-700' }, u.id),
                React.createElement('td', { className: 'px-4 py-3 text-sm text-gray-700' }, u.username),
                React.createElement('td', { className: 'px-4 py-3 text-sm text-gray-700' }, u.nickname),
                React.createElement('td', { className: 'px-4 py-3 text-sm text-gray-700' }, u.email),
                React.createElement('td', { className: 'px-4 py-3 text-sm text-gray-700' }, `VIP${u.vipLevel}`),
                React.createElement('td', { className: 'px-4 py-3 text-sm text-gray-700' }, u.balance?.toFixed(2) || '0.00'),
                React.createElement('td', { className: 'px-4 py-3 text-sm' }, (u.isActive ? '激活' : '禁用')),
                React.createElement('td', { className: 'px-4 py-3 text-sm text-gray-700' }, (u.registrationDate ? new Date(u.registrationDate).toLocaleString() : '-')),
                React.createElement('td', { className: 'px-4 py-3 text-sm' },
                  React.createElement('div', { className: 'flex items-center justify-end gap-2 whitespace-nowrap' },
                    React.createElement('button', { className: 'px-3 py-1 rounded-md bg-blue-600 text-white hover:bg-blue-700', onClick: () => openEdit(u) }, '编辑'),
                    React.createElement('button', { className: 'px-3 py-1 rounded-md bg-purple-600 text-white hover:bg-purple-700', onClick: () => openChangePassword(u) }, '改密'),
                    React.createElement('button', { className: 'px-3 py-1 rounded-md bg-yellow-500 text-white hover:bg-yellow-600', onClick: () => toggleActive(u) }, (u.isActive ? '禁用' : '启用')),
                    React.createElement('button', { className: 'px-3 py-1 rounded-md bg-red-600 text-white hover:bg-red-700', onClick: () => handleDelete(u.id) }, '删除')
                  )
                )
              ))
          )
        )
      ),
      React.createElement('div', { className: 'flex items-center justify-between' },
        React.createElement('div', { className: 'text-sm text-gray-600' }, `第 ${page + 1} / ${Math.max(totalPages, 1)} 页`),
        React.createElement('div', { className: 'space-x-2' },
          React.createElement('button', { className: 'px-3 py-1 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50', disabled: page === 0, onClick: handlePrev }, '上一页'),
          React.createElement('button', { className: 'px-3 py-1 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50', disabled: page >= totalPages - 1, onClick: handleNext }, '下一页')
        )
      ),
      showAdd && React.createElement('div', { className: 'fixed inset-0 bg-black/30 flex items-center justify-center p-4' },
        React.createElement('div', { className: 'bg-white rounded-xl shadow-2xl w-full max-w-md p-6 space-y-4' },
          React.createElement('h3', { className: 'text-xl font-bold text-gray-800' }, '新增会员'),
          React.createElement('div', { className: 'space-y-3' },
            React.createElement('input', { className: 'w-full border border-gray-300 rounded-lg px-3 py-2', placeholder: '用户名', value: addForm.username, onChange: (e) => setAddForm({ ...addForm, username: e.target.value }) }),
            React.createElement('input', { className: 'w-full border border-gray-300 rounded-lg px-3 py-2', placeholder: '邮箱', value: addForm.email, onChange: (e) => setAddForm({ ...addForm, email: e.target.value }) }),
            React.createElement('input', { className: 'w-full border border-gray-300 rounded-lg px-3 py-2', placeholder: '密码', type: 'password', value: addForm.password, onChange: (e) => setAddForm({ ...addForm, password: e.target.value }) }),
            React.createElement('input', { className: 'w-full border border-gray-300 rounded-lg px-3 py-2', placeholder: '昵称(可选)', value: addForm.nickname, onChange: (e) => setAddForm({ ...addForm, nickname: e.target.value }) })
          ),
          React.createElement('div', { className: 'flex justify-end space-x-2 pt-2' },
            React.createElement('button', { className: 'px-4 py-2 rounded-md bg-gray-200 text-gray-700', onClick: () => { setShowAdd(false); setAddForm({ username: "", email: "", password: "", nickname: "" }); } }, '取消'),
            React.createElement('button', { className: 'px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700', onClick: handleAdd }, '保存')
          )
        )
      ),
      showChangePassword && changePasswordUser && React.createElement('div', { className: 'fixed inset-0 bg-black/30 flex items-center justify-center p-4' },
        React.createElement('div', { className: 'bg-white rounded-xl shadow-2xl w-full max-w-md p-6 space-y-4' },
          React.createElement('h3', { className: 'text-xl font-bold text-gray-800' }, `修改用户密码 - ${changePasswordUser.username}`),
          error && React.createElement('div', { className: 'bg-red-100 text-red-700 border border-red-200 p-3 rounded-lg text-sm' }, error),
          React.createElement('div', { className: 'space-y-3' },
            React.createElement('input', { className: 'w-full border border-gray-300 rounded-lg px-3 py-2', placeholder: '新密码', type: 'password', value: passwordForm.password, onChange: (e) => setPasswordForm({ ...passwordForm, password: e.target.value }) }),
            React.createElement('input', { className: 'w-full border border-gray-300 rounded-lg px-3 py-2', placeholder: '确认新密码', type: 'password', value: passwordForm.confirmPassword, onChange: (e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value }) })
          ),
          React.createElement('div', { className: 'flex justify-end space-x-2 pt-2' },
            React.createElement('button', { className: 'px-4 py-2 rounded-md bg-gray-200 text-gray-700', onClick: () => { setShowChangePassword(false); setChangePasswordUser(null); setPasswordForm({ password: "", confirmPassword: "" }); setError(""); } }, '取消'),
            React.createElement('button', { className: 'px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700', onClick: handleChangePassword }, '保存')
          )
        )
      ),
      showEdit && editUser && React.createElement('div', { className: 'fixed inset-0 bg-black/30 flex items-center justify-center p-4' },
        React.createElement('div', { className: 'bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[80vh] overflow-y-auto p-6 space-y-4' },
          React.createElement('h3', { className: 'text-xl font-bold text-gray-800' }, '编辑会员'),
          React.createElement('div', { className: 'space-y-3' },
            React.createElement('div', { className: 'text-sm text-gray-500' }, `ID: ${editUser.id} 用户名: ${editUser.username}`),
            React.createElement('input', { className: 'w-full border border-gray-300 rounded-lg px-3 py-2', placeholder: '昵称', value: editUser.nickname ?? '', onChange: (e) => setEditUser({ ...editUser, nickname: e.target.value }) }),
            React.createElement('input', { className: 'w-full border border-gray-300 rounded-lg px-3 py-2', placeholder: '邮箱', value: editUser.email ?? '', onChange: (e) => setEditUser({ ...editUser, email: e.target.value }) }),
            React.createElement('select', { className: 'w-full border border-gray-300 rounded-lg px-3 py-2', value: editUser.vipLevel ?? 0, onChange: (e) => setEditUser({ ...editUser, vipLevel: parseInt(e.target.value, 10) }) },
              React.createElement('option', { value: 0 }, 'VIP0'),
              React.createElement('option', { value: 99 }, 'VIP99')
            ),
            React.createElement('label', { className: 'inline-flex items-center space-x-2' },
              React.createElement('input', { type: 'checkbox', checked: !!editUser.isActive, onChange: (e) => setEditUser({ ...editUser, isActive: e.target.checked }) }),
              React.createElement('span', { className: 'text-sm text-gray-700' }, '激活')
            )
          ),
          React.createElement('div', { className: 'flex justify-end space-x-2 pt-2' },
            React.createElement('button', { className: 'px-4 py-2 rounded-md bg-gray-200 text-gray-700', onClick: () => { setShowEdit(false); setEditUser(null); } }, '取消'),
            React.createElement('button', { className: 'px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700', onClick: handleEditSave }, '保存')
          )
        )
      )
    )
  );
};

window.Components = window.Components || {};
window.Components.MemberManagement = MemberManagement;
try { window.dispatchEvent(new Event('modules:loaded')); } catch (e) {}
