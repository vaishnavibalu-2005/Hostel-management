import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { BedDouble, Users, Search, Plus, Pencil, Trash2, X } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const emptyForm = {
  name: "",
  rollNumber: "",
  department: "",
  year: "1st Year",
  roomNumber: "",
  phone: "",
  feeStatus: "Pending"
};

function App() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);

  const client = axios.create({ baseURL: API_URL });

  async function loadStudents() {
    try {
      setLoading(true);
      const response = await client.get("/students");
      setStudents(response.data);
      setError("");
    } catch {
      setError("Could not load students. Check that the backend and MongoDB are running.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadStudents();
  }, []);

  const filteredStudents = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return students;
    return students.filter((student) =>
      [student.name, student.rollNumber, student.department, student.roomNumber]
        .some((value) => String(value || "").toLowerCase().includes(term))
    );
  }, [students, search]);

  function openAddForm() {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
  }

  function openEditForm(student) {
    setForm({
      name: student.name || "",
      rollNumber: student.rollNumber || "",
      department: student.department || "",
      year: student.year || "1st Year",
      roomNumber: student.roomNumber || "",
      phone: student.phone || "",
      feeStatus: student.feeStatus || "Pending"
    });
    setEditingId(student._id);
    setShowForm(true);
  }

  function updateField(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      if (editingId) {
        const response = await client.put(`/students/${editingId}`, form);
        setStudents((current) => current.map((item) => item._id === editingId ? response.data : item));
      } else {
        const response = await client.post("/students", form);
        setStudents((current) => [response.data, ...current]);
      }
      setShowForm(false);
      setForm(emptyForm);
      setEditingId(null);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Could not save student details.");
    }
  }

  async function deleteStudent(id) {
    if (!window.confirm("Delete this student record?")) return;
    try {
      await client.delete(`/students/${id}`);
      setStudents((current) => current.filter((student) => student._id !== id));
    } catch {
      setError("Could not delete the student record.");
    }
  }

  const pendingCount = students.filter((student) => student.feeStatus === "Pending").length;

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-mark"><BedDouble size={24} /></div>
        <div>
          <h1>Hostel<span>Hub</span></h1>
          <p>Management portal</p>
        </div>
        <div className="side-note">
          <span className="side-dot" />
          Student records
        </div>
        <div className="sidebar-bottom">HOSTEL ADMINISTRATION</div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <p className="eyebrow">OVERVIEW</p>
            <h2>Student Management</h2>
            <p className="subheading">Manage hostel residents and their details.</p>
          </div>
          <button className="primary-btn" onClick={openAddForm}><Plus size={18} /> Add Student</button>
        </header>

        <section className="stats">
          <article className="stat-card">
            <div className="stat-icon blue"><Users size={21} /></div>
            <div><p>Total Students</p><strong>{students.length}</strong></div>
          </article>
          <article className="stat-card">
            <div className="stat-icon amber"><BedDouble size={21} /></div>
            <div><p>Pending Fees</p><strong>{pendingCount}</strong></div>
          </article>
        </section>

        <section className="panel">
          <div className="panel-heading">
            <div><h3>Hostel Residents</h3><p>Student details and room allocation</p></div>
            <label className="search-box">
              <Search size={17} />
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search students..." />
            </label>
          </div>

          {error && <div className="error-banner">{error}</div>}
          {loading ? <div className="empty-state">Loading student records...</div> :
            filteredStudents.length === 0 ? <div className="empty-state">No student records found. Add a student to get started.</div> :
            <div className="table-wrap">
              <table>
                <thead><tr>
                  <th>STUDENT</th><th>ROLL NUMBER</th><th>DEPARTMENT</th><th>YEAR</th><th>ROOM</th><th>FEE STATUS</th><th>ACTIONS</th>
                </tr></thead>
                <tbody>
                  {filteredStudents.map((student) => (
                    <tr key={student._id}>
                      <td><strong>{student.name}</strong><small>{student.phone || "No phone"}</small></td>
                      <td>{student.rollNumber}</td>
                      <td>{student.department}</td>
                      <td>{student.year}</td>
                      <td><span className="room-chip">{student.roomNumber}</span></td>
                      <td><span className={`fee-badge ${student.feeStatus.toLowerCase()}`}>{student.feeStatus}</span></td>
                      <td><div className="row-actions">
                        <button aria-label="Edit student" onClick={() => openEditForm(student)}><Pencil size={16} /></button>
                        <button aria-label="Delete student" onClick={() => deleteStudent(student._id)}><Trash2 size={16} /></button>
                      </div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          }
        </section>
        <footer>HostelHub · Student records management</footer>
      </main>

      {showForm && <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && setShowForm(false)}>
        <section className="modal">
          <div className="modal-head">
            <div><p className="eyebrow">{editingId ? "UPDATE RECORD" : "NEW RECORD"}</p><h3>{editingId ? "Edit Student" : "Add Student"}</h3></div>
            <button className="close-btn" onClick={() => setShowForm(false)}><X size={20} /></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <label>Student Name<input name="name" value={form.name} onChange={updateField} required /></label>
              <label>Roll Number<input name="rollNumber" value={form.rollNumber} onChange={updateField} required /></label>
              <label>Department<input name="department" value={form.department} onChange={updateField} required /></label>
              <label>Year<select name="year" value={form.year} onChange={updateField}><option>1st Year</option><option>2nd Year</option><option>3rd Year</option><option>4th Year</option></select></label>
              <label>Room Number<input name="roomNumber" value={form.roomNumber} onChange={updateField} required /></label>
              <label>Phone Number<input name="phone" value={form.phone} onChange={updateField} /></label>
              <label className="full-width">Fee Status<select name="feeStatus" value={form.feeStatus} onChange={updateField}><option>Pending</option><option>Paid</option></select></label>
            </div>
            <div className="modal-actions">
              <button type="button" className="secondary-btn" onClick={() => setShowForm(false)}>Cancel</button>
              <button type="submit" className="primary-btn">{editingId ? "Save Changes" : "Add Student"}</button>
            </div>
          </form>
        </section>
      </div>}
    </div>
  );
}

export default App;
