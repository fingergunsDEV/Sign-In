import { createStore } from './store.js';

const loadInitialState = async () => {
  let savedSettings = null;
  
  if (typeof chrome !== 'undefined' && chrome.storage) {
    try {
      const result = await chrome.storage.local.get('userSettings');
      savedSettings = result.userSettings;
    } catch (error) {
      console.error('Error loading from chrome storage:', error);
    }
  } else {
    try {
      const stored = localStorage.getItem('userSettings');
      if (stored) {
        savedSettings = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error loading from localStorage:', error);
    }
  }

  return {
    courses: [
      {
        id: 1,
        title: "Holistic SEO Fundamentals",
        instructor: "Sarah Chen",
        progress: 75,
        duration: "8 weeks"
      },
      {
        id: 2,
        title: "Predictive Analytics & Forecasting",
        instructor: "Dr. James Miller", 
        progress: 30,
        duration: "12 weeks"
      },
      {
        id: 3,
        title: "Business Intelligence Dashboard Design",
        instructor: "Michael Rodriguez",
        progress: 90,
        duration: "6 weeks"
      },
      {
        id: 4,
        title: "Advanced SEO Strategy & Implementation",
        instructor: "Emma Watson",
        progress: 45,
        duration: "10 weeks"
      },
      {
        id: 5,
        title: "Data Visualization for Business Insights",
        instructor: "David Kumar",
        progress: 60,
        duration: "8 weeks"
      },
      {
        id: 6,
        title: "Marketing Analytics & Customer Behavior",
        instructor: "Lisa Thompson",
        progress: 25,
        duration: "10 weeks"
      }
    ],
    activeMenuItem: 'dashboard',
    searchTerm: '',
    user: null,
    settings: savedSettings || {
      theme: 'light',
      notifications: true,
      emailUpdates: true,
      language: 'en',
      autoplay: false
    }
  };
};

const initialState = await loadInitialState();

const reducers = {
  SET_ACTIVE_MENU: (state, payload) => ({
    ...state,
    activeMenuItem: payload
  }),
  SET_SEARCH_TERM: (state, payload) => ({
    ...state,
    searchTerm: payload
  }),
  UPDATE_COURSE_PROGRESS: (state, { courseId, progress }) => ({
    ...state,
    courses: state.courses.map(course => 
      course.id === courseId ? { ...course, progress } : course
    )
  }),
  SET_USER: (state, payload) => ({
    ...state,
    user: payload
  }),
  UPDATE_SETTINGS: (state, payload) => ({
    ...state,
    settings: {
      ...state.settings,
      ...payload
    }
  })
};

export const store = createStore(initialState, reducers);