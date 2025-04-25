# Twitter Clone 🐦

A **full-stack Twitter clone** built with **Next.js**, **NestJS**, and **Firebase**, offering a modern social experience with cool features, sleek design, and great architecture.

## 🔍 Description

This project mimics the core features of Twitter — including posting, liking, and commenting — with support for **authentication**, **server-side rendering**, and **cloud functions**. It's split into two parts:

- **Client**: Built with **Next.js**, **React**, and **ShadCN**
- **Server**: Built with **NestJS**, deployed with **Firebase Functions**

## 📁 Project Structure

```
.
├── client/   # Next.js frontend
└── server/   # NestJS backend (Firebase Functions)
```

## 🚀 Features

- **Authentication** with Firebase
- **Posts**, **Likes**, and **Comments**
- **Responsive UI** with Tailwind + ShadCN UI
- **Server-side APIs** with NestJS
- **Cloud-hosted backend** using Firebase + Firestore + Storage
- **Dark mode** toggle with `next-themes`

## 🛠️ Tech Stack

### Frontend

- **Next.js 15**
- **React 19**
- **TailwindCSS**
- **ShadCN UI**
- **Zustand** (state management)
- **React Hook Form** + **Zod** (forms and validation)
- **Framer Motion** (animations)
- **React Query** (`@tanstack/react-query`)

### Backend

- **NestJS 11**
- **Express 5**
- **Firebase Admin SDK** for Firestore + Storage
- **Firebase Functions** (cloud deployment)

## ⚙️ Installation

### 1. Clone the Repo

```bash
git clone https://github.com/andrew-dev-p/nextjs-firebase-twitter-clone.git
cd nextjs-firebase-twitter-clone
```

### 2. Setup Client

```bash
cd client
npm install
```

### 3. Setup Server

```bash
cd ../server
npm install
```

## 🧪 Running Locally

### Client

```bash
cd client
npm run dev
```

### Server

```bash
cd server
npm run start:dev
```

## 🔐 Environment Variables

### 📦 Client (`client/.env.local`)

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id

NEXT_PUBLIC_API_URL=https://your-api-url
```

### 🔧 Server (`server/.env`)

```env
CLIENT_URL=https://your-client-url
```

## 📬 Deployment

- **Client**: Deployed on **Vercel**
- **Server**: Deployed via **Firebase Functions** (Google Cloud)
