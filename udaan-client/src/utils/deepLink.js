export function openCourse(course) {
  const ua = navigator.userAgent;
  const isIOS = /iphone|ipad|ipod/i.test(ua);
  const deep = `${import.meta.env.VITE_APP_DEEP_LINK_SCHEME}://course/${course.id}`;
  const store = isIOS ? course.appStoreUrl : course.playStoreUrl;
  window.location.href = deep;
  setTimeout(() => window.open(store, '_blank'), 1800);
}
