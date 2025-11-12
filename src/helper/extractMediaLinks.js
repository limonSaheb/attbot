export const extractMediaLinks = (urls) => {
  const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp"];
  const videoExtensions = [".mp4", ".mkv", ".webm"];

  let imageUrl = null;
  let videoUrl = null;

  urls.forEach((url) => {
    const extension = url.split(".").pop().toLowerCase();

    if (!imageUrl && imageExtensions.includes(`.${extension}`)) {
      imageUrl = url;
    } else if (!videoUrl && videoExtensions.includes(`.${extension}`)) {
      videoUrl = url;
    }
  });

  return { imageUrl, videoUrl };
};
