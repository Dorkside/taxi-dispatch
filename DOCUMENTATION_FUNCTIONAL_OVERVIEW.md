# Functional Overview of Taxi Dispatch App

## Overview
This application is a comprehensive taxi dispatch and management system built with Vue.js. It provides real-time management of trips, drivers, billing, and administrative entities, leveraging Firebase as its backend platform.

## Technology Stack
- **Frontend:** Vue.js with Vuetify UI components and Vue Router for navigation.
- **State Management:** Vuex with Vuex ORM for managing complex data models.
- **Backend:** Firebase Firestore for real-time database and Firebase Authentication for user management.
- **Offline Support:** IndexedDB persistence and service worker for offline capabilities.
- **Date Handling:** dayjs library localized to French.

# Core Functional Modules
The app is organized into several main modules accessible via routes:

- **Authentication:** User login and access control.
- **Journee (Daily View):** Displays daily trips and their statuses.
- **Departs (Departures):** Management of trip departures.
- **Semaine (Weekly Series):** Weekly overview of trips.
- **Chauffeurs (Drivers):** Management of driver profiles and assignments.
- **Places:** Management of locations relevant to trips.
- **Facturation (Billing):** Billing and invoicing functionalities.
- **Societes (Companies):** Administrative management of companies.
- **Categories:** Management of trip or service categories.
- **Admins:** Administrative user management.
- **Stats:** Statistical reports and analytics.
- **Bons:** Generates transport and passage documents for French administration.

## Data Models
Key entities are modeled using Vuex ORM and synchronized with Firestore in real-time:

- **Course:** Represents a trip or ride, linked to drivers (Chauffeur), patients, and categories.
- **Chauffeur:** Driver profiles and related data.
- **Patient:** Passenger or client information.
- **Place:** Locations involved in trips.
- **Category:** Classification of trips or services.
- **User:** Application users and their roles.
- **Bon:** Represents vouchers or tickets managed by the app.

## Real-Time Data Synchronization
The app uses Firestore listeners to keep local data models in sync with the backend. Changes in Firestore documents (additions, modifications, deletions) are automatically reflected in the app state.

## Authentication and Routing
Route guards enforce authentication, redirecting unauthenticated users to the login page and restricting access to protected routes.

## Offline and Performance Features
- IndexedDB persistence ensures data availability offline.
- Service worker manages caching and background updates.
- Unlimited Firestore cache size configured for performance.

## Summary
This app provides a modular, scalable, and real-time taxi dispatch solution with comprehensive management features, secure authentication, and offline support, built on modern web technologies and Firebase backend services.