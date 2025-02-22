import MSEVideoPlayer from "./mse_video_player"
import videoSegments from "./video-segments"

const mimeCodec = 'video/mp4; codecs="avc1.4D401F"'

document.addEventListener("DOMContentLoaded", () => {
  const player = new MSEVideoPlayer("videoElement", mimeCodec, videoSegments)
  player.init()
})
