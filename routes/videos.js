const express = require("express");
const router = express.Router();
const fs = require("fs");
const VIDEOS_FILE_PATH = "./data/videos.json";
const crypto = require("crypto");

function getVideos() {
  const fileContents = fs.readFileSync(VIDEOS_FILE_PATH);
  return JSON.parse(fileContents);
}


function setVideos(videos) {
  const videosAsJson = JSON.stringify(videos, null, 2);
  fs.writeFileSync(VIDEOS_FILE_PATH, videosAsJson);
}

router.get("/", (req, res) => {
  res.send(getVideos());
});


// Post videos
router.post("/", (req, res) => {
  const videos = getVideos();

  if (!req.body.title || !req.body.description) {
      return res.status(400).json({
          error: {
              message: "Requires title and description in request body",
              statusCode: 400,
          },
      });
  }

  const newVideo = {
      id: crypto.randomUUID(),
      title: req.body.title,
      description: req.body.description,
      channel: req.body.channel || 'Default Channel',
      likes: "10,000",
      views: "20,000",
      timestamp: new Date(),
      image: process.env.bakedUrl + 'images/image1.jpeg', // Assuming this path exists in your public folder
      comments: []
  };

  videos.push(newVideo);
  setVideos(videos);
  res.status(201).send(newVideo);
});


// Get videosById

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
