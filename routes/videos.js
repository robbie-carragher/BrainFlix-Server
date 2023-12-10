const express = require("express");
const router = express.Router();
const fs = require("fs");
const VIDEOS_FILE_PATH = "./data/videos.json";

function getVideos() {
  const fileContents = fs.readFileSync(VIDEOS_FILE_PATH);
  return JSON.parse(fileContents);
}

router.get("/", (req, res) => {
  res.send(getVideos());
});

router.get("/:id", (req, res) => {
  const videos = getVideos();

  const foundVideo = videos.find((video) => {
    return video.id === req.params.id;
  });

  if (foundVideo) {
    return res.json(foundVideo);
  }

  res.status(404).json({
    error: {
      message: "Unable to find the video",
      code: 404,
    },
  });
});

module.exports = router;
