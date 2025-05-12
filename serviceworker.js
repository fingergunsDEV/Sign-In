// Handle installation
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({
    lastCourse: null,
    courseProgress: {},
    userSettings: {
      theme: 'light',
      notifications: true,
      emailUpdates: true,
      language: 'en',
      autoplay: false
    }
  });
});

// Listen for messages from content scripts or popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'UPDATE_COURSE_PROGRESS') {
    updateCourseProgress(request.courseId, request.progress);
  }
  return true;
});

async function updateCourseProgress(courseId, progress) {
  const data = await chrome.storage.local.get('courseProgress');
  const courseProgress = data.courseProgress || {};
  
  courseProgress[courseId] = progress;
  await chrome.storage.local.set({ 
    courseProgress,
    lastCourse: courseId
  });
}