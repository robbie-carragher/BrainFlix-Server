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
    channel: req.body.channel || "Default Channel",
    likes: "10,000",
    views: "20,000",
    timestamp: new Date(),
    image: process.env.bakedUrl + "images/image1.jpeg",
    comments: [],
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

// POST endpoint to add a comment to a video
router.post("/:id/comments", (req, res) => {
  const videos = getVideos();
  const videoId = req.params.id;
  const newComment = {
    id: crypto.randomUUID(),
    name: req.body.name || "Anonymous",
    comment: req.body.comment,
    timestamp: new Date(),
  };

  const video = videos.find((video) => video.id === videoId);
  if (!video) {
    return res.status(404).json({ message: "Video not found" });
  }

  video.comments.push(newComment);
  setVideos(videos);
  res.status(201).json(newComment);
});

// DELETE 
router.delete("/:videoId/comments/:commentId", (req, res) => {
  const videos = getVideos();
  const { videoId, commentId } = req.params;

  const video = videos.find((video) => video.id === videoId);
  if (!video) {
    return res.status(404).json({ message: "Video not found" });
  }

  const commentIndex = video.comments.findIndex(
    (comment) => comment.id === commentId
  );
  if (commentIndex === -1) {
    return res.status(404).json({ message: "Comment not found" });
  }

  video.comments.splice(commentIndex, 1);
  setVideos(videos);
  res.status(200).json({ message: "Comment deleted" });
});

// Put Likes

router.put("/:videoId/likes", (req, res) => {
  const { videoId } = req.params;
  const videos = getVideos();

  const videoIndex = videos.findIndex((video) => video.id === videoId);
  if (videoIndex === -1) {
    return res.status(404).json({ message: "Video not found" });
  }

  const currentLikes = parseInt(videos[videoIndex].likes.replace(/,/g, ""), 10);
  videos[videoIndex].likes = (currentLikes + 1).toLocaleString();

  setVideos(videos);
  res.status(200).json({ likes: videos[videoIndex].likes });
});

module.exports = router;
