export const getHardcodedCourseImage = (courseName) => {
  if (!courseName) return null;
  const name = courseName.toLowerCase();
  
  if (name.includes('combo')) return '/banners/Combo Program.webp';
  if (name.includes('jac')) return '/banners/JACD + GGSIPU.webp';
  if (name.includes('one homestate')) return '/banners/Josaa Csab + Hosmestate.webp';
  if (name.includes('josaa and csab')) return '/banners/Josaa + Csab.webp';
  if (name.includes('other') || name.includes('nfsu') || name.includes('rru') || name.includes('jac chandigarh') || name.includes('separate')) return '/banners/Other Counselling.webp';
  if (name.includes(' up ') || name.startsWith('up ') || name.includes('aktu') || name.includes('hbtu') || name.includes('mmut')) return '/banners/All UP Counselling.webp';
  
  return null;
};
