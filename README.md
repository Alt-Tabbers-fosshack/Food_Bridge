# FoodBridge
⚠️ This repository uses separate branches:
- Frontend → `main` branch
- Backend → `master3` branch

---

# 🌿 FoodBridge — Backend

> REST API powering the FoodBridge food redistribution platform.

This is the Django + Django REST Framework backend. It handles user authentication with JWT, donation management, role-based permissions, and geolocation-aware distance calculations using the Haversine formula.

---

## 🔗 Links

| | URL |
|---|---|
| 🚀 Deployed Backend | https://food-bridge-yczx.onrender.com |
| 🖥️ Frontend App | https://food-bridge.vercel.app |

---

## 🛠️ Tech Stack

| Package | Version | Purpose |
|---|---|---|
| `Django` | 6.0.3 | Web framework |
| `djangorestframework` | latest | REST API layer |
| `djangorestframework-simplejwt` | latest | JWT authentication |
| `django-cors-headers` | latest | CORS handling |
| `dj-database-url` | 3.1.2 | Database URL parsing |
| `psycopg2-binary` | 2.9.11 | PostgreSQL adapter |
| `gunicorn` | 25.3.0 | Production WSGI server |
| `python-decouple` | 3.8 | Environment variable management |

---

## 📁 Project Structure

```
foodbridge-backend/
├── manage.py
├── requirements.txt
├── Procfile                        # gunicorn command for Render deployment
├── foodbridge_backend/
│   ├── settings.py                 # Project settings (JWT, CORS, DB)
│   ├── urls.py                     # Root URL config
│   ├── wsgi.py
│   └── asgi.py
├── users/                          # Custom user app
│   ├── models.py                   # User model with role field
│   ├── serializers.py              # Register, Login, User serializers
│   ├── views.py                    # RegisterView, LoginView, CurrentUserView
│   └── urls.py                     # /api/register/, /api/login/, /api/me/
└── donations/                      # Donations app
    ├── models.py                   # FoodDonation model
    ├── serializers.py              # FoodDonationSerializer with distance field
    ├── views.py                    # List/Create, Detail, StatusUpdate views
    └── urls.py                     # /api/donations/ routes
```

---

## 📡 API Reference

**Base URL:** `https://food-bridge-yczx.onrender.com`

All protected endpoints require the header:
```
Authorization: Bearer <access_token>
```

---

### 🔐 Auth Endpoints

#### Register
```http
POST /api/register/
```
Body:
```json
{
  "username": "john",
  "email": "john@example.com",
  "password": "secret123",
  "password2": "secret123",
  "role": "donor"
}
```
`role` must be one of: `donor`, `volunteer`, `receiver`

Response:
```json
{
  "user": { "id": 1, "username": "john", "email": "john@example.com", "role": "donor" },
  "tokens": { "access": "...", "refresh": "..." }
}
```

---

#### Login
```http
POST /api/login/
```
Body:
```json
{
  "username": "john",
  "password": "secret123"
}
```
Response: same shape as register.

---

#### Get Current User
```http
GET /api/me/
Authorization: Bearer <access_token>
```
Returns the authenticated user's profile.

---

#### Refresh Token
```http
POST /api/token/refresh/
```
Body:
```json
{ "refresh": "<refresh_token>" }
```
Returns a new `access` token.

---

### 🍱 Donation Endpoints

#### List Donations
```http
GET /api/donations/
Authorization: Bearer <access_token>
```
Optional query params:
- `?lat=11.25&lng=75.78` — calculates and sorts results by distance (km) using the Haversine formula
- `?status=available` — filter by status (`available`, `picked_up`, `delivered`)

Results are automatically filtered by role:
- **Donor** — sees only their own donations
- **Volunteer** — sees all `available` donations + their assigned pickups
- **Receiver** — sees donations assigned to them

---

#### Create Donation
```http
POST /api/donations/
Authorization: Bearer <access_token>
```
Body:
```json
{
  "food_type": "Rice & Curry",
  "quantity": 10,
  "unit": "plates",
  "latitude": 11.2588,
  "longitude": 75.7804,
  "hours_until_expiry": 4
}
```
`unit` must be one of: `plates`, `kg`, `boxes`, `packets`

---

#### Get Single Donation
```http
GET /api/donations/<id>/
Authorization: Bearer <access_token>
```

---

#### Update Donation Status
```http
POST /api/donations/<id>/status/
Authorization: Bearer <access_token>
```
Body:
```json
{ "action": "pickup" }
```
or
```json
{ "action": "deliver" }
```

Status flow:
```
available  →  picked_up  →  delivered
           ↑ "pickup"    ↑ "deliver"
```

Rules enforced:
- Only a `volunteer` can call `pickup` or `deliver`
- `pickup` only works when status is `available`
- `deliver` only works when status is `picked_up` and the requesting volunteer is the assigned one

---

#### Delete Donation
```http
DELETE /api/donations/<id>/
Authorization: Bearer <access_token>
```

---

### Data Models

#### User
| Field | Type | Notes |
|---|---|---|
| `id` | int | Auto |
| `username` | string | Unique |
| `email` | string | Required, unique |
| `role` | string | `donor` / `volunteer` / `receiver` |
| `phone` | string | Optional |

#### FoodDonation
| Field | Type | Notes |
|---|---|---|
| `id` | int | Auto |
| `donor` | FK → User | Set automatically from auth |
| `food_type` | string | e.g. "Rice & Curry" |
| `quantity` | decimal | e.g. 10.00 |
| `unit` | string | `plates` / `kg` / `boxes` / `packets` |
| `latitude` | decimal | Donor's GPS lat |
| `longitude` | decimal | Donor's GPS lng |
| `hours_until_expiry` | int | Default: 4 |
| `status` | string | `available` / `picked_up` / `delivered` |
| `volunteer` | FK → User | Assigned on pickup |
| `receiver` | FK → User | Optional |
| `created_at` | datetime | Auto |
| `updated_at` | datetime | Auto |

---

## ⚙️ How to Run Locally

### 1. Clone the repo and switch to the backend branch

```bash
git clone https://github.com/your-username/FoodBridge.git
cd FoodBridge
git checkout master3
```

### 2. Create and activate a virtual environment

```bash
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

### 4. Set up environment variables

Create a `.env` file in the project root:

```env
SECRET_KEY=your-django-secret-key
DATABASE_URL=sqlite:///db.sqlite3
```

> For production (PostgreSQL on Render), `DATABASE_URL` will look like:
> `postgres://user:password@host:5432/dbname`

### 5. Apply migrations

```bash
python manage.py migrate
```

### 6. (Optional) Create a superuser

```bash
python manage.py createsuperuser
```

### 7. Run the development server

```bash
python manage.py runserver
```

API available at [http://localhost:8000](http://localhost:8000).

---

## 🚀 Deploying to Render

The `Procfile` is already configured for Render:

```
web: gunicorn foodbridge_backend.wsgi
```

Set the following environment variables in your Render dashboard:

| Variable | Value |
|---|---|
| `SECRET_KEY` | A long random string |
| `DATABASE_URL` | Your PostgreSQL connection string |

`ALLOWED_HOSTS` and `CORS_ALLOWED_ORIGINS` in `settings.py` are already set to the production Render URL. Update these if you change your deployment URL.

---

## 🔐 JWT Configuration

| Setting | Value |
|---|---|
| Access token lifetime | 1 hour |
| Refresh token lifetime | 7 days |
| Rotate refresh tokens | Yes |
| Auth header | `Bearer <token>` |

---

> **Note:** This is the `master3` branch. The React frontend lives in the `main` branch. See its README for setup and deployment details.
