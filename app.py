from flask import Flask, render_template, request, redirect, url_for, flash, session
from flask_login import LoginManager, login_required, login_user, logout_user, current_user, UserMixin
import mysql.connector
from werkzeug.security import generate_password_hash, check_password_hash
import os
from dotenv import load_dotenv
from contextlib import contextmanager

# Load environment variables
load_dotenv()

app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'your-secret-key')

# MySQL Configuration (Hardcoded)
db_config = {
    'host': 'localhost',
    'user': 'root',
    'password': 'sinha@15',
    'database': 'patient_data_analysis'
}

@contextmanager
def get_db():
    conn = None
    try:
        conn = mysql.connector.connect(**db_config)
        yield conn
    except mysql.connector.Error as e:
        flash(f"Database error: Please try again later")
        raise e
    finally:
        if conn is not None and conn.is_connected():
            conn.close()

# User class for Flask-Login
class User(UserMixin):
    def __init__(self, user_data):
        self.id = user_data['id']
        self.username = user_data['username']
        self.email = user_data['email']
        self.role = user_data['role']

# Login manager configuration
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

@login_manager.user_loader
def load_user(user_id):
    try:
        with get_db() as conn:
            cursor = conn.cursor(dictionary=True)
            cursor.execute('SELECT * FROM users WHERE id = %s', (user_id,))
            user_data = cursor.fetchone()
            cursor.close()
            return User(user_data) if user_data else None
    except Exception:
        return None

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        
        if not username or not password:
            flash('Username and password are required')
            return render_template('login.html')
        
        try:
            with get_db() as conn:
                cursor = conn.cursor(dictionary=True)
                cursor.execute('SELECT * FROM users WHERE username = %s', (username,))
                user_data = cursor.fetchone()
                cursor.close()
                
                if user_data and check_password_hash(user_data['hashed_password'], password):
                    user = User(user_data)
                    login_user(user)
                    return redirect(url_for('dashboard'))
                    
                flash('Invalid username or password')
        except Exception:
            flash('An error occurred. Please try again later.')
            
    return render_template('login.html')

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form.get('username')
        email = request.form.get('email')
        password = request.form.get('password')
        role = request.form.get('role')
        
        if not all([username, email, password, role]):
            flash('All fields are required')
            return redirect(url_for('register'))
            
        if len(password) < 8:
            flash('Password must be at least 8 characters long')
            return redirect(url_for('register'))
        
        try:
            with get_db() as conn:
                cursor = conn.cursor(dictionary=True)
                
                # Check if username exists
                cursor.execute('SELECT * FROM users WHERE username = %s OR email = %s', (username, email))
                if cursor.fetchone():
                    flash('Username or email already exists')
                    return redirect(url_for('register'))
                
                # Create new user
                hashed_password = generate_password_hash(password)
                cursor.execute(
                    'INSERT INTO users (username, email, hashed_password, role) VALUES (%s, %s, %s, %s)',
                    (username, email, hashed_password, role)
                )
                conn.commit()
                cursor.close()
                
                flash('Registration successful')
                return redirect(url_for('login'))
        except Exception:
            flash('An error occurred. Please try again later.')
            
    return render_template('register.html')

@app.route('/dashboard')
@login_required
def dashboard():
    return render_template('dashboard.html')

@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('index'))

if __name__ == '__main__':
    app.run(debug=False) # Changed to False for production 