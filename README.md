# FoodBridge
⚠️ This repository uses separate branches:
- Frontend → `main` branch
- Backend → `master3` branch

---

# 🌍 FoodBridge — Frontend

> Connecting surplus food with those who need it most, in real time.

FoodBridge is a role-based food redistribution web app. Donors list surplus food, volunteers pick it up via an interactive map, and receivers track incoming deliveries — all in one platform.

---

## 🔗 Links

| | URL |
|---|---|
| 🚀 Deployed Frontend | https://food-bridge-six.vercel.app/ |
| 🔌 Backend API | food-bridge-yczx.onrender.com/api |

---

## 🛠️ Tech Stack

- **React 19** — UI framework
- **React Router v7** — client-side routing
- **Axios** — HTTP client with JWT interceptors
- **Leaflet + OpenStreetMap** — interactive donation map (no API key needed)
- **React Context API** — global auth and donation state

---

## ⚙️ How to Run Locally

### 1. Clone the repo and switch to the frontend branch

```bash
git clone https://github.com/your-username/FoodBridge.git
cd FoodBridge
git checkout main
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the project root:

```env
REACT_APP_API_URL=http://localhost:8000
```

> For production, this should point to the deployed Render backend:
> `REACT_APP_API_URL=https://your-backend.onrender.com`

### 4. Start the development server

```bash
npm start
```

App runs at [http://localhost:3000](http://localhost:3000).

---

## 👤 User Roles

| Role | Route | Description |
|---|---|---|
| 🍱 Donor | `/donor` | Post surplus food, track donation status |
| 🚚 Volunteer | `/volunteer` | Accept pickups, mark deliveries via map |
| 🏠 Receiver | `/receiver` | View incoming and available donations |

---

## 📁 Key Structure

```
src/
├── api/            # Axios instance, auth + donation API calls
├── components/     # MapContainer, ProtectedRoute
├── context/        # AuthContext, DonationContext
└── pages/          # Login, Donor, Volunteer, Receiver
```

---

> **Note:** This is the `main` branch. The backend lives in the `master3` branch and is built with Django + Django REST Framework. See its README for setup and API docs.
