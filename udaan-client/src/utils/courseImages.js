export const getHardcodedCourseImage = (courseName) => {
  if (!courseName) return null;
  const name = courseName.toLowerCase();
  
  if (name.includes('combo')) return '/banners/combo-program.webp';
  if (name.includes('jac')) return '/banners/jacd-ggsipu.webp';
  if (name.includes('one homestate')) return '/banners/josaa-csab-homestate.webp';
  if (name.includes('josaa and csab')) return '/banners/josaa-csab.webp';
  if (name.includes('other') || name.includes('nfsu') || name.includes('rru') || name.includes('jac chandigarh') || name.includes('separate')) return '/banners/other-counselling.webp';
  if (name.includes(' up ') || name.startsWith('up ') || name.includes('aktu') || name.includes('hbtu') || name.includes('mmut')) return '/banners/all-up-counselling.webp';
  if (name.includes('ggsipu')) return '/banners/Ggsipu.webp';
  if (name.includes('mhtcet')) return '/banners/mhtcet.webp';
  if (name.includes('comedk')) return '/banners/comedk.webp';
  if (name.includes('mpdte')) return '/banners/mpdte.webp';
  if (name.includes('hstes')) return '/banners/hstes.webp';
  if (name.includes('webinar')) return '/banners/webinar.webp';
if (name.includes('filling')) return '/banners/josaa_choice.webp';
  return null;
};
