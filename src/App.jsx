import React, { useState } from 'react';
import './App.css';

function App() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    workshop: '',
    participants: 1,
    workshopDate: '',
    participationMode: 'פרונטלי',
    comments: ''
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  const validate = () => {
    let newErrors = {};

    if (!formData.fullName) {
      newErrors.fullName = { type: 'empty', msg: 'שדה חובה: נא להזין שם מלא.' };
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = { type: 'invalid', msg: 'שם מלא חייב להכיל לפחות 2 תווים.' };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = { type: 'empty', msg: 'שדה חובה: נא להזין כתובת אימייל.' };
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = { type: 'invalid', msg: 'כתובת האימייל שהוזנה אינה תקינה.' };
    }

    const phoneRegex = /^\d{10}$/;
    if (!formData.phone) {
      newErrors.phone = { type: 'empty', msg: 'שדה חובה: נא להזין מספר טלפון.' };
    } else if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = { type: 'invalid', msg: 'מספר טלפון חייב להכיל בדיוק 10 ספרות.' };
    }

    if (!formData.workshop) {
      newErrors.workshop = { type: 'empty', msg: 'חובה לבחור סדנה מהרשימה.' };
    }

    if (!formData.participants) {
      newErrors.participants = { type: 'empty', msg: 'שדה חובה: נא לציין מספר משתתפות.' };
    } else if (formData.participants < 1 || formData.participants > 5) {
      newErrors.participants = { type: 'invalid', msg: 'מספר המשתתפות חייב להיות בין 1 ל-5.' };
    }

    if (!formData.workshopDate) {
      newErrors.workshopDate = { type: 'empty', msg: 'חובה לבחור מועד לסדנה.' };
    }

    if (!formData.participationMode) {
      newErrors.participationMode = { type: 'empty', msg: 'חובה לבחור אופן השתתפות.' };
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccessMessage('');

    if (validate()) {
      const existing = JSON.parse(localStorage.getItem('workshopRegistrations')) || [];
      existing.push({ ...formData, id: Date.now() });
      localStorage.setItem('workshopRegistrations', JSON.stringify(existing));

      setSuccessMessage('ההרשמה בוצעה בהצלחה ונשמרה במערכת!');
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        workshop: '',
        participants: 1,
        workshopDate: '',
        participationMode: 'פרונטלי',
        comments: ''
      });
      setErrors({});
    }
  };

  const getClass = (name) => {
    if (!errors[name]) return 'form-input';
    if (errors[name].type === 'empty') return 'form-input input-empty';
    return 'form-input input-error';
  };

  const getSelectClass = (name) => {
    if (!errors[name]) return 'form-select';
    if (errors[name].type === 'empty') return 'form-select input-empty';
    return 'form-select input-error';
  };

  return (
    <div className="app-container">
      <div className="form-header">
        <h2 className="form-title">מערכת רישום לסדנאות</h2>
        <p className="form-subtitle">מלאי את הפרטים הבאים כדי להבטיח את מקומך</p>
      </div>

      {successMessage && <div className="success-message">{successMessage}</div>}

      <form onSubmit={handleSubmit} className="workshop-form">
        
        {/* שם מלא */}
        <div className="form-group">
          <label className="form-label">שם מלא</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className={getClass('fullName')}
          />
          {errors.fullName && (
            <span className="error-text" style={{ color: errors.fullName.type === 'empty' ? '#d97706' : '#dc2626' }}>
              {errors.fullName.msg}
            </span>
          )}
        </div>

        {/* כתובת אימייל */}
        <div className="form-group">
          <label className="form-label">כתובת אימייל</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={getClass('email')}
          />
          {errors.email && (
            <span className="error-text" style={{ color: errors.email.type === 'empty' ? '#d97706' : '#dc2626' }}>
              {errors.email.msg}
            </span>
          )}
        </div>

        {/* מספר טלפון */}
        <div className="form-group">
          <label className="form-label">מספר טלפון (10 ספרות)</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className={getClass('phone')}
          />
          {errors.phone && (
            <span className="error-text" style={{ color: errors.phone.type === 'empty' ? '#d97706' : '#dc2626' }}>
              {errors.phone.msg}
            </span>
          )}
        </div>

        {/* בחירת סדנה - Select */}
        <div className="form-group">
          <label className="form-label">בחירת סדנה</label>
          <select
            name="workshop"
            value={formData.workshop}
            onChange={handleChange}
            className={getSelectClass('workshop')}
          >
            <option value="">-- בחר סדנה מהרשימה --</option>
            <option value="עיצוב גרפי">עיצוב גרפי</option>
            <option value="צילום">צילום</option>
            <option value="פיתוח אתרים">פיתוח אתרים</option>
            <option value="בינה מלאכותית">בינה מלאכותית</option>
          </select>
          {errors.workshop && <span className="error-text" style={{ color: '#d97706' }}>{errors.workshop.msg}</span>}
        </div>

        {/* מספר משתתפות - Number */}
        <div className="form-group">
          <label className="form-label">מספר משתתפות (1-5)</label>
          <input
            type="number"
            name="participants"
            min="1"
            max="5"
            value={formData.participants}
            onChange={handleChange}
            className={getClass('participants')}
          />
          {errors.participants && (
            <span className="error-text" style={{ color: errors.participants.type === 'empty' ? '#d97706' : '#dc2626' }}>
              {errors.participants.msg}
            </span>
          )}
        </div>

        {/* מועד הסדנה - Select */}
        <div className="form-group">
          <label className="form-label">מועד הסדנה</label>
          <select
            name="workshopDate"
            value={formData.workshopDate}
            onChange={handleChange}
            className={getSelectClass('workshopDate')}
          >
            <option value="">-- בחר מועד אפשרי --</option>
            <option value="מועד א - 01/06/2026">מועד א - 01/06/2026</option>
            <option value="מועד ב - 10/06/2026">מועד ב - 10/06/2026</option>
            <option value="מועד ג - 20/06/2026">מועד ג - 20/06/2026</option>
          </select>
          {errors.workshopDate && <span className="error-text" style={{ color: '#d97706' }}>{errors.workshopDate.msg}</span>}
        </div>

        {/* אופן השתתפות - Radio */}
        <div className="form-group">
          <label className="form-label">אופן השתתפות</label>
          <div className="radio-group">
            <label className="radio-label">
              <input
                type="radio"
                name="participationMode"
                value="פרונטלי"
                checked={formData.participationMode === 'פרונטלי'}
                onChange={handleChange}
              /> פרונטלי
            </label>
            <label className="radio-label">
              <input
                type="radio"
                name="participationMode"
                value="מקוון"
                checked={formData.participationMode === 'מקוון'}
                onChange={handleChange}
              /> מקוון
            </label>
          </div>
        </div>

        {/* הערות נוספות - Textarea */}
        <div className="form-group">
          <label className="form-label">הערות נוספות</label>
          <textarea
            name="comments"
            value={formData.comments}
            onChange={handleChange}
            rows="3"
            className="form-textarea"
          />
        </div>

        {/* כפתור שליחה */}
        <button type="submit" className="submit-btn">שלח והרשם למערכת</button>

      </form>
    </div>
  );
}

export default App;